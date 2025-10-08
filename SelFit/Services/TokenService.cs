using Microsoft.IdentityModel.Tokens;
using SelFit.Interfaces;
using SelFit.Models.Auth;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace SelFit.Services;

public class TokenService : ITokenService
{
    private readonly IConfiguration _configuration;

    public TokenService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public string GenerateToken(UserModel user)
    {
        //Convert UserID to a string from GUID
        var userIdString = user.UserID.ToString();

        List<Claim> claims = new()
        {
            new("name_id", user.Id.ToString()),
            new("unique_name", user.Email),
            new("user_guid", userIdString),
            new("role", user.Role)
        };

        var getSecretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
            _configuration.GetSection("JwtSettings:SecretKey").Value!));

        var signingCreds = new SigningCredentials(getSecretKey, SecurityAlgorithms.HmacSha256);

        var expirationDays = int.Parse(_configuration["JwtSettings:AccessTokenExpirationInDays"]!);
        var expires = DateTime.UtcNow.AddDays(expirationDays);

        var token = new JwtSecurityToken(
            claims: claims,
            expires: expires,
            signingCredentials: signingCreds
        );
        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}