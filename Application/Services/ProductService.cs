using Application.Core;
using Application.Dto;
using Application.Dto.Product;
using Application.Interfaces;
using AutoMapper;
using Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Persistence;
using Domain;

namespace Application.Services  // Siema
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
            var product = await _context.Products
                .Include(p => p.ProductDiscounts)
                .FirstOrDefaultAsync(p => p.Id == productId);

            if(product == null)
                return null;

            var newDiscount = _mapper.Map<ProductDiscount>(discount);
            product.ProductDiscounts.Add(newDiscount);

            _context.Update(product);
            await _context.SaveChangesAsync();

            return Result<object>.Success("Discount added successfully");

        }

        public async Task<Result<object>> ChangeProductStatus(int productId, ProductStatus newStatus)
        {
            throw new NotImplementedException();
        }

        public async Task<Result<int>> Create(ProductCreateUpdateDto product)  /**/
        {
            throw new NotImplementedException();
        }

        public async Task<Result<object>> Delete(int productId)
        {
            throw new NotImplementedException();
        }

        public async Task<Result<object>> DeletePermanently(int productId)
        {
            throw new NotImplementedException();
        }

        public async Task<Result<ProductDto>> Details(int productId)
        {
            var product = await _context.Products
                .Include(p => p.ProductInfo)
                .Include(p => p.Photo)
                .Include(p => p.Category)
                .Include(p => p.ProductExpert)
                .Include(p => p.ProductDiscounts)
                .FirstOrDefaultAsync(p => p.Id == productId);

            if ( product == null)
                return null;

            var productDto = _mapper.Map<ProductDto>(product);

            return Result<ProductDto>.Success(productDto);
        }

        public async Task<Result<IEnumerable<ProductDto>>> GetDeletedProducts()
        {
            throw new NotImplementedException();
        }

        public async Task<Result<IEnumerable<ProductDto>>> GetDiscountedProducts(DateRangeDto dateRange)
        {
            var discountedProducts = await _context.Products
                .Include(p => p.ProductInfo)
                .Include(p => p.Photo)
                .Include(p => p.Category)
                .Include(p => p.ProductExpert)
                .Include(p => p.ProductDiscounts)
                .Where(p => p.ProductDiscounts
                .Any(d => d.Start >= dateRange.Start && d.End <= dateRange.End))
                .ToListAsync();

            if ( discountedProducts == null)
                return null;

            var discountedProductDtos = _mapper.Map<IEnumerable<ProductDto>>(discountedProducts);

            return Result<IEnumerable<ProductDto>>.Success(discountedProductDtos);

        }

        public async Task<Result<IEnumerable<ProductDto>>> GetNewestProducts()
        {
             var newestProducts = await _context.Products
                .Include(p => p.ProductInfo)
                .Include(p => p.Photo)
                .Include(p => p.Category)
                .Include(p => p.ProductExpert)
                .Include(p => p.ProductDiscounts)
                .OrderByDescending(p => p.CreatedAt)
                .Take(3)
                .ToListAsync();

            if (newestProducts == null)
                return null;

            var newestProductsDto = _mapper.Map<IEnumerable<ProductDto>>(newestProducts);

            return Result<IEnumerable<ProductDto>>.Success(newestProductsDto);
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
            var topProducts = await _context.Products
                .Include(p => p.ProductInfo)
                .OrderByDescending(p => p.ProductInfo.TotalSold)
                .Take(3)
                .ToListAsync();

            if ( topProducts == null)
                return null;

            var topProductsDto = _mapper.Map<IEnumerable<ProductDto>>(topProducts);

            return Result<IEnumerable<ProductDto>>.Success(topProductsDto);
        }

        public async Task<Result<ProductDto>> Update(int productId, ProductCreateUpdateDto product)
        {
            throw new NotImplementedException();
        }

        public async Task<Result<object>> UpdateImage(int productId, string imageId)
        {
            throw new NotImplementedException();
        }
    }
}