using System.ComponentModel.DataAnnotations;

namespace Application.Dto.Product
{
    public class DiscountDto
    {
        [Required]
        public decimal Value { get; set; }
        [Required]
        public DateTime Start { get; set; } 
        [Required] 
        public DateTime End { get; set; } 
    }
}