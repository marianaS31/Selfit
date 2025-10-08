using SelFit.DTOs.Prouduct;

namespace SelFit.Interfaces;

public interface IProductService
{
    Task<bool> CreateProductAsync(ProductDto productDto, Guid sellerId);
    Task<ProductDto> UpdateProductAsync(Guid productId, EditProductDto editProductDto);
    Task<ProductDto> GetProductByIdAsync(Guid productId);
    Task<List<ProductDto>> GetAllProductsAsync();
    Task<bool> DeleteProductAsync(Guid productId);
}