using Microsoft.EntityFrameworkCore;
using SelFit.Data;
using SelFit.DTOs.Users;
using SelFit.Interfaces;
using SelFit.Models.Users;

namespace SelFit.Services;

public class SellerProfileService : ISellerProfileService
{
    private readonly AppDbContext _appDbContext;

    public SellerProfileService(AppDbContext appDbContext)
    {
        _appDbContext = appDbContext;
    }

    public async Task<SellerProfileModel> GetSellerByIdAsync(Guid id)
    {
        return await _appDbContext.Sellers.Include(s => s.Products)
            .FirstOrDefaultAsync(s => s.UserID == id);
    }

    public async Task<bool> UpdateSellerAsync(Guid id, SellerProfileUpdateDto sellerProfileUpdateDto)
    {
        var seller = await _appDbContext.Sellers.FirstOrDefaultAsync(c => c.UserID == id);

        if (seller == null) return false;

        //Update user properties
        seller.Name = sellerProfileUpdateDto.Name;
        seller.Description = sellerProfileUpdateDto.Description;

        await _appDbContext.SaveChangesAsync();

        return true;
    }

    public async Task<List<SellerProfileModel>> GetSellersAsync()
    {
        return await _appDbContext.Sellers
            .Include(s => s.Products)
            .Include(s => s.User)
            .ToListAsync();
    }
}