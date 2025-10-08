using SelFit.Enums;
using SelFit.Models.Users;
using System.Text.Json.Serialization;

namespace SelFit.Models.Product;

public class ProductModel
{
    public Guid Id { get; set; }
    [JsonIgnore] public Guid SellerId { get; set; }
    public string Email { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public decimal Price { get; set; }
    public string ImageUrl { get; set; } = string.Empty;

    //Product Details
    public MaterialTypeEnum Material { get; set; }
    public string Color { get; set; }
    public List<ProductMeasurementModel> Measurements { get; set; } = new();
    [JsonIgnore] public SellerProfileModel Seller { get; set; }
}