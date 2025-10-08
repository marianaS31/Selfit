using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using SelFit.Interfaces;

namespace SelFit.Services;

public class BlobStorageService : IBlobStorageService
{
    private readonly IConfiguration _configuration;
    private readonly string[] _allowedExtensions = { ".jpg", ".jpeg", ".png" };

    public BlobStorageService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    private string ContentType(string extention)
    {
        extention = extention.ToLower();

        var mimeTypes = new Dictionary<string, string>
        {
            { ".jpg", "image/jpeg" },
            { ".jpeg", "image/jpeg" },
            { ".png", "image/png" }
        };

        if (mimeTypes.ContainsKey(extention)) return mimeTypes[extention];

        return "application/octet-stream";
    }

    public async Task<string> UploadFileAsync(IFormFile file, string productName, string folderName)
    {
        var extention = Path.GetExtension(file.FileName).ToLower();
        if (_allowedExtensions.Contains(extention) == false)
            throw new InvalidOperationException(
                $"File type not allowed. Allowed types are: {string.Join(" ", _allowedExtensions)}");

        try
        {
            var blobServiceClient = new BlobServiceClient(_configuration["AzureBlobStorage:ConnectionString"]);
            var containerClient =
                blobServiceClient.GetBlobContainerClient(_configuration["AzureBlobStorage:ContainerName"]);
            await containerClient.CreateIfNotExistsAsync();

            var formatedFileName = Path.GetFileNameWithoutExtension(productName).Replace(" ", "%20") + extention;
            var blobName = $"{folderName}/{Guid.NewGuid()}_{formatedFileName}";
            var blobClient = containerClient.GetBlobClient(blobName);

            var contentType = ContentType(extention);

            using (var stream = file.OpenReadStream())
            {
                await blobClient.UploadAsync(stream, new BlobHttpHeaders
                {
                    ContentType = contentType
                });
            }

            return blobClient.Uri.ToString();
        }
        catch (Exception ex)
        {
            return $"File upload failed: {ex.Message}";
        }
    }

    public async Task<bool> DeleteFileAsync(string filePath)
    {
        var blobServiceClient = new BlobServiceClient(_configuration["AzureBlobStorage:ConnectionString"]);
        var containerClient =
            blobServiceClient.GetBlobContainerClient(_configuration["AzureBlobStorage:ContainerName"]);

        // Construct full blob path including folder and file name
        var uri = new Uri(filePath);

        var path = uri.AbsolutePath;
        var result = path.Substring(path.IndexOf('/', 1) + 1).Replace("%40", "@");

        // Get the blob client for the specific blob path
        var blobClient = containerClient.GetBlobClient(result);

        if (await blobClient.ExistsAsync() == false) return false;

        // Attempt to delete the blob
        var response = await blobClient.DeleteIfExistsAsync();

        return response;
    }
}