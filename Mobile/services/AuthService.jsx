import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';

const BASE_API_URL = 'http://192.168.1.236:5264/api';

const axiosInstance = axios.create({
  baseURL: BASE_API_URL,
});

// Token management
const getAccessToken = async () => await AsyncStorage.getItem('authToken');

// Request interceptor
axiosInstance.interceptors.request.use(
  async (config) => {
    const token = await getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Simplified response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;

// Authentication
export const registerCustomer = async (userDetails) => {
  try {
    const response = await axiosInstance.post(
      '/Auth/registerCustomer',
      userDetails
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const loginUser = async (userDetails) => {
  const response = await axiosInstance.post('/Auth/login', userDetails);
  // Decode token and store in AsyncStorage
  const token = response.data.Token;
  const decoded = jwtDecode(token);

  // Store token and role in AsyncStorage
  await AsyncStorage.setItem('authToken', token);
  await AsyncStorage.setItem('userID', response.data.UserID);
  await AsyncStorage.setItem('role', decoded.role);
  await AsyncStorage.setItem('email', decoded.unique_name);
  return response.data;
};

export const forgotPassword = async (userEmail) => {
  const response = await axiosInstance.post('/Auth/forgotPassword', {
    email: userEmail,
  });
  return response.data;
};

export const resetPassword = async (newPasswordData) => {
  const response = await axiosInstance.put(
    '/Auth/resetPassword',
    newPasswordData
  );
  return response.data;
};

//Sellers
export const getSellers = async () => {
  const response = await axiosInstance.get('/SellerProfile/get-sellers');
  return response.data;
};

export const getSellerById = async (id) => {
  const response = await axiosInstance.get(`/SellerProfile/${id}`);
  return response.data;
};

export const getSellerByIdEmail = async (id) => {
  const response = await axiosInstance.get(`/SellerProfile/${id}`);
  return response.data.Email;
};

//Customer
export const getCustomerById = async (id) => {
  const response = await axiosInstance.get(`/CustomerProfile/${id}`);
  return response.data;
};

export const updateCustomer = async (id, customerData) => {
  const response = await axiosInstance.put(`/CustomerProfile/${id}`, {
    fullName: customerData.fullName,
    phoneNumber: customerData.phoneNumber,
    address: customerData.address,
    zip: customerData.zip,
    city: customerData.city,
  });
  return response.data;
};
//Product
export const getProductsBySellerId = async (id) => {
  const response = await axiosInstance.get(`/Product/get-products/${id}`);
  return response.data;
};

export const getProductById = async (productId) => {
  const response = await axiosInstance.get(`/Product/get-product/${productId}`);
  return response.data;
};

export const getAllProducts = async (sellerId) => {
  const response = await axiosInstance.get(`Product/get-products/${sellerId}`);
  return response.data;
};

//order
export const createOrder = async (orderDto) => {
  const response = await axiosInstance.post('/Order/place-order', orderDto);
  return response.data;
};

export const getOrderByCustomer = async (customerId) => {
  const response = await axiosInstance.get(
    `/Order/customer/${customerId}/orders`
  );
  return response.data;
};

export const getOrderBySeller = async (sellerId) => {
  const response = await axiosInstance.get(`/Order/seller/${sellerId}/orders`);
  return response.data;
};

//Contact
export const contactSeller = async (contactSellerDto) => {
  const response = await axiosInstance.post(
    '/ContactSeller/contact-seller',
    contactSellerDto
  );
  return response.data;
};
