namespace Domain
{
    public class ProductInfo
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public decimal CurrentStock { get; set; }
        public decimal TotalSold { get; set; }

        public Product Product { get; set; }
    }
}