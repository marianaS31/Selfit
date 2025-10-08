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

public class CustomerProfileControllerTest
{
    private readonly Mock<ICustomerProfileService> _customerProfileSMock;
    private readonly CustomerProfileController _customerProfileController;
    private readonly AppDbContext _appDbContext;

    public CustomerProfileControllerTest()
    {
        _customerProfileSMock = new Mock<ICustomerProfileService>();

        //set up in-memory database
        var options = new DbContextOptionsBuilder<AppDbContext>().UseInMemoryDatabase("TestDatabase").Options;

        _appDbContext = new AppDbContext(options);

        //initialise controller with mock services
        _customerProfileController = new CustomerProfileController(_appDbContext, _customerProfileSMock.Object);
    }

    [Fact]
    public async Task GetCustomers_ReturnsOk()
    {
        //arrange
        var customerId = Guid.NewGuid();
        var customers = new List<CustomerProfileModel>
        {
            new()
            {
                Address = "address",
                City = "city",
                Email = "email@a.com",
                FullName = "FullName",
                PhoneNumber = "+37100000000",
                UserID = customerId,
                Zip = "1234-567"
            }
        };

        _customerProfileSMock.Setup(service => service.GetCustomersAsync())
            .ReturnsAsync(customers);

        //act
        var result = await _customerProfileController.GetCustomers();

        //assert that the result is of OkObjectResult type
        var actionResult = Assert.IsType<ActionResult<List<CustomerProfileModel>>>(result);
        var okResult = Assert.IsType<OkObjectResult>(actionResult.Result);
    }

    [Fact]
    public async Task GetCustomers_ReturnsBadRequest()
    {
        //arrange
        var customers = new List<CustomerProfileModel> { };

        _customerProfileSMock.Setup(service => service.GetCustomersAsync())
            .ReturnsAsync(customers);

        //act
        var result = await _customerProfileController.GetCustomers();

        //assert that the result is BadRequest when customers are null
        var actionResult = Assert.IsType<ActionResult<List<CustomerProfileModel>>>(result);
        var badRequestResult = Assert.IsType<BadRequestObjectResult>(actionResult.Result);
        Assert.Equal("There are no customers.", badRequestResult.Value);
    }

    [Fact]
    public async Task GetCustomerById_ReturnsOk()
    {
        //arrange
        var customerId = Guid.NewGuid();
        var customer = new CustomerProfileModel()
        {
            Address = "address",
            City = "city",
            Email = "email@a.com",
            FullName = "FullName",
            PhoneNumber = "+37100000000",
            UserID = customerId,
            Zip = "1234-567"
        };

        _customerProfileSMock.Setup(service => service.GetCustomerByIdAsync(customerId))
            .ReturnsAsync(customer);

        //act
        var result = await _customerProfileController.GetCustomerById(customerId);

        //assert that the result is Ok when customer exists by that Id
        var okResult = Assert.IsType<OkObjectResult>(result);
    }

    [Fact]
    public async Task GetCustomerById_ReturnsBadRequest()
    {
        //arrange
        var nonExistentCustomerId = Guid.NewGuid();

        //simulating an action of customer not being found under given Id
        _customerProfileSMock.Setup(service => service.GetCustomerByIdAsync(nonExistentCustomerId))
            .ReturnsAsync((CustomerProfileModel)null);

        //act
        var result = await _customerProfileController.GetCustomerById(nonExistentCustomerId);

        //assert that the result is BadRequest when customers are null
        var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
        Assert.Equal($"Customer by Id {nonExistentCustomerId} not found.", badRequestResult.Value);
    }

    [Fact]
    public async Task UpdateCustomer_ReturnsOk()
    {
        var customerId = Guid.NewGuid();
        var customerUpdateDto = new CustomerProfileUpdateDto()
        {
            Address = "address edited",
            City = "city edited",
            FullName = "name edited",
            PhoneNumber = "+39100000001",
            Zip = "1235-456"
        };

        _customerProfileSMock.Setup(service => service.UpdateCustomerAsync(customerId, customerUpdateDto))
            .ReturnsAsync(true);

        var result = await _customerProfileController.UpdateCustomer(customerId, customerUpdateDto);

        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.Equal("User information was changed.", okResult.Value);
    }

    [Fact]
    public async Task UpdateCustomer_ReturnsBadRequest()
    {
        var nonExistentCustomerId = Guid.NewGuid();
        var customerUpdateDto = new CustomerProfileUpdateDto()
        {
            Address = "address edited",
            City = "city edited",
            FullName = "name edited",
            PhoneNumber = "+39100000001",
            Zip = "1235-456"
        };

        _customerProfileSMock
            .Setup(service => service.UpdateCustomerAsync(nonExistentCustomerId, customerUpdateDto))
            .ReturnsAsync(false);

        var result = await _customerProfileController.UpdateCustomer(nonExistentCustomerId, customerUpdateDto);

        var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
        Assert.Equal($"Customer by Id {nonExistentCustomerId} not found.", badRequestResult.Value);
    }
}