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
using SelFit.DTOs.Users;
using SelFit.Interfaces;
using SelFit.Models.Users;

namespace Selfit.Tests.Controllers;

public class SellerProfileControllerTest
{
    private readonly Mock<ISellerProfileService> _sellerProfileServiceMock;
    private readonly SellerProfileController _sellerProfileController;
    private readonly AppDbContext _appDbContext;

    public SellerProfileControllerTest()
    {
        _sellerProfileServiceMock = new Mock<ISellerProfileService>();

        //set up in-memory database
        var options = new DbContextOptionsBuilder<AppDbContext>().UseInMemoryDatabase("TestDatabase").Options;

        _appDbContext = new AppDbContext(options);

        //initialise controller with mock services
        _sellerProfileController = new SellerProfileController(_appDbContext, _sellerProfileServiceMock.Object);
    }

    [Fact]
    public async Task GetSellers_ReturnsOk()
    {
        //arrange
        var sellerId = Guid.NewGuid();
        var sellers = new List<SellerProfileModel>
        {
            new()
            {
                Description = "store description",
                Email = "email@test.com",
                Name = "Store name",
                UserID = sellerId
            }
        };

        _sellerProfileServiceMock.Setup(service => service.GetSellersAsync())
            .ReturnsAsync(sellers);

        //act
        var result = await _sellerProfileController.GetSellers();

        //assert that the result is of the okresult type
        var actionResult = Assert.IsType<ActionResult<List<SellerProfileModel>>>(result);
        var okResult = Assert.IsType<OkObjectResult>(actionResult.Result);
    }

    [Fact]
    public async Task GetSellers_NoSellers_BadRequest()
    {
        //arrange
        var sellers = new List<SellerProfileModel> { };

        _sellerProfileServiceMock.Setup(service => service.GetSellersAsync())
            .ReturnsAsync(sellers);

        //act
        var result = await _sellerProfileController.GetSellers();

        //assert that the result is BadRequest when customers are null
        var actionResult = Assert.IsType<ActionResult<List<SellerProfileModel>>>(result);
        var badRequestResult = Assert.IsType<BadRequestObjectResult>(actionResult.Result);
        Assert.Equal("There are no sellers.", badRequestResult.Value);
    }

    [Fact]
    public async Task GetSellerById_ReturnsOk()
    {
        //arrange
        var sellerId = Guid.NewGuid();
        var seller = new SellerProfileModel()
        {
            Description = "store description",
            Email = "email@test.com",
            Name = "Store name",
            UserID = sellerId
        };

        _sellerProfileServiceMock.Setup(service => service.GetSellerByIdAsync(sellerId))
            .ReturnsAsync(seller);

        //act
        var result = await _sellerProfileController.GetSellerById(sellerId);

        //assert that the result is Ok when customer exists by that Id
        var okResult = Assert.IsType<OkObjectResult>(result);
    }

    [Fact]
    public async Task GetSellerById_SellerDoesNotExist_BadRequest()
    {
        //arrange
        var nonExistentSellerId = Guid.NewGuid();

        _sellerProfileServiceMock.Setup(service => service.GetSellerByIdAsync(nonExistentSellerId))
            .ReturnsAsync((SellerProfileModel)null);

        //act
        var result = await _sellerProfileController.GetSellerById(nonExistentSellerId);

        //assert that the result is Ok when customer exists by that Id
        var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
        Assert.Equal($"Seller by Id {nonExistentSellerId} not found.", badRequestResult.Value);
    }

    [Fact]
    public async Task UpdateSeller_ReturnsOk()
    {
        var sellerId = Guid.NewGuid();
        var sellerUpdateDto = new SellerProfileUpdateDto()
        {
            Description = "store description",
            Name = "Store name"
        };

        _sellerProfileServiceMock.Setup(service => service.UpdateSellerAsync(sellerId, sellerUpdateDto))
            .ReturnsAsync(true);

        var result = await _sellerProfileController.UpdateSeller(sellerId, sellerUpdateDto);

        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.Equal("Seller information was changed.", okResult.Value);
    }

    [Fact]
    public async Task UpdateSeller_FailedToUpdate_BadRequest()
    {
        var nonExistentSellerId = Guid.NewGuid();
        var sellerUpdateDto = new SellerProfileUpdateDto()
        {
            Description = "store description",
            Name = "Store name"
        };

        _sellerProfileServiceMock.Setup(service => service.UpdateSellerAsync(nonExistentSellerId, sellerUpdateDto))
            .ReturnsAsync(false);

        var result = await _sellerProfileController.UpdateSeller(nonExistentSellerId, sellerUpdateDto);

        var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
        Assert.Equal($"Seller by Id {nonExistentSellerId} not found.", badRequestResult.Value);
    }
}