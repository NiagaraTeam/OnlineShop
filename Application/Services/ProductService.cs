using System.Reflection.Metadata;
using System.Runtime.Loader;
using Application.Core;
using Application.Dto;
using Application.Dto.Product;
using Application.Interfaces;
using AutoMapper;
using Domain;
using Domain.Enums;
using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Services
{
    public class ProductService : IProductService
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;

        public ProductService(
            DataContext context, 
            IMapper mapper
        )
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<Result<object>> AddProductDiscount(int productId, DiscountDto discount)
        {

            throw new NotImplementedException();
        }

        public async Task<Result<object>> ChangeProductStatus(int productId, ProductStatus newStatus)
        {
            var changeStatusProduct = await _context.Products.FindAsync(productId);
            if (changeStatusProduct == null)
                return null;

            changeStatusProduct.Status = newStatus;
            _context.Products.Update(changeStatusProduct);
            
            if (await _context.SaveChangesAsync() > 0) {
                return Result<object>.Success(null);
            }

            return Result<object>.Failure("Couldn't save changes");

        }
 
        public async Task<Result<int>> Create(ProductCreateUpdateDto product)
        {
            var createProduct = _mapper.Map<Product>(product);
            if (createProduct == null) {
                return null;
            }
            createProduct.CreatedAt = DateTime.UtcNow;
            createProduct.ModificationDate = DateTime.UtcNow;
            var productInfo = new ProductInfo{CurrentStock = 10, TotalSold = 0};
            createProduct.ProductInfo = productInfo;
            _context.Products.Add(createProduct);

            if(await _context.SaveChangesAsync() > 0) {
                return Result<int>.Success(createProduct.Id);
            }         

            return Result<int>.Failure("Failed adding shipping method");
        }

        public async Task<Result<object>> Delete(int productId)
        {
            throw new NotImplementedException();
        }

        public async Task<Result<object>> DeletePermanently(int productId)
        {
            var deleteProduct = await _context.Products.FindAsync(productId);
            if (deleteProduct == null) {
                return Result<object>.Failure("The indicated product is not available");
            }
            
            _context.Products.Remove(deleteProduct);

             if (await _context.SaveChangesAsync() > 0) {
                return Result<object>.Success(null);
            }

            return Result<object>.Failure("Couldn't save changes");

        }

        public async Task<Result<ProductDto>> Details(int productId)
        {
            throw new NotImplementedException();
        }

        public async Task<Result<IEnumerable<ProductDto>>> GetDeletedProducts()
        {
            throw new NotImplementedException();
        }

        public async Task<Result<IEnumerable<ProductDto>>> GetDiscountedProducts(DateRangeDto dateRange)
        {
            throw new NotImplementedException();
        }

        public async Task<Result<IEnumerable<ProductDto>>> GetNewestProducts()
        {
            throw new NotImplementedException();
        }

        public async Task<MemoryStream> GetPDFWithPriceList(int categoryId)
        {
            throw new NotImplementedException();
        }

        public async Task<Result<object>> QuestionAboutProduct(int productId, QuestionDto question)
        {
            throw new NotImplementedException();
        }

        public async Task<Result<IEnumerable<ProductDto>>> TopPurchasedProducts()
        {
            throw new NotImplementedException();
        }

        public async Task<Result<ProductDto>> Update(int productId, ProductCreateUpdateDto product)
        {
            var updateProduct = await _context.Products.FirstOrDefaultAsync(p => p.Id == productId);
            if (updateProduct == null)
                return null;
                
            _mapper.Map(product, updateProduct);
            _context.Products.Update(updateProduct);

            if (await _context.SaveChangesAsync() > 0) {
                return Result<ProductDto>.Success(null);
            }

            return Result<ProductDto>.Failure("Couldn't save changes");

        }

        public async Task<Result<object>> UpdateImage(int productId, string imageId)
        {
            throw new NotImplementedException();
        }
    }
}