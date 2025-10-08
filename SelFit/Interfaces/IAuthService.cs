using SelFit.DTOs.Account;
using SelFit.Enums;
using SelFit.Models.Auth;

namespace SelFit.Interfaces;

public interface IAuthService
{
    Task<bool> RegisterAsync(RegisterDto newUser, UserRoleEnum role);
    Task<UserModel> LoginAsync(LoginDto login);
    Task<PasswordResetModel> RequestPasswordResetAsync(string email);
    Task<bool> ResetPasswordAsync(string email, string newPassword, string code);
}