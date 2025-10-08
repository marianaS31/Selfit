namespace SelFit.DTOs.Prouduct;

public class UploadImageDto
{
    public Guid ProductId { get; set; }
    public IFormFile ProductImage { get; set; }
}