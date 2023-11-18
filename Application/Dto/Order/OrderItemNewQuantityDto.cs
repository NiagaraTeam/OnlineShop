using System.ComponentModel.DataAnnotations;
namespace Application.Dto.Order
{
    public class OrderItemNewQuantityDto
    {
        [Required]
        public decimal Quantity { get; set; }
        [Required]
        public int ProductId { get; set; }
    }
}