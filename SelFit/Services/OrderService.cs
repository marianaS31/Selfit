using Microsoft.EntityFrameworkCore;
using SelFit.Data;
using SelFit.DTOs.Account;
using SelFit.DTOs.Order;
using SelFit.DTOs.Prouduct;
using SelFit.DTOs.Users;
using SelFit.Enums;
using SelFit.Interfaces;
using SelFit.Models.Orders;
using SelFit.Responses;

namespace SelFit.Services;

public class OrderService : IOrderService
{
    private readonly AppDbContext _appDbContext;

    public OrderService(AppDbContext appDbContext)
    {
        _appDbContext = appDbContext;
    }

    public async Task<ResponseOrder> CreateOrderAsync(OrderDto orderDto)
    {
        var customer = await _appDbContext.Customers
            .Include(c => c.User)
            .FirstOrDefaultAsync(c => c.UserID == orderDto.CustomerId);

        var seller = await _appDbContext.Sellers
            .Include(s => s.User)
            .FirstOrDefaultAsync(s => s.UserID == orderDto.SellerId);

        var product = await _appDbContext.Products
            .Include(p => p.Measurements)
            .FirstOrDefaultAsync(p => p.Id == orderDto.ProductId);

        var totalPrice = product.Price;

        var order = new OrderModel
        {
            CustomerId = customer.UserID,
            SellerId = seller.UserID,
            ProductId = product.Id,
            TotalPrice = totalPrice,
            OrderDate = DateTime.UtcNow,
            OrderStatus = OrderStatusEnum.Pending
        };

        _appDbContext.Orders.Add(order);
        await _appDbContext.SaveChangesAsync();

        var responseOrderDto = new ResponseOrder
        {
            Id = order.Id,
            CustomerId = customer.UserID,
            SellerId = seller.UserID,
            ProductId = product.Id,
            TotalPrice = totalPrice,
            OrderDate = order.OrderDate,
            OrderStatus = order.OrderStatus,
            Customer = new CustomerProfileDto
            {
                FullName = customer.FullName,
                PhoneNumber = customer.PhoneNumber,
                Address = customer.Address,
                Zip = customer.Zip,
                City = customer.City,
                User = new UserModelDto
                {
                    Email = customer.User.Email,
                    Role = customer.User.Role,
                    DateCreated = customer.User.DateCreated
                }
            },
            Seller = new SellerProfileDto
            {
                Name = seller.Name,
                Description = seller.Description,
                User = new UserModelDto
                {
                    Email = seller.User.Email,
                    Role = seller.User.Role,
                    DateCreated = seller.User.DateCreated
                }
            },
            Product = new ProductDto
            {
                Name = product.Name,
                Description = product.Description,
                Price = product.Price,
                ImageUrl = product.ImageUrl,
                Color = product.Color,
                Material = product.Material,
                Measurements = product.Measurements.Select(m => new ProductMeasurementDto()
                {
                    MeasurementType = m.MeasurementType,
                    Value = m.Value
                }).ToList()
            }
        };

        return responseOrderDto;
    }

    public async Task<bool> UpdateStatusOrderTaskAsync(Guid orderId, OrderStatusEnum status)
    {
        var order = await _appDbContext.Orders.FirstOrDefaultAsync(o => o.Id == orderId);

        if (order == null) return false;

        order.OrderStatus = status;
        await _appDbContext.SaveChangesAsync();
        return true;
    }

    public async Task<List<ResponseOrder>> GetOrdersBySellerIdAsync(Guid sellerId)
    {
        var order = await _appDbContext.Orders
            .Include(o => o.Customer).ThenInclude(c => c.User)
            .Include(o => o.Seller).ThenInclude(s => s.User)
            .Include(o => o.Product).ThenInclude(p => p.Measurements)
            .Where(o => o.SellerId == sellerId)
            .ToListAsync();

        if (order == null) return null;

        var orderResponses = order.Select(o => new ResponseOrder
        {
            Id = o.Id,
            CustomerId = o.CustomerId,
            SellerId = o.SellerId,
            ProductId = o.ProductId,
            TotalPrice = o.TotalPrice,
            OrderDate = o.OrderDate,
            OrderStatus = o.OrderStatus,
            Customer = new CustomerProfileDto
            {
                FullName = o.Customer.FullName,
                PhoneNumber = o.Customer.PhoneNumber,
                Address = o.Customer.Address,
                Zip = o.Customer.Zip,
                City = o.Customer.City,
                User = new UserModelDto
                {
                    Email = o.Seller.User.Email,
                    Role = o.Seller.User.Role,
                    DateCreated = o.Seller.User.DateCreated
                }
            },
            Seller = new SellerProfileDto
            {
                Name = o.Seller.Name,
                Description = o.Seller.Description,
                User = new UserModelDto
                {
                    Email = o.Seller.User.Email,
                    Role = o.Seller.User.Role,
                    DateCreated = o.Seller.User.DateCreated
                }
            },
            Product = new ProductDto
            {
                Name = o.Product.Name,
                Description = o.Product.Description,
                Price = o.Product.Price,
                ImageUrl = o.Product.ImageUrl,
                Color = o.Product.Color,
                Material = o.Product.Material,
                Measurements = o.Product.Measurements.Select(m => new ProductMeasurementDto()
                {
                    MeasurementType = m.MeasurementType,
                    Value = m.Value
                }).ToList()
            }
        }).ToList();

        return orderResponses;
    }

    public async Task<ResponseOrder> GetOrderByOrderIdAsync(Guid orderId)
    {
        var order = await _appDbContext.Orders
            .Include(o => o.Customer).ThenInclude(c => c.User)
            .Include(o => o.Seller).ThenInclude(s => s.User)
            .Include(o => o.Product).ThenInclude(p => p.Measurements)
            .FirstOrDefaultAsync(o => o.Id == orderId);

        if (order == null) return null;

        var orderResponse = new ResponseOrder()
        {
            Id = order.Id,
            CustomerId = order.CustomerId,
            SellerId = order.SellerId,
            ProductId = order.ProductId,
            TotalPrice = order.TotalPrice,
            OrderDate = order.OrderDate,
            OrderStatus = order.OrderStatus,
            Customer = new CustomerProfileDto
            {
                FullName = order.Customer.FullName,
                PhoneNumber = order.Customer.PhoneNumber,
                Address = order.Customer.Address,
                Zip = order.Customer.Zip,
                City = order.Customer.City,
                User = new UserModelDto
                {
                    Email = order.Seller.User.Email,
                    Role = order.Seller.User.Role,
                    DateCreated = order.Seller.User.DateCreated
                }
            },
            Seller = new SellerProfileDto
            {
                Name = order.Seller.Name,
                Description = order.Seller.Description,
                User = new UserModelDto
                {
                    Email = order.Seller.User.Email,
                    Role = order.Seller.User.Role,
                    DateCreated = order.Seller.User.DateCreated
                }
            },
            Product = new ProductDto
            {
                Name = order.Product.Name,
                Description = order.Product.Description,
                Price = order.Product.Price,
                ImageUrl = order.Product.ImageUrl,
                Color = order.Product.Color,
                Material = order.Product.Material,
                Measurements = order.Product.Measurements.Select(m => new ProductMeasurementDto()
                {
                    MeasurementType = m.MeasurementType,
                    Value = m.Value
                }).ToList()
            }
        };

        return orderResponse;
    }

    public async Task<List<ResponseOrder>> GetAllOrdersAsync()
    {
        var orders = await _appDbContext.Orders
            .Include(o => o.Customer).ThenInclude(c => c.User)
            .Include(o => o.Seller).ThenInclude(s => s.User)
            .Include(o => o.Product).ThenInclude(p => p.Measurements)
            .ToListAsync();

        if (orders == null) return null;

        var orderResponses = orders.Select(o => new ResponseOrder
        {
            Id = o.Id,
            CustomerId = o.CustomerId,
            SellerId = o.SellerId,
            ProductId = o.ProductId,
            TotalPrice = o.TotalPrice,
            OrderDate = o.OrderDate,
            OrderStatus = o.OrderStatus,
            Customer = new CustomerProfileDto
            {
                FullName = o.Customer.FullName,
                PhoneNumber = o.Customer.PhoneNumber,
                Address = o.Customer.Address,
                Zip = o.Customer.Zip,
                City = o.Customer.City,
                User = new UserModelDto
                {
                    Email = o.Seller.User.Email,
                    Role = o.Seller.User.Role,
                    DateCreated = o.Seller.User.DateCreated
                }
            },
            Seller = new SellerProfileDto
            {
                Name = o.Seller.Name,
                Description = o.Seller.Description,
                User = new UserModelDto
                {
                    Email = o.Seller.User.Email,
                    Role = o.Seller.User.Role,
                    DateCreated = o.Seller.User.DateCreated
                }
            },
            Product = new ProductDto
            {
                Name = o.Product.Name,
                Description = o.Product.Description,
                Price = o.Product.Price,
                ImageUrl = o.Product.ImageUrl,
                Color = o.Product.Color,
                Material = o.Product.Material,
                Measurements = o.Product.Measurements.Select(m => new ProductMeasurementDto()
                {
                    MeasurementType = m.MeasurementType,
                    Value = m.Value
                }).ToList()
            }
        }).ToList();

        return orderResponses;
    }

    public async Task<bool> DeleteOrderAsync(Guid orderId)
    {
        var order = await _appDbContext.Orders
            .FirstOrDefaultAsync(o => o.Id == orderId);

        if (order == null) return false;

        _appDbContext.Orders.Remove(order);

        await _appDbContext.SaveChangesAsync();

        return true;
    }
}