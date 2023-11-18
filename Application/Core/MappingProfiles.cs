using Application.Dto.Product;
using Application.Dto.ShippingPayment;
using Application.Dto.User;
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
            CreateMap<Domain.Product, Application.Dto.Product.ProductDto>();
        }
    }
}