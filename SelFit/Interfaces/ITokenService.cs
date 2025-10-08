using SelFit.Models.Auth;

namespace SelFit.Interfaces;

public interface ITokenService
{
    string GenerateToken(UserModel user);
}