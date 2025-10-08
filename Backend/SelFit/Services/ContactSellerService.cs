using Microsoft.EntityFrameworkCore;
using SelFit.Data;
using SelFit.Interfaces;
using System.Net;
using System.Net.Mail;

namespace SelFit.Services;

public class ContactSellerService : IContactSellerService
{
    private readonly AppDbContext _appDbContext;
    private readonly IConfiguration _configuration;

    public ContactSellerService(AppDbContext appDbContext, IConfiguration configuration)
    {
        _appDbContext = appDbContext;
        _configuration = configuration;
    }

    public async Task<bool> ContactSellerByAsync(string customerEmail, string customerMessage, string sellerEmail,
        Guid productId)
    {
        try
        {
            //product not found
            var product = await _appDbContext.Products.FirstOrDefaultAsync(p => p.Id == productId);
            if (product == null) return false;

            //seller not found
            var seller = await _appDbContext.Sellers.FirstOrDefaultAsync(s => s.Email == sellerEmail);
            if (seller == null) return false;

            //check if customer is valid
            var customer = await _appDbContext.Customers.FirstOrDefaultAsync(c => c.Email == customerEmail);

            // From System -> Seller
            var sellerSubject = $"Customer contact you about {product.Name}";
            var sellerBody = $"<h1>Customer Inquiry</h1>" +
                             $"<p><strong>Product:</strong> {product.Name}</p>" +
                             $"<p><strong>Customer Message:</strong> {customerMessage}</p>" +
                             $"<p><strong>Customer Email:</strong> {customerEmail}</p>";


            var emailToSellerSent = await SendEmail(_configuration["EmailSettings:SenderEmail"], seller.Email,
                sellerSubject, sellerBody);

            // From System -> Customer
            var customerSubject = "Your inquiry has been sent to the seller";
            var customerBody = $"<p>Thank you for reaching out about <strong>{product.Name}</strong>. " +
                               $"The seller has received your message and will get back to you soon.</p>";
            var emailToCustomerSent = await SendEmail(_configuration["EmailSettings:SenderEmail"], customer.Email,
                customerSubject, customerBody);

            return emailToSellerSent && emailToCustomerSent;
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.ToString());
            return false;
        }
    }

    private async Task<bool> SendEmail(string senderEmail, string recipientEmail, string subject, string body)
    {
        try
        {
            var smtpClient = new SmtpClient(_configuration["EmailSettings:SmtpHost"])
            {
                Port = int.Parse(_configuration["EmailSettings:SmtpPort"]),
                Credentials = new NetworkCredential(
                    _configuration["EmailSettings:SmtpUsername"],
                    _configuration["EmailSettings:SmtpPassword"]),
                EnableSsl = true
            };

            var mailMessage = new MailMessage
            {
                From = new MailAddress(senderEmail),
                Subject = subject,
                Body = body,
                IsBodyHtml = true
            };

            mailMessage.To.Add(recipientEmail);
            await smtpClient.SendMailAsync(mailMessage);
            return true;
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.ToString());
            return false;
        }
    }
}