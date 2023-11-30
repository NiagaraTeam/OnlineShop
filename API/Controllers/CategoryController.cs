using Application.Dto.Category;
using Application.Interfaces;
using Domain.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Persistence;

namespace API.Controllers
{
    public class CategoryController : BaseApiController
    {
        private readonly ICategoryService _categoryService;
        public CategoryController(ICategoryService categoryService)
        {
            _categoryService = categoryService;
        }

        [HttpPost("categories")] //api/categories
        [Authorize(Roles = StaticUserRoles.ADMIN)]
        public async Task<IActionResult> CreateCategory(CategoryCreateUpdateDto category)
        {
            return HandleResult(await _categoryService.Create(category));
        }

        [HttpPut("categories/{categoryId}")] //api/categories/categoryId
        [Authorize(Roles = StaticUserRoles.ADMIN)]
        public async Task<IActionResult> UpdateCategory(int categoryId, CategoryCreateUpdateDto category)
        {
            return HandleResult(await _categoryService.Update(categoryId, category));
        }


        [HttpPatch("categories/{categoryId}/{newStatus}")] //api/categories/categoryId/status
        [Authorize(Roles = StaticUserRoles.ADMIN)]
        public async Task<IActionResult> ChangeCategoryStatus(int categoryId, CategoryStatus newStatus)
        {
            return HandleResult(await _categoryService.ChangeCategoryStatus(categoryId, newStatus));
        }

        [HttpGet("categories")] //api/categories
        [AllowAnonymous]
        public async Task<IActionResult> GetAllCategories()
        {
            return HandleResult(await _categoryService.GetAllCategories());
        }
    }
}