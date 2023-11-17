using Application.Dto.Category;
using Application.Dto.Product;
using Application.Dto.ShippingPayment;
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
            CreateMap<Category, CategoryDto>();
            CreateMap<CategoryCreateUpdateDto, Category>();
            CreateMap<ShippingMethod, ShippingMethodDto>();
            CreateMap<ShippingMethodCreateUpdateDto, ShippingMethod>();
            CreateMap<Product, ProductDto>();
            CreateMap<ProductUpdateDto, Product>();
            CreateMap<ProductCreateDto, Product>();
        }
    }
}