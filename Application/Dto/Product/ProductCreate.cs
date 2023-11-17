using System.ComponentModel.DataAnnotations;
using Application.Core.CustomDataAnnotations;
using Domain.Enums;

namespace Application.Dto.Product
{
    public class ProductCreateDto
    {
        [Required]
        public string Name { get; set; }
        [Required]
        public string Description { get; set; }
        [Required]
        [GraterThanZero(ErrorMessage = "Field {0} must be positive number")]
        public decimal Price { get; set; }
        [Required]
        // tu dodać walidację czy watość jest ze zbioru ustalonych wartości
        // albo zamienić te pole na Enum
        public int TaxRate { get; set; }
        [Required]
        public int CategoryId { get; set; }
        [Required]
        public int ProductExpertId { get; set; }
        [Required]
        public ProductStatus Status { get; set; }
        [Required]
        [GraterThanZero(ErrorMessage = "Field {0} must be positive number")]
        public decimal CurrentStock { get; set; }
    }
}