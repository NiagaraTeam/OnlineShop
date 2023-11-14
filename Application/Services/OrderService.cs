using Application.Core;
using Application.Dto.Order;
using Application.Interfaces;
using AutoMapper;
using Domain;
using Domain.Enums;
using Persistence;

namespace Application.Services
{
    public class OrderService : IOrderService
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;

        public OrderService(
            DataContext context,
            IMapper mapper
        )
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<Result<object>> AddOrderItem(int orderId, OrderItemDto item)
        {
            var order = await _context.Orders.FindAsync(orderId);
            if (order == null)
            {
                return Result<object>.Failure("Order with id not found");
            }

            var itemToAdd = _mapper.Map<OrderItem>(item);


            _context.OrderItems.Add(itemToAdd);

            if (await _context.SaveChangesAsync() > 0)
                return Result<object>.Success(null);

            return Result<object>.Failure("Failed adding item to order");

        }

        public async Task<Result<object>> ChangeOrderItemQuantity(int orderId, OrderItemNewQuantityDto item)
        {
            //?????????????? howww
            throw new NotImplementedException();
        }

        public async Task<Result<object>> ChangeOrderStatus(int orderId, OrderStatus status)
        {
            var orderToChangeStatus = await _context.Orders.FindAsync(orderId);
            if (orderToChangeStatus == null)
            {
                return Result<object>.Failure("Order with id not found");
            }

            orderToChangeStatus.Status = status;
            _context.Orders.Update(orderToChangeStatus);

            if (await _context.SaveChangesAsync() > 0)
                return Result<object>.Success(null);

            return Result<object>.Failure("Failed to update order status");
        }

        public async Task<Result<int>> Create(OrderCreateUpdateDto order)
        {
            var orderToCreate = _mapper.Map<Order>(order);

            _context.Orders.Add(orderToCreate);

            if (await _context.SaveChangesAsync() > 0)
                return Result<int>.Success(orderToCreate.Id);

            return Result<int>.Failure("Failed creating order");
        }

        public async Task<Result<OrderDto>> Details(int orderId)
        {

            //?? pozniej sie dorobi 
            throw new NotImplementedException();
        }

        public async Task<Result<object>> RemoveOrderItem(int orderId, int productId)
        {
            var orderToRemoveItemFrom = await _context.Orders.FindAsync(orderId);
            if (orderToRemoveItemFrom == null)
            {
                return Result<object>.Failure("Order with id not found");
            }

            var itemToRemoveFromOrder = await _context.OrderItems.FindAsync(orderId, productId);
            if (itemToRemoveFromOrder == null)
            {
                return Result<object>.Failure("Item with id not found in order with id");
            }

            _context.OrderItems.Remove(itemToRemoveFromOrder);

            if (await _context.SaveChangesAsync() > 0)
                return Result<object>.Success(null);

            return Result<object>.Failure("Failed to delete order item");
        }

        public async Task<Result<object>> Update(int orderId, OrderCreateUpdateDto order)
        {
            var updatedOrder = _mapper.Map<Order>(order);
            var existingOrder = await _context.Orders.FindAsync(orderId);

            if (existingOrder == null)
            {
                return Result<object>.Failure("Order with id not found");
            }

            _context.Orders.Update(updatedOrder);

            if (await _context.SaveChangesAsync() > 0)
                return Result<object>.Success(null);

            return Result<object>.Failure("Failed to update order");
        }
    }
}
