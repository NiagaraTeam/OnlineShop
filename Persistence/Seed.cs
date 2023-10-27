using Domain;
using Microsoft.AspNetCore.Identity;

namespace Persistence
{
    public class Seed
    {
        public static async Task SeedData(DataContext context, UserManager<AppUser> userManager)
        {
            if (userManager.Users.Any()) return;

            // seed database

            //Customers
            var users = new List<AppUser>
            {
                new AppUser
                {
                    UserName = "bob",
                    Email = "bob@test.com"
                },
                new AppUser
                {
                    UserName = "jane",
                    Email = "jane@test.com"
                },
                new AppUser
                {
                    UserName = "tom",
                    Email = "tom@test.com"
                },
            };

            foreach (var user in users)
            {
                await userManager.CreateAsync(user, "Pa$$w0rd");
            }
        }
    }
}