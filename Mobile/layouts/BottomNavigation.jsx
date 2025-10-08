import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import logoutIcon from '../assets/icons/logout.png';
import ordersIcon from '../assets/icons/orders.png';
import profileEditIcon from '../assets/icons/account192.png';

const BottomNavigation = () => {
  const navigation = useNavigation();

  const handleSiteTitleClick = async () => {
    navigation.navigate('SellerList');
  };

  const handleViewOrderClick = async () => {
    const customerId = await AsyncStorage.getItem('userID');
    navigation.navigate('ViewAllCustomerOrders', { customerId });
  };

  const handleProfileEditClick = async () => {
    const customerId = await AsyncStorage.getItem('userID');
    navigation.navigate('CustomerEditProfile', { customerId });
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('authToken');
    await AsyncStorage.removeItem('userID');
    await AsyncStorage.removeItem('role');
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleSiteTitleClick} style={styles.siteTitle}>
        <Text style={styles.siteTitleText}>SELFIT</Text>
      </TouchableOpacity>

      <View style={styles.userActions}>
        <TouchableOpacity
          onPress={handleViewOrderClick}
          style={styles.actionIcon}
        >
          <Image source={ordersIcon} style={styles.icon} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleProfileEditClick}
          style={styles.actionIcon}
        >
          <Image source={profileEditIcon} style={styles.icon} />
        </TouchableOpacity>

        <TouchableOpacity onPress={handleLogout} style={styles.actionIcon}>
          <Image source={logoutIcon} style={styles.icon} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 50,
    backgroundColor: '#eee',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderRadius: 1,
    borderTopWidth: 1,
    borderTopColor: '#000000',
  },
  siteTitle: {
    flex: 1,
  },
  siteTitleText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  userActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionIcon: {
    marginLeft: 10,
  },
  icon: {
    width: 24,
    height: 24,
  },
});

export default BottomNavigation;
