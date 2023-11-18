using Application.Dto.User;
using Application.Dto.Category;
using Application.Dto.Product;
using Application.Dto.ShippingPayment;
using Application.Dto.Order;

using AutoMapper;
using Domain;

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

            CreateMap<AddressDto, Address>();

            CreateMap<Order, OrderDto>();
            CreateMap<OrderCreateUpdateDto, Order>();
            CreateMap<OrderItem, OrderItemDto>();
            CreateMap<OrderItemDto, OrderItem>();
            CreateMap<OrderItemAddDto, OrderItem>();
            CreateMap<OrderItemNewQuantityDto, OrderItem>();

            CreateMap<Product, ProductDto>();
            CreateMap<ProductExpert, ProductExpertDto>();
            CreateMap<ProductInfo, ProductInfoDto>();
            CreateMap<ProductDiscount, DiscountDto>();
            CreateMap<ProductUpdateDto, Product>();
            CreateMap<ProductCreateDto, Product>();
            
            CreateMap<Category, CategoryDto>();
            CreateMap<CategoryCreateUpdateDto, Category>();
            
            CreateMap<Photo, PhotoDto>();
        }
    }
}