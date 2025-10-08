import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import {
  getSellerByIdEmail,
  createOrder,
  contactSeller,
} from '../../services/AuthService';
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import loadingIcon from '../../assets/icons/loadingContact.gif';
import { Image } from 'react-native';
import MessageModal from './OrderMessageModal';
const ProductCustomization = () => {
  const route = useRoute();
  const { product, sellerId, productId } = route.params;
  const navigation = useNavigation();

  const [error, setError] = useState(null);
  const [customMeasurements, setCustomMeasurements] = useState([]);
  const [isOrderCreated, setIsOrderCreated] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [sellerEmail, setSellerEmail] = useState(null);
  const [loadingMessage, setLoadingMessage] = useState(false);
  const [isOrderCreating, setIsOrderCreating] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [isMessageSent, setIsMessageSent] = useState(false);

  const customerId = AsyncStorage.getItem('userID');
  const customerEmail = AsyncStorage.getItem('email');

  useEffect(() => {
    const fetchSellerEmail = async () => {
      try {
        const email = await getSellerByIdEmail(sellerId);
        setSellerEmail(email);
      } catch (err) {
        setError('Failed to fetch seller email');
      }
    };

    if (sellerId) {
      fetchSellerEmail();
    }
  }, [sellerId]);

  const handleMeasurementChange = (index, value) => {
    // check if order is created
    if (isOrderCreated) return;
    //let user in input values
    const updatedMeasurements = [...customMeasurements];
    updatedMeasurements[index] = value;
    setCustomMeasurements(updatedMeasurements);
  };

  const validateForm = () => {
    const newValidationErrors = {};

    product.Measurements.forEach((measurement, index) => {
      const customMeasurement = customMeasurements[index];

      if (!customMeasurement) {
        newValidationErrors[
          `measurement${index}`
        ] = `${measurement.MeasurementType} is required`;
      }

      if (!customMeasurement) {
        newValidationErrors[`measurement${index}`] = `Input is required`;
      } else if (customMeasurement.length < 1) {
        newValidationErrors[`measurement${index}`] =
          'Must be at least 1 character';
      } else if (!/^\d+(\.\d+)?$/.test(customMeasurement)) {
        newValidationErrors[`measurement${index}`] = `Please enter a number.`;
      } else if (parseFloat(customMeasurement) > 150) {
        newValidationErrors[`measurement${index}`] =
          'Value cannot be more than 150 ';
      } else if (parseFloat(customMeasurement) < 1) {
        newValidationErrors[`measurement${index}`] =
          'Value cannot be less than 1 ';
      }
    });

    setValidationErrors(newValidationErrors);
    return Object.keys(newValidationErrors).length === 0;
  };

  const handleCreateOrder = async () => {
    if (isOrderCreated || isOrderCreating) {
      return;
    }

    if (!validateForm()) {
      return;
    }

    setError(null);
    setIsOrderCreating(true);

    try {
      const orderDto = {
        CustomerId: customerId._j,
        SellerId: sellerId,
        ProductId: productId,
        BaseColor: product.Color,
        BaseMaterial: product.Material,
        Measurements: product.Measurements.map((measurement, index) => ({
          MeasurementType: measurement.MeasurementType,
          Value: customMeasurements[index],
        })),
      };
      await createOrder(orderDto);
      setIsOrderCreated(true);
    } catch (error) {
      setError('Failed to create order. Please try again later.');
    } finally {
      setIsOrderCreating(false);
    }
  };

  useEffect(() => {
    const fetchSellerEmail = async () => {
      try {
        const email = await getSellerByIdEmail(sellerId);
        setSellerEmail(email);
      } catch (error) {
        setError('Failed to fetch seller email');
      }
    };

    if (sellerId) {
      fetchSellerEmail();
    }
  }, [sellerId]);

  const handleOpenMessageModal = () => {
    if (!isMessageSent) {
      setIsMessageModalOpen(true);
    }
  };

  const handleCloseMessageModal = () => {
    setIsMessageModalOpen(false);
  };

  const handleSendMessage = async (message) => {
    setLoadingMessage(true);

    try {
      const contactSellerDto = {
        Message: message,
        ProductId: productId,
        SellerEmail: sellerEmail,
        CustomerEmail: customerEmail._j,
      };
      await contactSeller(contactSellerDto);
      setIsMessageSent(true);
      setIsMessageModalOpen(false);
    } catch (err) {
      setError('Failed to send message');
      setIsMessageSent(false);
    } finally {
      setLoadingMessage(false);
    }
  };
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>{product.Name} CUSTOMIZATION</Text>

        <Text style={styles.info}>
          Customize your product by entering your measurements below (in
          centimeters)
        </Text>

        {product.Measurements.map((measurement, index) => (
          <View key={index} style={styles.inputGroup}>
            <TextInput
              style={[
                styles.input,
                validationErrors[`measurement${index}`] && styles.inputError,
              ]}
              value={customMeasurements[index] || ''}
              onChangeText={(value) => handleMeasurementChange(index, value)}
              placeholder={measurement.MeasurementType}
              placeholderTextColor="#6e6e6e"
              editable={!isOrderCreated}
            />
            {validationErrors[`measurement${index}`] && (
              <Text style={styles.errorMessage}>
                {validationErrors[`measurement${index}`]}
              </Text>
            )}
          </View>
        ))}
        <TouchableOpacity
          style={[
            styles.button,
            styles.createOrderButton,
            isOrderCreated && styles.disabledButton,
          ]}
          onPress={handleCreateOrder}
          disabled={isOrderCreated}
        >
          <Text style={styles.buttonText}>
            {isOrderCreated ? 'ORDER CREATED' : 'CREATE ORDER'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button,
            styles.contactSellerButton,
            isMessageSent && styles.disabledButton,
          ]}
          onPress={handleOpenMessageModal}
          disabled={isMessageSent || loadingMessage}
        >
          {loadingMessage && (
            <Image
              source={loadingIcon}
              style={styles.loadingIcon}
              resizeMode="contain"
            />
          )}
          <Text style={styles.buttonText}>
            {isMessageSent
              ? 'MESSAGE SENT'
              : loadingMessage
              ? 'SENDING...'
              : 'CONTACT SELLER'}
          </Text>
        </TouchableOpacity>

        {isOrderCreated && (
          <TouchableOpacity
            style={[styles.button, styles.viewOrdersButton]}
            onPress={() =>
              navigation.navigate('ViewAllCustomerOrders', customerId)
            }
          >
            <Text style={styles.buttonText}>View Your Orders</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[styles.button, styles.goBackButton]}
          onPress={() => navigation.goBack()}
        >
          <Text style={[styles.buttonText, styles.backButtonText]}>
            GO BACK
          </Text>
        </TouchableOpacity>
      </View>
      <MessageModal
        isOpen={isMessageModalOpen}
        onClose={handleCloseMessageModal}
        onSend={handleSendMessage}
      />
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  formContainer: {
    width: '65%',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 10,
  },

  info: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',
  },
  inputGroup: {
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 5,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  errorMessage: {
    color: 'red',
    fontSize: 14,
    marginBottom: -10,
  },
  button: {
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 15,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  createOrderButton: {
    backgroundColor: '#4a4a4a',
  },
  loadingIcon: {
    width: 30,
    height: 30,
    marginRight: 5,
  },
  viewOrdersButton: {
    backgroundColor: '#29253E',
  },
  goBackButton: {
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#000000',
  },
  contactSellerButton: {
    backgroundColor: '#000000',
    gap: 10,
  },
  backButtonText: {
    color: '#000000',
  },
  disabledButton: {
    backgroundColor: '#cccccc',
  },
});

export default ProductCustomization;
