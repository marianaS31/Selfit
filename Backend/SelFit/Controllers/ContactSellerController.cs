using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SelFit.Data;
using SelFit.DTOs.Contact;
using SelFit.Interfaces;

namespace SelFit.Controllers;

[Route("api/[controller]")]
[ApiController]
public class ContactSellerController : ControllerBase
{
    private readonly AppDbContext _appDbContext;
    private readonly IContactSellerService _contactSellerService;

    public ContactSellerController(AppDbContext appDbContext, IContactSellerService contactSellerService)
    {
        _appDbContext = appDbContext;
        _contactSellerService = contactSellerService;
    }

    [HttpPost("contact-seller")]
    [Authorize(Roles = "Customer")]
    public async Task<ActionResult> ContactSeller([FromBody] ContactSellerDto contactSellerDto)
    {
        var exist = await _appDbContext.Products.FirstOrDefaultAsync(p => p.Id == contactSellerDto.ProductID);
        if (exist == null) return BadRequest("Product does not exist");

        var success = await _contactSellerService.ContactSellerByAsync(contactSellerDto.CustomerEmail,
            contactSellerDto.Message, contactSellerDto.SellerEmail, contactSellerDto.ProductID);
        if (success == false) return BadRequest("Failed to send email");

        return Ok("Your message has been sent to the seller. The seller will get back to you soon.");
    }
}