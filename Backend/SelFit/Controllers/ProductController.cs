using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SelFit.Data;
using SelFit.DTOs.Prouduct;
using SelFit.Interfaces;

namespace SelFit.Controllers;

[Route("api/[controller]")]
[ApiController]
public class ProductController : ControllerBase
{
    private readonly AppDbContext _appDbContext;
    private readonly IProductService _productService;

    public ProductController(AppDbContext appDbContext, IProductService productService)
    {
        _appDbContext = appDbContext;
        _productService = productService;
    }

    [HttpPost("create-product")]
    [Authorize(Roles = "Seller, Admin")]
    public async Task<ActionResult> CreateProduct([FromBody] ProductDto productDto, Guid sellerId)
    {
        var seller = await _appDbContext.Sellers.FirstOrDefaultAsync(s => s.UserID == sellerId);

        if (seller == null) return BadRequest("Seller not found");

        var result = await _productService.CreateProductAsync(productDto, sellerId);

        if (!result) return BadRequest("Seller does not exist");

        return Ok(result);
    }

    [HttpPut("update-product/{id}")]
    [Authorize(Roles = "Seller, Admin")]
    public async Task<ActionResult> EditProduct([FromRoute] Guid id, [FromBody] EditProductDto editProductDto)
    {
        var updatedProduct = await _productService.UpdateProductAsync(id, editProductDto);
        if (updatedProduct == null) return BadRequest("Product not found");

        return Ok(updatedProduct);
    }

    [HttpGet("get-product/{id}")]
    [Authorize]
    public async Task<ActionResult<ProductDto>> GetProductById([FromRoute] Guid id)
    {
        var product = await _productService.GetProductByIdAsync(id);

        if (product == null) return BadRequest("Product not found");

        return Ok(product);
    }

    [HttpGet("get-products")]
    [Authorize]
    public async Task<ActionResult<ProductDto>> GetAllProducts()
    {
        var product = await _productService.GetAllProductsAsync();

        if (product == null || !product.Any()) return BadRequest("Products not found");

        return Ok(product);
    }

    [HttpDelete("delete-product/{id}")]
    [Authorize(Roles = "Seller, Admin")]
    public async Task<ActionResult> DeleteProduct([FromRoute] Guid id)
    {
        var result = await _productService.DeleteProductAsync(id);

        if (result == false) return BadRequest("Product not found");

        return Ok("Product deleted successfully");
    }
}