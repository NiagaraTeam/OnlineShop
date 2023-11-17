using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Dto.ShippingPayment;
using Domain;
using Domain.Enums;

namespace Application.Dto.Order
{
    public class OrderDto
    {
        public int Id { get; set; }
        public DateTime OrderDate { get; set; }
        public OrderStatus Status { get; set; }

        public PaymentMethodDto PaymentMethod { get; set; }
        public ShippingMethodDto ShippingMethod { get; set; }
        public ICollection<OrderItemDto> Items { get; set; }

    }
}