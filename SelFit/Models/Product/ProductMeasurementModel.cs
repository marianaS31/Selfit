namespace SelFit.Models.Product;

public class ProductMeasurementModel
{
    public Guid Id { get; set; }
    public Guid ProductId { get; set; }
    public string MeasurementType { get; set; }
    public decimal Value { get; set; }
    public ProductModel Product { get; set; }
}