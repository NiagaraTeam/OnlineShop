using Application.Core;
using Application.Dto;
using Application.Dto.Product;
using Application.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain;
using Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Persistence;
using iText.Kernel.Pdf;
using iText.Layout;
using iText.Layout.Element;
using iText.Kernel.Pdf.Canvas.Draw;
using MimeKit;
using Application.Services.Mail;
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Options;

namespace Application.Services
{
    public class ProductService : IProductService
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        private readonly IPhotoService _photoService;
        private readonly MailSettings _mailSettings;


        public ProductService(
            DataContext context, 
            IMapper mapper,
            IPhotoService photoService,
            IOptions<MailSettings> mailSettings
        )
        {
            _context = context;
            _mapper = mapper;
            _photoService = photoService;
            _mailSettings = mailSettings.Value;

        }

        public async Task<Result<object>> AddProductDiscount(int productId, DiscountDto discount)
        {
            var product = await _context.Products
                .Include(p => p.ProductDiscounts)
                .FirstOrDefaultAsync(p => p.Id == productId);

            if(product == null || product.Status == ProductStatus.Deleted)
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

            var newDiscount = new ProductDiscount{
                Value = discount.Value,
                ProductId = productId,
                Start = discount.Start,
                End = discount.End
            };

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

        public async Task<Result<object>> DeletePermanently(int productId)
        {
            var deleteProduct = await _context.Products
                .FindAsync(productId);

            if (deleteProduct == null) 
                return Result<object>.Failure("The indicated product is not available");
            
            // trzeba dodać sprawdzenie czy produkt nie jest powiązany z żadnymi zamówieniami

            await _photoService.DeletePhoto(deleteProduct.PhotoId);

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

            if (product.Status == ProductStatus.Deleted || 
                product.Status == ProductStatus.Hidden)
                return Result<ProductDto>.Success(null);

            var productDto = _mapper.Map<ProductDto>(product);

            return Result<ProductDto>.Success(productDto);
        }

        public async Task<Result<IEnumerable<ProductDto>>> GetDeletedProducts()
        {
            var deletedProducts = await _context.Products
                .Include(p => p.ProductInfo)
                .Include(p => p.Photo)
                .Include(p => p.Category)
                .Include(p => p.ProductExpert)
                .Include(p => p.ProductDiscounts)
                .Where(p => p.Status == ProductStatus.Deleted)
                .ToListAsync();

            if (deletedProducts == null)
                return null;

            var deletedProductDtos = _mapper.Map<IEnumerable<ProductDto>>(deletedProducts);

            return Result<IEnumerable<ProductDto>>.Success(deletedProductDtos);
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
                .Where(p => p.Status == ProductStatus.Available && p.ProductDiscounts
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
                .Where(p => p.Status == ProductStatus.Available)
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
            var products = await _context.Products
                .Where(p => p.CategoryId == categoryId)
                .Where(p => p.Status == ProductStatus.Available)
                .OrderBy(p => p.Id)
                .ToListAsync();

            var category = await _context.Categories
                .Where(c => c.Id == categoryId)
                .FirstOrDefaultAsync();

            var stream = new MemoryStream();

            using (var writer = new PdfWriter(stream))
            {
                using var pdf = new PdfDocument(writer);

                var document = new Document(pdf);

                document.Add(new Paragraph("Category: " + category.Name).SetFontSize(20));

                LineSeparator ls = new LineSeparator(new SolidLine()).SetMarginBottom(20f);
                document.Add(ls);

                // Utwórz tabelę
                var table = new Table(3);

                // Dodaj nagłówki kolumn do tabeli
                table.AddHeaderCell("ID");

                var productNameHeaderCell = new Cell().Add(new Paragraph("Product Name"));
                productNameHeaderCell.SetMinWidth(250f);
                table.AddHeaderCell(productNameHeaderCell);

                table.AddHeaderCell("Price (PLN)");

                // Dodaj dane do tabeli
                foreach (var product in products)
                {   
                    Cell idCell = new Cell();
                    idCell.Add(new Paragraph($"{product.Id}"));
                    idCell.SetTextAlignment(iText.Layout.Properties.TextAlignment.CENTER);
                    table.AddCell(idCell);

                    table.AddCell(product.Name);

                    Cell priceCell = new Cell();
                    priceCell.Add(new Paragraph($"{product.Price}"));
                    priceCell.SetTextAlignment(iText.Layout.Properties.TextAlignment.RIGHT);
                    table.AddCell(priceCell);
                }

                // Dodaj tabelę do dokumentu
                document.Add(table);

                document.Close();
            }

            return stream;
        }

        public async Task<Result<PagedList<ProductDto>>> GetProducts(PagingParams parameters)
        {
            var query = _context.Products
                .Where(p => p.Status != ProductStatus.Deleted)
                .ProjectTo<ProductDto>(_mapper.ConfigurationProvider)
                .AsQueryable();

            return Result<PagedList<ProductDto>>.Success(
                    await PagedList<ProductDto>.CreateAsync(query, parameters.PageNumber, 
                        parameters.PageSize)
                );
        }

        public async Task<Result<object>> QuestionAboutProduct(int productId, QuestionDto question)
        {
            //szukamy produktu i experta z nim powiązanego
            var product = await _context.Products
                .Include(p => p.ProductExpert)
                .FirstOrDefaultAsync(p => p.Id == productId);

            if (product == null) 
            {
                return Result<object>.Failure("This product not exist.");
            }
            
            var email = new MimeMessage
            {
                //ustawiamy nadawce ?
                Sender = MailboxAddress.Parse(_mailSettings.Mail)
                // Sender = MailboxAddress.Parse(question.Email)
            };
            
            email.Subject = "Product Question";

            var builder = new BodyBuilder {HtmlBody = ""};

            //pobieramy adres experta
            email.To.Add(MailboxAddress.Parse(product.ProductExpert.Email));

            //dodanie tresci z zapytania; email ma nalezy do klienta
            builder.HtmlBody += $"<p>Question from: <strong>{question.Email}</strong></p>";
            builder.HtmlBody += $"<p>Message: {question.Message}</p>";
            email.Body = builder.ToMessageBody();


            //wysylanie maila
            using var client = new SmtpClient();
            try
            {
                client.Connect(_mailSettings.Host, _mailSettings.Port, SecureSocketOptions.StartTls);
                client.Authenticate(_mailSettings.Mail, _mailSettings.Password);
                await client.SendAsync(email);

                return Result<object>.Success("null");

            }
            catch (Exception e)
            {
                return Result<object>.Failure("Failed to send email: " + e.Message);
            }
            finally
            {
                client.Disconnect(true);
                client.Dispose();
            }
            //throw new NotImplementedException();
            
        }

        public async Task<Result<IEnumerable<ProductDto>>> TopPurchasedProducts()
        {
            var topProducts = await _context.Products
                .Include(p => p.ProductInfo)
                .Include(p => p.Photo)
                .Include(p => p.Category)
                .Include(p => p.ProductExpert)
                .Include(p => p.ProductDiscounts)
                .Where(p => p.Status == ProductStatus.Available)
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
            var updateProduct = await _context.Products
                .Include(p => p.ProductInfo)
                .FirstOrDefaultAsync(p => p.Id == productId);

            if (updateProduct == null)
                return null;
                
            _mapper.Map(product, updateProduct);

            updateProduct.ProductInfo.CurrentStock = product.CurrentStock;

            if (updateProduct.ProductInfo.CurrentStock <= 0)
                        updateProduct.Status = ProductStatus.Unavailable;

            _context.Products.Update(updateProduct);

            if (await _context.SaveChangesAsync() == 0) {
                return Result<ProductDto>.Failure("Couldn't save changes");
            }

            var result = await _context.Products
                .Include(p => p.ProductInfo)
                .Include(p => p.Photo)
                .Include(p => p.Category)
                .Include(p => p.ProductExpert)
                .Include(p => p.ProductDiscounts)
                .FirstOrDefaultAsync(p => p.Id == productId);

            var productDto = _mapper.Map<ProductDto>(result);
            
            return Result<ProductDto>.Success(_mapper.Map<ProductDto>(productDto));
        }

        public async Task<Result<IEnumerable<ProductExpertDto>>> GetProductsExperts()
        {
            var experts = await _context.ProductExperts.ToListAsync();

            var expertsDto = _mapper.Map<IEnumerable<ProductExpertDto>>(experts);

            return Result<IEnumerable<ProductExpertDto>>.Success(expertsDto);
        }
    }
}