using SelFit.DTOs.Account;

namespace SelFit.DTOs.Users;

public class SellerProfileDto
{
    public string Name { get; set; }
    public string Description { get; set; }
    public UserModelDto User { get; set; }
}