using FluentValidation;
using SelFit.DTOs.Account;

namespace SelFit.Validators;

public class PasswordResetDtoValidator : AbstractValidator<PasswordResetDto>
{
    public PasswordResetDtoValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email is required.")
            .EmailAddress().WithMessage("Invalid email address.");

        RuleFor(x => x.Code)
            .NotEmpty().WithMessage("Code is required.");

        RuleFor(x => x.NewPassword)
            .NotEmpty().WithMessage("New password is required.")
            .MinimumLength(8).WithMessage("Password must be at least 8 characters long.")
            .MaximumLength(12).WithMessage("Password must be less than 12 characters long.")
            .Matches(@"^(?=.*[A-Z])(?=.*\d).*$")
            .WithMessage("The password must contain at least one uppercase letter and one number.");
    }
}