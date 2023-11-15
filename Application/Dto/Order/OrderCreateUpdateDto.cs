using Domain;

namespace Application.Dto.Order
{
    public class OrderCreateUpdateDto
    {
        public int CustomerDetailsId { get; set; }
        public int PaymentMethodId { get; set; }
        public int ShippingMethodId { get; set; }
        public ICollection<OrderItem> Items { get; set; }

    }
}