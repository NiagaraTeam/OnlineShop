using Domain.Enums;

namespace Domain
{
    public class CustomerDetails
    {
        public int Id { get; set; }
        public string UserId { get; set; }
        public int AddressId { get; set; }
        public AccountStatus Status { get; set; }
        public decimal DiscountValue { get; set; } // default 0
        public bool Newsletter { get; set; } // default false
        
        public ICollection<CustomerDetailsProduct> FavouriteProducts { get; set; }
        public ICollection<Order> Orders { get; set; }
        public AppUser User { get; set; }
        public Address Address { get; set; }
    }
}