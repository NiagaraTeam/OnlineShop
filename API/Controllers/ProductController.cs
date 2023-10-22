using Application.Dto;
using Application.Dto.Product;
using Application.Interfaces;
using Domain.Enums;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class ProductController : BaseApiController
    {
        private readonly IProductService _productService;
        public ProductController(IProductService productService)
        {
            _productService = productService;
        }

        [HttpPost("products")] //api/products
        public async Task<IActionResult> CreateProduct(ProductCreateUpdateDto product)
        {
            return HandleResult(await _productService.Create(product));
        }

        [HttpPut("products/{productId}")] //api/products/productId
        public async Task<IActionResult> UpdateProduct(int productId, ProductCreateUpdateDto product)
        {
            return HandleResult(await _productService.Update(productId, product));
        }

        [HttpDelete("products/{productId}")] //api/products/productId
        public async Task<IActionResult> DeleteProduct(int productId)
        {
            return HandleResult(await _productService.Delete(productId));
        }

        [HttpDelete("products/{productId}/permanently")] //api/products/productId/permanently
        public async Task<IActionResult> DeleteProductPermanently(int productId)
        {
            return HandleResult(await _productService.DeletePermanently(productId));
        }

        [HttpGet("products/deleted")] //api/products/deleted
        public async Task<IActionResult> GetDeletedProducts()
        {
            return HandleResult(await _productService.GetDeletedProducts());
        }

        [HttpPatch("products/{productId}/status")] //api/products/productId/status
        public async Task<IActionResult> ChangeProductStatus(int productId, ProductStatus newStatus)
        {
            return HandleResult(await _productService.ChangeProductStatus(productId, newStatus));
        }

        [HttpGet("products/{productId}")] //api/products/productId
        public async Task<IActionResult> GetProductDetails(int productId)
        {
            return HandleResult(await _productService.Details(productId));
        }

        [HttpGet("products/top-purchased")] //api/products/top-purchased
        public async Task<IActionResult> GetTopPurchasedProducts()
        {
            return HandleResult(await _productService.TopPurchasedProducts());
        }

        [HttpGet("products/newest")] //api/products/newest
        public async Task<IActionResult> GetNewestProducts()
        {
            return HandleResult(await _productService.GetNewestProducts());
        }

        [HttpGet("products/discounted")] //api/products/discouted
        public async Task<IActionResult> GetDiscountedProducts([FromQuery] DateRangeDto dateRange)
        {
            return HandleResult(await _productService.GetDiscountedProducts(dateRange));
        }

        [HttpPatch("products/{productId}/image")] //api/products/productId/image
        public async Task<IActionResult> UpdateProductImage(int productId, string imageId)
        {
            return HandleResult(await _productService.UpdateImage(productId, imageId));
        }

        [HttpGet("products/price-list/{categoryId}")] //api/products/price-list/categoryId
        public async Task<IActionResult> GetPriceList(int categoryId)
        {
            try
            {
                var pdf = await _productService.GetPDFWithPriceList(categoryId);

                return File(pdf.ToArray(), "application/pdf", "pricelist.pdf");
            }
            catch (Exception)
            {
                return StatusCode(500, $"An error occurred during generating zip file");
            }
        }

        [HttpPost("products/{productId}/discount")] //api/products/productId/discount
        public async Task<IActionResult> AddProductDiscount(int productId, DiscountDto discount)
        {
            return HandleResult(await _productService.AddProductDiscount(productId, discount));
        }

        [HttpPost("products/{productId}/question")] //api/products/productId/question
        public async Task<IActionResult> AskQuestionAboutProduct(int productId, QuestionDto question)
        {
            return HandleResult(await _productService.QuestionAboutProduct(productId, question));
        }
    }
}