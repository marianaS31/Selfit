import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { getSellers } from '../services/AuthService';
import SellerCard from '../components/seller/SellerCard';
import { ScrollView } from 'react-native-gesture-handler';

const SellerListPage = () => {
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
  }, []);

  return (
    <View style={styles.storeListContainer}>
      <Text style={styles.title}>Our Sellers</Text>
      <View style={styles.titleLine} />
      <ScrollView contentContainerStyle={styles.sellerListGrid}>
        {loading && <ActivityIndicator style={styles.loadingMessage} />}
        {error && <Text style={styles.errorMessage}>{error}</Text>}
        {sellers.map((seller, index) => (
          <SellerCard
            key={seller.UserID || index}
            seller={seller}
            sellerName={seller.Name}
            imageUrl={seller.ImageUrl}
            sellerId={seller.UserID}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  storeListContainer: {
    marginTop: 30,
    padding: 16,
    maxWidth: 1200,
    marginBottom: 50,
  },
  title: {
    fontSize: 24,
    marginBottom: 8,
    color: '#343a40',
    textAlign: 'center',
  },
  titleLine: {
    height: 1,
    backgroundColor: '#dee2e6',
    marginVertical: 16,
  },
  sellerList: {
    padding: 16,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  sellerListGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingBottom: 60,
  },
  errorMessage: {
    color: '#dc3545',
    marginBottom: 16,
    textAlign: 'center',
  },
  loadingMessage: {
    marginBottom: 16,
    alignSelf: 'center',
  },
});

export default SellerListPage;
