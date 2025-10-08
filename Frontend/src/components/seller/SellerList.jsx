import { useState, useEffect } from 'react';
import SellerCard from './SellerCard';
import { getSellers } from '../../services/AuthService';
import '../../styles/sellerList.css';

const SellerList = () => {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSellers = async () => {
      setLoading(true);
      try {
        const data = await getSellers();
        setSellers(data);
        setError(null);
      } catch (err) {
        setError('Failed to load sellers');
      } finally {
        setLoading(false);
      }
    };

    fetchSellers();
  }, []); // only loads when page loads

  return (
    <div className="store-list-container">
      <h2 className="title">Our Sellers</h2>
      <p className="subtitle">
        Discover amazing products from our amazing sellers
      </p>
      <hr className="title-line-sellers" />
      <div className="seller-list">
        {loading && <div className="loading-message">Loading...</div>}
        {error && <div className="error-message">{error}</div>}

        <div className="seller-list-grid">
          {(() => {
            const sellerCards = [];
            for (let i = 0; i < sellers.length; i++) {
              const seller = sellers[i];
              sellerCards.push(
                <SellerCard
                  key={seller.UserID || i}
                  seller={seller}
                  sellerName={seller.Name}
                  imageUrl={seller.ImageUrl}
                  sellerId={seller.UserID}
                />
              );
            }
            return sellerCards;
          })()}
        </div>
      </div>
    </div>
  );
};

export default SellerList;
