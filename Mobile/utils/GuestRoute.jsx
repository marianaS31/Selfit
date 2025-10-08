import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwtDecode from 'jwt-decode'; // Adjust this import if your decoder is custom
import { useNavigation } from '@react-navigation/native';

const GuestRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [error, setError] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (!token) {
          setIsAuthenticated(false);
          return;
        }

        const decoded = jwtDecode(token);
        setIsAuthenticated(true);
        setUserRole(decoded.role);
      } catch (error) {
        setError('Error checking authentication');
        setIsAuthenticated(false);
      }
    };

    checkAuthentication();
  }, []);

  // Handle redirection in a useEffect
  useEffect(() => {
    if (isAuthenticated) {
      const redirectPath =
        userRole === 'Customer' ? 'SellerList' : 'LandingPage';
      navigation.replace(redirectPath); // Perform navigation here
    }
  }, [isAuthenticated, userRole, navigation]);

  if (isAuthenticated) {
    // While redirecting, render nothing
    return null;
  }

  // Render children if not authenticated
  return children;
};

export default GuestRoute;
