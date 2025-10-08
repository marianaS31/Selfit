using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SelFit.Data;
using SelFit.DTOs.Users;
using SelFit.Interfaces;
using SelFit.Models.Users;

namespace SelFit.Controllers;

[Route("api/[controller]")]
[ApiController]
public class CustomerProfileController : ControllerBase
{
    private readonly AppDbContext _appDbContext;
    private readonly ICustomerProfileService _customerProfileService;

    public CustomerProfileController(AppDbContext appDbContext, ICustomerProfileService customerProfileService)
    {
        _appDbContext = appDbContext;
        _customerProfileService = customerProfileService;
    }

    [HttpGet("{id}")]
    [Authorize(Roles = "Customer, Admin")]
    public async Task<ActionResult> GetCustomerById([FromRoute] Guid id)
    {
        var customer = await _customerProfileService.GetCustomerByIdAsync(id);

        if (customer == null) return BadRequest($"Customer by Id {id} not found.");

        return Ok(customer);
    }
    
    [HttpPut("{id}")]
    [Authorize(Roles = "Customer, Admin")]
    public async Task<ActionResult> UpdateCustomer([FromRoute] Guid id,
        [FromBody] CustomerProfileUpdateDto customerProfileUpdateDto)
    {
        var result = await _customerProfileService.UpdateCustomerAsync(id, customerProfileUpdateDto);

        if (result == false) return BadRequest($"Customer by Id {id} not found.");

        return Ok("User information was changed.");
    }

    [HttpGet("get-customers")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<List<CustomerProfileModel>>> GetCustomers()
    {
        var customers = await _customerProfileService.GetCustomersAsync();

        if (customers == null || !customers.Any()) return BadRequest("There are no customers.");

        return Ok(customers);
    }
}