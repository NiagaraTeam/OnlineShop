using System.ComponentModel.DataAnnotations;
using Application.Core.CustomDataAnnotations;

namespace Application.Dto.ShippingPayment
{
    public class ShippingMethodCreateUpdateDto
    {
        [Required]
        public string Name { get; set; }
        [Required]
        [GraterThanZero(ErrorMessage = "Field {0} must be positive number")]
        public decimal Cost { get; set; }
    }
}