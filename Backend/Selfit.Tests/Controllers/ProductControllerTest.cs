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
using SelFit.DTOs.Prouduct;
using SelFit.DTOs.Users;
using SelFit.Interfaces;
using SelFit.Models;
using SelFit.Models.Users;

namespace Selfit.Tests.Controllers;

public class ProductControllerTest
{
    private readonly Mock<IProductService> _productServiceMock;
    private readonly ProductController _productController;
    private readonly AppDbContext _appDbContext;

    public ProductControllerTest()
    {
        _productServiceMock = new Mock<IProductService>();

        //set up in-memory database
        var options = new DbContextOptionsBuilder<AppDbContext>().UseInMemoryDatabase("TestDatabase").Options;

        _appDbContext = new AppDbContext(options);

        //seed database with customer and seller
        _appDbContext.Sellers.Add(CreateSeller());
        _appDbContext.SaveChanges();

        //initialise controller with mock services
        _productController = new ProductController(_appDbContext, _productServiceMock.Object);
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

    private ProductDto CreateProductDto()
    {
        return new ProductDto()
        {
            Description = "test description",
            Name = "Sample item",
            Price = 10,
            Color = "Red"
        };
    }

    [Fact]
    public async Task CreateProduct_ReturnsOk()
    {
        //arrange
        var seller = await _appDbContext.Sellers.FirstAsync();

        //create product
        var productDto = CreateProductDto();

        //setup mock service to simulate creation of product
        _productServiceMock.Setup(service => service.CreateProductAsync(productDto, seller.UserID))
            .ReturnsAsync(true);

        //act
        var result = await _productController.CreateProduct(productDto, seller.UserID);

        //assert
        var okResult = Assert.IsType<OkObjectResult>(result);
    }

    [Fact]
    public async Task CreateProduct_CreateFailed_BadRequest()
    {
        //arrange
        var seller = await _appDbContext.Sellers.FirstAsync();

        //create product
        var productDto = CreateProductDto();

        //setup mock service to simulate creation of product
        _productServiceMock.Setup(service => service.CreateProductAsync(productDto, seller.UserID))
            .ReturnsAsync(false);

        //act
        var result = await _productController.CreateProduct(productDto, seller.UserID);

        //assert
        var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
    }
}