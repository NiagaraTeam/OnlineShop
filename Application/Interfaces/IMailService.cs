using Application.Core;
using Application.Dto.Order;
using Domain.Enums;

namespace Application.Interfaces
{
    public interface IMailService
    {
        Task<Result<object>> SendNewsletterAsync();
        Task<Result<object>> SendOrderStatusChangeEmail(int orderId, OrderStatus status);
    }
}