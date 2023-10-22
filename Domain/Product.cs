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
        public Photo Image { get; set; } 
        public DateTime CreatedAt { get; set; }
        public DateTime ModificationDate { get; set; }
        public ProductStatus Status { get; set; }
        public int ExpertId { get; set; }

        public Category Category { get; set; }
        public ProductExpert Expert { get; set; }
    }
}