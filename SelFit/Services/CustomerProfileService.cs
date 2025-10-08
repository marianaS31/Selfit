using Microsoft.EntityFrameworkCore;
using SelFit.Data;
using SelFit.DTOs.Users;
using SelFit.Interfaces;
using SelFit.Models.Users;

namespace SelFit.Services;

public class CustomerProfileService : ICustomerProfileService
{
    private readonly AppDbContext _appDbContext;

    public CustomerProfileService(AppDbContext appDbContext)
    {
        _appDbContext = appDbContext;
    }

    public async Task<CustomerProfileModel> GetCustomerByIdAsync(Guid id)
    {
        return await _appDbContext.Customers
            .Include(u => u.User)
            .FirstOrDefaultAsync(s => s.UserID == id);
    }

    public async Task<List<CustomerProfileModel>> GetCustomersAsync()
    {
        return await _appDbContext.Customers.Include(c => c.User).ToListAsync();
    }

    public async Task<bool> UpdateCustomerAsync(Guid id, CustomerProfileUpdateDto customerProfileUpdateDto)
    {
        var customer = await _appDbContext.Customers.FirstOrDefaultAsync(c => c.UserID == id);

        if (customer == null) return false;

        //Update user properties
        customer.FullName = customerProfileUpdateDto.FullName;
        customer.PhoneNumber = customerProfileUpdateDto.PhoneNumber;
        customer.Address = customerProfileUpdateDto.Address;
        customer.Zip = customerProfileUpdateDto.Zip;
        customer.City = customerProfileUpdateDto.City;

        await _appDbContext.SaveChangesAsync();

        return true;
    }
}