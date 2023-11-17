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
            
            CreateMap<Category, CategoryDto>();
            CreateMap<CategoryCreateUpdateDto, Category>();
            
            CreateMap<Product, ProductDto>();
            CreateMap<ProductExpert, ProductExpertDto>();
            CreateMap<ProductInfo, ProductInfoDto>();
            CreateMap<Photo, PhotoDto>();
            CreateMap<ProductDiscount, DiscountDto>();
            CreateMap<ProductUpdateDto, Product>();
            CreateMap<ProductCreateDto, Product>();
        }
    }
}