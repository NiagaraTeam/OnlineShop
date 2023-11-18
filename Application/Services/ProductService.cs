using Application.Core;
using Application.Dto;
using Application.Dto.Product;
using Application.Interfaces;
using AutoMapper;
using Domain;
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

            // Sprawdź, czy nowy rabat nakłada się na istniejące rabaty
            bool isOverlap = product.ProductDiscounts.Any(existingDiscount =>
                (discount.Start >= existingDiscount.Start && discount.Start <= existingDiscount.End) ||
                (discount.End >= existingDiscount.Start && discount.End <= existingDiscount.End) ||
                (discount.Start <= existingDiscount.Start && discount.End >= existingDiscount.End));

            if (isOverlap)
            {
                // Jeżeli istnieje nakładanie się rabatów, zwróć błąd
                return Result<object>.Failure("New discount period overlaps with existing discounts.");
            }

            var newDiscount = _mapper.Map<ProductDiscount>(discount);
            product.ProductDiscounts.Add(newDiscount);

            _context.Update(product);
            await _context.SaveChangesAsync();

            return Result<object>.Success(null);
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

        public async Task<Result<int>> Create(ProductCreateDto product)
        {
            var createProduct = _mapper.Map<Product>(product);
            if (createProduct == null) {
                return null;
            }

            createProduct.CreatedAt = DateTime.UtcNow;
            createProduct.ModificationDate = DateTime.UtcNow;
            var productInfo = new ProductInfo
            {
                CurrentStock = product.CurrentStock, 
                TotalSold = 0
            };
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

            if (deleteProduct == null) 
                return Result<object>.Failure("The indicated product is not available");
            
            // trzeba dodać sprawdzenie czy produkt nie jest powiązany z żadnymi zamówieniami

            _context.Products.Remove(deleteProduct);

            if (await _context.SaveChangesAsync() > 0) 
                return Result<object>.Success(null);
            
            return Result<object>.Failure("Couldn't save changes");
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

            if (product == null)
                return null;

            var productDto = _mapper.Map<ProductDto>(product);

            return Result<ProductDto>.Success(productDto);
        }

        public async Task<Result<IEnumerable<ProductDto>>> GetDeletedProducts()
        {
            throw new NotImplementedException();
        }

        public async Task<Result<IEnumerable<ProductDto>>> GetDiscountedProducts()
        {
            DateTime currentDate = DateTime.UtcNow;

            var discountedProducts = await _context.Products
                .Include(p => p.ProductInfo)
                .Include(p => p.Photo)
                .Include(p => p.Category)
                .Include(p => p.ProductExpert)
                .Include(p => p.ProductDiscounts)
                .Where(p => p.ProductDiscounts
                    .Any(d => d.Start <= currentDate && d.End >= currentDate))
                .ToListAsync();

            if (discountedProducts == null)
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
                .Take(10)
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
                .Take(10)
                .ToListAsync();

            if ( topProducts == null)
                return null;

            var topProductsDto = _mapper.Map<IEnumerable<ProductDto>>(topProducts);

            return Result<IEnumerable<ProductDto>>.Success(topProductsDto);
        }

        public async Task<Result<ProductDto>> Update(int productId, ProductUpdateDto product)
        {
            var updateProduct = await _context.Products.FirstOrDefaultAsync(p => p.Id == productId);
            if (updateProduct == null)
                return null;
                
            _mapper.Map(product, updateProduct);
            _context.Products.Update(updateProduct);

            if (await _context.SaveChangesAsync() > 0) {
                return Result<ProductDto>.Success(_mapper.Map<ProductDto>(updateProduct));
            }

            return Result<ProductDto>.Failure("Couldn't save changes");

        }

        public async Task<Result<object>> UpdateImage(int productId, string imageId)
        {
            throw new NotImplementedException();
        }
    }
}