import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native'; // For getting params from navigation
import { getProductById } from '../services/AuthService'; // Service to fetch product details
import ProductView from '../components/product/ProductView'; // Component for displaying product info

const ProductPage = () => {
  const route = useRoute();
  const { productId, sellerId } = route.params; // Get productId and sellerId from navigation params
  const [product, setProduct] = useState(null); // State to store product info
  const [loading, setLoading] = useState(true); // State to manage loading state
  const [error, setError] = useState(null); // State to handle errors

  // Fetch product details on component mount
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const data = await getProductById(productId); // Fetch product by ID
        setProduct(data); // Set fetched product data
        setError(null); // Reset error if successful
      } catch (err) {
        setError('Failed to fetch product'); // Set error if failed to fetch data
      } finally {
        setLoading(false); // Stop loading after fetching
      }
    };

    fetchProduct(); // Call fetch function
  }, [productId]);

  return (
    <View style={styles.container}>
      {loading && <ActivityIndicator size="large" color="#0000ff" style={styles.loadingMessage} />}
      {error && <Text style={styles.errorMessage}>{error}</Text>}
      {!loading && product && <ProductView product={product} sellerId={sellerId} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    marginTop: 30,
    flexGrow: 1,
  },
  loadingMessage: {
    alignSelf: 'center',
  },
  errorMessage: {
    color: '#dc3545',
    textAlign: 'center',
  },
});

export default ProductPage;
