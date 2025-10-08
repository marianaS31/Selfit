using Microsoft.EntityFrameworkCore;
using SelFit.Data;
using SelFit.DTOs.Account;
using SelFit.Enums;
using SelFit.Interfaces;
using SelFit.Models.Auth;
using SelFit.Models.Users;
using System.Net;
using System.Net.Mail;

namespace SelFit.Services;

public class AuthService : IAuthService
{
    private readonly AppDbContext _appDbContext;
    private readonly IConfiguration _configuration;

    public AuthService(AppDbContext appDbContext, IConfiguration configuration)
    {
        _appDbContext = appDbContext;
        _configuration = configuration;
    }

    private string GenerateRandomCode()
    {
        const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+={}:<>?";
        var rnd = new Random();
        var code = new char[10];
        var randomCode = "";

        for (var i = 0; i < 10; i++)
        {
            code[i] = chars[rnd.Next(chars.Length)];
            randomCode += code[i];
        }

        return randomCode;
    }

    private bool SendResetPassword(string email, string code)
    {
        try
        {
            var smtpClient = new SmtpClient(_configuration["EmailSettings:SmtpHost"])
            {
                Port = int.Parse(_configuration["EmailSettings:SmtpPort"]),
                Credentials = new NetworkCredential(
                    _configuration["EmailSettings:SmtpUsername"],
                    _configuration["EmailSettings:SmtpPassword"]),
                EnableSsl = true
            };

            var mailMessage = new MailMessage
            {
                From = new MailAddress(_configuration["EmailSettings:SenderEmail"]),
                Subject = "YOUR PASSWORD CODE",
                Body = $"<h1> CODE EXPIRES IN 10 MINUTES</h1>" +
                       $"<p>YOUR CODE FOR RESETTING PASSWORD IS: {code}</p>",
                IsBodyHtml = true
            };

            mailMessage.To.Add(email);
            smtpClient.Send(mailMessage);
            return true;
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.ToString());
            return false;
        }
    }

    public async Task<bool> RegisterAsync(RegisterDto newUser, UserRoleEnum role)
    {
        var user = await _appDbContext.Users.FirstOrDefaultAsync(u => u.Email == newUser.Email);

        if (user != null) return false; // Email already exists

        if (newUser.Password != newUser.ConfirmPassword) return false; // Passwords do not match

        // Converting password into hash type
        var passwordHash =
            BCrypt.Net.BCrypt.HashPassword(newUser.Password);

        // Add new user to database
        var addUser = new UserModel
        {
            Email = newUser.Email.ToLower(),
            PasswordHash = passwordHash,
            Role = role.ToString(),
            DateCreated = DateTime.Now,
            UserID = Guid.NewGuid() // Ensure this GUID is properly created and assigned
        };

        _appDbContext.Users.Add(addUser);
        await _appDbContext.SaveChangesAsync();

        // Check if the user role is Seller, for creating a corresponding SellerModel
        if (role == UserRoleEnum.Seller)
        {
            var seller = new SellerProfileModel
            {
                UserID = addUser.UserID,
                Email = addUser.Email
            };
            _appDbContext.Sellers.Add(seller);
            await _appDbContext.SaveChangesAsync(); // Save changes for the seller record
        }

        if (role == UserRoleEnum.Customer)
        {
            var customer = new CustomerProfileModel
            {
                UserID = addUser.UserID,
                Email = addUser.Email
            };
            _appDbContext.Customers.Add(customer);
            await _appDbContext.SaveChangesAsync();
        }

        return true;
    }

    public async Task<UserModel> LoginAsync(LoginDto login)
    {
        var user = await _appDbContext.Users.FirstOrDefaultAsync(e => e.Email == login.Email);

        //Check if user exists
        if (user == null || !BCrypt.Net.BCrypt.Verify(login.Password, user.PasswordHash)) return null;

        return user;
    }

    public async Task<PasswordResetModel> RequestPasswordResetAsync(string email)
    {
        var code = GenerateRandomCode();
        var user = await _appDbContext.Users.FirstOrDefaultAsync(u => u.Email == email);

        var passwordReset = new PasswordResetModel
        {
            UserID = user.UserID,
            Email = user.Email.ToLower(),
            Code = code,
            DateExpires = DateTime.UtcNow.AddMinutes(10),
            IsValid = true
        };

        var sendEmail = SendResetPassword(email, code);

        if (sendEmail == false) return null;

        await _appDbContext.PasswordReset.AddAsync(passwordReset);
        await _appDbContext.SaveChangesAsync();
        return passwordReset;
    }

    public async Task<bool> ResetPasswordAsync(string email, string code, string newPassword)
    {
        var user = await _appDbContext.Users.FirstOrDefaultAsync(e => e.Email == email);

        if (user == null) return false;

        var newPasswordHash = BCrypt.Net.BCrypt.HashPassword(newPassword);
        user.PasswordHash = newPasswordHash;

        _appDbContext.Users.Update(user);
        await _appDbContext.SaveChangesAsync();
        return true;
    }
}