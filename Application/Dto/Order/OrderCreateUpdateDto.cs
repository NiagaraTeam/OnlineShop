using Domain;
using Domain.Enums;

namespace Application.Dto.Order
{
    public class OrderCreateUpdateDto
    {
        public ICollection<OrderItem> Items { get; set; }
        public OrderStatus Status { get; set; }

        public int PaymentMethodId { get; set; }
        public int ShippingMethodId { get; set; }

    }
}