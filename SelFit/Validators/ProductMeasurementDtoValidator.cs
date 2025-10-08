using FluentValidation;
using SelFit.DTOs.Prouduct;

namespace SelFit.Validators;

public class ProductMeasurementDtoValidator : AbstractValidator<ProductMeasurementDto>
{
    public ProductMeasurementDtoValidator()
    {
        RuleFor(x => x.MeasurementType)
            .NotEmpty().WithMessage("Measurement type is required.")
            .Length(1, 50).WithMessage("Measurement type must be between 1 and 50 characters.")
            .Matches("^[a-zA-Z0-9]+$").WithMessage("Measurement type can only contain letters and numbers.");

        RuleFor(x => x.Value)
            .NotEmpty().WithMessage("Value is required.")
            .GreaterThan(0).WithMessage("Value must be greater than 0")
            .LessThanOrEqualTo(1000).WithMessage("Value must be less than or equal to 1000.");
    }
}