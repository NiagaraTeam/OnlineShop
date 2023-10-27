namespace Domain
{
    public class CustomerDetailsProduct
    {
    public int CustomerDetailsId { get; set; }
    public CustomerDetails CustomerDetails { get; set; }
    
    public int ProductId { get; set; }
    public Product Product { get; set; }
}
}