using Application.Core;
using Application.Dto.Order;
using Application.Interfaces;
using AutoMapper;
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
            throw new NotImplementedException();
        }

        public async Task<Result<object>> ChangeOrderItemQuantity(int orderId, OrderItemNewQuantityDto item)
        {
            throw new NotImplementedException();
        }

        public async Task<Result<object>> ChangeOrderStatus(int orderId, OrderStatus status)
        {
            throw new NotImplementedException();
        }

        public async Task<Result<int>> Create(OrderCreateUpdateDto order)
        {
            throw new NotImplementedException();
        }

        public async Task<Result<OrderDto>> Details(int orderId)
        {
            throw new NotImplementedException();
        }

        public async Task<Result<object>> RemoveOrderItem(int orderId, int productId)
        {
            throw new NotImplementedException();
        }

        public async Task<Result<object>> Update(int orderId, OrderCreateUpdateDto order)
        {
            throw new NotImplementedException();
        }
    }
}
