using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.Dto.Order
{
    public class OrderItemAddDto
    {
        public int ProductId{ get; set; }
        public Decimal Quantity{ get; set; }
    }
}