using Domain.Enums;
using Microsoft.AspNetCore.Identity;

namespace Domain
{
    public class AppUser : IdentityUser
    {
        public Address Address { get; set; }
        public AccountStatus Status { get; set; }
        public decimal DiscountValue { get; set; } // default 0
        public bool Newsletter { get; set; } // default false

        public ICollection<Product> FavouriteProducts { get; set; }
    }
}