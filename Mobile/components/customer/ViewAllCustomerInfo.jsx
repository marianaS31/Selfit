import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { getCustomerById } from '../../services/AuthService'; // Ensure this method works for React Native

const ViewAllCustomerInfo = ({ customerId }) => {
  const [customerData, setCustomerData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCustomerData = async () => {
      setLoading(true);
      try {
        const data = await getCustomerById(customerId);
        setCustomerData(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch customer data');
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerData();
  }, [customerId]);

  const getFieldValue = (field) => (field ? field : 'N/A');

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Customer Information</Text>
      {customerData ? (
        <>
          <Text style={styles.info}>
            <Text style={styles.label}>Full Name: </Text>
            {getFieldValue(customerData.FullName)}
          </Text>
          <Text style={styles.info}>
            <Text style={styles.label}>Phone Number: </Text>
            {getFieldValue(customerData.PhoneNumber)}
          </Text>
          <Text style={styles.info}>
            <Text style={styles.label}>Address: </Text>
            {getFieldValue(customerData.Address)}
          </Text>
          <Text style={styles.info}>
            <Text style={styles.label}>ZIP Code: </Text>
            {getFieldValue(customerData.Zip)}
          </Text>
          <Text style={styles.info}>
            <Text style={styles.label}>City: </Text>
            {getFieldValue(customerData.City)}
          </Text>
          <Text style={styles.info}>
            <Text style={styles.label}>Email: </Text>
            {getFieldValue(customerData.Email)}
          </Text>
        </>
      ) : (
        <Text style={styles.info}>No customer data available</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    marginVertical: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  info: {
    fontSize: 16,
    marginVertical: 5,
  },
  label: {
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default ViewAllCustomerInfo;
