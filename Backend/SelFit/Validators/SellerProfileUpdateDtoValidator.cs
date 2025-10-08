using FluentValidation;
using SelFit.DTOs.Users;

namespace SelFit.Validators;

public class SellerProfileUpdateDtoValidator : AbstractValidator<SellerProfileUpdateDto>
{
    public SellerProfileUpdateDtoValidator()
    {
        RuleFor(s => s.Name)
            .NotEmpty().WithMessage("Name is required.")
            .MaximumLength(100).WithMessage("Name cannot exceed 100 characters.");

        RuleFor(s => s.Description)
            .MaximumLength(500).WithMessage("Description cannot exceed 500 characters.");
    }
}