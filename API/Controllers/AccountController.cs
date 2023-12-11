using System.Security.Claims;
using API.Dto;
using API.Interfaces;
using Application.Dto.User;
using Application.Interfaces;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace API.Controllers
{
    [ApiController]
    public class AccountController : BaseApiController
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly ITokenService _tokenService;
        private readonly IUserAccessor _userAccessor;
        private readonly IUserService _userService;
        public AccountController(
            UserManager<AppUser> userManager, 
            ITokenService tokenService,
            IUserAccessor userAccessor,
            IUserService userService)
        {
            _tokenService = tokenService;
            _userManager = userManager;
            _userAccessor = userAccessor;
            _userService = userService;
        }

        [AllowAnonymous]
        [HttpPost("account/login-customer")] //api/account/login-customer
        public async Task<ActionResult<UserDto>> LoginCustomer(LoginDto loginDto)
        {
            var user = await _userManager.FindByEmailAsync(loginDto.Email);

            if (user == null) return Unauthorized();

            if (!await HasRole(user, StaticUserRoles.CUSTOMER))
                return Unauthorized();

            var result = await _userManager.CheckPasswordAsync(user, loginDto.Password);

            if (result)
                return await CreateUserObject(user, false);

            return Unauthorized();
        }

        [AllowAnonymous]
        [HttpPost("account/login-admin")] //api/account/login-admin
        public async Task<ActionResult<UserDto>> LoginAdmin(LoginDto loginDto)
        {
            var user = await _userManager.FindByEmailAsync(loginDto.Email);

            if (user == null) return Unauthorized();

            if (!await HasRole(user, StaticUserRoles.ADMIN))
                return Unauthorized();

            var result = await _userManager.CheckPasswordAsync(user, loginDto.Password);

            if (result)
                return await CreateUserObject(user, true);

            return Unauthorized();
        }

        [AllowAnonymous]
        [HttpPost("account/register")] //api/account/register
        public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
        {
            if (await _userManager.Users.AnyAsync(x => x.UserName == registerDto.UserName))
            {
                ModelState.AddModelError("username", "Username taken");
                return ValidationProblem(ModelState);
            }

            if (await _userManager.Users.AnyAsync(x => x.Email == registerDto.Email))
            {
                ModelState.AddModelError("email", "Email taken");
                return ValidationProblem(ModelState);
            }

            var user = new AppUser
            {
                Email = registerDto.Email,
                UserName = registerDto.UserName
            };

            var result = await _userManager.CreateAsync(user, registerDto.Password);

            if (result.Succeeded)
            {
                await _userManager.AddToRoleAsync(user, StaticUserRoles.CUSTOMER);
                return await CreateUserObject(user, false);
            }

            return BadRequest(result.Errors);
        }

        [Authorize]
        [HttpPost("account/changepassword")] //api/account/changepassword
        public async Task<ActionResult<UserDto>> ChangePassword(ChangePasswordDto changePasswordDto)
        {
            var user = await _userManager.FindByEmailAsync(_userAccessor.GetUserEmail());

            var result = await _userManager.ChangePasswordAsync(
                user, changePasswordDto.CurrentPassword, changePasswordDto.NewPassword);

            if (result.Succeeded)
            {
                return await CreateUserObject(user, await HasRole(user, StaticUserRoles.ADMIN));
            }
            
            ModelState.AddModelError("currentpassword", "Invalid password");
            return ValidationProblem(ModelState);
        }

        [Authorize]
        [HttpGet("account")] //api/account
        public async Task<ActionResult<UserDto>> GetCurrentUser()
        {
            var user = await _userManager.FindByEmailAsync(User.FindFirstValue(ClaimTypes.Email));

            return await CreateUserObject(user, await HasRole(user, StaticUserRoles.ADMIN));
        }

        [Authorize]
        [HttpGet("account/{userId}/details")] //api/account/userId/details
        public async Task<ActionResult<UserDto>> GetUserDetails(string userId)
        {
            return HandleResult(await _userService.UserDetails(userId));
        }

        [HttpDelete("accounts/{userId}")] //api/accounts/userId
        [Authorize(Roles = StaticUserRoles.ADMIN)]
        public async Task<IActionResult> DeleteAccount(string userId)
        {
            return HandleResult(await _userService.DeleteAccount(userId));
        }

        [HttpPatch("accounts/{userId}/address")] //api/accounts/userId/address
        [Authorize(Roles = StaticUserRoles.CUSTOMER)]
        public async Task<IActionResult> UpdateUserAddress(string userId, AddressDto address)
        {
            return HandleResult(await _userService.UpdateUserAddress(userId, address));
        }

        [HttpGet("account/favourites")] //api/account/favourites
        [Authorize(Roles = StaticUserRoles.CUSTOMER)]
        public async Task<IActionResult> GetFavouriteProducts()
        {
            return HandleResult(await _userService.GetFavouriteProducts());
        }

        [HttpPost("accounts/{userId}/favourites/{productId}")] //api/accounts/userId/favourites/productId
        [Authorize(Roles = StaticUserRoles.CUSTOMER)]
        public async Task<IActionResult> AddFavouriteProduct(string userId, int productId)
        {
            return HandleResult(await _userService.AddFavouriteProduct(userId, productId));
        }

        [HttpDelete("accounts/{userId}/favourites/{productId}")] //api/accounts/userId/favourites/productId
        [Authorize(Roles = StaticUserRoles.CUSTOMER)]
        public async Task<IActionResult> RemoveFavouriteProduct(string userId, int productId)
        {
            return HandleResult(await _userService.RemoveFavouriteProduct(userId, productId));
        }

        [HttpPost("accounts/{userId}/reset-password")] //api/accounts/userId/reset-password
        public async Task<IActionResult> ResetPasswordRequest(string userId)
        {
            return HandleResult(await _userService.ResetPasswordRequest(userId));
        }

        [HttpGet("accounts/{userId}/discount")] //api/accounts/userId/discount
        public async Task<IActionResult> GetUserDiscount(string userId)
        {
            return HandleResult(await _userService.GetUserDiscount(userId));
        }

        [HttpPut("accounts/{userId}/discount")] //api/accounts/userId/discount
        [Authorize(Roles = StaticUserRoles.ADMIN)]
        public async Task<IActionResult> SetUserDiscount(string userId, DiscountValueDto discountValue)
        {
            return HandleResult(await _userService.SetUserDiscount(userId, discountValue));
        }

        [HttpGet("customers")] //api/customers
        [Authorize(Roles = StaticUserRoles.ADMIN)]
        public async Task<IActionResult> GetUsersAsync() 
        {
            return HandleResult(await _userService.GetAllUsers());
        }

        [HttpPatch("accounts/{userId}")] //api/accounts/userId/discount
        [Authorize(Roles = StaticUserRoles.ADMIN)]
        public async Task<IActionResult> UpdateUserDiscount(string userId, DiscountValueDto discount) {
            return HandleResult(await _userService.UpdateUserDiscount(userId, discount));
        }
        private async Task<UserDto> CreateUserObject(AppUser user, bool isAdmin)
        {
            return new UserDto
            {
                Id = user.Id,
                UserName = user.UserName,
                Email = user.Email,
                Token = await _tokenService.CreateToken(user),
                IsAdmin = isAdmin
            };
        }

        private async Task<bool> HasRole(AppUser user, string role)
        {
            var userRoles = await _userManager.GetRolesAsync(user);

            bool hasRole = false;

            foreach (var userRole in userRoles)
            {
                if (userRole == role)
                {
                    hasRole = true;
                    break;
                }
            }

            return hasRole;
        }
    }
}