using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SelFit.Data;
using SelFit.DTOs.Order;
using SelFit.Enums;
using SelFit.Interfaces;
using SelFit.Responses;
using System.Data;

namespace SelFit.Controllers;

[Route("api/[controller]")]
[ApiController]
public class OrderController : ControllerBase
{
    private readonly AppDbContext _appDbContext;
    private readonly IOrderService _orderService;

    public OrderController(AppDbContext appDbContext, IOrderService orderService)
    {
        _appDbContext = appDbContext;
        _orderService = orderService;
    }

    [HttpPost("place-order")]
    [Authorize(Roles = "Customer, Admin")]
    public async Task<ActionResult> PlaceOrder([FromBody] OrderDto orderDto)
    {
        var customer = await _appDbContext.Customers
            .FirstOrDefaultAsync(c => c.UserID == orderDto.CustomerId);

        if (customer == null) return BadRequest($"Customer with ID {orderDto.CustomerId} not found.");

        var seller = await _appDbContext.Sellers
            .FirstOrDefaultAsync(s => s.UserID == orderDto.SellerId);

        if (seller == null) return BadRequest($"Seller with ID {orderDto.SellerId} not found.");

        var product = await _appDbContext.Products
            .FirstOrDefaultAsync(p => p.Id == orderDto.ProductId);

        if (product == null) return BadRequest($"Product with ID {orderDto.ProductId} not found.");

        var newOrder = await _orderService.CreateOrderAsync(orderDto);

        if (newOrder == null) return BadRequest("Order creation failed, check the order details.");

        return Ok(newOrder);
    }

    [HttpPost("change-order-status/{orderId}")]
    [Authorize(Roles = "Seller, Admin")]
    public async Task<ActionResult> ChangeOrderStatus([FromRoute] Guid orderId, [FromQuery] OrderStatusEnum orderStatus)
    {
        var status = await _orderService.UpdateStatusOrderTaskAsync(orderId, orderStatus);
        if (status == false) return BadRequest("Failed to change order status");

        return Ok("Order Status was changed successfully");
    }

    [HttpGet("orders-by-seller/{sellerId}")]
    [Authorize(Roles = "Seller, Admin")]
    public async Task<ActionResult<List<ResponseOrder>>> GetOrdersBySellerId([FromRoute] Guid sellerId)
    {
        var seller = await _appDbContext.Sellers.FirstOrDefaultAsync(s => s.UserID == sellerId);

        if (seller == null) return BadRequest("Seller not found");

        var orders = await _orderService.GetOrdersBySellerIdAsync(sellerId);

        if (orders == null || !orders.Any()) return BadRequest("No orders found for the specified seller.");

        return Ok(orders);
    }

    [HttpGet("get-order/{orderId}")]
    [Authorize]
    public async Task<ActionResult> GetOrderById([FromRoute] Guid orderId)
    {
        var order = await _orderService.GetOrderByOrderIdAsync(orderId);

        if (order == null) return BadRequest($"Order with ID {orderId} not found.");

        return Ok(order);
    }

    [HttpGet("get-orders")]
    [Authorize]
    public async Task<ActionResult> GetAllOrders()
    {
        var orders = await _orderService.GetAllOrdersAsync();

        if (orders == null || orders.Any()) return BadRequest("No orders found.");

        return Ok(orders);
    }

    [HttpDelete("delete-order/{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult> DeleteOrder([FromRoute] Guid id)
    {
        var success = await _orderService.DeleteOrderAsync(id);

        if (success == false) return NotFound("Order not found");

        return Ok("Order was successfully deleted");
    }
}