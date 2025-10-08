import React, { useState, useEffect } from 'react';
import '../../styles/viewAllCustomerInfoButton.css';
import { getCustomerById } from '../../services/AuthService';

const ViewAllCustomerInfoButton = ({ customerId }) => {
  const [showInfo, setShowInfo] = useState(false);
  const [customerData, setCustomerData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (showInfo && customerId) {
      const fetchCustomerData = async () => {
        setLoading(true);
        try {
          const data = await getCustomerById(customerId);
          setCustomerData(data);
        } catch (err) {
          setError('Failed to fetch customer data');
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchCustomerData();
    }
  }, [showInfo, customerId]);

  const toggleInfo = (e) => {
    e.preventDefault();
    setShowInfo(!showInfo); // Toggle visibility of customer information
  };

  const getFieldValue = (field) => {
    return field ? field : 'N/A';
  };

  return (
    <div className="view-all-customer-info">
      <button
        type="button"
        onClick={toggleInfo}
        className="view-all-customer-info-button"
      >
        {showInfo ? 'Hide' : 'View'} All Information
      </button>
      {showInfo && (
        <div className="info-modal">
          <h3>Customer Information</h3>
          {loading && <p>Loading...</p>}
          {error && <p className="error">{error}</p>}
          {customerData && (
            <>
              <p>
                <strong>Full Name:</strong>{' '}
                {getFieldValue(customerData.FullName)}
              </p>
              <p>
                <strong>Phone Number:</strong>{' '}
                {getFieldValue(customerData.PhoneNumber)}
              </p>
              <p>
                <strong>Address:</strong> {getFieldValue(customerData.Address)}
              </p>
              <p>
                <strong>ZIP Code:</strong> {getFieldValue(customerData.Zip)}
              </p>
              <p>
                <strong>City:</strong> {getFieldValue(customerData.City)}
              </p>
              <p>
                <strong>Email:</strong> {getFieldValue(customerData.Email)}
              </p>
            </>
          )}
          <button
            onClick={toggleInfo}
            className="close-all-customer-info-button"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default ViewAllCustomerInfoButton;
