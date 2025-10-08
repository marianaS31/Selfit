using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Moq;
using SelFit.Controllers;
using SelFit.Data;
using SelFit.DTOs.Contact;
using SelFit.Interfaces;
using SelFit.Models;
using SelFit.Models.Product;
using SelFit.Models.Users;

namespace Selfit.Tests.Controllers;

public class ContactSellerControllerTest
{
    private readonly Mock<IContactSellerService> _contactSellerServiceMock;
    private readonly ContactSellerController _contactSellerController;
    private readonly AppDbContext _appDbContext;

    public ContactSellerControllerTest()
    {
        _contactSellerServiceMock = new Mock<IContactSellerService>();

        //set up in-memory database
        var options = new DbContextOptionsBuilder<AppDbContext>().UseInMemoryDatabase("TestDatabase").Options;

        _appDbContext = new AppDbContext(options);

        //seed database with customer and seller
        _appDbContext.Sellers.Add(CreateSeller());
        _appDbContext.SaveChanges();

        //initialise controller with mock services
        _contactSellerController = new ContactSellerController(_appDbContext, _contactSellerServiceMock.Object);
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

    private ContactSellerDto CreateContactSellerDto(Guid productId)
    {
        return new ContactSellerDto()
        {
            CustomerEmail = "customer@test.com",
            Message = "Hey, change this!",
            ProductID = productId,
            SellerEmail = "seller@test.com"
        };
    }

    [Fact]
    public async Task ContactSeller_ReturnsOk()
    {
        //arrange
        //fetches seller from db to create product
        var seller = _appDbContext.Sellers.First();
        var product = CreateProduct(seller.UserID);

        _appDbContext.Products.AddAsync(product);
        _appDbContext.SaveChangesAsync();

        //creates dto
        var contactSellerDto = CreateContactSellerDto(product.Id);

        //setup mock service
        _contactSellerServiceMock.Setup(service => service.ContactSellerByAsync(
                contactSellerDto.CustomerEmail, contactSellerDto.Message,
                contactSellerDto.SellerEmail, contactSellerDto.ProductID))
            .ReturnsAsync(true);

        //act
        var result = await _contactSellerController.ContactSeller(contactSellerDto);

        //assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.Equal("Your message has been sent to the seller. The seller will get back to you soon.",
            okResult.Value);
    }

    [Fact]
    public async Task ContactSeller_ProductDoesNotExist_BadRequest()
    {
        //arrange
        //fetches seller from db to create product
        var seller = _appDbContext.Sellers.First();
        var nonExistentProductId = Guid.NewGuid();

        //creates dto
        var contactSellerDto = CreateContactSellerDto(nonExistentProductId);

        //setup mock service
        _contactSellerServiceMock.Setup(service => service.ContactSellerByAsync(
                contactSellerDto.CustomerEmail, contactSellerDto.Message,
                contactSellerDto.SellerEmail, contactSellerDto.ProductID))
            .ReturnsAsync(true);

        //act
        var result = await _contactSellerController.ContactSeller(contactSellerDto);

        //assert
        var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
        Assert.Equal("Product does not exist", badRequestResult.Value);
    }

    [Fact]
    public async Task ContactSeller_FailedToSendEmail_BadRequest()
    {
        //arrange
        //fetches seller from db to create product
        var seller = _appDbContext.Sellers.First();
        var product = CreateProduct(seller.UserID);

        _appDbContext.Products.AddAsync(product);
        _appDbContext.SaveChangesAsync();

        //creates dto
        var contactSellerDto = CreateContactSellerDto(product.Id);

        //setup mock service
        _contactSellerServiceMock.Setup(service => service.ContactSellerByAsync(
                contactSellerDto.CustomerEmail, contactSellerDto.Message,
                contactSellerDto.SellerEmail, contactSellerDto.ProductID))
            .ReturnsAsync(false);

        //act
        var result = await _contactSellerController.ContactSeller(contactSellerDto);

        //assert
        var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
        Assert.Equal("Failed to send email", badRequestResult.Value);
    }
}