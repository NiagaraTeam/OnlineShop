using System.Net.Sockets;
using Domain;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Persistence
{
    public class DataContext : IdentityDbContext<AppUser>
    {
        public DataContext(DbContextOptions options) 
            :base(options){}

        // entity framework config
        public DbSet<Address> Addresses { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }
        public DbSet<PaymentMethod> PaymentMethods { get; set; }
        public DbSet<ShippingMethod> ShippingMethods { get; set; }
        public DbSet<Photo> Photos { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<ProductDiscount> ProductDiscounts { get; set; }
        public DbSet<ProductExpert> ProductExperts { get; set; }
        public DbSet<ProductInfo> ProductInfos { get; set; }
        public DbSet<CustomerDetails> CustomerDetails { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
		{
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<AppUser>()
                .HasOne(u => u.CustomerDetails)
                .WithOne(cd => cd.User)
                .HasForeignKey<CustomerDetails>(cd => cd.UserId)
                .IsRequired();

            modelBuilder.Entity<CustomerDetails>()
                .HasOne(ud => ud.Address)
                .WithOne(a => a.CustomerDetails)
                .HasForeignKey<CustomerDetails>(a => a.AddressId)
                .IsRequired(false); // when creating account address will be empty

            modelBuilder.Entity<Category>()
                .HasOne(c => c.ParentCategory)
                .WithMany(c => c.ChildCategories)
                .HasForeignKey(c => c.ParentCategoryId)
                .IsRequired();

            modelBuilder.Entity<CustomerDetails>()
                .HasMany(cd => cd.Orders)
                .WithOne(o => o.CustomerDetails)
                .HasForeignKey(o => o.CustomerDetailsId)
                .IsRequired();

            modelBuilder.Entity<CustomerDetailsProduct>()
                .HasKey(cdp => new {cdp.CustomerDetailsId, cdp.ProductId});
            modelBuilder.Entity<CustomerDetailsProduct>()
                .HasOne(cdp => cdp.CustomerDetails)
                .WithMany(cd => cd.FavouriteProducts)
                .HasForeignKey(cdp => cdp.CustomerDetailsId)
                .IsRequired();
            modelBuilder.Entity<CustomerDetailsProduct>()
                .HasOne(cdp => cdp.Product)
                .WithMany(cd => cd.Customers)
                .HasForeignKey(cdp => cdp.ProductId)
                .IsRequired();        

            modelBuilder.Entity<Order>()
                .HasOne(o => o.PaymentMethod)
                .WithMany(pm => pm.Orders)
                .HasForeignKey(o => o.PaymentMethodId)
                .IsRequired();

            modelBuilder.Entity<Order>()
                .HasOne(o => o.ShippingMethod)
                .WithMany(pm => pm.Orders)
                .HasForeignKey(o => o.ShippingMethodId)
                .IsRequired();

            modelBuilder.Entity<OrderItem>()
                .HasKey(oi => new {oi.OrderId, oi.ProductId});
            modelBuilder.Entity<OrderItem>()
                .HasOne(oi => oi.Order)
                .WithMany(o => o.Items)
                .HasForeignKey(oi => oi.OrderId)
                .IsRequired();
            modelBuilder.Entity<OrderItem>()
                .HasOne(oi => oi.Product)
                .WithMany(p => p.Orders)
                .HasForeignKey(oi => oi.ProductId)
                .IsRequired();

            modelBuilder.Entity<Product>()
                .HasOne(p => p.Photo)
                .WithOne(p => p.Product)
                .HasForeignKey<Product>(p => p.PhotoId)
                .IsRequired(false); // photo can be null       

            modelBuilder.Entity<Product>()
                .HasOne(p => p.Category)
                .WithMany(c => c.Products)
                .HasForeignKey(p => p.CategoryId)
                .IsRequired();

            modelBuilder.Entity<Product>()
                .HasOne(p => p.ProductExpert)
                .WithMany(pe => pe.Products)
                .HasForeignKey(p => p.ProductExpertId)
                .IsRequired();

            modelBuilder.Entity<Product>()
                .HasMany(p => p.ProductDiscounts)
                .WithOne(pd => pd.Product)
                .HasForeignKey(p => p.ProductId)
                .IsRequired();

            modelBuilder.Entity<Product>()
                .HasOne(p => p.ProductInfo)
                .WithOne(pi => pi.Product)
                .HasForeignKey<ProductInfo>(p => p.ProductId)
                .IsRequired();
        }
    }
}