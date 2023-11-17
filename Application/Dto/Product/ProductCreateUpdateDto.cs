using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Application.Core.CustomDataAnnotations;
using Application.Dto.Category;
using Domain;
using Domain.Enums;

namespace Application.Dto.Product
{
    public class ProductCreateUpdateDto
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }
        public int TaxRate { get; set; } // -1/0/5/8/23 (-1 means tax free)
        public int CategoryId { get; set; }
        public int ProductExpertId { get; set; }
        //public DateTime CreatedAt { get; set; }
        //public DateTime ModificationDate { get; set; }
        public ProductStatus Status { get; set; }
        //public int ProductInfoId { get; set; }
    }
}