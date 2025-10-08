import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Button,
  ScrollView,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';

const ProductView = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [imageError, setImageError] = useState(false);
  const navigation = useNavigation();
  const route = useRoute();
  const { sellerId, productId, product } = route.params;

  const openImageModal = () => {
    setModalVisible(true);
  };

  const closeImageModal = () => {
    setModalVisible(false);
  };

  return (
    <View style={styles.productContainer}>
      <TouchableOpacity onPress={openImageModal}>
        <Image
          source={
            imageError || !product?.ImageUrl
              ? require('../../assets/images/no-image.jpg')
              : { uri: product.ImageUrl }
          }
          style={styles.productImage}
          onError={() => setImageError(true)}
        />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={closeImageModal}
      >
        <TouchableOpacity
          style={styles.modalBackground}
          onPress={closeImageModal}
        >
          <View style={styles.modalContainer}>
            <Image
              source={
                imageError || !product?.ImageUrl
                  ? require('../../assets/images/no-image.jpg')
                  : { uri: product.ImageUrl }
              }
              style={styles.productImage}
              onError={() => setImageError(true)}
            />
          </View>
        </TouchableOpacity>
      </Modal>

      <Text style={styles.productName}>{product.Name}</Text>
      <Text style={styles.productPrice}>{`${product.Price.toFixed(2)} €`}</Text>
      <View style={styles.titleLine} />
      <ScrollView style={styles.descriptionContainer}>
        <Text style={styles.productDescription}>{product.Description}</Text>
      </ScrollView>
      <TouchableOpacity
        style={styles.itemButton}
        onPress={() =>
          navigation.navigate('ProductCustomization', {
            sellerId: sellerId,
            product: product,
            productId: productId,
          })
        }
      >
        <Text style={styles.itemButtonText}>Select Item</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  productContainer: {
    alignItems: 'center',
    padding: 16,
  },
  titleLine: {
    height: 1,
    backgroundColor: '#dee2e6',
    width: '90%',
    marginVertical: 16,
  },
  productImage: {
    width: 300,
    height: 300,
    borderRadius: 8,
    marginBottom: 16,
    resizeMode: 'contain',
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 18,
    color: '#28a745',
    marginBottom: 12,
  },
  productDescription: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  descriptionContainer: {
    maxHeight: '20%',
    width: '90%',
    marginBottom: 20,
  },
  modalContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '90%',
    height: '80%',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  fullImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    borderRadius: 8,
  },
  itemButton: {
    backgroundColor: '#000000',
    marginBottom: 15,
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
  },
  itemButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
});

export default ProductView;
