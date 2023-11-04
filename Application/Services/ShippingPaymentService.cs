using Application.Core;
using Application.Dto.ShippingPayment;
using Application.Interfaces;
using AutoMapper;
using Domain;
using Microsoft.EntityFrameworkCore;
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
            var paymentMethod = _mapper.Map<PaymentMethod>(method);

            _context.PaymentMethods.Add(paymentMethod);

            if (await _context.SaveChangesAsync() > 0)
                return Result<int>.Success(paymentMethod.Id);
            
            return Result<int>.Failure("Failed adding payment method");
        }

        public async Task<Result<int>> AddShippingMethod(ShippingMethodCreateUpdateDto method)
        {
            var shippingMethod = _mapper.Map<ShippingMethod>(method);

            _context.ShippingMethods.Add(shippingMethod);

            if (await _context.SaveChangesAsync() > 0)
                return Result<int>.Success(shippingMethod.Id);
            
            return Result<int>.Failure("Failed adding shipping method");
        }

        public async Task<Result<object>> DeletePaymentMethod(int methodId)
        {
            var paymentMethodToDelete = await _context.PaymentMethods.FindAsync(methodId);

            if (paymentMethodToDelete == null)
                return null;

            bool isAssignedToOrder = _context.Orders.Any(o => o.PaymentMethodId == methodId);

            if (isAssignedToOrder)
                return Result<object>.Failure("Payment method is assigned to one or more orders and cannot be deleted.");
            

            _context.PaymentMethods.Remove(paymentMethodToDelete);

            if (await _context.SaveChangesAsync() > 0)
                return Result<object>.Success(null);

            return Result<object>.Failure("Failed to delete payment method");
        }

        public async Task<Result<object>> DeleteShippingMethod(int methodId)
        {
            var shippingMethodToDelete = await _context.ShippingMethods.FindAsync(methodId);

            if (shippingMethodToDelete == null)
                return null;

            bool isAssignedToOrder = _context.Orders.Any(o => o.ShippingMethodId == methodId);

            if (isAssignedToOrder)
                return Result<object>.Failure("Shipping method is assigned to one or more orders and cannot be deleted.");
            

            _context.ShippingMethods.Remove(shippingMethodToDelete);

            if (await _context.SaveChangesAsync() > 0)
                return Result<object>.Success(null);

            return Result<object>.Failure("Failed to delete shipping method");
        }

        public async Task<Result<IEnumerable<PaymentMethodDto>>> GetPaymentMethods()
        {
            var paymentMethods = await _context.PaymentMethods.ToListAsync();

            var paymentMethodsDto = _mapper.Map<List<PaymentMethodDto>>(paymentMethods);

            return Result<IEnumerable<PaymentMethodDto>>.Success(paymentMethodsDto);
        }

        public async Task<Result<IEnumerable<ShippingMethodDto>>> GetShippingMethods()
        {
            var shippingMethods = await _context.ShippingMethods.ToListAsync();

            var shippingMethodsDto = _mapper.Map<List<ShippingMethodDto>>(shippingMethods);

            return Result<IEnumerable<ShippingMethodDto>>.Success(shippingMethodsDto);
        }
    }
}