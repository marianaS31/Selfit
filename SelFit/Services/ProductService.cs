using Microsoft.EntityFrameworkCore;
using SelFit.Data;
using SelFit.DTOs.Prouduct;
using SelFit.Interfaces;
using SelFit.Models.Product;

public class ProductService : IProductService
{
    private readonly AppDbContext _appDbContext;

    public ProductService(AppDbContext appDbContext)
    {
        _appDbContext = appDbContext;
    }

    public async Task<bool> CreateProductAsync(ProductDto productDto, Guid sellerId)
    {
        var seller = await _appDbContext.Sellers.Include(s => s.Products)
            .FirstOrDefaultAsync(s => s.UserID == sellerId);

        if (seller == null) return false;

        var product = new ProductModel
        {
            Id = Guid.NewGuid(),
            SellerId = seller.UserID,
            Email = seller.Email,
            Name = productDto.Name,
            Description = productDto.Description,
            Price = productDto.Price,
            Material = productDto.Material,
            Color = productDto.Color,
            Measurements = new List<ProductMeasurementModel>()
        };
        //able to create more than one measurement
        foreach (var measurementDto in productDto.Measurements)
        {
            var measurement = new ProductMeasurementModel
            {
                Id = Guid.NewGuid(),
                ProductId = product.Id,
                MeasurementType = measurementDto.MeasurementType,
                Value = measurementDto.Value
            };
            product.Measurements.Add(measurement);
        }

        _appDbContext.Products.Add(product);
        seller.Products.Add(product);

        await _appDbContext.SaveChangesAsync();
        return true;
    }

    public async Task<ProductDto> UpdateProductAsync(Guid productId, EditProductDto editProductDto)
    {
        var product = await _appDbContext.Products
            .Include(p => p.Measurements)
            .FirstOrDefaultAsync(p => p.Id == productId);

        if (product == null) return null;

        product.Name = editProductDto.Name;
        product.Description = editProductDto.Description;
        product.Price = editProductDto.Price;
        product.Material = editProductDto.Material;
        product.Color = editProductDto.Color;

        // Remove existing measurements
        await _appDbContext.ProductMeasurement
            .Where(m => m.ProductId == productId)
            .ExecuteDeleteAsync();

        // Add new measurements
        var newMeasurements = editProductDto.Measurements.Select(measurement => new ProductMeasurementModel
        {
            Id = Guid.NewGuid(),
            ProductId = productId,
            MeasurementType = measurement.MeasurementType,
            Value = measurement.Value
        }).ToList();

        await _appDbContext.ProductMeasurement.AddRangeAsync(newMeasurements); // add all measurements even more than 1
        await _appDbContext.SaveChangesAsync();

        var updatedProduct = new ProductDto
        {
            Name = product.Name,
            Description = product.Description,
            Price = product.Price,
            Material = product.Material,
            Color = product.Color,
            Measurements = newMeasurements.Select(m => new ProductMeasurementDto
            {
                MeasurementType = m.MeasurementType,
                Value = m.Value
            }).ToList()
        };

        return updatedProduct;
    }

    public async Task<ProductDto> GetProductByIdAsync(Guid productId)
    {
        var product = await _appDbContext.Products
            .Include(p => p.Measurements)
            .FirstOrDefaultAsync(p => p.Id == productId);

        if (product == null) return null;

        var productDto = new ProductDto
        {
            Name = product.Name,
            Description = product.Description,
            Price = product.Price,
            ImageUrl = product.ImageUrl,
            Material = product.Material,
            Color = product.Color,
            Measurements = product.Measurements.Select(m => new ProductMeasurementDto
            {
                MeasurementType = m.MeasurementType,
                Value = m.Value
            }).ToList()
        };

        return productDto;
    }

    public async Task<List<ProductDto>> GetAllProductsAsync()
    {
        var product = await _appDbContext.Products
            .Include(p => p.Measurements)
            .ToListAsync();

        if (product == null) return null;

        var allProducts = product.Select(p => new ProductDto
        {
            Name = p.Name,
            Description = p.Description,
            Price = p.Price,
            ImageUrl = p.ImageUrl,
            Material = p.Material,
            Color = p.Color,
            Measurements = p.Measurements.Select(m => new ProductMeasurementDto
            {
                MeasurementType = m.MeasurementType,
                Value = m.Value
            }).ToList()
        }).ToList();

        return allProducts;
    }

    public async Task<bool> DeleteProductAsync(Guid productId)
    {
        var product = await _appDbContext.Products.FirstOrDefaultAsync(p => p.Id == productId);

        if (product == null) return false;

        _appDbContext.Products.Remove(product);

        await _appDbContext.SaveChangesAsync();

        return true;
    }
}