using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Dto.Product;

namespace Application.Dto.Order
{
    public class OrderItemDto
    {
        public decimal Quantity { get; set; }
        public int ProductId { get; set; }
        //public ProductDto ProductDto{ get; set; }
    }
}