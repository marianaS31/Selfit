using FluentValidation;
using SelFit.DTOs.Account;

namespace SelFit.Validators;

public class RegisterDtoValidator : AbstractValidator<RegisterDto>
{
    public RegisterDtoValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email is Required")
            .Matches(@"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$")
            .WithMessage("Email can only contain letters (a-z), digits (0-9), and periods (.)");

        RuleFor(x => x.Password)
            .NotEmpty().WithMessage("Password is required")
            .MinimumLength(8).WithMessage("Password must be at least 8 characters long")
            .MaximumLength(12).WithMessage("Password must be less than 12 characters long")
            .Matches(@"^(?=.*[A-Z])(?=.*\d).*$")
            .WithMessage("The password must contain at least one uppercase letter and one number.");

        RuleFor(x => x.ConfirmPassword)
            .Equal(x => x.Password).WithMessage("Passwords do not match.");
    }
}