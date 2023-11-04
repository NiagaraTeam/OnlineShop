using Domain;
using Domain.Enums;
using Microsoft.AspNetCore.Identity;

namespace Persistence
{
    public class Seed
    {
        public static async Task SeedData(DataContext context, UserManager<AppUser> userManager, RoleManager<IdentityRole> roleManager)
        {
            // seed database

            //Roles
            bool isCustomerRoleExists = await roleManager.RoleExistsAsync(StaticUserRoles.CUSTOMER);
            bool isAdminRoleExists = await roleManager.RoleExistsAsync(StaticUserRoles.ADMIN);

            if (!isCustomerRoleExists)
                await roleManager.CreateAsync(new IdentityRole(StaticUserRoles.CUSTOMER));

            if (!isAdminRoleExists) 
                await roleManager.CreateAsync(new IdentityRole(StaticUserRoles.ADMIN));

            if (userManager.Users.Any()) return;

            //Admin
            var admin = new AppUser
            {
                UserName = "admin",
                Email = "admin@test.com"
            };

            await userManager.CreateAsync(admin, "Pa$$w0rd");
            await userManager.AddToRoleAsync(admin, StaticUserRoles.ADMIN);

            //Customers
            var users = new List<AppUser>
            {
                new AppUser
                {
                    UserName = "bob",
                    Email = "bob@test.com",
                    CustomerDetails = new CustomerDetails
                    {
                        Status = AccountStatus.Active,
                        FavouriteProducts = new List<CustomerDetailsProduct>(),
                        Orders = new List<Order>(),
                        Address = new Address
                        {
                            AddressLine1 = "123 Main St",
                            City = "Sample City",
                            ZipCode = "12345",
                            Country = "Sample Country"
                        }
                    }
                },
                new AppUser
                {
                    UserName = "jane",
                    Email = "jane@test.com",
                    CustomerDetails = new CustomerDetails
                    {
                        Status = AccountStatus.Active,
                        FavouriteProducts = new List<CustomerDetailsProduct>(),
                        Orders = new List<Order>(),
                        Address = new Address
                        {
                            AddressLine1 = "456 Elm St",
                            City = "Another City",
                            ZipCode = "54321",
                            Country = "Another Country"
                        }
                    }
                },
                new AppUser
                {
                    UserName = "tom",
                    Email = "tom@test.com",
                    CustomerDetails = new CustomerDetails
                    {
                        Status = AccountStatus.Active,
                        FavouriteProducts = new List<CustomerDetailsProduct>(),
                        Orders = new List<Order>(),
                        Address = new Address
                        {
                            AddressLine1 = "789 Oak St",
                            City = "Yet Another City",
                            ZipCode = "98765",
                            Country = "Yet Another Country"
                        }
                    }
                },
            };

            foreach (var user in users)
            {
                await userManager.CreateAsync(user, "Pa$$w0rd");
                await userManager.AddToRoleAsync(user, StaticUserRoles.CUSTOMER);
            }

            // ShippingMethods
            var shippingMethods = new List<ShippingMethod>
            {
                new() { Name = "Standard Shipping", Cost = 5.99m },
                new() { Name = "Express Shipping", Cost = 12.99m }
            };
            context.ShippingMethods.AddRange(shippingMethods);

            // PaymentMethods
            var paymentMethods = new List<PaymentMethod>
            {
                new() { Name = "Credit Card" },
                new() { Name = "PayPal" }
            };
            context.PaymentMethods.AddRange(paymentMethods);

            // ProductExperts
            var productExperts = new List<ProductExpert>
            {
                new() { 
                    FirstName = "John", 
                    LastName = "Doe", 
                    Email = "john.doe@example.com",
                    PhoneNumber = "555666777" },
                new() { 
                    FirstName = "Jane", 
                    LastName = "Smith", 
                    Email = "jane.smith@example.com",
                    PhoneNumber = "555666777" }
            };
            context.ProductExperts.AddRange(productExperts);
            
            // Categories
            var categories = new List<Category>
            {
                new() {
                    Name = "Snacks",
                    Status = CategoryStatus.Visible,
                    ParentCategory = null
                }
            };

            categories.Add(new Category {
                Name = "Chips",
                Status = CategoryStatus.Visible,
                ParentCategory = categories[0]
            });

            categories.Add(new Category {
                Name = "Sweets",
                Status = CategoryStatus.Visible,
                ParentCategory = categories[0]
            });

            categories.Add(new Category {
                Name = "Fruit Snack",
                Status = CategoryStatus.Visible,
                ParentCategory = categories[0]
            });

            categories.Add(new Category {
                Name = "Potato Chips",
                Status = CategoryStatus.Visible,
                ParentCategory = categories[1]
            });

            categories.Add(new Category {
                Name = "Corn Chips",
                Status = CategoryStatus.Visible,
                ParentCategory = categories[1]
            });

            categories.Add(new Category {
                Name = "Chocolates",
                Status = CategoryStatus.Visible,
                ParentCategory = categories[2]
            });

            categories.Add(new Category {
                Name = "Lolipops",
                Status = CategoryStatus.Visible,
                ParentCategory = categories[2]
            });

            context.Categories.AddRange(categories);

            // Produkty
            var products = new List<Product>
            {
                new() {
                    Name = "Product 1",
                    Description = "Description for Product 1",
                    Price = 19.99m,
                    TaxRate = 23, 
                    Category = categories[7],
                    PhotoId = null,
                    CreatedAt = DateTime.UtcNow,
                    ModificationDate = DateTime.UtcNow,
                    Status = ProductStatus.Available, 
                    ProductExpert = productExperts[0],
                    ProductInfo = new ProductInfo
                    {
                        CurrentStock = 100,
                        TotalSold = 0 
                    }
                },
                new() {
                    Name = "Product 2",
                    Description = "Description for Product 2",
                    Price = 29.99m,
                    TaxRate = 23,
                    Category = categories[6],
                    PhotoId = null,
                    CreatedAt = DateTime.UtcNow,
                    ModificationDate = DateTime.UtcNow,
                    Status = ProductStatus.Available,
                    ProductExpert = productExperts[1],
                    ProductInfo = new ProductInfo
                    {
                        CurrentStock = 50,
                        TotalSold = 0
                    }
                },
                new() {
                    Name = "Product 3",
                    Description = "Description for Product 3",
                    Price = 39.99m,
                    TaxRate = 23,
                    Category = categories[5],
                    PhotoId = null,
                    CreatedAt = DateTime.UtcNow,
                    ModificationDate = DateTime.UtcNow,
                    Status = ProductStatus.Available,
                    ProductExpert = productExperts[1],
                    ProductInfo = new ProductInfo
                    {
                        CurrentStock = 75,
                        TotalSold = 0
                    }
                },
                new() {
                    Name = "Product 4",
                    Description = "Description for Product 4",
                    Price = 49.99m,
                    TaxRate = 23,
                    Category = categories[5],
                    PhotoId = null,
                    CreatedAt = DateTime.UtcNow,
                    ModificationDate = DateTime.UtcNow,
                    Status = ProductStatus.Unavailable,
                    ProductExpert = productExperts[0],
                    ProductInfo = new ProductInfo
                    {
                        CurrentStock = 0,
                        TotalSold = 10
                    }
                },
                new() {
                    Name = "Product 5",
                    Description = "Description for Product 5",
                    Price = 59.99m,
                    TaxRate = 23,
                    Category = categories[4],
                    PhotoId = null,
                    CreatedAt = DateTime.UtcNow,
                    ModificationDate = DateTime.UtcNow,
                    Status = ProductStatus.Deleted,
                    ProductExpert = productExperts[1],
                    ProductInfo = new ProductInfo
                    {
                        CurrentStock = 80,
                        TotalSold = 0
                    }
                }
            };

            context.Products.AddRange(products);

            //ProductsDiscounts
            var productDiscount = new ProductDiscount
            {
                Value = 0.2m, 
                Product = products[0],
                Start = DateTime.UtcNow, 
                End = DateTime.UtcNow.AddMonths(1) 
            };

            context.ProductDiscounts.Add(productDiscount);

            //Orders
            var orders = new List<Order>
            {
                new() {
                    CustomerDetails = users[0].CustomerDetails,
                    OrderDate = DateTime.UtcNow, 
                    Status = OrderStatus.New, 
                    PaymentMethod = paymentMethods[0],
                    ShippingMethod = shippingMethods[0],
                    Items = new List<OrderItem>
                    {
                        new() {
                            Product = products[0],
                            Quantity = 2 
                        },
                        new() {
                            Product = products[1],
                            Quantity = 1
                        }
                    }
                },
                new() {
                    CustomerDetails = users[1].CustomerDetails,
                    OrderDate = DateTime.UtcNow, 
                    Status = OrderStatus.Processing, 
                    PaymentMethod = paymentMethods[1],
                    ShippingMethod = shippingMethods[1],
                    Items = new List<OrderItem>
                    {
                        new() {
                            Product = products[1],
                            Quantity = 2 
                        },
                        new() {
                            Product = products[2],
                            Quantity = 1
                        }
                    }
                }
            };

            context.Orders.AddRange(orders);

            await context.SaveChangesAsync();
        }
    }
}