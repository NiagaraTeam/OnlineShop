using Application.Core;
using Application.Dto.Order;
using Application.Interfaces;
using AutoMapper;
using Domain;
using Domain.Enums;
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using MimeKit;
using Persistence;

namespace Application.Services.Mail
{
    public class MailService : IMailService
    {
        private readonly MailSettings _mailSettings;
        private readonly DataContext _context;
        private readonly IProductService _productService;
        private readonly IMapper _mapper;
        public MailService(DataContext context, IOptions<MailSettings> mailSettings, IProductService productService, IMapper mapper)
        {
            _mailSettings = mailSettings.Value;
            _context = context;
            _productService = productService;
            _mapper = mapper;
        }
        public async Task<Result<object>> SendNewsletterAsync() {
            var user = _context.Users
                .Include(u => u.CustomerDetails)
                .Where(u => u.CustomerDetails.Newsletter == true)
                .Select(u => u.Email)
                .ToList();

            var discountedProducts = _productService.GetDiscountedProducts().Result.Value.ToList();
            var newestProducts = _productService.GetNewestProducts().Result.Value.ToList();

            var email = new MimeMessage
            {
                Sender = MailboxAddress.Parse(_mailSettings.Mail)
            };

            for (int i = 0; i < user.Count; i++) {
                email.To.Add(MailboxAddress.Parse(user[i]));
            }

            email.Subject = "Okazje i promocje OnlineShop";

            var builder = new BodyBuilder{ HtmlBody = "" };

            if (discountedProducts.Count > 0)
            {
                builder.HtmlBody += "<h2>Okazje cenowe:</h2>";
                foreach (var product in discountedProducts) {
                    foreach (var discount in product.ProductDiscounts) {
                        builder.HtmlBody += $"<p><strong>{product.Name}, przecena {discount.Value * 100}% </strong></p>";
                        builder.HtmlBody += $"<p>Aktualna cena: {Math.Round(product.Price - (product.Price * discount.Value), 2)}zł</p>";
                    }
                }
            }

            if (newestProducts.Count > 0)
            {
                builder.HtmlBody += "<h2>Nowości:</h2>";
                foreach (var product in newestProducts) {
                    builder.HtmlBody += $"<p><b>{product.Name}</b>: {product.Price} zł </p>";
                }
            }

            email.Body = builder.ToMessageBody();

            using var client = new SmtpClient();
            try
            {
                client.Connect(_mailSettings.Host, _mailSettings.Port, SecureSocketOptions.StartTls);
                client.Authenticate(_mailSettings.Mail, _mailSettings.Password);
                await client.SendAsync(email);
                return Result<object>.Success(null);
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
        }

        public async Task<Result<object>> SendOrderStatusChangeEmail(int orderId, OrderStatus status)
        {
             var order = await _context.Orders
                .Include(o => o.CustomerDetails)
                .ThenInclude(cd => cd.User)
                .FirstOrDefaultAsync(o => o.Id == orderId);

            var email = new MimeMessage
            {
                Sender = MailboxAddress.Parse(_mailSettings.Mail)
            };

            email.Subject = "Change of order status";

            var builder = new BodyBuilder { HtmlBody = "" };

            email.To.Add(MailboxAddress.Parse(order.CustomerDetails.User.Email));
                        
            builder.HtmlBody += $"<span class=\"strong\">Your order number: <strong>{orderId}</strong> changed status to: <strong>{status}</strong></span>";
            email.Body = builder.ToMessageBody();

            using var client = new SmtpClient();
            try
            {
                client.Connect(_mailSettings.Host, _mailSettings.Port, SecureSocketOptions.StartTls);
                client.Authenticate(_mailSettings.Mail, _mailSettings.Password);
                await client.SendAsync(email);
                return Result<object>.Success(null);
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
        }

    }
}