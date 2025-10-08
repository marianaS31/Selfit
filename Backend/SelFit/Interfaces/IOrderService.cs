using SelFit.DTOs.Order;
using SelFit.Enums;
using SelFit.Responses;

namespace SelFit.Interfaces;

public interface IOrderService
{
    Task<ResponseOrder> CreateOrderAsync(OrderDto orderDto);
    Task<bool> UpdateStatusOrderTaskAsync(Guid orderId, OrderStatusEnum orderStatus);
    Task<List<ResponseOrder>> GetOrdersBySellerIdAsync(Guid sellerId);
    Task<ResponseOrder> GetOrderByOrderIdAsync(Guid orderId);
    Task<List<ResponseOrder>> GetAllOrdersAsync();
    Task<bool> DeleteOrderAsync(Guid orderId);
}