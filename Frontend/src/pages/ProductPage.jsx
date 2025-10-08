import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getProductById } from '../services/AuthService';
import ProductView from '../components/product/ProductView';

const ProductPage = () => {
  const { productId, sellerId } = useParams();
  const [product, setProduct] = useState([]); //state to store product info
  const [loading, setLoading] = useState(true); // state to manage loading state
  const [error, setError] = useState(null); //state to handle errors

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const data = await getProductById(productId);
        setProduct(data);
        setError(null);
        console.log(data);
      } catch (err) {
        setError('Failed to fetch product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  return (
    <div className="product-view-container">
      {loading && <div className="loading-message">Loading...</div>}
      {error && <div className="error-message">{error}</div>}
      {!loading && product && (
        <>
          <ProductView product={product} />
        </>
      )}
    </div>
  );
};

export default ProductPage;
