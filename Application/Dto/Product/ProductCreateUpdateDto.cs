using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Application.Core.CustomDataAnnotations;
using Application.Dto.Category;
using Domain;

namespace Application.Dto.Product
{
    public class ProductCreateUpdateDto
    {
        [Required]
        public string Name {get; set;}
        public int CategoryId {get; set;}
        public int ProductExpertId {get; set;}
        public int ProductInfoId {get; set;}
        //public CategoryDto CategoriId {get; set;}
        /*
        [Required]
        public string Description {get; set;}
        [Required]
        [GraterThanZero(ErrorMessage = "Field {0} must be greater than zero")]
        public decimal Price {get; set;}
        public DateTime CreatedAt { get; set; }
        public DateTime ModificationDate { get; set; }
*/
    }
}