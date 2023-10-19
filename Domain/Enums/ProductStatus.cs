namespace Domain.Enums
{
    public enum ProductStatus
    {
        Available = 1, // product in stock and visible for users
        Unavailable = 2, // product out of stock
        Hidden = 3, // product hidden from users
        Deleted = 4 // product moved to trash
    }
}