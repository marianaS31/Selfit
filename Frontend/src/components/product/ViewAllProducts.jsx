import React, { useState, useEffect } from 'react';
import { getAllProducts, deleteProducts } from '../../services/AuthService';
import EditProductModal from './EditProductModal';
import ProductImageHandler from './ProductImageHandler';
import '../../styles/viewAllProducts.css';

function ViewAllProducts() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const sellerId = localStorage.getItem('userID');

  useEffect(() => {
    fetchProducts();
  }, [sellerId]);

  const fetchProducts = async () => {
    try {
      const data = await getAllProducts(sellerId);
      setProducts(data);
    } catch (err) {
      if (err.response && err.response.status === 400) {
        setError('Failed to get all products');
        setError(err.response.data || 'No products were found.');
      } else {
        setError('Failed to fetch products');
      }
    }
  };

  const handleDelete = async (product, e) => {
    if (e) {
      e.stopPropagation();
    }

    try {
      await deleteProducts(product.ProductId);
      //refresh products after deleting
      await fetchProducts();
    } catch (err) {
      setError('Failed to delete product');
    }
  };

  const handleEdit = (product, e) => {
    // ensure event propagation is stopped
    if (e) {
      e.stopPropagation();
    }
    setEditingProduct(product);
  };

  const handleCardClick = (product) => {
    setSelectedProduct(selectedProduct === product ? null : product);
  };

  const handleProductUpdate = async () => {
    await fetchProducts();
    setEditingProduct(null);
  };

  if (error)
    return (
      <div className="store-products-error-message-no-products-found">
        {error}
      </div>
    );
  if (products.length === 0) return <p>No products found.</p>;

  return (
    <div className="store-products-container">
      <h1 className="store-products-title">All Products</h1>

      <div className="store-products-grid">
        {products.map((product) => (
          <div
            key={product.ProductId}
            className={`store-product-card ${
              selectedProduct === product ? 'store-product-card-selected' : ''
            }`}
            onClick={() => handleCardClick(product)}
          >
            <h2 className="store-product-name">{product.Name}</h2>

            <div className="store-product-details">
              <p>Description: {product.Description}</p>
              <p>Price: {product.Price}€</p>
              <p>Product ID: {product.ProductId}</p>
              <p>Material: {product.Material}</p>
              <p>Color: {product.Color}</p>
            </div>

            {/* Only show these when expanded */}
            {selectedProduct === product && (
              <div
                className="store-expanded-content"
                onClick={(e) => e.stopPropagation()} // Crucial stop propagation
              >
                <button
                  onClick={(e) => handleEdit(product, e)}
                  className="store-expand-edit-button"
                >
                  Edit Product
                </button>

                <button
                  onClick={(e) => handleDelete(product, e)}
                  className="store-delete-product-button"
                >
                  Delete Product
                </button>

                <ProductImageHandler
                  product={product}
                  onImageUpdate={() => getAllProducts(sellerId)}
                />

                {product.Measurements?.length > 0 && (
                  <div className="store-product-measurements">
                    <h4>Measurements:</h4>
                    {product.Measurements.map((measurement, index) => (
                      <p key={index}>{measurement.MeasurementType}</p>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {editingProduct && (
        <EditProductModal
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
          onUpdate={handleProductUpdate}
        />
      )}
    </div>
  );
}

export default ViewAllProducts;
