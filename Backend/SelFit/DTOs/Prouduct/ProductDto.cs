using SelFit.Enums;

namespace SelFit.DTOs.Prouduct;

public class ProductDto
{
    public string Name { get; set; }
    public string Description { get; set; }
    public decimal Price { get; set; }

    public string ImageUrl { get; set; }

    //Product Details
    public MaterialTypeEnum Material { get; set; }
    public string Color { get; set; }
    public List<ProductMeasurementDto> Measurements { get; set; }
}