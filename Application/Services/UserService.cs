using Application.Core;
using Application.Dto.User;
using Application.Interfaces;

namespace Application.Services
{
    public class UserService : IUserService
    {//to ja
        public Task<Result<object>> AddFavouriteProduct(int userId, int productId)
        {
            throw new NotImplementedException();
        }

        public Task<Result<object>> DeleteAccount(int userId)
        {
            throw new NotImplementedException();
        }

        public Task<Result<decimal>> GetUserDiscount(int userId)
        {
            throw new NotImplementedException();
        }

        public Task<Result<object>> RemoveFavouriteProduct(int userId, int productId)
        {
            throw new NotImplementedException();
        }

        public Task<Result<object>> ResetPasswordRequest(int userId)
        {
            throw new NotImplementedException();
        }

        public Task<Result<object>> SetUserDiscount(int userId, decimal discountValue)
        {
            throw new NotImplementedException();
        }

        public Task<Result<object>> UpdateUserAddress(int userId, AddressDto address)
        {
            throw new NotImplementedException();
        }
    }
}