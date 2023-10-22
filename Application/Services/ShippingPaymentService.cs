using Application.Core;
using Application.Dto.ShippingPayment;
using Application.Interfaces;
using AutoMapper;
using Persistence;

namespace Application.Services
{
    public class ShippingPaymentService : IShippingPaymentService
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;

        public ShippingPaymentService(
            DataContext context, 
            IMapper mapper
        )
        {
            _context = context;
            _mapper = mapper;
        }
        
        public async Task<Result<int>> AddPaymentMethod(PaymentMethodCreateUpdateDto method)
        {
            throw new NotImplementedException();
        }

        public async Task<Result<int>> AddShippingMethod(ShippingMethodCreateUpdateDto method)
        {
            throw new NotImplementedException();
        }

        public async Task<Result<object>> DeletePaymentMethod(int methodId)
        {
            throw new NotImplementedException();
        }

        public async Task<Result<object>> DeleteShippingMethod(int methodId)
        {
            throw new NotImplementedException();
        }

        public async Task<Result<IEnumerable<PaymentMethodDto>>> GetPaymentMethods()
        {
            throw new NotImplementedException();
        }

        public async Task<Result<IEnumerable<ShippingMethodDto>>> GetShippingMethods()
        {
            throw new NotImplementedException();
        }

        public async Task<Result<object>> UpdatePaymentMethod(int methodId, PaymentMethodCreateUpdateDto method)
        {
            throw new NotImplementedException();
        }

        public async Task<Result<object>> UpdateShippingMethod(int methodId, ShippingMethodCreateUpdateDto method)
        {
            throw new NotImplementedException();
        }
    }
}