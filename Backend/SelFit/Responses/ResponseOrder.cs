using SelFit.DTOs.Prouduct;
using SelFit.DTOs.Users;
using SelFit.Enums;

namespace SelFit.Responses;

public class ResponseOrder
{
    public Guid Id { get; set; }
    public Guid CustomerId { get; set; }
    public Guid SellerId { get; set; }
    public Guid ProductId { get; set; }
    public decimal TotalPrice { get; set; }
    public DateTime OrderDate { get; set; }
    public OrderStatusEnum OrderStatus { get; set; }
    public CustomerProfileDto Customer { get; set; }
    public SellerProfileDto Seller { get; set; }
    public ProductDto Product { get; set; }
}