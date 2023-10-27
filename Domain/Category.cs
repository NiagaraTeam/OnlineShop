using Domain.Enums;

namespace Domain
{
    public class Category
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int ParentCategoryId { get; set; }
        public CategoryStatus Status { get; set; }

        public Category ParentCategory { get; set; }
        public ICollection<Category> ChildCategories { get; set; }
        public ICollection<Product> Products { get; set; }
    }
}