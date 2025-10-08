using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SelFit.Data;
using SelFit.DTOs.Users;
using SelFit.Interfaces;
using SelFit.Models.Users;

namespace SelFit.Controllers;

[Route("api/[controller]")]
[ApiController]
public class SellerProfileController : ControllerBase
{
    private readonly AppDbContext _appDbContext;
    private readonly ISellerProfileService _sellerProfileService;

    public SellerProfileController(AppDbContext appDbContext, ISellerProfileService sellerProfileService)
    {
        _appDbContext = appDbContext;
        _sellerProfileService = sellerProfileService;
    }

    [HttpGet("{id}")]
    [Authorize(Roles = "Seller, Admin")]
    public async Task<ActionResult> GetSellerById([FromRoute] Guid id)
    {
        var seller = await _sellerProfileService.GetSellerByIdAsync(id);

        if (seller == null) return BadRequest($"Seller by Id {id} not found.");

        return Ok(seller);
    }

    [HttpGet("get-sellers")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<List<SellerProfileModel>>> GetSellers()
    {
        var sellers = await _sellerProfileService.GetSellersAsync();

        if (sellers == null || !sellers.Any()) return BadRequest("There are no sellers.");

        return Ok(sellers);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Seller, Admin")]
    public async Task<ActionResult> UpdateSeller([FromRoute] Guid id,
        [FromBody] SellerProfileUpdateDto sellerProfileUpdateDto)
    {
        var result = await _sellerProfileService.UpdateSellerAsync(id, sellerProfileUpdateDto);

        if (result == false) return BadRequest($"Seller by Id {id} not found.");

        return Ok("Seller information was changed.");
    }
}