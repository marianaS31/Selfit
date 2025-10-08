import React, { useState } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const SellerDetailsCard = ({ seller }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <View style={styles.card}>
      <Image
        source={
          imageError || !seller?.ImageUrl
            ? require('../../assets/images/no-image.jpg')
            : { uri: seller.ImageUrl }
        }
        style={styles.image}
        onError={() => setImageError(true)}
      />
      <Text style={styles.name}>{seller?.Name || 'Seller'}</Text>
      <Text style={styles.description}>
        {seller?.Description || 'Empty description.'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    alignItems: 'center',
    flex: 1,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 12,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 4,
  },
});

export default SellerDetailsCard;
