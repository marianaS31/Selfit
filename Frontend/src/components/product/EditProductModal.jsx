import React, { useState } from 'react';
import { updateProducts } from '../../services/AuthService';
import { MaterialTypeEnum } from '../../enums/material/MaterialTypeEnum';
import '../../styles/editProductModal.css';

function EditProductModal({ product, onClose, onUpdate }) {
  const [formData, setFormData] = useState({
    Name: product.Name,
    Description: product.Description,
    Price: product.Price,
    Material: product.Material,
    Color: product.Color,
    Measurements: product.Measurements || [{ MeasurementType: '', Value: 0 }],
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const errors = {};
    const colorRegex = /^[a-zA-Z\s]+$/;

    if (!formData.Name || formData.Name.length > 16)
      errors.Name = formData.Name
        ? 'Product name cannot exceed 16 characters'
        : 'Product name is required';

    if (!formData.Description || formData.Description.length <= 10)
      errors.Description = formData.Description
        ? 'Product Description has to have more than 10 characters'
        : 'Product description is required';

    if (!formData.Price || isNaN(formData.Price) || formData.Price <= 0)
      errors.Price = 'Price must be greater than 0';

    if (!formData.Color || !colorRegex.test(formData.Color))
      errors.Color = !formData.Color
        ? 'Color is required'
        : 'Color must contain only letters';

    if (
      !formData.Measurements.length ||
      formData.Measurements.some((m) => !m.MeasurementType)
    ) {
      errors.Measurements = 'All measurement types must be filled';
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (validationErrors[name]) {
      setValidationErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleMeasurementChange = (index, value) => {
    const newMeasurements = formData.Measurements.map((m, i) =>
      i === index ? { ...m, MeasurementType: value } : m
    );

    setFormData((prev) => ({ ...prev, Measurements: newMeasurements }));

    if (validationErrors.Measurements) {
      setValidationErrors((prev) => ({ ...prev, Measurements: '' }));
    }
  };

  const addMeasurement = () => {
    setFormData((prev) => ({
      ...prev,
      Measurements: [...prev.Measurements, { MeasurementType: '', Value: 0 }],
    }));
  };

  const removeMeasurement = (index) => {
    if (formData.Measurements.length > 1) {
      setFormData((prev) => ({
        ...prev,
        Measurements: prev.Measurements.filter((_, i) => i !== index),
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      await updateProducts(product.ProductId, formData);
      onUpdate();
      onClose();
    } catch {
      setError('Failed to update product');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="store-product-edit-modal-container">
      <div className="store-product-edit-modal-content">
        <h2 className="store-product-edit-modal-title">Edit Product</h2>

        {error && (
          <div className="store-product-edit-error-message">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="store-product-edit-form">
          <div className="store-product-edit-form-group">
            <label className="store-product-edit-form-label">Name</label>
            <input
              type="text"
              name="Name"
              value={formData.Name}
              onChange={handleChange}
              className={`store-product-edit-form-input ${
                validationErrors.Name
                  ? 'store-product-edit-form-input--error'
                  : ''
              }`}
              placeholder="Enter product name"
            />
            {validationErrors.Name && (
              <div className="store-product-edit-validation-error">
                {validationErrors.Name}
              </div>
            )}
          </div>

          <div className="store-product-edit-form-group">
            <label className="store-product-edit-form-label">Description</label>
            <textarea
              name="Description"
              value={formData.Description}
              onChange={handleChange}
              className={`store-product-edit-form-input ${
                validationErrors.Description
                  ? 'store-product-edit-form-input--error'
                  : ''
              }`}
              placeholder="Describe your product"
            />
            {validationErrors.Description && (
              <div className="store-product-edit-validation-error">
                {validationErrors.Description}
              </div>
            )}
          </div>

          <div className="store-product-edit-form-group">
            <label className="store-product-edit-form-label">Price</label>
            <input
              type="number"
              name="Price"
              value={formData.Price}
              onChange={handleChange}
              className={`store-product-edit-form-input ${
                validationErrors.Price
                  ? 'store-product-edit-form-input--error'
                  : ''
              }`}
              placeholder="Enter price"
            />
            {validationErrors.Price && (
              <div className="store-product-edit-validation-error">
                {validationErrors.Price}
              </div>
            )}
          </div>

          <div className="store-product-edit-form-group">
            <label className="store-product-edit-form-label">Material</label>
            <select
              name="Material"
              value={formData.Material}
              onChange={handleChange}
              className="store-product-edit-form-input"
            >
              {Object.values(MaterialTypeEnum).map((material) => (
                <option key={material} value={material}>
                  {material}
                </option>
              ))}
            </select>
          </div>

          <div className="store-product-edit-form-group">
            <label className="store-product-edit-form-label">Color</label>
            <input
              type="text"
              name="Color"
              value={formData.Color}
              onChange={handleChange}
              className={`store-product-edit-form-input ${
                validationErrors.Color
                  ? 'store-product-edit-form-input--error'
                  : ''
              }`}
              placeholder="Enter color"
            />
            {validationErrors.Color && (
              <div className="store-product-edit-validation-error">
                {validationErrors.Color}
              </div>
            )}
          </div>

          <div className="store-product-edit-form-group">
            <label className="store-product-edit-form-label">
              Measurements
            </label>
            {validationErrors.Measurements && (
              <div className="store-product-edit-validation-error">
                {validationErrors.Measurements}
              </div>
            )}
            {formData.Measurements.map((measurement, index) => (
              <div key={index} className="store-product-edit-measurement-row">
                <input
                  type="text"
                  value={measurement.MeasurementType}
                  onChange={(e) =>
                    handleMeasurementChange(index, e.target.value)
                  }
                  className={`store-product-edit-form-input ${
                    validationErrors.Measurements
                      ? 'store-product-edit-form-input--error'
                      : ''
                  }`}
                  placeholder="Measurement Type"
                />
                <button
                  type="button"
                  onClick={() => removeMeasurement(index)}
                  className="store-product-edit-button store-product-edit-button--remove"
                  disabled={isSubmitting || formData.Measurements.length === 1}
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addMeasurement}
              className="store-product-edit-button store-product-edit-button--add"
              disabled={isSubmitting}
            >
              Add Measurement
            </button>
          </div>

          <div className="store-product-edit-form-actions">
            <button
              type="submit"
              className="store-product-edit-button store-product-edit-button--save"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="store-product-edit-button store-product-edit-button--cancel"
              disabled={isSubmitting}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProductModal;
