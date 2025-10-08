import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { getProductsBySellerId } from '../../services/AuthService';
import { useNavigate } from 'react-router-dom';
import '../../styles/ViewAllProducts.css';
const SellerProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const { sellerId } = useParams();
  const location = useLocation();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const productsData = await getProductsBySellerId(sellerId);
        setProducts(productsData);
      } catch (err) {
        if (err.response && err.response.status === 400) {
          console.log('Unable to fetch products, not found');
        } else {
          console.error('An unexpected error occurred. Please try again.');
        }
        setError('No products found or network issue.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [sellerId]);

  // Get seller name from navigation state
  const seller = location.state?.seller || 'Seller';

  const handleProductClick = (product) => {
    navigate(`/c/seller/${sellerId}/product/${product.ProductId}/customize`, {
      state: { seller: seller, productId: product },
    });
  };
  const handleGoBack = () => {
    navigate(-1); // Goes back to the previous page
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error"> {error}</div>;

  return (
    <div className="seller-products">
      <div className="seller-products-header">
        <div className="go-back-button-container">
          <button onClick={handleGoBack} className="seller-go-back-button">
            Go back
          </button>
        </div>
        <div className="seller-products-title-container">
          <h3 className="seller-products-title">Product Catalog</h3>
        </div>
      </div>
      {products.length === 0 ? (
        <p className="no-products">No products available.</p>
      ) : (
        <div className="product-grid">
          {products.map((product) => (
            <div
              key={product.Id}
              className="product-item"
              onClick={() => {
                handleProductClick(product);
              }}
            >
              <div className="product-image">
                {product.ImageUrl ? (
                  <img
                    src={product.ImageUrl}
                    alt={product.Name}
                    className="product-image-img"
                  />
                ) : (
                  <div className="product-image-placeholder">
                    <span>No image</span>
                  </div>
                )}
              </div>
              <div className="product-details">
                <div className="product-name">{product.Name}</div>
                <div className="product-price">${product.Price.toFixed(2)}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SellerProducts;
