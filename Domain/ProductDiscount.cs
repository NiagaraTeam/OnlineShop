namespace Domain
{
    public class ProductDiscount
    {
        public int Id { get; set; }
        public decimal Value { get; set; }
        public int ProductId { get; set; }
        public DateTime Start { get; set; }
        public DateTime End { get; set; }

        public Product Product { get; set; }
    }
}