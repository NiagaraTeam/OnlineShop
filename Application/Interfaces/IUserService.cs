using Application.Core;
using Application.Dto.Product;
using Application.Dto.User;
using Microsoft.AspNetCore.Identity;

namespace Application.Interfaces
{
    public interface IUserService
    {   
        Task<Result<UserDetailsDto>> UserDetails(string userId);
        Task<Result<object>> DeleteAccount(string userId);
        Task<Result<object>> UpdateUserAddress(string userId, AddressDto address);
        Task<Result<object>> AddFavouriteProduct(string userId, int productId);
        Task<Result<object>> RemoveFavouriteProduct(string userId, int productId);
        Task<Result<object>> ResetPasswordRequest(string userId);
        Task<Result<decimal>> GetUserDiscount(string userId);
        Task<Result<object>> SetUserDiscount(string userId, DiscountValueDto discountValue);
        Task<Result<object>> UpdateUserDiscount(string userId, DiscountValueDto discount);
        Task<Result<IEnumerable<ProductDto>>> GetFavouriteProducts();
        Task<Result<IEnumerable<UserDetailsDto>>> GetAllUsers();
    }
}