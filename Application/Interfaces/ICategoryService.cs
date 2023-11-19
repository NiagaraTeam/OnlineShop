using Application.Core;
using Application.Dto.Category;
using Domain.Enums;

namespace Application.Interfaces
{
    public interface ICategoryService
    {
        Task<Result<int>> Create(CategoryCreateUpdateDto category);
        Task<Result<object>> Update(int categoryId, CategoryCreateUpdateDto category);
        Task<Result<object>> ChangeCategoryStatus(int categoryId, CategoryStatus newStatus);
        Task<Result<CategoryTreeDto>> GetAllCategories();
    }
}