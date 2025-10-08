import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCustomerById, updateCustomer } from '../../services/AuthService';
import '../../styles/CustomerProfileEdit.css';
import Header from '../../layouts/Header/Header';
import ViewAllCustomerInfoButton from './ViewAllCustomerInfoButton';

function CustomerProfileEdit() {
  const [customerData, setCustomerData] = useState({
    fullName: '',
    phoneNumber: '',
    address: '',
    zip: '',
    city: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [showFullInfo, setShowFullInfo] = useState(false);

  const id = localStorage.getItem('userID');
  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        const data = await getCustomerById(id);
        setCustomerData(data);
      } catch (err) {
        setError('Failed to fetch customer data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCustomerData();
  }, [id]);

  const handleInputChange = (e) => {
    setCustomerData({
      ...customerData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    const newValidationErrors = {};

    if (!customerData.fullName) {
      newValidationErrors.fullName = 'Full name is required';
    } else if (customerData.fullName.length > 50) {
      newValidationErrors.fullName = 'Full name cannot exceed 50 characters';
    } else if (!/^[a-zA-Z\s'-.]+$/.test(customerData.fullName)) {
      newValidationErrors.fullName = 'Invalid letters in full name';
    }

    if (!customerData.phoneNumber) {
      newValidationErrors.phoneNumber = 'Phone number is required';
    } else if (!/^\+?[1-9]\d{8,14}$/.test(customerData.phoneNumber)) {
      newValidationErrors.phoneNumber =
        'Should start with a + followed by 8-15 digits';
    }

    if (!customerData.address) {
      newValidationErrors.address = 'Address is required';
    } else if (customerData.address.length > 255) {
      newValidationErrors.address = 'Address cannot exceed 255 characters';
    }

    if (!customerData.zip) {
      newValidationErrors.zip = 'ZIP code is required';
    } else if (!/^\d{4}(?:[-\s]\d{3})?$/.test(customerData.zip)) {
      newValidationErrors.zip =
        "Invalid ZIP code format ('1234' or '1234-567')";
    }

    if (!customerData.city) {
      newValidationErrors.city = 'City is required';
    } else if (customerData.city.length > 32) {
      newValidationErrors.city = 'City cannot exceed 32 characters';
    }

    setValidationErrors(newValidationErrors);
    return Object.keys(newValidationErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMessage('');
    if (validateForm()) {
      try {
        await updateCustomer(id, customerData);
        setSuccessMessage('Customer information updated successfully');
      } catch (err) {
        setError('Failed to update customer information');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleHomePageClick = () => {
    navigate('/c/sellerList');
  };
  return (
    <div className="customer-profile-edit-container">
      <Header />
      <div className="customer-profile-edit-form">
        <h2 className="customer-profile-edit-title">EDIT CUSTOMER PROFILE</h2>

        <div className="customer-profile-edit-info-container">
          <p className="customer-profile-edit-info">
            Update your personal information and keep your profile up to date
          </p>
        </div>
        <ViewAllCustomerInfoButton customerId={id} />
        <form onSubmit={handleSubmit}>
          <div className="customer-profile-edit-group">
            <input
              type="text"
              name="fullName"
              value={customerData.fullName}
              onChange={handleInputChange}
              placeholder=" "
              className={`customer-profile-edit-input ${
                validationErrors.fullName ? 'error' : ''
              }`}
            />
            <label className="customer-profile-edit-label">Full Name*</label>
            {validationErrors.fullName && (
              <p className="customer-edit-error-message">
                {validationErrors.fullName}
              </p>
            )}
          </div>

          <div className="customer-profile-edit-group">
            <input
              type="tel"
              name="phoneNumber"
              value={customerData.phoneNumber}
              onChange={handleInputChange}
              placeholder=" "
              className={`customer-profile-edit-input ${
                validationErrors.phoneNumber ? 'error' : ''
              }`}
            />
            <label className="customer-profile-edit-label">Phone Number*</label>
            {validationErrors.phoneNumber && (
              <p className="customer-edit-error-message">
                {validationErrors.phoneNumber}
              </p>
            )}
          </div>

          <div className="customer-profile-edit-group">
            <input
              type="text"
              name="address"
              value={customerData.address}
              onChange={handleInputChange}
              placeholder=" "
              className={`customer-profile-edit-input ${
                validationErrors.address ? 'error' : ''
              }`}
            />
            <label className="customer-profile-edit-label">Address*</label>
            {validationErrors.address && (
              <p className="customer-edit-error-message">
                {validationErrors.address}
              </p>
            )}
          </div>

          <div className="customer-profile-edit-group">
            <input
              type="text"
              name="zip"
              value={customerData.zip}
              onChange={handleInputChange}
              placeholder=" "
              className={`customer-profile-edit-input ${
                validationErrors.zip ? 'error' : ''
              }`}
            />
            <label className="customer-profile-edit-label">ZIP Code*</label>
            {validationErrors.zip && (
              <p className="customer-edit-error-message">
                {validationErrors.zip}
              </p>
            )}
          </div>

          <div className="customer-profile-edit-group">
            <input
              type="text"
              name="city"
              value={customerData.city}
              onChange={handleInputChange}
              placeholder=" "
              className={`customer-profile-edit-input ${
                validationErrors.city ? 'error' : ''
              }`}
            />
            <label className="customer-profile-edit-label">City*</label>
            {validationErrors.city && (
              <p className="customer-edit-error-message">
                {validationErrors.city}
              </p>
            )}
          </div>

          <button type="submit" className="customer-profile-edit-submit">
            UPDATE PROFILE
          </button>
        </form>
        <p className="go-back-home">
          Go back to{' '}
          <a
            href="/c/sellerList"
            onClick={handleHomePageClick}
            className="go-back-home-link"
          >
            Home Page
          </a>
        </p>
        {successMessage && (
          <div className="success-message">{successMessage}</div>
        )}
      </div>
    </div>
  );
}
export default CustomerProfileEdit;
