namespace SelFit.Interfaces;

public interface IContactSellerService
{
    Task<bool> ContactSellerByAsync(string customerEmail, string customerMessage, string sellerEmail,
        Guid productId);
}