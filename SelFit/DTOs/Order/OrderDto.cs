namespace SelFit.DTOs.Order;

public class OrderDto
{
    public Guid CustomerId { get; set; }
    public Guid SellerId { get; set; }
    public Guid ProductId { get; set; }
}