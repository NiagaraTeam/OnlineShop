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
        }
    }
}