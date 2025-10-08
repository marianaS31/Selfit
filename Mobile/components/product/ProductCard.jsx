import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';

const ProductCard = ({ product, sellerId }) => {
  const [imageError, setImageError] = useState(false);
  const navigation = useNavigation();

  const handleCardClick = () => {
    if (!product.ProductId) {
      setImageError('Invalid Product ID');
      return;
    }
    navigation.navigate('ProductDetails', {
      sellerId,
      productId: product.ProductId,
      product: product,
    });
  };

  const getShortenedName = (name, maxLength = 10) => {
    if (name.length > maxLength) {
      return `${name.substring(0, maxLength)}...`;
    }
    return name;
  };

  return (
    <TouchableOpacity style={styles.card} onPress={handleCardClick}>
      <View style={styles.imageContainer}>
        <Image
          source={
            imageError || !product?.ImageUrl
              ? require('../../assets/images/no-image.jpg')
              : { uri: product.ImageUrl }
          }
          style={styles.image}
          onError={() => setImageError(true)}
        />
      </View>
      <Text style={styles.productName}>
        {getShortenedName(product.Name) || 'Unnamed Product'}
      </Text>
      <Text style={styles.productPrice}>{`${product.Price.toFixed(2)} €`}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 120,
    alignItems: 'center',
    margin: 10,
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  imageContainer: {
    width: 120,
    height: 120,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'white',
    overflow: 'hidden',
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  placeholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#666',
    fontSize: 14,
  },
  productName: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    marginVertical: 4,
    paddingHorizontal: 8,
  },
  productPrice: {
    fontSize: 14,
    color: 'green',
    paddingBottom: 4,
  },
});

export default ProductCard;
