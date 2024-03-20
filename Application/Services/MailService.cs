using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using Domain;
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using MimeKit;
using Persistence;

namespace Application.Services
{
    public class MailService : IMailService
    {
        private readonly MailSettings _mailSettings;
        private readonly DataContext _context;
        public MailService(DataContext context, IOptions<MailSettings> mailSettings) {
            _mailSettings = mailSettings.Value;
            _context = context;
        }
        public async Task<Result<object>> SendEmailAsync() {
            var user = _context.Users
                .Include(u => u.CustomerDetails)
                .Where(u => u.CustomerDetails.Newsletter == false)
                .Select(u => u.Email)
                .ToList();
            var products = _context.Products
                .Include(p => p.ProductDiscounts)
                .ToList();
            var email = new MimeMessage();
            email.Sender = MailboxAddress.Parse(_mailSettings.Mail);

            for (int i = 0; i < user.Count; i++) {
                email.To.Add(MailboxAddress.Parse(user[i]));
            }

            email.Subject = "Newsletter";
            var builder = new BodyBuilder();
            builder.HtmlBody = "<h2>Okazje cenowe!</h2>";
            foreach (var product in products) {
                foreach (var discount in product.ProductDiscounts) {
                    builder.HtmlBody += $"<p><strong>{product.Name}, przecena {discount.Value * 100}% </strong></p>";
                    builder.HtmlBody += $"<p>Aktualna cena: {Math.Round(product.Price - (product.Price * discount.Value), 2)}zł</p>";
                }
            }
            email.Body = builder.ToMessageBody();
            using (var client = new SmtpClient())
            try {
                client.Connect(_mailSettings.Host, _mailSettings.Port, SecureSocketOptions.StartTls);
                client.Authenticate(_mailSettings.Mail, _mailSettings.Password);
                await client.SendAsync(email);
                return Result<object>.Success(null);
            } catch (Exception e) {
                return Result<object>.Failure("Failed to send email: " + e.Message);
            }
            finally {
                client.Disconnect(true);
                client.Dispose();
            }
        }

    }
}