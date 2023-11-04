using System.ComponentModel.DataAnnotations;

namespace Application.Dto.ShippingPayment
{
    public class PaymentMethodCreateUpdateDto
    {
        [Required]
        public string Name { get; set; }
    }
}