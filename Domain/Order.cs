using Domain.Enums;

namespace Domain
{
    public class Order
    {
        public int Id { get; set; }
        public int CustomerDetailsId { get; set; }
        public DateTime OrderDate { get; set; }
        public OrderStatus Status { get; set; }
        public int PaymentMethodId { get; set; } 
        public int ShippingMethodId { get; set; } 

        public CustomerDetails CustomerDetails { get; set; }
        public PaymentMethod PaymentMethod { get; set; }
        public ShippingMethod ShippingMethod { get; set; }
        public ICollection<OrderItem> Items { get; set; }
    }
}