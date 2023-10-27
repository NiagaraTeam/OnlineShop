namespace Domain
{
    public class OrderItem
    {
        public int OrderId { get; set; }
        public int ProductId { get; set; }
        public decimal Quantity { get; set; }

        public Order Order { get; set; }
        public Product Product { get; set; }
    }
}