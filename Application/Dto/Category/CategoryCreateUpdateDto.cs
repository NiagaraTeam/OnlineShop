using System.ComponentModel.DataAnnotations;

namespace Application.Dto.Category
{
    public class CategoryCreateUpdateDto
    {
        [Required]
        public string Name { get; set; }
        public int? ParentCategoryId { get; set; }
    }
}