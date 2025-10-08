import { useNavigate, useParams } from 'react-router-dom';
import '../../styles/productView.css';

const ProductView = ({ product }) => {
  const navigate = useNavigate();
  const { sellerId, productId } = useParams();
  const seller = location.state?.seller || 'Seller';

  const handleButtonClick = () => {
    navigate(`/c/seller/${sellerId}/product/${productId}/customize`, {
      state: { seller, product },
    });
  };

  return (
    <div className="product-details">
      <img
        src={product.ImageUrl || 'https://via.placeholder.com/200'}
        alt={product.Name || 'Unnamed Product'}
        className="product-individual-image"
      />
      <div className="product-details-text">
        <p className="product-individual-name">
          {product.Name || 'Unnamed Product'}
        </p>

        <p className="product-individual-price-title">BASE PRICE</p>
        <p className="product-individual-price-number">
          {`${product.Price.toFixed(2)} €` || 'Price unavailable'}
        </p>

        <hr className="title-line-product" />

        <p className="product-individual-description-title">DESCRIPTION</p>
        <p className="product-individual-description">
          {product.Description || 'No description available.'}
        </p>

        <hr className="title-line-product" />

        <p className="product-individual-description-title">MATERIAL</p>
        <p className="product-individual-material">
          {product.Material || 'No material available.'}
        </p>
        <button className="product-button" onClick={handleButtonClick}>
          Select Item
        </button>
      </div>
    </div>
  );
};

export default ProductView;
