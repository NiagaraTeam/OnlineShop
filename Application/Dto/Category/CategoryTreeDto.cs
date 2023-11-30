using Domain.Enums;

namespace Application.Dto.Category
{
    public class CategoryTreeDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int? ParentCategoryId { get; set; }
        public CategoryStatus Status { get; set; }

        public List<CategoryTreeDto> ChildCategories { get; set; }
    }
}