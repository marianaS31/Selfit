using FluentValidation;
using SelFit.DTOs.Prouduct;

namespace SelFit.Validators;

public class UploadImageDtoValidator : AbstractValidator<UploadImageDto>
{
    public UploadImageDtoValidator()
    {
        RuleFor(x => x.ProductId)
            .NotEmpty().WithMessage("Product ID is required.");

        RuleFor(x => x.ProductImage)
            .NotNull().WithMessage("Product image is required.")
            .Must(x => x.Length > 0).WithMessage("Uploaded file cannot be empty.");
    }
}