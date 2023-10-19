using Domain.Enums;

namespace Domain
{
    public class Order
    {
        public int Id { get; set; }
        public int CustomerId { get; set; }
        public DateTime OrderDate { get; set; }
        public OrderStatus Status { get; set; }
        public int PaymentMethodId { get; set; } 
        public int ShippingMethodId { get; set; } 

        public AppUser Customer { get; set; }
        public PaymentMethod PaymentMethod { get; set; }
        public ShippingMethod ShippingMethod { get; set; }
    }
}