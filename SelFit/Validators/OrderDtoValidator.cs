using FluentValidation;
using SelFit.DTOs.Order;

namespace SelFit.Validators;

public class OrderDtoValidator : AbstractValidator<OrderDto>
{
    public OrderDtoValidator()
    {
        RuleFor(order => order.CustomerId)
            .NotEmpty().WithMessage("CustomerId is required.");

        RuleFor(order => order.SellerId)
            .NotEmpty().WithMessage("SellerId is required.");

        RuleFor(order => order.ProductId)
            .NotEmpty().WithMessage("ProductId is required.");
    }
}