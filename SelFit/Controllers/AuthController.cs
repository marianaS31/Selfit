using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SelFit.Data;
using SelFit.DTOs.Account;
using SelFit.Enums;
using SelFit.Interfaces;
using SelFit.Responses;
using System.ComponentModel.DataAnnotations;

namespace SelFit.Controllers;

[Route("api/[controller]")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _appDbContext;
    private readonly IAuthService _authService;
    private readonly ITokenService _tokenService;
    private readonly IConfiguration _configuration;

    public AuthController(AppDbContext appDbContext, IAuthService authService, ITokenService tokenService,
        IConfiguration configuration)
    {
        _appDbContext = appDbContext;
        _authService = authService;
        _tokenService = tokenService;
        _configuration = configuration;
    }

    [HttpPost("registerSeller")]
    public async Task<ActionResult> RegisterSeller([FromBody] RegisterDto newUser)
    {
        var result = await _authService.RegisterAsync(newUser, UserRoleEnum.Seller);
        if (!result)
        {
            if (await _appDbContext.Users.AnyAsync(u => u.Email == newUser.Email))
                return Conflict("Email already exists");
            if (newUser.Password != newUser.ConfirmPassword) return BadRequest("Passwords do not match.");
        }

        return Ok("Seller registered successfully.");
    }

    [HttpPost("registerCustomer")]
    public async Task<ActionResult> RegisterCustomer([FromBody] RegisterDto newUser)
    {
        var result = await _authService.RegisterAsync(newUser, UserRoleEnum.Customer);
        if (!result)
        {
            if (await _appDbContext.Users.AnyAsync(u => u.Email == newUser.Email))
                return Conflict("Email already exists");
            if (newUser.Password != newUser.ConfirmPassword) return BadRequest("Passwords do not match.");
        }

        return Ok("Customer registered successfully.");
    }

    [HttpPost("login")]
    public async Task<ActionResult> LoginUser([FromBody] LoginDto login)
    {
        var user = await _authService.LoginAsync(login);
        if (user == null) return Unauthorized("Invalid email or password.");

        var token = _tokenService.GenerateToken(user);

        //var cookieOptions = new CookieOptions
        //{
        //    HttpOnly = true,
        //    Secure = true,
        //    Expires = DateTimeOffset.UtcNow.AddDays(Convert.ToInt32(_configuration.GetSection("JwtSettings")["AccessTokenExpirationInDays"]))
        //};

        //Response.Cookies.Append("jwtToken", token, cookieOptions);

        return Ok(new LoginResponse
        {
            Message = "Login successful.",
            Token = token,
            UserID = user.UserID
        });
    }

    [HttpPost("forgotPassword")]
    public async Task<ActionResult> ForgotPassword([FromBody] [Required] string email)
    {
        var user = await _appDbContext.Users.FirstOrDefaultAsync(e => e.Email == email);

        if (user == null) return BadRequest("Email not found");

        var resetRequest = await _authService.RequestPasswordResetAsync(email);

        if (resetRequest == null) return BadRequest("Failed to send the code");

        // he reset email
        return Ok($"Password reset sent successfully to {email}");
    }

    [HttpPut("resetPassword")]
    public async Task<ActionResult> ResetPassword([FromBody] PasswordResetDto passwordReset)
    {
        // Find the reset request in the database
        var resetRequest = await _appDbContext.PasswordReset
            .FirstOrDefaultAsync(r => r.Email == passwordReset.Email && r.Code == passwordReset.Code);

        if (resetRequest == null) return BadRequest("Invalid code or email not found.");

        if (!resetRequest.IsValid) return BadRequest("Code was already used");

        if (resetRequest.DateExpires < DateTime.UtcNow)
        {
            _appDbContext.PasswordReset.Remove(resetRequest);
            await _appDbContext.SaveChangesAsync();
            return BadRequest("Expired code.");
        }

        //Call the service of Request a password reset
        var resetSuccessfull =
            await _authService.ResetPasswordAsync(passwordReset.Email, passwordReset.Code, passwordReset.NewPassword);

        if (!resetSuccessfull) return BadRequest("Failed to reset the password");

        resetRequest.IsValid = false;

        _appDbContext.PasswordReset.Remove(resetRequest);
        await _appDbContext.SaveChangesAsync();
        return Ok("Password was updated successfully");
    }

    [HttpDelete("Logout")]
    [Authorize]
    public async Task<ActionResult> Logout()
    {
        // Response.Cookies.Delete("jwtToken");
        return Ok("Logged out successfully");
    }
}