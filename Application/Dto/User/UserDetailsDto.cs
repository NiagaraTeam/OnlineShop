using Application.Dto.Order;
using Application.Dto.Product;
using Domain.Enums;

namespace Application.Dto.User
{
    public class UserDetailsDto
    {
        public string Id { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
        public AccountStatus Status { get; set; }
        public decimal DiscountValue { get; set; }
        public bool Newsletter { get; set; } 
        public ICollection<OrderDto> Orders { get; set; }
        public AddressDto Address { get; set; }
    }
}