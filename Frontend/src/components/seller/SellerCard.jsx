import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/sellerCard.css';

const SellerCard = ({ sellerName, imageUrl, sellerId, seller }) => {
  const [imageError, setImageError] = useState(false);
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/c/seller/${sellerId}`, {
      state: { seller: seller },
    });
  };

  return (
    <div className="seller-card" onClick={handleCardClick}>
      <div className="seller-card-image">
        {!imageError ? (
          <img
            src={imageUrl}
            alt={sellerName || 'Seller'}
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="seller-card-placeholder">No Image</div>
        )}
      </div>
      <div className="seller-card-name">{sellerName || 'Seller'}</div>
    </div>
  );
};

export default SellerCard;
