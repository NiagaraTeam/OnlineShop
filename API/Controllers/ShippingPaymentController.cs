using Application.Dto.ShippingPayment;
using Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Persistence;

namespace API.Controllers
{
    public class ShippingPaymentController : BaseApiController
    {
        private readonly IShippingPaymentService _shippingPaymentService;

        public ShippingPaymentController(IShippingPaymentService shippingPaymentService)
        {
            _shippingPaymentService = shippingPaymentService;
        }

        [HttpGet("shipping-methods")] //api/shipping-methods
        [AllowAnonymous]
        public async Task<IActionResult> GetShippingMethods()
        {
            return HandleResult(await _shippingPaymentService.GetShippingMethods());
        }

        [HttpGet("payment-methods")] //api/payment-methods
        [AllowAnonymous]
        public async Task<IActionResult> GetPaymentMethods()
        {
            return HandleResult(await _shippingPaymentService.GetPaymentMethods());
        }

        [HttpPost("shipping-methods")] //api/shipping-methods
        [Authorize(Roles = StaticUserRoles.ADMIN)]
        public async Task<IActionResult> AddShippingMethod(ShippingMethodCreateUpdateDto method)
        {
            return HandleResult(await _shippingPaymentService.AddShippingMethod(method));
        }

        [HttpPost("payment-methods")] //api/payment-methods
        [Authorize(Roles = StaticUserRoles.ADMIN)]
        public async Task<IActionResult> AddPaymentMethod(PaymentMethodCreateUpdateDto method)
        {
            return HandleResult(await _shippingPaymentService.AddPaymentMethod(method));
        }

        [HttpDelete("shipping-methods/{methodId}")] //api/shipping-methods/methodId
        [Authorize(Roles = StaticUserRoles.ADMIN)]
        public async Task<IActionResult> DeleteShippingMethod(int methodId)
        {
            return HandleResult(await _shippingPaymentService.DeleteShippingMethod(methodId));
        }

        [HttpDelete("payment-methods/{methodId}")]  //api/payment-methods/methodId
        [Authorize(Roles = StaticUserRoles.ADMIN)]
        public async Task<IActionResult> DeletePaymentMethod(int methodId)
        {
            return HandleResult(await _shippingPaymentService.DeletePaymentMethod(methodId));
        }
    }
}