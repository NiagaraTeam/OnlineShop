using Application.Core;
using Application.Dto.User;
using Application.Interfaces;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Persistence;
using Domain;
using Microsoft.AspNetCore.Identity;

namespace Application.Services
{
    public class UserService : IUserService
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        private readonly UserManager<AppUser> _userManager;

        public UserService(
            DataContext context,
            IMapper mapper,
            UserManager<AppUser> userManager
        )
        {
            _context = context;
            _mapper = mapper;
            _userManager = userManager;
        }
        public async Task<Result<object>> AddFavouriteProduct(string userId, int productId)
        {
            var user = await _context.Users.Include(u => u.CustomerDetails).FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
            {
                return Result<Object>.Failure("User not found");
            }

            if (user.CustomerDetails.FavouriteProducts == null)
            {
                user.CustomerDetails.FavouriteProducts = new List<CustomerDetailsProduct>();
            }
            if (user.CustomerDetails.FavouriteProducts.Any(fp => fp.ProductId == productId))
            {
                return Result<Object>.Failure("Product is already in favourites");
            }

            user.CustomerDetails.FavouriteProducts.Add(new CustomerDetailsProduct { ProductId = productId });

            if (await _context.SaveChangesAsync() > 0)
                return Result<object>.Success(null);

            return Result<object>.Failure("Failed adding the product");
        }

        public async Task<Result<object>> DeleteAccount(string userId)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
            {
                return Result<Object>.Failure("User not found");
            }

            _context.Users.Remove(user);

            if (await _context.SaveChangesAsync() > 0)
                return Result<object>.Success(null);

            return Result<object>.Failure("Failed deleting the account");
        }

        public async Task<Result<decimal>> GetUserDiscount(string userId)
        {
            var user = await _context.Users.Include(u => u.CustomerDetails).FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
            {
                return Result<decimal>.Failure("User not found");
            }
            if (user.CustomerDetails == null )
            {
                return Result<decimal>.Failure("Discount data not available");
            }

            return Result<decimal>.Success(user.CustomerDetails.DiscountValue);
        }

        public async Task<Result<object>> RemoveFavouriteProduct(string userId, int productId)
        {
            var user = await _context.Users.Include(u => u.CustomerDetails).FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
            {
                return Result<object>.Failure("User not found");
            }

            if (user.CustomerDetails.FavouriteProducts == null)
            {
                user.CustomerDetails.FavouriteProducts = new List<CustomerDetailsProduct>();
            }

            var favoriteProduct = user.CustomerDetails.FavouriteProducts.FirstOrDefault(fp => fp.ProductId == productId);
            if (favoriteProduct != null)
            {
                user.CustomerDetails.FavouriteProducts.Remove(favoriteProduct);
                await _context.SaveChangesAsync();
            }

            return Result<object>.Success(null);
        }

        public async Task<Result<object>> ResetPasswordRequest(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);

            if (user == null)
            {
                return Result<Object>.Failure("User not found");
            }

            var resetToken = await _userManager.GeneratePasswordResetTokenAsync(user);

            Console.WriteLine($"Reset token for user {user.Email}: {resetToken}");

            return Result<object>.Success(null);
        }

        public async Task<Result<object>> SetUserDiscount(string userId, decimal discountValue)
        {
            var user = await _context.Users.Include(u => u.CustomerDetails).FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
            {
                return Result<Object>.Failure("User not found");
            }

            user.CustomerDetails.DiscountValue = discountValue;

            if (await _context.SaveChangesAsync() > 0)
                return Result<object>.Success(null);

            return Result<object>.Failure("Failed setting user discount");
        }

        public async Task<Result<object>> UpdateUserAddress(string userId, AddressDto address)
        {
            var user = await _context.Users.Include(u => u.CustomerDetails).FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
            {
                return Result<Object>.Failure("User not found");
            }

            _mapper.Map(address, user.CustomerDetails.Address);

            if (await _context.SaveChangesAsync() > 0)
                return Result<object>.Success(null);

            return Result<object>.Failure("Failed updating the address");
        }
    }
}