using SelFit.Models.Users;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;


namespace SelFit.Models.Auth;

public class UserModel
{
    [Key] public int Id { get; set; }
    public Guid UserID { get; set; }
    public string Email { get; set; }
    public string PasswordHash { get; set; }
    public string Role { get; set; }

    public DateTime DateCreated { get; set; }

    // Navigation property for sellers
    [JsonIgnore] public SellerProfileModel Seller { get; set; }
    [JsonIgnore] public CustomerProfileModel Customer { get; set; }
}