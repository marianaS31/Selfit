import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { getOrderByCustomer } from '../../services/AuthService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoute } from '@react-navigation/native';

const ViewAllCustomerOrders = () => {
  const route = useRoute();
  const { customerId } = route.params;
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const customerId = await AsyncStorage.getItem('userID');
        const data = await getOrderByCustomer(customerId);
        setOrders(data);
      } catch (err) {
        setError('No orders were found');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleOrderClick = (order) => {
    setSelectedOrder(order);
  };

  return (
    <ScrollView style={styles.customerOrdersContainer}>
      <View style={styles.customerOrdersContent}>
        <Text style={styles.customerOrdersTitle}>MY ORDERS</Text>
        <View style={styles.customerOrdersInfoContainer}>
          <Text style={styles.customerOrdersInfo}>
            View and track all your orders in one place
          </Text>
        </View>

        {isLoading && (
          <View style={styles.loadingMessage}>
            <Text>Loading orders...</Text>
          </View>
        )}

        {error && (
          <View style={styles.errorMessage}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {!isLoading && !error && (
          <View style={styles.customerOrdersList}>
            {orders.map((order) => (
              <TouchableOpacity
                key={order.Id}
                style={[
                  styles.customerOrderCard,
                  selectedOrder?.Id === order.Id && styles.selectedOrderCard,
                ]}
                onPress={() => handleOrderClick(order)}
              >
                <Text style={styles.customerProductName}>
                  {order.Product.Name}
                </Text>
                <View style={styles.customerProductDetails}>
                  <Text>Price: {order.Product.Price}€</Text>
                  <Text>Color: {order.Product.Color}</Text>
                  <Text>Material: {order.Product.Material}</Text>
                  <Text style={[styles.orderStatus]}>
                    Status:
                    <Text style={styles[`status${order.OrderStatus}`]}>
                      {' '}
                      {order.OrderStatus}
                    </Text>
                  </Text>
                </View>

                {selectedOrder?.Id === order.Id && (
                  <View style={styles.expandedOrderDetails}>
                    <View style={styles.customerDetailsSection}>
                      <Text style={styles.sectionTitle}>
                        Customer Information
                      </Text>
                      <Text>Full Name: {order.Customer.FullName || 'N/A'}</Text>
                      <Text>Email: {order.Customer.Email}</Text>
                      <Text>Phone: {order.Customer.PhoneNumber || 'N/A'}</Text>
                      <Text>Address: {order.Customer.Address || 'N/A'}</Text>
                      <Text>City: {order.Customer.City || 'N/A'}</Text>
                      <Text>ZIP: {order.Customer.Zip || 'N/A'}</Text>
                    </View>

                    <View style={styles.customerDetailsSection}>
                      <Text style={styles.sectionTitle}>
                        Seller Information
                      </Text>
                      <Text>Name: {order.Seller.Name || 'N/A'}</Text>
                    </View>

                    <View style={styles.customerDetailsSection}>
                      <Text style={styles.sectionTitle}>
                        Custom Measurements
                      </Text>
                      {order.CustomMeasurements.map((measurement, index) => (
                        <Text key={index}>
                          {measurement.MeasurementType}: {measurement.Value}
                        </Text>
                      ))}
                    </View>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  customerOrdersContainer: {
    flex: 1,
    paddingTop: 50,
    marginBottom: 50,
  },
  customerOrdersContent: {
    paddingHorizontal: 20,
    paddingVertical: 50,
  },
  customerOrdersTitle: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 10,
    fontWeight: '600',
  },
  customerOrdersInfoContainer: {
    alignItems: 'center',
  },
  customerOrdersInfo: {
    textAlign: 'center',
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  customerOrdersList: {
    marginBottom: 20,
  },
  customerOrderCard: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 15,
    marginBottom: 10,
  },
  selectedOrderCard: {
    borderColor: '#000000',
    backgroundColor: '#f8f8f8',
  },
  customerProductName: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 10,
  },

  statusPending: {
    color: '#ffa500',
  },
  statusProcessing: {
    color: '#1e90ff',
  },
  statusShipped: {
    color: '#32cd32',
  },
  statusDelivered: {
    color: '#008000',
  },
  statusCancelled: {
    color: '#ff0000',
  },

  loadingMessage: {
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: 'red',
  },
  customerOrderDetailsTitle: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 15,
  },
  customerDetailsSection: {},
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 10,
  },
});

export default ViewAllCustomerOrders;
