import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  createOrder,
  contactSeller,
  getSellerByIdEmail,
} from '../../services/AuthService';
import '../../styles/ProductCustomization.css';
import MessageModal from './OrderMessageModal';
import { MessageCircle } from 'lucide-react';
import loadingGif from '../../assets/icons/loading.gif';

const ProductCustomization = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [customMeasurements, setCustomMeasurements] = useState([]);
  const [isOrderCreated, setIsOrderCreated] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [sellerEmail, setSellerEmail] = useState(null);

  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [isMessageSent, setIsMessageSent] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState(false);
  const [isOrderCreating, setIsOrderCreating] = useState(false);

  const { sellerId, productId } = useParams();

  const seller = location.state?.seller || { UserID: sellerId };
  const product = location.state?.product || { ProductId: productId };

  const customerId = localStorage.getItem('userID');

  useEffect(() => {
    const fetchSellerEmail = async () => {
      try {
        const email = await getSellerByIdEmail(sellerId);
        setSellerEmail(email);
      } catch (error) {
        console.error('Failed to fetch seller email:', error);
      }
    };

    if (sellerId) {
      fetchSellerEmail();
    }
  }, [sellerId]);

  const handleMeasurementChange = (index, value) => {
    // check if order is created
    if (isOrderCreated) return;
    //let user in input values
    const updatedMeasurements = [...customMeasurements];
    updatedMeasurements[index] = value;
    setCustomMeasurements(updatedMeasurements);
  };

  const validateForm = () => {
    const newValidationErrors = {};

    product.Measurements.forEach((measurement, index) => {
      const customMeasurement = customMeasurements[index];

      // Check if the measurement is empty
      if (!customMeasurement) {
        newValidationErrors[
          `measurement${index}`
        ] = `${measurement.MeasurementType} is required`;
      }

      // Check string length (min/max length can be set as per your need)
      if (!customMeasurement) {
        newValidationErrors[`measurement${index}`] = `Input is required`;
      } else if (customMeasurement.length < 1) {
        newValidationErrors[`measurement${index}`] =
          'Must be at least 1 character';
      } else if (!/^\d+(\.\d+)?$/.test(customMeasurement)) {
        newValidationErrors[`measurement${index}`] = `Please enter a number.`;
      } else if (parseFloat(customMeasurement) > 150) {
        newValidationErrors[`measurement${index}`] =
          'Value cannot cannot be more than 150 ';
      } else if (parseFloat(customMeasurement) < 1) {
        newValidationErrors[`measurement${index}`] =
          'Value cannot be less than 1 ';
      }
    });

    setValidationErrors(newValidationErrors);
    return Object.keys(newValidationErrors).length === 0;
  };

  const handleCreateOrderSubmit = async (e) => {
    e.preventDefault();

    if (isOrderCreated || isOrderCreating) {
      return;
    }

    if (!validateForm()) {
      return;
    }

    setError(null);
    setIsOrderCreating(true);

    try {
      const orderDto = {
        CustomerId: customerId,
        SellerId: sellerId,
        ProductId: productId,
        BaseColor: product.Color,
        BaseMaterial: product.Material,
        Measurements: product.Measurements.map((measurement, index) => ({
          MeasurementType: measurement.MeasurementType,
          Value: customMeasurements[index],
        })),
      };

      await createOrder(orderDto);
      setIsOrderCreated(true);
    } catch (error) {
      console.error('Order creation failed ', error);
      setError('Failed to create order. Please try again later.');
    } finally {
      setIsOrderCreating(false);
    }
  };

  const handleOpenMessageModal = () => {
    if (!isMessageSent) {
      setIsMessageModalOpen(true);
    }
  };

  const handleCloseMessageModal = () => {
    setIsMessageModalOpen(false);
  };

  const handleSendMessage = async (message) => {
    setLoadingMessage(true);

    try {
      const contactSellerDto = {
        Message: message,
        ProductID: productId,
        SellerEmail: sellerEmail,
        CustomerEmail: localStorage.getItem('email'),
      };

      await contactSeller(contactSellerDto);
      setIsMessageSent(true);
      handleCloseMessageModal();
    } catch (err) {
      console.error('Failed to send message:', err);
      setIsMessageSent(false);
    } finally {
      setLoadingMessage(false);
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleViewOrders = () => {
    navigate(`/c/orders/${customerId}`);
  };

  return (
    <div className="product-customization-container">
      <div className="product-customization-form">
        <h2 className="product-customization-title">
          {product.Name} CUSTOMIZATION
        </h2>

        <div className="product-customization-info-container">
          <p className="product-customization-info">
            Customize your product by entering your measurements below (in
            centimeters)
          </p>
        </div>
        <form onSubmit={handleCreateOrderSubmit}>
          {product.Measurements.map((measurement, index) => (
            <div key={index} className="product-customization-group">
              <input
                type="text"
                value={customMeasurements[index] || ''}
                onChange={(e) => handleMeasurementChange(index, e.target.value)}
                placeholder=" "
                className="product-customization-input"
                disabled={isOrderCreated}
              />
              <label className="product-customization-label">
                {measurement.MeasurementType}
              </label>
              {validationErrors[`measurement${index}`] && (
                <p className="product-error-message">
                  {validationErrors[`measurement${index}`]}
                </p>
              )}
            </div>
          ))}

          <button
            type="submit"
            className="product-customization-submit"
            disabled={isOrderCreated || isOrderCreating}
          >
            {isOrderCreating ? (
              <img src={loadingGif} alt="Loading..." className="loading-gif" />
            ) : isOrderCreated ? (
              'ORDER CREATED'
            ) : (
              'CREATE ORDER'
            )}
          </button>
        </form>

        <button
          onClick={handleOpenMessageModal}
          className="contact-seller-button"
          disabled={isMessageSent || loadingMessage}
        >
          {loadingMessage ? (
            <img src={loadingGif} alt="Loading..." className="loading-gif" />
          ) : (
            <MessageCircle className="contact-seller-icon" />
          )}
          {isMessageSent ? 'MESSAGE SENT!' : 'CONTACT SELLER'}
        </button>
        <MessageModal
          isOpen={isMessageModalOpen}
          onClose={handleCloseMessageModal}
          onSend={handleSendMessage}
        />

        {isOrderCreated && (
          <button onClick={handleViewOrders} className="view-orders-button">
            View Your Orders
          </button>
        )}
        <button onClick={handleGoBack} className="go-back-button">
          GO BACK
        </button>
      </div>
    </div>
  );
};
export default ProductCustomization;
