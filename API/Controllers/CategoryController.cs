using Application.Dto.Category;
using Application.Interfaces;
using Domain.Enums;
using Microsoft.AspNetCore.Mvc;

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
        public async Task<IActionResult> CreateCategory(CategoryCreateUpdateDto category)
        {
            return HandleResult(await _categoryService.Create(category));
        }

        [HttpPut("categories/{categoryId}")] //api/categories/categoryId
        public async Task<IActionResult> UpdateCategory(int categoryId, CategoryCreateUpdateDto category)
        {
            return HandleResult(await _categoryService.Update(categoryId, category));
        }

        [HttpPatch("categories/{categoryId}/{newStatus}")] //api/categories/categoryId/newStatus
        public async Task<IActionResult> ChangeCategoryStatus(int categoryId, CategoryStatus newStatus)
        {
            return HandleResult(await _categoryService.ChangeCategoryStatus(categoryId, newStatus));
        }
    }
}