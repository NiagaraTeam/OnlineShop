using System.Runtime.InteropServices;
using Application.Core;
using Application.Dto.Order;
using Application.Dto.User;
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
        private readonly IUserAccessor _userAccessor;

        public OrderService(
            DataContext context,
            IMapper mapper,
            IUserAccessor userAccessor
        )
        {
            _context = context;
            _mapper = mapper;
            _userAccessor = userAccessor;
        }

        public async Task<Result<object>> AddOrderItem(int orderId, OrderItemAddDto item)
        {
            var order = await _context.Orders.Include(o => o.Items).FirstOrDefaultAsync(o => o.Id == orderId);
            if (order == null)
            {
                return null;
            }

            var orderItem = new OrderItem
            {
                ProductId = item.ProductId,
                OrderId = orderId,
                Quantity = item.Quantity,
            };

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
            if (orderItem == null)
                return null;

            orderItem.Quantity = item.Quantity;
            _context.Update(orderItem);

            if (await _context.SaveChangesAsync() > 0)
                return Result<object>.Success(null);

            return Result<object>.Failure("Failed updating order item quantity");

        }

        public async Task<Result<object>> ChangeOrderStatus(int orderId, OrderStatus status)
        {
            var orderToChangeStatus = await _context.Orders
            .Include(i => i.Items)
            .FirstOrDefaultAsync(o => o.Id == orderId);

            if (orderToChangeStatus == null)
                return null;


            if (orderToChangeStatus.Status == OrderStatus.Canceled || orderToChangeStatus.Status == OrderStatus.Completed)
                return Result<object>.Failure("Failed to update order status, order is already completed or canceled");
            
            if (status == OrderStatus.Completed)
            {
                foreach (OrderItem item in orderToChangeStatus.Items)
                {
                    var product = await _context.Products
                        .Include(p => p.ProductInfo)
                        .FirstOrDefaultAsync(p => p.Id ==item.ProductId);
                    
                    if (product == null)
                        return Result<object>.Failure("Product not found");

                    if (product.ProductInfo.CurrentStock < item.Quantity)
                        return Result<object>.Failure("Cannot update order status due to lack of products");
                    
                    product.ProductInfo.CurrentStock -= item.Quantity;
                    product.ProductInfo.TotalSold += item.Quantity;

                    if (product.ProductInfo.CurrentStock <= 0)
                        product.Status = ProductStatus.Unavailable;
                    
                    _context.Products.Update(product);
                }
            }
            orderToChangeStatus.Status = status;

            _context.Orders.Update(orderToChangeStatus);

            if (await _context.SaveChangesAsync() > 0)
                return Result<object>.Success(null);

            return Result<object>.Failure("Failed to update order status");
        }
        public async Task<Result<IEnumerable<OrderDto>>> GetAllOrders()
        {
            var orders = await _context.Orders
                .Include(o => o.CustomerDetails)
                    .ThenInclude(cd => cd.User)
                .Include(o => o.CustomerDetails)
                    .ThenInclude(cd => cd.Address)
                .Include(o => o.PaymentMethod)
                .Include(o => o.ShippingMethod)
                .Include(o => o.Items)
                    .ThenInclude(o => o.Product)
                .ToListAsync();

            var ordersDto = _mapper.Map<IEnumerable<OrderDto>>(orders);

            int index = -1;
            foreach (var orderdto in ordersDto)
            {
                index++;
                orderdto.UserDetails = new UserDetailsDto{
                    Id = orders[index].CustomerDetails.UserId,
                    UserName = orders[index].CustomerDetails.User.UserName,
                    Email = orders[index].CustomerDetails.User.Email,
                    Status = orders[index].CustomerDetails.User.CustomerDetails.Status,
                    DiscountValue = orders[index].CustomerDetails.DiscountValue,
                    Newsletter = orders[index].CustomerDetails.Newsletter,
                    Orders = null,
                    Address = _mapper.Map<AddressDto>(orders[index].CustomerDetails.Address)
                };
                orderdto.TotalValue = CalculateOrderValue(orderdto, false);
                orderdto.TotalValueWithTax = CalculateOrderValue(orderdto, true);
            }
            

            return Result<IEnumerable<OrderDto>>.Success(ordersDto);
        }
        public async Task<Result<int>> Create(OrderCreateUpdateDto order)
        {
            var user = await _context.Users
                .Include(u => u.CustomerDetails)
                .FirstOrDefaultAsync(u => u.Email == _userAccessor.GetUserEmail());

            var orderToCreate = _mapper.Map<Order>(order);
            if (orderToCreate == null)
            {
                return null;
            }

            orderToCreate.CustomerDetailsId = user.CustomerDetails.Id;
            orderToCreate.OrderDate = DateTime.UtcNow;
            orderToCreate.Status = OrderStatus.New;

            _context.Orders.Add(orderToCreate);

            if (await _context.SaveChangesAsync() > 0)
                return Result<int>.Success(orderToCreate.Id);

            return Result<int>.Failure("Failed creating order");
        }

        public async Task<Result<ICollection<OrderItemAddDto>>> CheckItemsAvailability(OrderCreateUpdateDto order)
        {
            var items = order.Items;

            List<OrderItemAddDto> unavailableItems = new();

            foreach (var item in items)
            {
                var product = await _context.Products.Include(p => p.ProductInfo).FirstOrDefaultAsync(p => p.Id == item.ProductId);

                if (product.ProductInfo.CurrentStock < item.Quantity)
                {
                    var unavailableQuiantity = item.Quantity - product.ProductInfo.CurrentStock;
                    
                    item.Quantity = unavailableQuiantity;

                    unavailableItems.Add(item);
                }
            }

            return Result<ICollection<OrderItemAddDto>>.Success(unavailableItems);
        }

        public async Task<Result<OrderDto>> Details(int orderId)
        {
            var order = await _context.Orders
                .Include(o => o.CustomerDetails)
                        .ThenInclude(cd => cd.User)
                .Include(o => o.CustomerDetails)
                    .ThenInclude(cd => cd.Address)
                .Include(o => o.PaymentMethod)
                .Include(o => o.ShippingMethod)
                .Include(o => o.Items)
                    .ThenInclude(o => o.Product)
                .FirstOrDefaultAsync(o => o.Id == orderId);

            if (order == null)
                return null;

            var orderdto = _mapper.Map<OrderDto>(order);

            orderdto.UserDetails = new UserDetailsDto{
                Id = order.CustomerDetails.UserId,
                UserName = order.CustomerDetails.User.UserName,
                Email = order.CustomerDetails.User.Email,
                Status = order.CustomerDetails.User.CustomerDetails.Status,
                DiscountValue = order.CustomerDetails.DiscountValue,
                Newsletter = order.CustomerDetails.Newsletter,
                Orders = null,
                Address = _mapper.Map<AddressDto>(order.CustomerDetails.Address)
            };

            orderdto.TotalValue = CalculateOrderValue(orderdto, false);
            orderdto.TotalValueWithTax = CalculateOrderValue(orderdto, true);

            return Result<OrderDto>.Success(orderdto);
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

            updateOrder.ShippingMethod = await _context.ShippingMethods.FindAsync(order.ShippingMethodId);
            updateOrder.PaymentMethod = await _context.PaymentMethods.FindAsync(order.PaymentMethodId);
            _context.Orders.Update(updateOrder);

            if (await _context.SaveChangesAsync() > 0)
                return Result<object>.Success(null);

            return Result<object>.Failure("Failed to save updateorder");
        }
    
        private decimal CalculateOrderValue(OrderDto order, bool withTax)
        {
            decimal totalValue = 0;

            // items
            foreach (var item in order.Items){
                var itemValue = item.Product.Price * item.Quantity;

                if (withTax)
                {
                    var taxRate = item.Product.TaxRate;
                    if (taxRate != -1 && taxRate != 0)
                        itemValue *= 1.0m + (decimal)(taxRate / 100.0);
                }

                totalValue += itemValue;
            }

            // shipping cost
            totalValue += order.ShippingMethod.Cost;

            // user discount
            var userDiscount = 1 - order.UserDetails.DiscountValue;
            totalValue *= userDiscount;
            
            return totalValue;
        }
    }
}
