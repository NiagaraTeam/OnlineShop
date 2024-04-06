using Application.Core;
using Application.Dto.Order;

namespace Application.Interfaces
{
    public interface IMailService
    {
        Task<Result<object>> SendNewsletterAsync();

        Task<Result<object>> SendOrderDetailsAsync(OrderDto orderDto);

    }
}