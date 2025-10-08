import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const SellerCard = ({ sellerName, imageUrl, sellerId, seller }) => {
  const [imageError, setImageError] = useState(false);
  const navigation = useNavigation();

  const handleCardClick = () => {
    navigation.navigate('SellerDetails', {
      sellerId: sellerId,
      seller: seller,
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
            imageError || !imageUrl
              ? require('../../assets/images/no-image.jpg')
              : { uri: imageUrl }
          }
          style={styles.image}
          onError={() => setImageError(true)}
        />
      </View>
      <Text style={styles.name}>
        {getShortenedName(sellerName) || 'Seller'}
      </Text>
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    color: '#666',
    fontSize: 14,
  },
  name: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    marginVertical: 10,
    paddingHorizontal: 8,
  },
});

export default SellerCard;
