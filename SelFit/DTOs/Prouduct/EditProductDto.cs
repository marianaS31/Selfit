using SelFit.Enums;

namespace SelFit.DTOs.Prouduct;

public class EditProductDto
{
    public string Name { get; set; }
    public string Description { get; set; }
    public decimal Price { get; set; }
    public MaterialTypeEnum Material { get; set; }
    public string Color { get; set; }
    public List<ProductMeasurementDto> Measurements { get; set; }
}