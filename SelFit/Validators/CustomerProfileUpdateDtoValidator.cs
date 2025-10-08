using FluentValidation;
using SelFit.DTOs.Users;

namespace SelFit.Validators;

public class CustomerProfileUpdateDtoValidator : AbstractValidator<CustomerProfileUpdateDto>
{
    public CustomerProfileUpdateDtoValidator()
    {
        RuleFor(x => x.FullName)
            .NotEmpty().WithMessage("Full name is required")
            .MaximumLength(50)
            .WithMessage("Full name cannot exceed 50 characters") // Increased length for full names
            .Matches(@"^[a-zA-Z\s'-.]+$").WithMessage("Invalid letters");

        RuleFor(x => x.PhoneNumber)
            .NotEmpty().WithMessage("Phone number is required")
            .Matches(@"^\+?[1-9]\d{8,14}$")
            .WithMessage("It should start with a '+' followed by country code and digits contain 8-15 digits");

        RuleFor(x => x.Address)
            .NotEmpty().WithMessage("Address is required")
            .MaximumLength(255).WithMessage("Address cannot exceed 255 characters");

        RuleFor(x => x.Zip)
            .NotEmpty().WithMessage("Zip code is required")
            .Matches(@"^\d{4}(?:[-\s]\d{3})?$").WithMessage("Invalid Zip code format ('1234' or '1234-567')");

        RuleFor(x => x.City)
            .NotEmpty().WithMessage("City is required")
            .MaximumLength(32).WithMessage("City cannot exceed 32 characters");
    }
}