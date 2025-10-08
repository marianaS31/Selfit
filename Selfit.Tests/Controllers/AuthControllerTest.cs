using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Moq;
using SelFit.Controllers;
using SelFit.Data;
using SelFit.DTOs.Account;
using SelFit.Enums;
using SelFit.Interfaces;
using SelFit.Models.Auth;
using SelFit.Responses;

namespace SelFit.Tests;

public class AuthControllerTests
{
    private readonly Mock<IAuthService> _authServiceMock;
    private readonly Mock<ITokenService> _tokenServiceMock;
    private readonly AppDbContext _appDbContext;
    private readonly AuthController _authController;
    private readonly Mock<IConfiguration> _configurationMock;

    public AuthControllerTests()
    {
        _authServiceMock = new Mock<IAuthService>();
        _tokenServiceMock = new Mock<ITokenService>();
        _configurationMock = new Mock<IConfiguration>();

        // Set up configuration values directly
        _configurationMock.Setup(x => x["JwtSettings:SecretKey"])
            .Returns("VERY_VERY_SECRET_KEY_KEEP_IT_AS_PRIVATE_AS_POSSIBLE");
        _configurationMock.Setup(x => x["JwtSettings:AccessTokenExpirationInDays"]).Returns("7");

        // Set up in memory database
        var options = new DbContextOptionsBuilder<AppDbContext>().UseInMemoryDatabase("TestDatabase").Options;

        _appDbContext = new AppDbContext(options);

        // Setup test data in memory
        _appDbContext.Users.Add(new UserModel
        {
            UserID = Guid.NewGuid(),
            Email = "test@example.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("Password123!"),
            Role = UserRoleEnum.Customer.ToString(),
            DateCreated = DateTime.Now
        });
        _appDbContext.SaveChanges();

        _authController = new AuthController(_appDbContext, _authServiceMock.Object, _tokenServiceMock.Object,
            _configurationMock.Object);
    }

    [Fact]
    public async Task Register_ValidCustomerEmail()
    {
        // Arrange
        var newCustomer = new RegisterDto
        {
            Email = "test@example.com", // Same email as the one seeded in the database
            Password = "Password123!",
            ConfirmPassword = "Password123!"
        };

        // Setup AuthService mock to simulate an existing user scenario
        _authServiceMock.Setup(auth => auth.RegisterAsync(newCustomer, UserRoleEnum.Customer)).ReturnsAsync(false);

        // Act
        var result = await _authController.RegisterCustomer(newCustomer);

        // Assert
        var conflictResult = Assert.IsType<ConflictObjectResult>(result);
        Assert.Equal("Email already exists", conflictResult.Value);
    }

    [Fact]
    public async Task Register_ValidSellerEmail()
    {
        //Arrange

        var newSeller = new RegisterDto
        {
            Email = "test@example.com", // Same email as the one seeded in the database
            Password = "Password123!",
            ConfirmPassword = "Password123!"
        };

        _authServiceMock.Setup(auth => auth.RegisterAsync(newSeller, UserRoleEnum.Seller)).ReturnsAsync(false);
        //Act
        var result = await _authController.RegisterSeller(newSeller);
        //Assert
        var conflictResult = Assert.IsType<ConflictObjectResult>(result);
        Assert.Equal("Email already exists", conflictResult.Value);
    }

    [Fact]
    public async Task Register_ValidSellerPassword()
    {
        //Arrange
        var validSeller = new RegisterDto()
        {
            Email = "seller@gmail.com",
            Password = "ValidPassword123!",
            ConfirmPassword = "ValidPassword123!"
        };

        _authServiceMock.Setup(auth => auth.RegisterAsync(validSeller, UserRoleEnum.Seller)).ReturnsAsync(false);
        //Act
        var result = await _authController.RegisterSeller(validSeller);
        //Assert
        var okSeller = Assert.IsType<OkObjectResult>(result);
        Assert.Equal("Seller registered successfully.", okSeller.Value);
    }

    [Fact]
    public async Task Register_InvalidSellerPassword()
    {
        //Arrange
        var invalidSeller = new RegisterDto()
        {
            Email = "ivalidSeller@gmail.com",
            Password = "ValidPassword123!",
            ConfirmPassword = "ValidPassword"
        };

        _authServiceMock.Setup(auth => auth.RegisterAsync(invalidSeller, UserRoleEnum.Seller)).ReturnsAsync(false);
        //Act
        var result = await _authController.RegisterSeller(invalidSeller);
        //Assert
        var conflictSeller = Assert.IsType<BadRequestObjectResult>(result);
        Assert.Equal("Passwords do not match.", conflictSeller.Value);
    }

    [Fact]
    public async Task Register_ValidCustomerPassword()
    {
        //Arrange
        var invalidCustomer = new RegisterDto()
        {
            Email = "customer@gmail.com",
            Password = "ValidPassword123!",
            ConfirmPassword = "ValidPassword123!"
        };

        _authServiceMock.Setup(auth => auth.RegisterAsync(invalidCustomer, UserRoleEnum.Customer))
            .ReturnsAsync(false);
        //Act
        var result = await _authController.RegisterCustomer(invalidCustomer);
        //Assert
        var okCustomer = Assert.IsType<OkObjectResult>(result);
        Assert.Equal("Customer registered successfully.", okCustomer.Value);
    }

    [Fact]
    public async Task Register_InvalidCustomerPassword()
    {
        //Arrange
        var invalidCustomer = new RegisterDto()
        {
            Email = "ivalidCustomer@gmail.com",
            Password = "ValidPassword123!",
            ConfirmPassword = "ValidPassword"
        };

        _authServiceMock.Setup(auth => auth.RegisterAsync(invalidCustomer, UserRoleEnum.Customer))
            .ReturnsAsync(false);
        //Act
        var result = await _authController.RegisterCustomer(invalidCustomer);
        //Assert
        var conflictCustomer = Assert.IsType<BadRequestObjectResult>(result);
        Assert.Equal("Passwords do not match.", conflictCustomer.Value);
    }

    [Fact]
    public async Task Login_ValidCredentials()
    {
        //Arrange
        var loginUser = new LoginDto()
        {
            Email = "test@example.com",
            Password = "Password123!"
        };

        var existingUser = await _appDbContext.Users.FirstOrDefaultAsync(u => u.Email == loginUser.Email);

        _authServiceMock.Setup(auth => auth.LoginAsync(loginUser)).ReturnsAsync(existingUser);
        _tokenServiceMock.Setup(token => token.GenerateToken(existingUser)).Returns("Fake-Token");

        // Act
        var result = await _authController.LoginUser(loginUser);

        // Assert
        var okLogin = Assert.IsType<OkObjectResult>(result);

        // Cast the Value as a Dictionary<string, object>
        var response = Assert.IsType<LoginResponse>(okLogin.Value);

        // Assert on individual values in the dictionary
        Assert.Equal("Login successful.", response.Message);
        Assert.Equal("Fake-Token", response.Token);
    }

    [Fact]
    public async Task Login_InvalidCredentials()
    {
        // Arrange
        var loginUser = new LoginDto()
        {
            Email = "wrong@example.com",
            Password = "WrongPassword!"
        };
        var existingUser = await _appDbContext.Users.FirstOrDefaultAsync(u => u.Email == loginUser.Email);
        _authServiceMock.Setup(auth => auth.LoginAsync(loginUser)).ReturnsAsync(existingUser);

        // Act
        var result = await _authController.LoginUser(loginUser);

        // Assert
        var unauthorizedResult = Assert.IsType<UnauthorizedObjectResult>(result);
        Assert.Equal("Invalid email or password.", unauthorizedResult.Value);
    }

    [Fact]
    public async Task ForgotPassword_ValidCredentials_EmailExists_SuccessfulResponse()
    {
        //Arrange
        var inputEmail = "test@example.com";

        var existingUser = await _appDbContext.Users.FirstOrDefaultAsync(u => u.Email == inputEmail);

        var resetModel = new PasswordResetModel
        {
            UserID = existingUser.UserID,
            Email = existingUser.Email,
            Code = "123456",
            DateExpires = DateTime.UtcNow.AddMinutes(10),
            IsValid = true
        };

        _authServiceMock.Setup(auth => auth.RequestPasswordResetAsync(inputEmail)).ReturnsAsync(resetModel);
        //Act
        var result = await _authController.ForgotPassword(inputEmail);
        //Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.Equal($"Password reset sent successfully to {inputEmail}", okResult.Value);
    }

    [Fact]
    public async Task ForgotPassword_InvalidCredentals_WrongEmail_NotFoundResponses()
    {
        //Arrange
        var inputEmail = "wrong@example.com";

        //Act
        var result = await _authController.ForgotPassword(inputEmail);
        //Assert
        var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
        Assert.Equal("Email not found", badRequestResult.Value);
    }

    [Fact]
    public async Task ForgotPassword_InvalidCredentials_FailedToSendCode_BadRequestResponses()
    {
        var inputEmail = "test@example.com";

        var existingUser = await _appDbContext.Users.FirstOrDefaultAsync(u => u.Email == inputEmail);
        Assert.NotNull(existingUser); // Ensure that user exists in database

        //Mock the service to return null
        _authServiceMock.Setup(auth => auth.RequestPasswordResetAsync(inputEmail)).ReturnsAsync(() => null);
        //Act
        var result = await _authController.ForgotPassword(inputEmail);
        //Assert
        var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
        Assert.Equal("Failed to send the code", badRequestResult.Value);
    }

    [Fact]
    public async Task ResetPassword_ValidRequest_Success()
    {
        //Arrange
        var email = "test@example.com";
        var code = "123456";
        var newPassword = "Passwosd123!";

        //Ensure the user and reset request exists in db
        var resetRequest = new PasswordResetModel()
        {
            Email = email,
            Code = code,
            DateExpires = DateTime.UtcNow.AddMinutes(10),
            IsValid = true
        };

        _appDbContext.PasswordReset.Add(resetRequest);
        await _appDbContext.SaveChangesAsync();

        var resetDto = new PasswordResetDto()
        {
            Email = email,
            Code = code,
            NewPassword = newPassword
        };

        _authServiceMock.Setup(auth => auth.ResetPasswordAsync(resetDto.Email, resetDto.Code, resetDto.NewPassword))
            .ReturnsAsync(true);
        //Act
        var result = await _authController.ResetPassword(resetDto);
        //Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.Equal("Password was updated successfully", okResult.Value);
    }

    [Fact]
    public async Task ResetPassword_InvalidPasswordOrCode_BadRequest()
    {
        //Arrange
        var email = "wrong@example.com";
        var code = "654321";
        var newPassword = "Passwosd123!";

        //Ensure the user and reset request exists in db
        var resetRequest = new PasswordResetModel()
        {
            Email = email,
            Code = "147852",
            DateExpires = DateTime.UtcNow.AddMinutes(10),
            IsValid = true
        };

        _appDbContext.PasswordReset.Add(resetRequest);
        await _appDbContext.SaveChangesAsync();

        var resetDto = new PasswordResetDto()
        {
            Email = email,
            Code = code,
            NewPassword = newPassword
        };

        _authServiceMock.Setup(auth => auth.ResetPasswordAsync(resetDto.Email, resetDto.Code, resetDto.NewPassword))
            .ReturnsAsync(true);
        //Act
        var result = await _authController.ResetPassword(resetDto);
        //Assert
        var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
        Assert.Equal("Invalid code or email not found.", badRequestResult.Value);
    }

    [Fact]
    public async Task ResetPassword_UsedCode_BadRequest()
    {
        //Arrange
        var email = "wrong@example.com";
        var code = "654321";
        var newPassword = "Passwosd123!";

        //Ensure the user and reset request exists in db
        var resetRequest = new PasswordResetModel()
        {
            Email = email,
            Code = "654321",
            DateExpires = DateTime.UtcNow.AddMinutes(10),
            IsValid = false
        };

        _appDbContext.PasswordReset.Add(resetRequest);
        await _appDbContext.SaveChangesAsync();

        var resetDto = new PasswordResetDto()
        {
            Email = email,
            Code = code,
            NewPassword = newPassword
        };

        _authServiceMock.Setup(auth => auth.ResetPasswordAsync(resetDto.Email, resetDto.Code, resetDto.NewPassword))
            .ReturnsAsync(true);
        //Act
        var result = await _authController.ResetPassword(resetDto);
        //Assert
        var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
        Assert.Equal("Code was already used", badRequestResult.Value);
    }

    [Fact]
    public async Task ResetPassword_ExpiredCode_BadRequest()
    {
        //Arrange
        var email = "wrong@example.com";
        var code = "654321";
        var newPassword = "Passwosd123!";

        //Ensure the user and reset request exists in db
        var resetRequest = new PasswordResetModel()
        {
            Email = email,
            Code = "654321",
            DateExpires = DateTime.UtcNow.AddMinutes(-10),
            IsValid = true
        };

        _appDbContext.PasswordReset.Add(resetRequest);
        await _appDbContext.SaveChangesAsync();

        var resetDto = new PasswordResetDto()
        {
            Email = email,
            Code = code,
            NewPassword = newPassword
        };

        _authServiceMock.Setup(auth => auth.ResetPasswordAsync(resetDto.Email, resetDto.Code, resetDto.NewPassword))
            .ReturnsAsync(true);
        //Act
        var result = await _authController.ResetPassword(resetDto);
        //Assert
        var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
        Assert.Equal("Expired code.", badRequestResult.Value);
    }

    [Fact]
    public async Task ResetPassword_FailedResetPassword_BadRequest()
    {
        //Arrange
        var email = "wrong@example.com";
        var code = "654321";
        var newPassword = "Passwosd123!";

        //Ensure the user and reset request exists in db
        var resetRequest = new PasswordResetModel()
        {
            Email = email,
            Code = "654321",
            DateExpires = DateTime.UtcNow.AddMinutes(10),
            IsValid = true
        };

        _appDbContext.PasswordReset.Add(resetRequest);
        await _appDbContext.SaveChangesAsync();

        var resetDto = new PasswordResetDto()
        {
            Email = email,
            Code = code,
            NewPassword = newPassword
        };

        _authServiceMock.Setup(auth => auth.ResetPasswordAsync(resetDto.Email, resetDto.Code, resetDto.NewPassword))
            .ReturnsAsync(false);
        //Act
        var result = await _authController.ResetPassword(resetDto);
        //Assert
        var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
        Assert.Equal("Failed to reset the password", badRequestResult.Value);
    }

    [Fact]
    public async Task Logout_ValidLogout()
    {
        var result = await _authController.Logout();
        var okRequestResult = Assert.IsType<OkObjectResult>(result);
        Assert.Equal("Logged out successfully", okRequestResult.Value);
    }
}