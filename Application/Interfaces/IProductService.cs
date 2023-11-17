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
        Task<Result<object>> Delete(int productId);
        Task<Result<object>> DeletePermanently(int productId);
        //Task<Result<IEnumerable<ProductDto>> List(???); // parametry work in progress
        Task<Result<IEnumerable<ProductDto>>> GetDeletedProducts();
        Task<Result<object>> ChangeProductStatus(int productId, ProductStatus newStatus);
        Task<Result<ProductDto>> Details(int productId);
        Task<Result<IEnumerable<ProductDto>>> TopPurchasedProducts();
        Task<Result<IEnumerable<ProductDto>>> GetNewestProducts();
        Task<Result<IEnumerable<ProductDto>>> GetDiscountedProducts();
        Task<Result<object>> UpdateImage(int productId, string imageId);
        Task<MemoryStream> GetPDFWithPriceList(int categoryId);
        Task<Result<object>> AddProductDiscount(int productId, DiscountDto discount);
        Task<Result<object>> QuestionAboutProduct(int productId, QuestionDto question);
    }
}