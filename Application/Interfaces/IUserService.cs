using Application.Core;
using Application.Dto.User;

namespace Application.Interfaces
{
    public interface IUserService
    {
        Task<Result<object>> DeleteAccount(int userId);
        Task<Result<object>> UpdateUserAddress(int userId, AddressDto address);
        Task<Result<object>> AddFavouriteProduct(int userId, int productId);
        Task<Result<object>> RemoveFavouriteProduct(int userId, int productId);
        Task<Result<object>> ResetPasswordRequest(int userId);
        Task<Result<decimal>> GetUserDiscount(int userId);
        Task<Result<object>> SetUserDiscount(int userId, decimal discountValue);
    }
}