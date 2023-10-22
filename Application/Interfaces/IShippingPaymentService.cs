using Application.Core;
using Application.Dto.ShippingPayment;

namespace Application.Interfaces
{
    public interface IShippingPaymentService
    {
        Task<Result<IEnumerable<ShippingMethodDto>>> GetShippingMethods();
        Task<Result<IEnumerable<PaymentMethodDto>>> GetPaymentMethods();

        Task<Result<int>> AddShippingMethod(ShippingMethodCreateUpdateDto method);
        Task<Result<int>> AddPaymentMethod(PaymentMethodCreateUpdateDto method);

        Task<Result<object>> UpdateShippingMethod(int methodId, ShippingMethodCreateUpdateDto method);
        Task<Result<object>> UpdatePaymentMethod(int methodId, PaymentMethodCreateUpdateDto method);

        Task<Result<object>> DeleteShippingMethod(int methodId);
        Task<Result<object>> DeletePaymentMethod(int methodId);
    }
}