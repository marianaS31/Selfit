using SelFit.DTOs.Users;
using SelFit.Models.Users;

namespace SelFit.Interfaces;

public interface ICustomerProfileService
{
    Task<CustomerProfileModel> GetCustomerByIdAsync(Guid id);
    Task<List<CustomerProfileModel>> GetCustomersAsync();
    Task<bool> UpdateCustomerAsync(Guid id, CustomerProfileUpdateDto customerProfileUpdateDto);
}