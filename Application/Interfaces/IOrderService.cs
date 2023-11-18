using Application.Core;
using Application.Dto.Order;
using Domain.Enums;

namespace Application.Interfaces
{
    public interface IOrderService
    {
        Task<Result<int>> Create(OrderCreateUpdateDto order);
        Task<Result<OrderDto>> Details(int orderId);
        Task<Result<object>> Update(int orderId, OrderCreateUpdateDto order);
        Task<Result<object>> AddOrderItem(int orderId, OrderItemAddDto item);
        Task<Result<object>> RemoveOrderItem(int orderId, int productId);
        Task<Result<object>> ChangeOrderItemQuantity(int orderId, OrderItemNewQuantityDto item);
        Task<Result<object>> ChangeOrderStatus(int orderId, OrderStatus status);
    }
}