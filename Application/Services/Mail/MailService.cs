using iText.Layout.Element;

using Application.Core;
using Application.Interfaces;
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
        private readonly IOrderService _orderService;
        public MailService(DataContext context, IOptions<MailSettings> mailSettings, IProductService productService, IOrderService orderService)
        {
            _mailSettings = mailSettings.Value;
            _context = context;
            _productService = productService;
            _orderService=orderService;
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

      public async Task<Result<object>> SendOrderDetailsAsync(int orderId)
        { 
            var order = _orderService.Details(orderId).Result.Value;

            var email = new MimeMessage
            {
                Sender = MailboxAddress.Parse(_mailSettings.Mail)
            };
            email.To.Add(MailboxAddress.Parse(order.UserDetails.Email));

            email.Subject = "Order confirmation";

            var builder = new BodyBuilder { HtmlBody = "" };

            builder.HtmlBody+=$"<h1>Order number: {order.Id}</h1>";
            builder.HtmlBody += "<h3>Products:</h3>";
            builder.HtmlBody+=  "<table><tr><th>Name</th><th>Quantity</th><th>Unit price</th><th>Total price</th></tr>";

            foreach (var item in order.Items)
            {
                builder.HtmlBody+=$"<tr style='text-align: center'><td>{item.Product.Name}</td><td>{item.Quantity}</td><td>{item.Product.Price}</td><td>{item.Quantity*item.Product.Price}</td></tr>";
            }

            builder.HtmlBody+="</table>";
            builder.HtmlBody+=$"<h3>Total: {order.TotalValue.ToString("F2")}</h3>";
            builder.HtmlBody+=$"<h3>Total with TAX: {order.TotalValueWithTax.ToString("F2")}</h3>";
            builder.HtmlBody+= $"<h3>Order details:</h3> Payment method: <strong>{order.PaymentMethod.Name}</strong><br>Shipping method: <strong>{order.ShippingMethod.Name}</strong>";
            builder.HtmlBody+= $"<h3>Customer details:</h3> E-mail: <strong>{order.UserDetails.Email}</strong><br>Address: <strong>{order.UserDetails.Address.AddressLine1} {order.UserDetails.Address.AddressLine2}</strong>";

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
