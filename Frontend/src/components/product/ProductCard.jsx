import {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/productCard.css';

// eslint-disable-next-line react/prop-types
const ProductCard = ({productName, imageUrl, productPrice, productId, sellerId}) => {
    const [imageError, setImageError] = useState(false);
    const navigate = useNavigate();

    const handleCardClick = () => {
        if (!productId) {
            console.error("Invalid Product ID"); // Add error logging
            return;
        }
        navigate(`/c/seller/${sellerId}/product/${productId}`), {
            state: { productName: productName },
        };
    };

    return (
        <div className="product-card" onClick={handleCardClick}>
            <div className="product-card-image">
                {!imageError ? (
                <img
                    src={imageUrl} // Default image if no image URL provided
                    alt={productName || 'Product'} // Fallback if no name is provided
                    onError={() => setImageError(true)} // Handle image load error
                />
                ) : (
                <div className="product-card-placeholder">No Image</div> // Placeholder if image fails to load
                )}
            </div>
            <div className="product-card-details">
                <p className="product-card-name">{productName || 'Unnamed Product'}</p>
                <p className="product-card-price">{`${productPrice} €` || 'Price Unavailable'}</p>
            </div>
        </div>
    );
}

export default ProductCard;