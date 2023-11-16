using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;

namespace Application.Dto.Category
{
    public class CategoryCreateUpdateDto
    {
        [Required]
        public string Name { get; set; }
        public int? ParentCategoryId { get; set; }
    }
}