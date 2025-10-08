import React, { useState, useEffect } from 'react';
import '../../styles/viewAllSellerInfoButton.css';
import { getSellerById } from '../../services/AuthService';

const ViewAllSellerInfoButton = ({ sellerId }) => {
  const [showInfo, setShowInfo] = useState(false);
  const [sellerData, setSellerData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (showInfo && sellerId) {
      const fetchSellerData = async () => {
        setLoading(true);
        try {
          const data = await getSellerById(sellerId);
          setSellerData(data);
        } catch (err) {
          setError('Failed to fetch seller data');
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchSellerData();
    }
  }, [showInfo, sellerId]);

  const toggleInfo = (e) => {
    e.preventDefault();
    setShowInfo(!showInfo); // Toggle visibility of seller information
  };

  const getFieldValue = (field) => {
    return field ? field : 'N/A';
  };

  return (
    <div className="view-all-seller-info">
      <button
        type="button"
        onClick={toggleInfo}
        className="view-all-seller-info-button"
      >
        {showInfo ? 'Hide' : 'View'} All Information
      </button>
      {showInfo && (
        <div className="info-modal">
          <h3>Seller Information</h3>
          {loading && <p>Loading...</p>}
          {error && <p className="error">{error}</p>}
          {sellerData && (
            <>
              <p>
                <strong>Name:</strong>{' '}
                {getFieldValue(sellerData.Name)}
              </p>
              <p>
                <strong>Description:</strong>{' '}
                {getFieldValue(sellerData.Description)}
              </p>
            </>
          )}
          <button
            onClick={toggleInfo}
            className="close-all-seller-info-button"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default ViewAllSellerInfoButton;
