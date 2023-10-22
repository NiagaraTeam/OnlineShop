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
        [HttpPost("account/login")] //api/account/login
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {
            var user = await _userManager.FindByEmailAsync(loginDto.Email);

            if (user == null) return Unauthorized();

            var result = await _userManager.CheckPasswordAsync(user, loginDto.Password);

            if (result)
                return CreateUserObject(user);

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
                return CreateUserObject(user);
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
                return CreateUserObject(user);
            }
            
            ModelState.AddModelError("currentpassword", "Invalid password");
            return ValidationProblem(ModelState);
        }

        [Authorize]
        [HttpGet("account")] //api/account
        public async Task<ActionResult<UserDto>> GetCurrentUser()
        {
            var user = await _userManager.FindByEmailAsync(User.FindFirstValue(ClaimTypes.Email));

            return CreateUserObject(user);
        }

        [HttpDelete("accounts/{userId}")] //api/accounts/userId
        public async Task<IActionResult> DeleteAccount(int userId)
        {
            return HandleResult(await _userService.DeleteAccount(userId));
        }

        [HttpPatch("accounts/{userId}/address")] //api/accounts/userId/address
        public async Task<IActionResult> UpdateUserAddress(int userId, AddressDto address)
        {
            return HandleResult(await _userService.UpdateUserAddress(userId, address));
        }

        [HttpPost("accounts/{userId}/favourites/{productId}")] //api/accounts/userId/favourites/productId
        public async Task<IActionResult> AddFavouriteProduct(int userId, int productId)
        {
            return HandleResult(await _userService.AddFavouriteProduct(userId, productId));
        }

        [HttpDelete("accounts/{userId}/favourites/{productId}")] //api/accounts/userId/favourites/productId
        public async Task<IActionResult> RemoveFavouriteProduct(int userId, int productId)
        {
            return HandleResult(await _userService.RemoveFavouriteProduct(userId, productId));
        }

        [HttpPost("accounts/{userId}/reset-password")] //api/accounts/userId/reset-password
        public async Task<IActionResult> ResetPasswordRequest(int userId)
        {
            return HandleResult(await _userService.ResetPasswordRequest(userId));
        }

        [HttpGet("accounts/{userId}/discount")] //api/accounts/userId/discount
        public async Task<IActionResult> GetUserDiscount(int userId)
        {
            return HandleResult(await _userService.GetUserDiscount(userId));
        }

        [HttpPut("accounts/{userId}/discount")] //api/accounts/userId/discount
        public async Task<IActionResult> SetUserDiscount(int userId, decimal discountValue)
        {
            return HandleResult(await _userService.SetUserDiscount(userId, discountValue));
        }

        private UserDto CreateUserObject(AppUser user)
        {
            return new UserDto
            {
                UserName = user.UserName,
                Email = user.Email,
                Token = _tokenService.CreateToken(user),  
            };
        }
    }
}