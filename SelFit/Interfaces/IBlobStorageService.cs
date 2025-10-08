namespace SelFit.Interfaces;

public interface IBlobStorageService
{
    Task<string> UploadFileAsync(IFormFile file, string fileName, string folderName);
    Task<bool> DeleteFileAsync(string filePath);
}