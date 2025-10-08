using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Castle.Core.Resource;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Moq;
using SelFit.Controllers;
using SelFit.Data;
using SelFit.DTOs.Order;
using SelFit.Enums;
using SelFit.Interfaces;
using SelFit.Migrations;
using SelFit.Models;
using SelFit.Models.Product;
using SelFit.Models.Users;
using SelFit.Responses;

namespace Selfit.Tests.Controllers;

public class OrderControllerTest
{
    private readonly Mock<IOrderService> _orderServiceMock;
    private readonly OrderController _orderController;
    private readonly AppDbContext _appDbContext;

    public OrderControllerTest()
    {
        _orderServiceMock = new Mock<IOrderService>();

        //set up in-memory database
        var options = new DbContextOptionsBuilder<AppDbContext>().UseInMemoryDatabase("TestDatabase").Options;

        _appDbContext = new AppDbContext(options);

        //seed database with customer and seller
        SeedDatabase();
        _appDbContext.SaveChanges();

        //initialise controller with mock services
        _orderController = new OrderController(_appDbContext, _orderServiceMock.Object);
    }

    private void SeedDatabase()
    {
        _appDbContext.Customers.Add(CreateCustomer());
        _appDbContext.Sellers.Add(CreateSeller());
        _appDbContext.SaveChanges();
    }

    private CustomerProfileModel CreateCustomer()
    {
        return new CustomerProfileModel()
        {
            Address = "test address",
            City = "test city",
            Email = "test@example.com",
            FullName = "Full name",
            PhoneNumber = "+37100000000",
            UserID = Guid.NewGuid()
        };
    }

    private SellerProfileModel CreateSeller()
    {
        return new SellerProfileModel()
        {
            Description = "new store",
            Email = "test@storetest.com",
            Name = "Test store",
            UserID = Guid.NewGuid()
        };
    }

    private ProductModel CreateProduct(Guid sellerId)
    {
        return new ProductModel()
        {
            Description = "description",
            Email = "test.email@test.com",
            Name = "Sample product",
            Id = Guid.NewGuid(),
            Price = 10,
            SellerId = sellerId,
            Color = "Red"
        };
    }

    private OrderDto CreateOrderDto(Guid customerId, Guid productId, Guid sellerId)
    {
        return new OrderDto()
        {
            CustomerId = customerId,
            ProductId = productId,
            SellerId = sellerId
        };
    }

    private ResponseOrder CreateOrderResponse(OrderDto orderDto)
    {
        return new ResponseOrder()
        {
            CustomerId = orderDto.CustomerId,
            Id = Guid.NewGuid(),
            ProductId = orderDto.ProductId,
            SellerId = orderDto.SellerId,
            OrderDate = DateTime.Now
        };
    }

    [Fact]
    public async Task PlaceOrder_ReturnOk()
    {
        //arrange
        var customer = _appDbContext.Customers.First();
        var seller = _appDbContext.Sellers.First();

        //create product associated with seller
        var product = CreateProduct(seller.UserID);

        await _appDbContext.Products.AddAsync(product);
        await _appDbContext.SaveChangesAsync();

        //create order dto using the seller, customer and created product info
        var orderDto = CreateOrderDto(customer.UserID, product.Id, seller.UserID);

        //create mock response from function
        var orderResponse = CreateOrderResponse(orderDto);

        //setup ordermock to simulate the creation of an order
        _orderServiceMock.Setup(service => service.CreateOrderAsync(orderDto))
            .ReturnsAsync(orderResponse);

        //act
        var result = await _orderController.PlaceOrder(orderDto);


        //assert
        var okResult = Assert.IsType<OkObjectResult>(result);
    }

    [Fact]
    public async Task PlaceOrder_CustomerDoesntExist_BadRequest()
    {
        //arrange
        var nonExistentCustomerId = Guid.NewGuid();
        var seller = _appDbContext.Sellers.First();

        //create product associated with seller
        var product = CreateProduct(seller.UserID);

        await _appDbContext.Products.AddAsync(product);
        await _appDbContext.SaveChangesAsync();

        //create order dto using the seller, customer and created product info
        var orderDto = CreateOrderDto(nonExistentCustomerId, product.Id, seller.UserID);

        //create mock response from function
        var orderResponse = CreateOrderResponse(orderDto);

        //setup ordermock to simulate the creation of an order
        _orderServiceMock.Setup(service => service.CreateOrderAsync(orderDto))
            .ReturnsAsync(orderResponse);

        //act
        var result = await _orderController.PlaceOrder(orderDto);

        //assert
        var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
        Assert.Equal($"Customer with ID {orderResponse.CustomerId} not found.", badRequestResult.Value);
    }

    [Fact]
    public async Task PlaceOrder_SellerDoesntExist_BadRequest()
    {
        //arrange
        var nonExistentSellerId = Guid.NewGuid();
        var customer = _appDbContext.Customers.First();

        //create product associated with seller
        var product = CreateProduct(nonExistentSellerId);

        await _appDbContext.Products.AddAsync(product);
        await _appDbContext.SaveChangesAsync();

        //create order dto using the seller, customer and created product info
        var orderDto = CreateOrderDto(customer.UserID, product.Id, nonExistentSellerId);
        //create mock response from function
        var orderResponse = CreateOrderResponse(orderDto);

        //setup ordermock to simulate the creation of an order
        _orderServiceMock.Setup(service => service.CreateOrderAsync(orderDto))
            .ReturnsAsync(orderResponse);

        //act
        var result = await _orderController.PlaceOrder(orderDto);

        //assert
        var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
        Assert.Equal($"Seller with ID {orderResponse.SellerId} not found.", badRequestResult.Value);
    }

    [Fact]
    public async Task PlaceOrder_ProductDoesntExist_BadRequest()
    {
        //arrange
        var seller = _appDbContext.Sellers.First();
        var customer = _appDbContext.Customers.First();

        //create productid that doesnt exist
        var nonExistentProductId = Guid.NewGuid();

        //create order dto using the seller, customer and created product info
        var orderDto = CreateOrderDto(customer.UserID, nonExistentProductId, seller.UserID);

        //create mock response from function
        var orderResponse = CreateOrderResponse(orderDto);

        //setup ordermock to simulate the creation of an order
        _orderServiceMock.Setup(service => service.CreateOrderAsync(orderDto))
            .ReturnsAsync(orderResponse);

        //act
        var result = await _orderController.PlaceOrder(orderDto);

        //assert
        var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
        Assert.Equal($"Product with ID {orderResponse.ProductId} not found.", badRequestResult.Value);
    }

    [Fact]
    public async Task PlaceOrder_OrderCreationFailed_BadRequest()
    {
        //arrange
        var customer = _appDbContext.Customers.First();
        var seller = _appDbContext.Sellers.First();

        //create product associated with seller
        var product = CreateProduct(seller.UserID);

        await _appDbContext.Products.AddAsync(product);
        await _appDbContext.SaveChangesAsync();

        //create order dto using the seller, customer and created product info
        var orderDto = CreateOrderDto(customer.UserID, product.Id, seller.UserID);

        //setup ordermock to simulate the creation of an order
        _orderServiceMock.Setup(service => service.CreateOrderAsync(orderDto))
            .ReturnsAsync((ResponseOrder)null);

        //act
        var result = await _orderController.PlaceOrder(orderDto);

        //assert
        var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
        Assert.Equal($"Order creation failed, check the order details.", badRequestResult.Value);
    }

    [Fact]
    public async Task ChangeOrderStatus_ReturnsOk()
    {
        //arrange
        //following code creates an order
        var customer = _appDbContext.Customers.First();
        var seller = _appDbContext.Sellers.First();

        var product = CreateProduct(seller.UserID);

        await _appDbContext.Products.AddAsync(product);
        await _appDbContext.SaveChangesAsync();

        var orderDto = CreateOrderDto(customer.UserID, product.Id, seller.UserID);

        var orderResponse = CreateOrderResponse(orderDto);

        //new order status
        var newOrderStatus = OrderStatusEnum.Processing;

        //setup to mock the service for updating order
        _orderServiceMock.Setup(service =>
                service.UpdateStatusOrderTaskAsync(orderResponse.Id, newOrderStatus))
            .ReturnsAsync(true);

        //act
        var result = await _orderController.ChangeOrderStatus(orderResponse.Id, newOrderStatus);

        //assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.Equal("Order Status was changed successfully", okResult.Value);
    }

    [Fact]
    public async Task ChangeOrderStatus_StatusIsFalse_BadRequest()
    {
        //arrange
        //following code creates an order
        var customer = _appDbContext.Customers.First();
        var seller = _appDbContext.Sellers.First();

        var product = CreateProduct(seller.UserID);

        await _appDbContext.Products.AddAsync(product);
        await _appDbContext.SaveChangesAsync();

        var orderDto = CreateOrderDto(customer.UserID, product.Id, seller.UserID);

        var orderResponse = CreateOrderResponse(orderDto);
        //new order status
        var newOrderStatus = OrderStatusEnum.Processing;

        //setup to mock the service for updating order
        //returns 'false' because we are simulating that the service fails to update order even if it exists
        _orderServiceMock.Setup(service =>
                service.UpdateStatusOrderTaskAsync(orderResponse.Id, newOrderStatus))
            .ReturnsAsync(false);

        //act
        var result = await _orderController.ChangeOrderStatus(orderResponse.Id, newOrderStatus);

        //assert
        var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
        Assert.Equal("Failed to change order status", badRequestResult.Value);
    }

    [Fact]
    public async Task GetOrdersBySellerId_ReturnsOk()
    {
        //arrange
        //following code creates an order
        var customer = _appDbContext.Customers.First();
        var seller = _appDbContext.Sellers.First();

        var product = CreateProduct(seller.UserID);

        await _appDbContext.Products.AddAsync(product);
        await _appDbContext.SaveChangesAsync();

        var orderDto = CreateOrderDto(customer.UserID, product.Id, seller.UserID);

        var orderResponse = CreateOrderResponse(orderDto);

        //simulates list of orders pulled from database
        var orders = new List<ResponseOrder> { orderResponse };

        //setup to mock the service for updating order
        _orderServiceMock.Setup(service =>
                service.GetOrdersBySellerIdAsync(orderResponse.SellerId))
            .ReturnsAsync(orders);

        //act
        var result = await _orderController.GetOrdersBySellerId(orderResponse.SellerId);

        //assert
        var actionResult = Assert.IsType<ActionResult<List<ResponseOrder>>>(result);
        var okResult = Assert.IsType<OkObjectResult>(actionResult.Result);
    }

    [Fact]
    public async Task GetOrdersBySellerId_SellerIsNotFound_BadRequest()
    {
        //arrange
        //following code creates an order
        var customer = _appDbContext.Customers.First();
        var nonExistentSeller = Guid.NewGuid();

        var product = new ProductModel
        {
            Description = "description",
            Email = "no email because seller doesnt exist",
            Name = "Sample product",
            Id = Guid.NewGuid(),
            Price = 10,
            SellerId = nonExistentSeller,
            Color = "Red"
        };

        await _appDbContext.Products.AddAsync(product);
        await _appDbContext.SaveChangesAsync();

        var orderDto = new OrderDto()
        {
            CustomerId = customer.UserID,
            ProductId = product.Id,
            SellerId = nonExistentSeller
        };

        var orderResponse = new ResponseOrder()
        {
            CustomerId = customer.UserID,
            Id = Guid.NewGuid(),
            ProductId = product.Id,
            SellerId = nonExistentSeller,
            OrderDate = DateTime.Now
        };

        //simulates list of orders pulled from database
        var orders = new List<ResponseOrder> { orderResponse };

        //setup to mock the service for updating order
        _orderServiceMock.Setup(service =>
                service.GetOrdersBySellerIdAsync(orderResponse.SellerId))
            .ReturnsAsync(orders);

        //act
        var result = await _orderController.GetOrdersBySellerId(orderResponse.SellerId);

        //assert
        var actionResult = Assert.IsType<ActionResult<List<ResponseOrder>>>(result);
        var badRequestResult = Assert.IsType<BadRequestObjectResult>(actionResult.Result);
        Assert.Equal("Seller not found", badRequestResult.Value);
    }

    [Fact]
    public async Task GetOrdersBySellerId_NoOrdersExist_BadRequest()
    {
        //arrange
        //following code creates an order
        var customer = _appDbContext.Customers.First();
        var seller = _appDbContext.Sellers.First();

        var product = new ProductModel
        {
            Description = "description",
            Email = seller.Email,
            Name = "Sample product",
            Id = Guid.NewGuid(),
            Price = 10,
            SellerId = seller.UserID,
            Color = "Red"
        };

        await _appDbContext.Products.AddAsync(product);
        await _appDbContext.SaveChangesAsync();

        var orderDto = new OrderDto()
        {
            CustomerId = customer.UserID,
            ProductId = product.Id,
            SellerId = seller.UserID
        };

        var orderResponse = new ResponseOrder()
        {
            CustomerId = customer.UserID,
            Id = Guid.NewGuid(),
            ProductId = product.Id,
            SellerId = seller.UserID,
            OrderDate = DateTime.Now
        };

        //simulates list of orders pulled from database
        var orders = new List<ResponseOrder> { };

        //setup to mock the service for updating order
        _orderServiceMock.Setup(service =>
                service.GetOrdersBySellerIdAsync(orderResponse.SellerId))
            .ReturnsAsync(orders);

        //act
        var result = await _orderController.GetOrdersBySellerId(orderResponse.SellerId);

        //assert
        var actionResult = Assert.IsType<ActionResult<List<ResponseOrder>>>(result);
        var badRequestResult = Assert.IsType<BadRequestObjectResult>(actionResult.Result);
        Assert.Equal("No orders found for the specified seller.", badRequestResult.Value);
    }

    [Fact]
    public async Task GetOrderById_ReturnsOk()
    {
        //arrange

        var orderId = Guid.NewGuid();

        var orderResponse = new ResponseOrder()
        {
            CustomerId = Guid.NewGuid(),
            Id = Guid.NewGuid(),
            ProductId = Guid.NewGuid(),
            SellerId = Guid.NewGuid(),
            OrderDate = DateTime.Now
        };

        //setup to mock the service for updating order
        _orderServiceMock.Setup(service =>
                service.GetOrderByOrderIdAsync(orderId))
            .ReturnsAsync(orderResponse);

        //act
        var result = await _orderController.GetOrderById(orderId);

        //assert
        var okResult = Assert.IsType<OkObjectResult>(result);
    }

    [Fact]
    public async Task GetOrderById_OrderDoesNotExist_BadRequest()
    {
        //arrange

        //id for nonexistent order
        var nonExistentId = Guid.NewGuid();

        //setup to mock the service for updating order
        _orderServiceMock.Setup(service =>
                service.GetOrderByOrderIdAsync(nonExistentId))
            .ReturnsAsync((ResponseOrder)null);

        //act
        var result = await _orderController.GetOrderById(nonExistentId);

        //assert
        var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
        Assert.Equal($"Order with ID {nonExistentId} not found.", badRequestResult.Value);
    }
}