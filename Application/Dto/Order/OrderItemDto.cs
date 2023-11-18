using Application.Dto.Product;

namespace Application.Dto.Order
{
    public class OrderItemDto
    {
        public decimal Quantity { get; set; }
        public ProductDto Product{ get; set; }
    }
}