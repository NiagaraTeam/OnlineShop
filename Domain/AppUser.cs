using Microsoft.AspNetCore.Identity;

namespace Domain
{
    public class AppUser : IdentityUser
    {
        //fileds are defined in IdentityUser class
        public CustomerDetails CustomerDetails { get; set; }
    }
}