using Application.Core;
using Application.Dto;
using Application.Dto.Product;
using Application.Interfaces;
using Domain.Enums;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Persistence;

namespace API.Controllers
{
    public class ProductController : BaseApiController
    {
        private readonly IProductService _productService;
        public ProductController(IProductService productService)
        {
            _productService = productService;
        }

        [HttpGet("products")] //api/products
        [AllowAnonymous]
        public async Task<IActionResult> CreateProduct([FromQuery] PagingParams param)
        {
            return HandlePagedResult(await _productService.GetProducts(param));
        }

        [HttpPost("products")] //api/products
        [Authorize(Roles = StaticUserRoles.ADMIN)]
        public async Task<IActionResult> CreateProduct(ProductCreateDto product)
        {
            return HandleResult(await _productService.Create(product));
        }

        [HttpPut("products/{productId}")] //api/products/productId
        [Authorize(Roles = StaticUserRoles.ADMIN)]
        public async Task<IActionResult> UpdateProduct(int productId, ProductUpdateDto product)
        {
            return HandleResult(await _productService.Update(productId, product));
        }

        [HttpDelete("products/{productId}/permanently")] //api/products/productId/permanently
        [Authorize(Roles = StaticUserRoles.ADMIN)]
        public async Task<IActionResult> DeleteProductPermanently(int productId)
        {
            return HandleResult(await _productService.DeletePermanently(productId));
        }

        [HttpGet("products/deleted")] //api/products/deleted
        [Authorize(Roles = StaticUserRoles.ADMIN)]
        public async Task<IActionResult> GetDeletedProducts()
        {
            return HandleResult(await _productService.GetDeletedProducts());
        }

        [HttpPatch("products/{productId}/{newStatus}")] //api/products/productId/status
        [Authorize(Roles = StaticUserRoles.ADMIN)]
        public async Task<IActionResult> ChangeProductStatus(int productId, ProductStatus newStatus)
        {
            return HandleResult(await _productService.ChangeProductStatus(productId, newStatus));
        }

        [HttpGet("products/{productId}")] //api/products/productId
        [AllowAnonymous]
        public async Task<IActionResult> GetProductDetails(int productId)
        {
            return HandleResult(await _productService.Details(productId));
        }

        [HttpGet("products/top-purchased")] //api/products/top-purchased
        [AllowAnonymous]
        public async Task<IActionResult> GetTopPurchasedProducts()
        {
            return HandleResult(await _productService.TopPurchasedProducts());
        }

        [HttpGet("products/newest")] //api/products/newest
        [AllowAnonymous]
        public async Task<IActionResult> GetNewestProducts()
        {
            return HandleResult(await _productService.GetNewestProducts());
        }

        [HttpGet("products/discounted")] //api/products/discounted
        [AllowAnonymous]
        public async Task<IActionResult> GetDiscountedProducts()
        {
            return HandleResult(await _productService.GetDiscountedProducts());
        }

        [HttpGet("products/price-list/{categoryId}")] //api/products/price-list/categoryId
        [AllowAnonymous]
        public async Task<IActionResult> GetPriceList(int categoryId)
        {
            try
            {
                var pdf = await _productService.GetPDFWithPriceList(categoryId);

                Response.Headers["Content-Disposition"] = "inline; filename=pricelist.pdf";

                return File(pdf.ToArray(), "application/pdf", "pricelist.pdf");
            }
            catch (Exception)
            {
                return StatusCode(500, $"An error occurred during generating zip file");
            }
        }

        [HttpPost("products/{productId}/discount")] //api/products/productId/discount
        [Authorize(Roles = StaticUserRoles.ADMIN)]
        public async Task<IActionResult> AddProductDiscount(int productId, DiscountDto discount)
        {
            return HandleResult(await _productService.AddProductDiscount(productId, discount));
        }

        [HttpPost("products/{productId}/question")] //api/products/productId/question
        [AllowAnonymous]
        public async Task<IActionResult> AskQuestionAboutProduct(int productId, QuestionDto question)
        {
            return HandleResult(await _productService.QuestionAboutProduct(productId, question));
        }

        [HttpGet("products/experts")] //api/products/experts
        [AllowAnonymous]
        public async Task<IActionResult> GetProductsExperts()
        {
            return HandleResult(await _productService.GetProductsExperts());
        }
    }
}