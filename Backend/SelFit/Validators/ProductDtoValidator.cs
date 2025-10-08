using FluentValidation;
using SelFit.DTOs.Prouduct;

namespace SelFit.Validators;

public class ProductDtoValidator : AbstractValidator<ProductDto>
{
    public ProductDtoValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Product name is required")
            .MaximumLength(200).WithMessage("Product name cannot exceed 200 characters");

        RuleFor(x => x.Description)
            .NotEmpty().WithMessage("Product description is required");

        RuleFor(x => x.Price)
            .GreaterThan(0).WithMessage("Price must be greater than 0");
        RuleFor(product => product.Material)
            .IsInEnum().WithMessage("Invalid material type");

        RuleFor(product => product.Color)
            .NotEmpty().WithMessage("Color is required");
    }
}