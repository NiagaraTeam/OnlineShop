using Application.Dto.ShippingPayment;
using Application.Dto.Order;
using AutoMapper;
using Domain;
using Application.Dto.Product;

namespace Application.Core
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            CreateMap<PaymentMethod, PaymentMethodDto>();
            CreateMap<PaymentMethodCreateUpdateDto, PaymentMethod>();

            CreateMap<ShippingMethod, ShippingMethodDto>();
            CreateMap<ShippingMethodCreateUpdateDto, ShippingMethod>();

            CreateMap<Order, OrderDto>();
            CreateMap<OrderCreateUpdateDto, Order>();

            CreateMap<OrderItem, OrderItemDto>();
            CreateMap<OrderItemDto, OrderItem>();
            CreateMap<OrderItemNewQuantityDto, OrderItem>();

            //CreateMap<Product, ProductDto>();


        }
    }
}