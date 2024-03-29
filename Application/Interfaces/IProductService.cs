using Application.Core;
using Application.Dto;
using Application.Dto.Product;
using Domain.Enums;

namespace Application.Interfaces
{
    public interface IProductService
    {
        Task<Result<int>> Create(ProductCreateDto product);
        Task<Result<ProductDto>> Update(int productId, ProductUpdateDto product);
        Task<Result<object>> DeletePermanently(int productId);
        Task<Result<PagedList<ProductDto>>> GetProducts(PagingParams parameters); 
        Task<Result<IEnumerable<ProductDto>>> GetDeletedProducts();
        Task<Result<object>> ChangeProductStatus(int productId, ProductStatus newStatus);
        Task<Result<ProductDto>> Details(int productId);
        Task<Result<IEnumerable<ProductDto>>> TopPurchasedProducts();
        Task<Result<IEnumerable<ProductDto>>> GetNewestProducts();
        Task<Result<IEnumerable<ProductDto>>> GetDiscountedProducts();
        Task<MemoryStream> GetPDFWithPriceList(int categoryId);
        Task<Result<object>> AddProductDiscount(int productId, DiscountDto discount);
        Task<Result<object>> QuestionAboutProduct(int productId, QuestionDto question);
        Task<Result<IEnumerable<ProductExpertDto>>> GetProductsExperts();
    }
}