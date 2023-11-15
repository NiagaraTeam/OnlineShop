using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using Domain;
namespace Application.Dto.Order
{
    public class OrderItemNewQuantityDto
    {
        [Required]
        public decimal Quantity { get; set; }
        public int ProductId { get; set; }


    }
}