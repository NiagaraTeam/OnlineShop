using Domain;
using Domain.Enums;
using Application.Dto.Category;

namespace Application.Dto.Product
{
    public class ProductDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }
        public int TaxRate { get; set; } // -1/0/5/8/23 (-1 means tax free)
        public DateTime CreatedAt { get; set; }
        public DateTime ModificationDate { get; set; }
        public ProductStatus Status { get; set; }

        public ProductInfoDto ProductInfo { get; set; }
        public PhotoDto Photo { get; set; } 
        public CategoryDto Category { get; set; }
        public ProductExpertDto ProductExpert { get; set; }
        public List<DiscountDto> ProductDiscounts { get; set;}
    }


}