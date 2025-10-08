import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProduct } from '../../services/AuthService';
import { MaterialTypeEnum } from '../../enums/material/MaterialTypeEnum';
import '../../styles/createProduct.css';

function CreateProduct() {
  const navigate = useNavigate();
  const [productData, setProductData] = useState({
    name: '',
    description: '',
    price: 0,
    material: MaterialTypeEnum.Cotton,
    color: '',
    measurements: [],
    newMeasurement: '',
  });
  const [status, setStatus] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newValidationErrors = {};

    if (!productData.name) {
      newValidationErrors.name = 'Product name is required';
    }
    if (productData.name.length >= 16) {
      // for styling purposes
      newValidationErrors.name = 'Product name cannot exceed 16 characters';
    }

    if (!productData.description) {
      newValidationErrors.description = 'Product description is required';
    }
    if (productData.description.length < 10) {
      newValidationErrors.description = 'Product description has be longer';
    }

    if (!productData.price) {
      newValidationErrors.price = 'Price is required';
    }
    if (isNaN(productData.price) || productData.price <= 0) {
      newValidationErrors.price = 'Price must be greater than 0';
    }

    const colorRegex = /^[a-zA-Z\s]+$/;
    if (!productData.color) {
      newValidationErrors.color = 'Color is required';
    } else if (!colorRegex.test(productData.color)) {
      newValidationErrors.color = 'Color must contain only letters';
    }

    if (productData.measurements.length === 0) {
      newValidationErrors.measurements = 'At least one measurement is required';
    }

    setValidationErrors(newValidationErrors);
    return Object.keys(newValidationErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) {
      return;
    }

    if (validateForm()) {
      setIsSubmitting(true);
      const userId = localStorage.getItem('userID');

      const product = {
        Name: productData.name,
        Description: productData.description,
        Price: parseFloat(productData.price),
        ImageUrl: '',
        Material: productData.material,
        Color: productData.color,
        Measurements: productData.measurements,
      };

      try {
        await createProduct(userId, product);
        setStatus('Product created successfully.');
        // Navigate to all products page after successful creation
        navigate('/s/allProducts');
      } catch (error) {
        setStatus('Error creating product: ' + error.message);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const addMeasurement = () => {
    const measurementRegex = /^[a-zA-Z0-9 ]{1,12}$/;
    const newErrors = { ...validationErrors };

    if (!measurementRegex.test(productData.newMeasurement)) {
      newErrors.newMeasurement = '1-12 characters only';
    } else {
      delete newErrors.newMeasurement;
    }

    setValidationErrors(newErrors);

    if (!newErrors.newMeasurement) {
      setProductData((prevData) => ({
        ...prevData,
        measurements: [
          ...prevData.measurements,
          { MeasurementType: prevData.newMeasurement, Value: 0 },
        ],
        newMeasurement: '',
      }));
    }
  };

  const removeMeasurement = (index) => {
    setProductData((prevData) => ({
      ...prevData,
      measurements: prevData.measurements.filter((_, i) => i !== index),
    }));
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="create-product-container">
      <h1 className="create-product-title">Create Product</h1>
      <form onSubmit={handleSubmit} className="create-product-form">
        <div className="create-product-group">
          <input
            type="text"
            name="name"
            value={productData.name}
            onChange={handleChange}
            className="create-product-input"
            placeholder=" "
          />
          <label className="create-product-label">Name</label>
          {validationErrors.name && (
            <p className="create-product-error-message">
              {validationErrors.name}
            </p>
          )}
        </div>
        <div className="create-product-group">
          <textarea
            name="description"
            value={productData.description}
            onChange={handleChange}
            className="create-product-textarea"
            placeholder=" "
          />
          <label className="create-product-label-description">
            Description
          </label>
          {validationErrors.description && (
            <p className="create-product-error-message">
              {validationErrors.description}
            </p>
          )}
        </div>
        <div className="create-product-group">
          <input
            type="number"
            name="price"
            value={productData.price}
            onChange={handleChange}
            className="create-product-input"
            placeholder=" "
          />
          <label className="create-product-label">Price</label>
          {validationErrors.price && (
            <p className="create-product-error-message">
              {validationErrors.price}
            </p>
          )}
        </div>
        <div className="create-product-group">
          <select
            name="material"
            value={productData.material}
            onChange={handleChange}
            className="create-product-select"
          >
            {Object.values(MaterialTypeEnum).map((material) => (
              <option key={material} value={material}>
                {material}
              </option>
            ))}
          </select>
          <label className="create-product-label">Material</label>
        </div>
        <div className="create-product-group">
          <input
            type="text"
            name="color"
            value={productData.color}
            onChange={handleChange}
            className="create-product-input"
            placeholder=" "
          />
          <label className="create-product-label">Color</label>
          {validationErrors.color && (
            <p className="create-product-error-message">
              {validationErrors.color}
            </p>
          )}
        </div>
        <div className="create-product-group">
          <input
            type="text"
            name="newMeasurement"
            value={productData.newMeasurement}
            onChange={handleChange}
            className="create-product-input"
            placeholder=" "
          />
          <label className="create-product-label">Add Measurement</label>
          {(validationErrors.measurements ||
            validationErrors.newMeasurement) && (
            <p className="create-product-error-message">
              {validationErrors.measurements || validationErrors.newMeasurement}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={addMeasurement}
          className="create-product-submit"
        >
          Add
        </button>
        <div className="measurements-list">
          <h3>Measurements:</h3>
          <ul>
            {productData.measurements.map((measurement, index) => (
              <li key={index} className="measurement-item">
                {measurement.MeasurementType}
                <button
                  type="button"
                  onClick={() => removeMeasurement(index)}
                  className="remove-measurement"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
        <button
          type="submit"
          className="create-product-submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creating Product...' : 'Create Product'}
        </button>
        <button onClick={handleGoBack} className="go-back-button">
          GO BACK
        </button>
      </form>
      {status && <p className="status-message">{status}</p>}
    </div>
  );
}

export default CreateProduct;
