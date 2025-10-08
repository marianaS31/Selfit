using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SelFit.Data;
using SelFit.DTOs.Prouduct;
using SelFit.Interfaces;
using SelFit.Responses;
using System.ComponentModel.DataAnnotations;

namespace SelFit.Controllers;

[Route("api/[controller]")]
[ApiController]
public class UploadImageController : ControllerBase
{
    private readonly AppDbContext _appDbContext;
    private readonly IBlobStorageService _blobStorageService;

    public UploadImageController(AppDbContext appDbContext, IBlobStorageService blobStorageService)
    {
        _appDbContext = appDbContext;
        _blobStorageService = blobStorageService;
    }


    [HttpPost("upload-picture")]
    [Authorize(Roles = "Seller, Admin")]
    public async Task<ActionResult> UploadImage([FromForm] UploadImageDto uploadImageDto)
    {
        var product = await _appDbContext.Products.FirstOrDefaultAsync(p => p.Id == uploadImageDto.ProductId);
        if (product == null) return BadRequest("Product not found.");

        if (!string.IsNullOrEmpty(product.ImageUrl)) return BadRequest("An image already exists for this product.");

        try
        {
            // Call the BlobStorageService to upload the file
            var imageUrl =
                await _blobStorageService.UploadFileAsync(uploadImageDto.ProductImage, product.Name, product.Email);
            product.ImageUrl = imageUrl;
            await _appDbContext.SaveChangesAsync();
            return Ok(new ImageUploadResponse { ImageUrl = imageUrl });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new ErrorResponse { Error = ex.Message });
        }
        catch (Exception ex)
        {
            return BadRequest(new ErrorResponse { Error = ex.Message });
        }
    }

    [HttpPut("update-picture")]
    [Authorize(Roles = "Seller, Customer, Admin")]
    public async Task<ActionResult> UpdatePicture([FromForm] UploadImageDto uploadImageDto)
    {
        var product = await _appDbContext.Products.FirstOrDefaultAsync(p => p.Id == uploadImageDto.ProductId);
        if (product == null) return BadRequest("Product not found");

        try
        {
            var deleteSuccess = await _blobStorageService.DeleteFileAsync(product.ImageUrl);
            if (deleteSuccess == false) return BadRequest("Failed to change the existing image");

            var imageUrl =
                await _blobStorageService.UploadFileAsync(uploadImageDto.ProductImage, product.Name, product.Email);

            product.ImageUrl = imageUrl;
            await _appDbContext.SaveChangesAsync();

            return Ok(new ImageUploadResponse { ImageUrl = imageUrl });
        }
        catch (Exception ex)
        {
            return BadRequest("File upload failed: " + ex.Message);
        }
    }

    [HttpGet("get-picture/{productId}")]
    [Authorize(Roles = "Seller, Admin")]
    public async Task<ActionResult> GetPicture([FromRoute] [Required] Guid productId)
    {
        var product = await _appDbContext.Products.FirstOrDefaultAsync(p => p.Id == productId);

        if (product == null) return BadRequest("Product not found");

        if (string.IsNullOrWhiteSpace(product.ImageUrl)) return BadRequest("Image not found");

        return Ok(product.ImageUrl);
    }

    [HttpDelete("delete-picture/{productId}")]
    [Authorize(Roles = "Seller, Admin")]
    public async Task<ActionResult> DeletePicture([Required] Guid productId)
    {
        var product = await _appDbContext.Products.FirstOrDefaultAsync(p => p.Id == productId);
        if (product == null) return BadRequest("Product not found");

        try
        {
            var deleteSuccess = await _blobStorageService.DeleteFileAsync(product.ImageUrl);
            if (deleteSuccess == false) return BadRequest("Failed to delete the existing image.");

            product.ImageUrl = string.Empty;
            await _appDbContext.SaveChangesAsync();
            return Ok($"Image of {product.Name} was successfully deleted");
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
}