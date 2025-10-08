using FluentValidation;
using SelFit.DTOs.Prouduct;

namespace SelFit.Validators;

public class EditProductDtoValidator : AbstractValidator<EditProductDto>
{
    public EditProductDtoValidator()
    {
        RuleFor(product => product.Name)
            .NotEmpty().WithMessage("Name is required.")
            .Length(3, 100).WithMessage("Name must be between 3 and 100 characters");

        RuleFor(product => product.Description)
            .NotEmpty().WithMessage("Description is required.")
            .Length(10, 500).WithMessage("Description must be between 10 and 500 characters");

        RuleFor(product => product.Price)
            .GreaterThan(0).WithMessage("Price must be a positive number");

        RuleFor(product => product.Material)
            .IsInEnum().WithMessage("Invalid material type");

        RuleFor(product => product.Color)
            .NotEmpty().WithMessage("Color is required");
    }
}