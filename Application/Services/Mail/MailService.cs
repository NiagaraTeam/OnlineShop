using Application.Core;
using Application.Dto.Order;
using Application.Interfaces;
using AutoMapper;
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
        private readonly IMapper _mapper;
        private readonly MailSettings _mailSettings;
        private readonly DataContext _context;
        private readonly IProductService _productService;

        public MailService(DataContext context, IOptions<MailSettings> mailSettings, IProductService productService, IMapper mapper)
        {
            _mailSettings = mailSettings.Value;
            _context = context;
            _productService = productService;
            _mapper = mapper;
        }
        
        public async Task<Result<object>> SendNewsletterAsync()
        {
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

            for (int i = 0; i < user.Count; i++)
            {
                email.To.Add(MailboxAddress.Parse(user[i]));
            }

            email.Subject = "Okazje i promocje OnlineShop";

            var builder = new BodyBuilder { HtmlBody = "" };

            if (discountedProducts.Count > 0)
            {
                builder.HtmlBody += "<h2>Okazje cenowe:</h2>";
                foreach (var product in discountedProducts)
                {
                    foreach (var discount in product.ProductDiscounts)
                    {
                        builder.HtmlBody += $"<p><strong>{product.Name}, przecena {discount.Value * 100}% </strong></p>";
                        builder.HtmlBody += $"<p>Aktualna cena: {Math.Round(product.Price - (product.Price * discount.Value), 2)}zł</p>";
                    }
                }
            }

            if (newestProducts.Count > 0)
            {
                builder.HtmlBody += "<h2>Nowości:</h2>";
                foreach (var product in newestProducts)
                {
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

        public async Task<Result<object>> SendOrderDetailsAsync(OrderDto orderdto)
        { 
            var email = new MimeMessage
            {
                Sender = MailboxAddress.Parse(_mailSettings.Mail)
            };
            email.To.Add(MailboxAddress.Parse(orderdto.UserDetails.Email));

            email.Subject = "Order confirmation";

            var builder = new BodyBuilder { HtmlBody = "" };

            // Header
            builder.HtmlBody += $"<h1>Order number: {orderdto.Id}</h1>";
            builder.HtmlBody += "<h3>Products:</h3>";

            // Table header
            builder.HtmlBody += "<table>";
            builder.HtmlBody += "<tr><th>Name</th><th>Quantity</th><th>Unit price</th><th>Total price</th></tr>";

            // Table body
            foreach (var item in orderdto.Items)
            {
                builder.HtmlBody += $"<tr style='text-align: center'>";
                builder.HtmlBody += $"<td>{item.Product.Name}</td>";
                builder.HtmlBody += $"<td>{item.Quantity}</td>";
                builder.HtmlBody += $"<td>{item.Product.Price}</td>";
                builder.HtmlBody += $"<td>{item.Quantity * item.Product.Price}</td>";
                builder.HtmlBody += $"</tr>";
            }

            // Table closing tag
            builder.HtmlBody += "</table>";

            // Total and Tax
            builder.HtmlBody += $"<h3>Total: {orderdto.TotalValue.ToString("F2")}</h3>";
            builder.HtmlBody += $"<h3>Total with TAX: {orderdto.TotalValueWithTax.ToString("F2")}</h3>";

            // Order details
            builder.HtmlBody += "<h3>Order details:</h3>";
            builder.HtmlBody += $"Payment method: <strong>{orderdto.PaymentMethod.Name}</strong><br>";
            builder.HtmlBody += $"Shipping method: <strong>{orderdto.ShippingMethod.Name}</strong>";

            // Customer details
            builder.HtmlBody += "<h3>Customer details:</h3>";
            builder.HtmlBody += $"E-mail: <strong>{orderdto.UserDetails.Email}</strong><br>";
            builder.HtmlBody += $"Address:<br>";
            builder.HtmlBody += $"<strong>{orderdto.UserDetails.Address.AddressLine1}<br>";

            if (!string.IsNullOrEmpty(orderdto.UserDetails.Address.AddressLine2))
                builder.HtmlBody += $"{orderdto.UserDetails.Address.AddressLine2}<br>";

            builder.HtmlBody += $"{orderdto.UserDetails.Address.ZipCode} {orderdto.UserDetails.Address.City}<br>";
            builder.HtmlBody += $"{orderdto.UserDetails.Address.Country}</strong>";

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
