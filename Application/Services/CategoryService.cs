using Application.Core;
using Application.Dto.Category;
using Application.Interfaces;
using AutoMapper;
using Domain;
using Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Services
{
    public class CategoryService : ICategoryService
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;

        public CategoryService(
            DataContext context, 
            IMapper mapper
        )
        {
            _context = context;
            _mapper = mapper;
        }
        public async Task<Result<object>> ChangeCategoryStatus(int categoryId, CategoryStatus newStatus)
        {
            var changingCategory = await _context.Categories.FirstOrDefaultAsync(p => p.Id == categoryId);
            if (changingCategory == null) 
                return null;

            changingCategory.Status = newStatus;
            
            if (await _context.SaveChangesAsync() > 0)
                return Result<object>.Success(null);

            return Result<object>.Failure("Failed to change category");   
        }

        public async Task<Result<int>> Create(CategoryCreateUpdateDto category)
        {
            var categoryCreate = _mapper.Map<Category>(category);

            categoryCreate.Status = CategoryStatus.Visible;

            _context.Categories.Add(categoryCreate);

            if(await _context.SaveChangesAsync() > 0) {
                return Result<int>.Success(categoryCreate.Id);
            }
            
            return Result<int>.Failure("Failed to create category");
        }

        public async Task<Result<object>> Update(int categoryId, CategoryCreateUpdateDto category)
        {
            var categoryUpdate = await _context.Categories.FindAsync(categoryId);

            if (categoryUpdate == null) {
                return null;
            }

            _mapper.Map(category, categoryUpdate);
            _context.Categories.Update(categoryUpdate);
            if (await _context.SaveChangesAsync() > 0) {
                return Result<object>.Success(null);
            }

            return Result<object>.Failure("Couldn't save changes");
        }

        public async Task<Result<CategoryTreeDto>> GetAllCategories()
        {
            var categories = await _context.Categories
                .Include(c => c.ParentCategory)
                .Include(c => c.ChildCategories)
                .ToListAsync();

            var categoryTreeDto = MapToCategoryTree(categories);

            return Result<CategoryTreeDto>.Success(categoryTreeDto);
        }

        private CategoryTreeDto MapToCategoryTree(List<Category> categories)
        {
            var rootCategory = categories.Where(c => c.ParentCategoryId == null).FirstOrDefault();

            var categoryTreeDto = _mapper.Map<CategoryTreeDto>(rootCategory);

            return categoryTreeDto;
        }

        public async Task<Result<object>> Delete(int categoryId)
        {
            var category = await _context.Categories
                .Include(c => c.Products)
                .Include(c => c.ChildCategories)
                .FirstOrDefaultAsync(c => c.Id == categoryId);

            if (category == null)
                return null;

            if (category.ChildCategories.Any())
                return Result<object>.Failure("The parent category cannot be deleted.");

            if (category.Products.Any()) 
                return Result<object>.Failure("The category is assigned to one or more products.");


            _context.Categories.Remove(category);

            if(await _context.SaveChangesAsync() > 0)
                return Result<object>.Success(null);

            return Result<object>.Failure("Failed to delete category");
        }
    }
}