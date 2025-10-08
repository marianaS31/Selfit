using SelFit.DTOs.Account;

namespace SelFit.DTOs.Users;

public class CustomerProfileDto
{
    public string FullName { get; set; }
    public string PhoneNumber { get; set; }
    public string Address { get; set; }
    public string Zip { get; set; }
    public string City { get; set; }
    public UserModelDto User { get; set; }
}