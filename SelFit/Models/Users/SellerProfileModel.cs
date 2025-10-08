using SelFit.Models.Auth;
using SelFit.Models.Orders;
using SelFit.Models.Product;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace SelFit.Models.Users;

public class SellerProfileModel
{
    [Key] public Guid UserID { get; set; }
    public string Email { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public List<ProductModel> Products { get; set; } = new();
    public List<OrderModel> Orders { get; set; } = new();

    [JsonIgnore] public UserModel User { get; set; }
}