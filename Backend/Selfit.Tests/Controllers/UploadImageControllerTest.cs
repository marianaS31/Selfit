using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ApiExplorer;
using Microsoft.EntityFrameworkCore;
using Moq;
using SelFit.Controllers;
using SelFit.Data;
using SelFit.DTOs.Prouduct;
using SelFit.Interfaces;
using SelFit.Models.Product;
using SelFit.Responses;

namespace Selfit.Tests.Controllers;

public class UploadImageControllerTest
{
    private readonly Mock<IBlobStorageService> _blobStorageServiceMock;
    private readonly UploadImageController _uploadImageController;
    private readonly AppDbContext _appDbContext;

    public UploadImageControllerTest()
    {
        // Mock IBlobStorageService
        _blobStorageServiceMock = new Mock<IBlobStorageService>();

        // Set up in-memory database
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase("TestDatabase")
            .Options;

        _appDbContext = new AppDbContext(options);

        // Set up test data in memory
        var testProduct = new ProductModel()
        {
            Id = Guid.NewGuid(),
            Name = "Test Product",
            Email = "test@example.com",
            Description = "Very good quality",
            Color = "Red",
            ImageUrl = string.Empty
        };

        _appDbContext.Products.Add(testProduct);
        _appDbContext.SaveChanges();

        _uploadImageController = new UploadImageController(_appDbContext, _blobStorageServiceMock.Object);
    }

    [Fact]
    public async Task UploadImage_ProductNotFound_ReturnsBadRequest()
    {
        //Arrange
        var uploadImageDto = new UploadImageDto()
        {
            ProductId = Guid.NewGuid(),
            ProductImage = new FormFile(Stream.Null, 0, 0, "productImage", "fileName.jpg")
        };

        //Act
        var result = await _uploadImageController.UploadImage(uploadImageDto);

        //Assert
        var response = Assert.IsType<BadRequestObjectResult>(result);
        Assert.Equal("Product not found.", response.Value);
    }

    [Fact]
    public async Task UploadImage_ImageAlreadyExists_ReturnBadRequest()
    {
        //Arrange
        //Get existing product from the in-memory database
        var product = await _appDbContext.Products.FirstOrDefaultAsync(p => p.Name == "Test Product");

        product.ImageUrl = "http://example.com/image.jpg";
        await _appDbContext.SaveChangesAsync();

        var uploadImageDto = new UploadImageDto()
        {
            ProductId = product.Id,
            ProductImage = new FormFile(Stream.Null, 0, 0, "productImage", "new-image.jpg")
        };

        //Act

        var result = await _uploadImageController.UploadImage(uploadImageDto);

        //Assert
        var response = Assert.IsType<BadRequestObjectResult>(result);
        Assert.Equal("An image already exists for this product.", response.Value);
    }

    [Fact]
    public async Task UploadImage_InvalidOperationException_ReturnsBadRequestWithError()
    {
        //Arrange
        var product = await _appDbContext.Products.FirstOrDefaultAsync(p => p.Name == "Test Product");
        var uploadImageDto = new UploadImageDto
        {
            ProductId = product.Id,
            ProductImage = new FormFile(Stream.Null, 0, 0, "productImage", "fileName.jpg")
        };

        var expectedErrorMessage = "An error occurred during the upload process.";

        _blobStorageServiceMock
            .Setup(x => x.UploadFileAsync(It.Is<IFormFile>(f => f.FileName == "fileName.jpg"), product.Name,
                product.Email))
            .ThrowsAsync(new InvalidOperationException(expectedErrorMessage));
        //Act
        var result = await _uploadImageController.UploadImage(uploadImageDto);

        //Assert
        var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
        var returnValue = Assert.IsType<ErrorResponse>(badRequestResult.Value);
        Assert.Equal(expectedErrorMessage, returnValue.Error);
    }

    [Fact]
    public async Task UploadImage_GeneralException_ReturnsBadRequestWithError()
    {
        // Arrange
        var product = await _appDbContext.Products.FirstOrDefaultAsync(p => p.Name == "Test Product");
        var uploadImageDto = new UploadImageDto
        {
            ProductId = product.Id,
            ProductImage = new FormFile(Stream.Null, 0, 0, "productImage", "fileName.jpg")
        };

        var expectedErrorMessage = "An unexpected error occurred.";

        _blobStorageServiceMock
            .Setup(x => x.UploadFileAsync(It.Is<IFormFile>(f => f.FileName == "fileName.jpg"), product.Name,
                product.Email))
            .ThrowsAsync(new Exception(expectedErrorMessage));

        // Act
        var result = await _uploadImageController.UploadImage(uploadImageDto);

        // Assert
        var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
        var returnValue = Assert.IsType<ErrorResponse>(badRequestResult.Value);
        Assert.Equal(expectedErrorMessage, returnValue.Error);
    }

    [Fact]
    public async Task UploadImage_SuccessfulUpload_ReturnsOkWithImageUrl()
    {
        //Arrange
        var product = await _appDbContext.Products.FirstOrDefaultAsync(p => p.Name == "Test Product");
        var uploadImageDto = new UploadImageDto
        {
            ProductId = product.Id,
            ProductImage = new FormFile(Stream.Null, 0, 0, "productImage", "fileName.jpg")
        };

        var imageUrl = "http://example.com/image.jpg";

        _blobStorageServiceMock
            .Setup(x => x.UploadFileAsync(It.Is<IFormFile>(f => f.FileName == "fileName.jpg"), product.Name,
                product.Email))
            .ReturnsAsync(imageUrl);

        //Act
        var result = await _uploadImageController.UploadImage(uploadImageDto);
        //Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        var returnValue = Assert.IsType<ImageUploadResponse>(okResult.Value);
        Assert.Equal(imageUrl, returnValue.ImageUrl);
    }

    [Fact]
    public async Task UpdateImage_SuccessfulUpdate_ReturnsOkWithImageUrl()
    {
        //Arrange
        var product = await _appDbContext.Products.FirstOrDefaultAsync(p => p.Name == "Test Product");
        var uploadImageDto = new UploadImageDto
        {
            ProductId = product.Id,
            ProductImage = new FormFile(Stream.Null, 0, 0, "productImage", "updatedFileName.jpg")
        };

        var expectedImageUrl = "http://example.com/image.jpg";
        //simulate image deletion
        _blobStorageServiceMock
            .Setup(x => x.DeleteFileAsync(product.ImageUrl))
            .ReturnsAsync(true);

        //simulate file upload
        _blobStorageServiceMock
            .Setup(x => x.UploadFileAsync(It.Is<IFormFile>(f => f.FileName == "updatedFileName.jpg"), product.Name,
                product.Email))
            .ReturnsAsync(expectedImageUrl);

        //Act
        var result = await _uploadImageController.UpdatePicture(uploadImageDto);
        //Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        var returnValue = Assert.IsType<ImageUploadResponse>(okResult.Value);
        Assert.Equal(expectedImageUrl, returnValue.ImageUrl);
    }

    [Fact]
    public async Task UpdateImage_FailedUpdate_ReturnsBadRequest()
    {
        //Arrange
        var product = await _appDbContext.Products.FirstOrDefaultAsync(p => p.Name == "Test Product");
        var uploadImageDto = new UploadImageDto
        {
            ProductId = product.Id,
            ProductImage = new FormFile(Stream.Null, 0, 0, "productImage", "updatedFileName.jpg")
        };

        //simulate image deletion
        _blobStorageServiceMock
            .Setup(x => x.DeleteFileAsync(product.ImageUrl))
            .ReturnsAsync(false);

        //Act
        var result = await _uploadImageController.UpdatePicture(uploadImageDto);
        //Assert
        var badRequestResponse = Assert.IsType<BadRequestObjectResult>(result);
        Assert.Equal("Failed to change the existing image", badRequestResponse.Value);
    }

    [Fact]
    public async Task UpdateImage_NotFoundProduct_ReturnBadRequest()
    {
        // Arrange

        var uploadImageDto = new UploadImageDto
        {
            ProductId = Guid.NewGuid(),
            ProductImage = new FormFile(Stream.Null, 0, 0, "productImage", "fileName.jpg")
        };

        // Act
        var result = await _uploadImageController.UpdatePicture(uploadImageDto);

        // Assert
        var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
        Assert.Equal("Product not found", badRequestResult.Value);
    }

    [Fact]
    public async Task UpdateImage_GeneralException_ReturnsBadRequestWithError()
    {
        // Arrange
        var product = await _appDbContext.Products.FirstOrDefaultAsync(p => p.Name == "Test Product");
        var uploadImageDto = new UploadImageDto
        {
            ProductId = product.Id,
            ProductImage = new FormFile(Stream.Null, 0, 0, "productImage", "fileName.jpg")
        };

        var expectedErrorMessage = "An unexpected error occurred.";

        _blobStorageServiceMock
            .Setup(x => x.DeleteFileAsync(product.ImageUrl))
            .ThrowsAsync(new Exception(expectedErrorMessage));

        // Act
        var result = await _uploadImageController.UpdatePicture(uploadImageDto);

        // Assert
        var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
        Assert.Equal("File upload failed: " + expectedErrorMessage, badRequestResult.Value);
    }

    [Fact]
    public async Task GetPicture_ProductNotFound_ReturnsBadRequest()
    {
        // Arrange
        var newProductId = Guid.NewGuid();

        // Act
        var result = await _uploadImageController.GetPicture(newProductId);

        // Assert
        var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
        Assert.Equal("Product not found", badRequestResult.Value);
    }

    [Fact]
    public async Task GetPicture_ProductExistsNoImageUrl_ReturnsBadRequest()
    {
        // Arrange
        var product = await _appDbContext.Products.FirstOrDefaultAsync(p => p.Name == "Test Product");
        product.ImageUrl = string.Empty;
        await _appDbContext.SaveChangesAsync();

        // Act
        var result = await _uploadImageController.GetPicture(product.Id);

        // Assert
        var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
        Assert.Equal("Image not found", badRequestResult.Value);
    }

    [Fact]
    public async Task GetPicture_ProductExistsWithImageUrl_ReturnsOkWithImageUrl()
    {
        // Arrange
        var product = new ProductModel()
        {
            Id = Guid.NewGuid(),
            Name = "Test Product",
            Email = "test@example.com",
            Description = "Very good quality",
            Color = "Red",
            ImageUrl = "http://example.com/image.jpg"
        };

        _appDbContext.Products.Add(product);
        await _appDbContext.SaveChangesAsync();

        // Act
        var result = await _uploadImageController.GetPicture(product.Id);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        var returnValue = Assert.IsType<string>(okResult.Value);
        Assert.Equal("http://example.com/image.jpg", returnValue);
    }

    [Fact]
    public async Task DeletePicture_ProductNotFound_ReturnsBadRequest()
    {
        // Arrange
        var nonExistentProductId = Guid.NewGuid();

        // Act
        var result = await _uploadImageController.DeletePicture(nonExistentProductId);

        // Assert
        var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
        Assert.Equal("Product not found", badRequestResult.Value);
    }

    [Fact]
    public async Task DeletePicture_ImageDeletionFails_ReturnsBadRequest()
    {
        // Arrange
        var product = new ProductModel()
        {
            Id = Guid.NewGuid(),
            Name = "Test Product",
            Email = "test@example.com",
            Description = "Very good quality",
            Color = "Red",
            ImageUrl = "http://example.com/image.jpg"
        };

        _appDbContext.Products.Add(product);
        await _appDbContext.SaveChangesAsync();

        // Simulate image deletion failure
        _blobStorageServiceMock
            .Setup(x => x.DeleteFileAsync(It.Is<string>(url => url == product.ImageUrl)))
            .ReturnsAsync(false);

        // Act
        var result = await _uploadImageController.DeletePicture(product.Id);

        // Assert
        var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
        Assert.Equal("Failed to delete the existing image.", badRequestResult.Value);
    }

    [Fact]
    public async Task DeletePicture_SuccessfulDeletion_ReturnsOkMessage()
    {
        // Arrange
        var product = new ProductModel()
        {
            Id = Guid.NewGuid(),
            Name = "Test Product",
            Email = "test@example.com",
            Description = "Very good quality",
            Color = "Red",
            ImageUrl = "http://example.com/image.jpg"
        };

        _appDbContext.Products.Add(product);
        await _appDbContext.SaveChangesAsync();

        // Simulate successful image deletion
        _blobStorageServiceMock
            .Setup(x => x.DeleteFileAsync(It.Is<string>(url => url == product.ImageUrl)))
            .ReturnsAsync(true);

        // Act
        var result = await _uploadImageController.DeletePicture(product.Id);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        Assert.Equal($"Image of {product.Name} was successfully deleted", okResult.Value);
    }

    [Fact]
    public async Task DeletePicture_GeneralException_ReturnsBadRequestWithError()
    {
        // Arrange
        var product = new ProductModel()
        {
            Id = Guid.NewGuid(),
            Name = "Test Product",
            Email = "test@example.com",
            Description = "Very good quality",
            Color = "Red",
            ImageUrl = "http://example.com/image.jpg"
        };

        _appDbContext.Products.Add(product);
        await _appDbContext.SaveChangesAsync();

        var expectedErrorMessage = "File upload failed: An unexpected error occurred.";

        _blobStorageServiceMock
            .Setup(x => x.DeleteFileAsync(product.ImageUrl))
            .ThrowsAsync(new Exception(expectedErrorMessage));

        // Act
        var result = await _uploadImageController.DeletePicture(product.Id);

        // Assert
        var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
        Assert.Equal(expectedErrorMessage, badRequestResult.Value);
    }
}