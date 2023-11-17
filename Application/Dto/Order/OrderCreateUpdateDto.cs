using Domain;
using Domain.Enums;

namespace Application.Dto.Order
{
    public class OrderCreateUpdateDto
    {
        public ICollection<OrderItemDto> Items { get; set; }
        public int PaymentMethodId { get; set; }
        public int ShippingMethodId { get; set; }

    }
}