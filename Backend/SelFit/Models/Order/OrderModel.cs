using SelFit.Enums;
using SelFit.Models.Product;
using SelFit.Models.Users;
using System.ComponentModel.DataAnnotations;

namespace SelFit.Models.Orders;

public class OrderModel
{
    [Key] public Guid Id { get; set; }
    public Guid CustomerId { get; set; }
    public Guid SellerId { get; set; }
    public Guid ProductId { get; set; }
    public decimal TotalPrice { get; set; }
    public DateTime OrderDate { get; set; }
    public OrderStatusEnum OrderStatus { get; set; }
    public CustomerProfileModel Customer { get; set; }
    public SellerProfileModel Seller { get; set; }
    public ProductModel Product { get; set; }
}