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

        public async Task<Result<object>> AddOrderItem(int orderId, OrderItemDto item)
        {
            var order = await _context.Orders.FindAsync(orderId);
            if (order == null)
            {
                return Result<object>.Failure("Order with id not found");
            }

            var itemToAdd = _mapper.Map<OrderItem>(item);

            _context.OrderItems.Add(itemToAdd);
            _context.Update(order);

            if (await _context.SaveChangesAsync() > 0)
                return Result<object>.Success(null);

            return Result<object>.Failure("Failed adding item to order");

        }

        public async Task<Result<object>> ChangeOrderItemQuantity(int orderId, OrderItemNewQuantityDto item)
        {
            /* var order = await _context.Orders
         .Include(o => o.Items)
         .FirstOrDefaultAsync(o => o.Id == orderId);

             if (order == null)
             {
                 return Result<object>.Failure("Order with id not found");
             }

             var orderItem = order.Items.FirstOrDefault(i => i.ProductId == item.ProductId);

             if (orderItem == null)
             {
                 return Result<object>.Failure($"Item with ProductId not found in order with ID.");
             }
             orderItem.Quantity = item.Quantity;
             _context.Update(orderItem);

             if (await _context.SaveChangesAsync() > 0)
                 return Result<object>.Success(null);
 */
            return Result<object>.Failure("Failed to update orderitem quantity");


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
            if (orderToCreate == null)
            {
                return Result<int>.Failure("Failed mapping order to create");
            }

            _context.Orders.Add(orderToCreate);

            if (await _context.SaveChangesAsync() > 0)
                return Result<int>.Success(orderToCreate.Id);

            return Result<int>.Failure("Failed creating order");
        }

        public async Task<Result<OrderDto>> Details(int orderId)
        {
            var order = await _context.Orders.FindAsync(orderId);

            if (order == null)
            {
                return Result<OrderDto>.Failure("Order with id not found");
            }

            var orderDto = new OrderDto
            {
                PaymentMethod = _mapper.Map<PaymentMethodDto>(order.PaymentMethod),
                ShippingMethod = _mapper.Map<ShippingMethodDto>(order.ShippingMethod),
                Id = order.Id,
                OrderDate = order.OrderDate,
                Status = order.Status,
                Items = new List<OrderItemDto> { }
            };

            foreach (var orderItem in order.Items)
            {
                OrderItemDto orderItemDto = new OrderItemDto
                {
                    Product = _mapper.Map<ProductDto>(orderItem.Product),
                    Quantity = orderItem.Quantity
                };
                orderDto.Items.Add(orderItemDto);
            }
            return Result<OrderDto>.Success(orderDto);
            /*
            var order = await _context.Orders
            .Include(o => o.OrderDate)
            .Include(o => o.Status)
            .Include(o => o.CustomerDetails)
            .Include(o => o.Items)
            .Include(o => o.PaymentMethod)
            .Include(o => o.ShippingMethod)
            .FirstOrDefaultAsync(o => o.Id == orderId);

            if (order == null)
            {
                return Result<OrderDto>.Failure("Order with id not found");
            }

            var orderDto = new OrderDto
            {
                Id = order.Id,
                OrderDate = order.OrderDate,
                Status = order.Status,
                CustomerDetailsId = order.CustomerDetailsId,
                PaymentMethod = order.PaymentMethod,
                ShippingMethod = order.ShippingMethod,
                Items = order.Items.Select(oi => new OrderItemDto
                {
                    //ProductDto=...
                    ProductDto = oi.,
                    Quantity = oi.Quantity
                }).ToList()
            };*/
            //return Result<OrderDto>.Success(orderDto);

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
            if (updatedOrder == null)
            {
                return Result<object>.Failure("Failed with mapping updated order");
            }

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
