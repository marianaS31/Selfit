import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { getCustomerById, updateCustomer } from '../../services/AuthService';
import ViewAllCustomerInfo from './ViewAllCustomerInfo';
import { useNavigation, useRoute } from '@react-navigation/native';

const CustomerProfileEdit = () => {
  const route = useRoute();
  const {customerId} = route.params;
  const [customerData, setCustomerData] = useState({
    fullName: '',
    phoneNumber: '',
    address: '',
    zip: '',
    city: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        const data = await getCustomerById(customerId);
        setCustomerData(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch customer data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCustomerData();
  }, [customerId]);

  const handleInputChange = (key, value) => {
    setCustomerData((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  const handleHomeButton = () => {
    navigation.navigate('SellerList');
  }

  const validateForm = () => {
    const newValidationErrors = {};

    if (!customerData.fullName) {
      newValidationErrors.fullName = 'Full name is required';
    } else if (customerData.fullName.length > 50) {
      newValidationErrors.fullName = 'Full name cannot exceed 50 characters';
    } else if (!/^[a-zA-Z\s'-.]+$/.test(customerData.fullName)) {
      newValidationErrors.fullName = 'Invalid letters in full name';
    }

    if (!customerData.phoneNumber) {
      newValidationErrors.phoneNumber = 'Phone number is required';
    } else if (!/^\+?[1-9]\d{8,14}$/.test(customerData.phoneNumber)) {
      newValidationErrors.phoneNumber =
        'Should start with a + followed by 8-15 digits';
    }

    if (!customerData.address) {
      newValidationErrors.address = 'Address is required';
    } else if (customerData.address.length > 255) {
      newValidationErrors.address = 'Address cannot exceed 255 characters';
    }

    if (!customerData.zip) {
      newValidationErrors.zip = 'ZIP code is required';
    } else if (!/^\d{4}(?:[-\s]\d{3})?$/.test(customerData.zip)) {
      newValidationErrors.zip =
        "Invalid ZIP code format ('1234' or '1234-567')";
    }

    if (!customerData.city) {
      newValidationErrors.city = 'City is required';
    } else if (customerData.city.length > 32) {
      newValidationErrors.city = 'City cannot exceed 32 characters';
    }

    setValidationErrors(newValidationErrors);
    return Object.keys(newValidationErrors).length === 0;
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage('');
    if (validateForm()) {
      try {
        await updateCustomer(customerId, customerData);
        setSuccessMessage('Customer information updated successfully');
      } catch (err) {
        setError('Failed to update customer information');
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity onPress={handleHomeButton}>
        <Text style={styles.homeButtonText}>{`< Home`}</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Edit My Profile</Text>

      <ViewAllCustomerInfo customerId={customerId} />

      <TextInput
        style={[styles.input, validationErrors.fullName && styles.errorInput]}
        placeholder="Full Name"
        value={customerData.fullName}
        onChangeText={(value) => handleInputChange('fullName', value)}
      />
      {validationErrors.fullName && <Text style={styles.errorText}>{validationErrors.fullName}</Text>}

      <TextInput
        style={[styles.input, validationErrors.phoneNumber && styles.errorInput]}
        placeholder="Phone Number"
        value={customerData.phoneNumber}
        onChangeText={(value) => handleInputChange('phoneNumber', value)}
      />
      {validationErrors.phoneNumber && <Text style={styles.errorText}>{validationErrors.phoneNumber}</Text>}

      <TextInput
        style={[styles.input, validationErrors.address && styles.errorInput]}
        placeholder="Address"
        value={customerData.address}
        onChangeText={(value) => handleInputChange('address', value)}
      />
      {validationErrors.address && <Text style={styles.errorText}>{validationErrors.address}</Text>}

      <TextInput
        style={[styles.input, validationErrors.zip && styles.errorInput]}
        placeholder="ZIP Code"
        value={customerData.zip}
        onChangeText={(value) => handleInputChange('zip', value)}
      />
      {validationErrors.zip && <Text style={styles.errorText}>{validationErrors.zip}</Text>}

      <TextInput
        style={[styles.input, validationErrors.city && styles.errorInput]}
        placeholder="City"
        value={customerData.city}
        onChangeText={(value) => handleInputChange('city', value)}
      />
      {validationErrors.city && <Text style={styles.errorText}>{validationErrors.city}</Text>}

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Update Profile</Text>
      </TouchableOpacity>

      {successMessage && <Text style={styles.successText}>{successMessage}</Text>}
      {error && <Text style={styles.errorText}>{error}</Text>}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#fff',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  errorInput: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: -10,
    marginBottom: 5,
  },
  successText: {
    color: 'green',
    textAlign: 'center',
    marginTop: 10,
  },
  submitButton: {
    backgroundColor: '#000000',
    marginBottom: 15,
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  homeButtonText: {
    fontWeight: 600,
  }
});

export default CustomerProfileEdit;
