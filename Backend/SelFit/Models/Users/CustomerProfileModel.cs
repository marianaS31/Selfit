using SelFit.Models.Auth;
using System.ComponentModel.DataAnnotations;

namespace SelFit.Models.Users;

public class CustomerProfileModel
{
    [Key] public Guid UserID { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; }
    public string PhoneNumber { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string Zip { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public UserModel User { get; set; }
}