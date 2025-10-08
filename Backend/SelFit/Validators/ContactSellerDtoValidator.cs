using FluentValidation;
using SelFit.DTOs.Contact;

namespace SelFit.Validators;

public class ContactSellerDtoValidator : AbstractValidator<ContactSellerDto>
{
    public ContactSellerDtoValidator()
    {
        RuleFor(contact => contact.Message)
            .NotEmpty().WithMessage("Message is required.")
            .MinimumLength(10).WithMessage("Message must be at least 10 characters long");

        RuleFor(contact => contact.ProductID)
            .NotEmpty().WithMessage("ProductID is required.");

        RuleFor(contact => contact.SellerEmail)
            .NotEmpty().WithMessage("Seller email is required.")
            .Matches(@"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$")
            .WithMessage("Email can only contain letters (a-z), digits (0-9), and periods (.)");

        RuleFor(contact => contact.CustomerEmail)
            .NotEmpty().WithMessage("Customer email is required.")
            .Matches(@"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$")
            .WithMessage("Email can only contain letters (a-z), digits (0-9), and periods (.)");
    }
}