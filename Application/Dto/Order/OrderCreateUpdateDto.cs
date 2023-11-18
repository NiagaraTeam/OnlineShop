using System.ComponentModel.DataAnnotations;

namespace Application.Dto.Order
{
    public class OrderCreateUpdateDto
    {
        [Required]
        public ICollection<OrderItemAddDto> Items { get; set; }
        [Required]
        public int PaymentMethodId { get; set; }
        [Required]
        public int ShippingMethodId { get; set; }
    }
}