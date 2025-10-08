import { useState, useEffect } from 'react';
import ProductCard from '../product/ProductCard.jsx';
import { useParams } from 'react-router-dom';
import '../../styles/productList.css';
import { getProductsBySellerId } from '../../services/AuthService.jsx';

const ProductList = () => {
  const { sellerId } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    //fetch product info
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const data = await getProductsBySellerId(sellerId);
        setProducts(data);
        setError(null);
      } catch (err) {
        setError('Products not found ');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [sellerId]);

  return (
    <>
      <h2 className="title">Our Items</h2>
      <hr className="title-line-products" />
      <div className="product-list">
        {loading && <div className="loading-message">Loading...</div>}
        {error && <div className="error-message">{error}</div>}

        <div className="product-list-grid">
          {(() => {
            const productCards = [];
            for (let i = 0; i < products.length; i++) {
              const product = products[i];
              productCards.push(
                <ProductCard
                  key={product.ProductId || i}
                  productId={product.ProductId}
                  sellerId={sellerId}
                  productName={product.Name}
                  imageUrl={product.ImageUrl}
                  productPrice={`${product.Price.toFixed(2)}`}
                />
              );
            }
            return productCards;
          })()}
        </div>
      </div>
    </>
  );
};

export default ProductList;
