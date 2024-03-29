using Application.Dto.ShippingPayment;
using Application.Dto.User;
using Domain.Enums;

namespace Application.Dto.Order
{
    public class OrderDto
    {
        public int Id { get; set; }
        public DateTime OrderDate { get; set; }
        public OrderStatus Status { get; set; }
        public decimal TotalValue { get; set; }
        public decimal TotalValueWithTax { get; set; } 
        public UserDetailsDto UserDetails { get; set; }
        public PaymentMethodDto PaymentMethod { get; set; }
        public ShippingMethodDto ShippingMethod { get; set; }
        public ICollection<OrderItemDto> Items { get; set; }
    }
}