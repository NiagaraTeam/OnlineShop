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

            CreateMap<ShippingMethod, ShippingMethodDto>();
            CreateMap<ShippingMethodCreateUpdateDto, ShippingMethod>();

            CreateMap<Product, ProductDto>();
            CreateMap<ProductExpert, ProductExpertDto>();
            CreateMap<ProductInfo, ProductInfoDto>();
            CreateMap<Category, CategoryDto>();
            CreateMap<Photo, PhotoDto>();
            CreateMap<ProductDiscount, DiscountDto>();
        }
    }
}