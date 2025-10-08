using SelFit.DTOs.Users;
using SelFit.Models.Users;

namespace SelFit.Interfaces;

public interface ISellerProfileService
{
    Task<SellerProfileModel> GetSellerByIdAsync(Guid id);
    Task<List<SellerProfileModel>> GetSellersAsync();
    Task<bool> UpdateSellerAsync(Guid id, SellerProfileUpdateDto sellerProfileUpdateDto);
}