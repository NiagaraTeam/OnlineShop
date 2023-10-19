namespace Domain
{
    public class ShippingMethod
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public decimal Cost { get; set; }

        public ICollection<Order> Orders { get; set; } 
    }
}