using System.ComponentModel.DataAnnotations;

namespace Application.Dto.Order
{
    public class OrderItemAddDto
    {
        [Required]
        public int ProductId{ get; set; }
        [Required]
        public Decimal Quantity{ get; set; }
    }
}