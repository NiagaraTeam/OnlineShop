using Domain.Enums;

namespace Domain
{
    public class Product
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }
        public int TaxRate { get; set; } // -1/0/5/8/23 (-1 means tax free)
        public int CategoryId { get; set; }
        public string PhotoId { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime ModificationDate { get; set; }
        public ProductStatus Status { get; set; }
        public int ProductExpertId { get; set; }
        public int ProductInfoId { get; set; }

        public ProductInfo ProductInfo { get; set; }
        public Photo Photo { get; set; } 
        public Category Category { get; set; }
        public ProductExpert ProductExpert { get; set; }
        public ICollection<ProductDiscount> ProductDiscounts { get; set; }
        public ICollection<CustomerDetailsProduct> Customers { get; set; }
        public ICollection<OrderItem> Orders { get; set; }
    }
}