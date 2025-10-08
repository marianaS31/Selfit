namespace SelFit.DTOs.Contact;

public class ContactSellerDto
{
    public string Message { get; set; }
    public Guid ProductID { get; set; }
    public string SellerEmail { get; set; }
    public string CustomerEmail { get; set; }
}