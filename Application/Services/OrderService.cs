using System.Collections.Immutable;
using Application.Core;
using Application.Dto.Order;
using Application.Dto.Product;
using Application.Dto.ShippingPayment;
using Application.Interfaces;
using AutoMapper;
using Domain;
using Domain.Enums;
using Microsoft.EntityFrameworkCore;
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

        public async Task<Result<object>> AddOrderItem(int orderId, OrderItemAddDto item)
        {
            var order = await _context.Orders.Include(p => p.Items).FirstOrDefaultAsync(o => o.Id == orderId);
            if (order == null)
            {
                return null;
            }

            var orderItem = new OrderItem
            {
                ProductId = item.ProductId,
                OrderId = orderId,
                Quantity = item.Quantity
            };
            if (order.Items == null)
            {
                return Result<object>.Failure("list do not exist");

            }
            order.Items.Add(orderItem);

            _context.Orders.Update(order);

            if (await _context.SaveChangesAsync() > 0)
                return Result<object>.Success(null);

            return Result<object>.Failure("Failed saving adding order item");

        }


        public async Task<Result<object>> ChangeOrderItemQuantity(int orderId, OrderItemNewQuantityDto item)
        {
            var orderItem = await _context.OrderItems.FirstOrDefaultAsync(oi => oi.OrderId == orderId && oi.
            ProductId == item.ProductId);
            if (orderItem != null)
            {
                orderItem.Quantity = item.Quantity;
                _context.Update(orderItem);

                if (await _context.SaveChangesAsync() > 0)
                    return Result<object>.Success(null);

                return Result<object>.Failure("Failed updating order item quantity");
            }
            else
            {
                return null;
            }
        }

        public async Task<Result<object>> ChangeOrderStatus(int orderId, OrderStatus status)
        {
            var orderToChangeStatus = await _context.Orders.FindAsync(orderId);
            if (orderToChangeStatus == null)
            {
                return null;
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
            if (orderToCreate == null)
            {
                return null;
            }

            orderToCreate.OrderDate = DateTime.UtcNow;
            orderToCreate.Status = OrderStatus.New;
            _context.Orders.Add(orderToCreate);

            if (await _context.SaveChangesAsync() > 0)
                return Result<int>.Success(orderToCreate.Id);

            return Result<int>.Failure("Failed creating order");
        }

        public async Task<Result<OrderDto>> Details(int orderId)
        {
            // xd
                        return Result<OrderDto>.Failure("Failed creating order");

        }

        public async Task<Result<object>> RemoveOrderItem(int orderId, int productId)
        {

            var orderitemToRemove = await _context.OrderItems.FirstOrDefaultAsync(oi => oi.OrderId == orderId && oi.ProductId == productId);
            if (orderitemToRemove == null)
            {
                return null;
            }

            _context.OrderItems.Remove(orderitemToRemove);

            if (await _context.SaveChangesAsync() > 0)
                return Result<object>.Success(null);

            return Result<object>.Failure("Failed to save removeorderitem");
        }

        public async Task<Result<object>> Update(int orderId, OrderCreateUpdateDto order)
        {
            var updateOrder = await _context.Orders.FindAsync(orderId);
            if (updateOrder == null)
            {
                return null;
            }

            _mapper.Map(order, updateOrder);
            _context.Orders.Update(updateOrder);

            if (await _context.SaveChangesAsync() > 0)
                return Result<object>.Success(null);

            return Result<object>.Failure("Failed to save updateorder");
        }
    }
}
