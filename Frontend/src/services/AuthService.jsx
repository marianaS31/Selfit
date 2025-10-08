import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
const BASE_API_URL = 'http://localhost:5264/api';

const axiosInstance = axios.create({
  baseURL: BASE_API_URL,
  withCredentials: true, // send cookies with request
});

//Token management
const getAccessToken = () => localStorage.getItem('authToken');
const setAccessToken = (token) => localStorage.setItem('authToken', token);
const removeAccessToken = () => localStorage.removeItem('authToken');

//Request interceptor
axiosInstance.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // attach token to request header
  }
  return config;
});

let isTokenRefreshing = false;
let failedQueue = [];

//process all pending rqeuests after token refresh
const processPendingRequests = (error, newToken = null) => {
  failedQueue.forEach((request) => {
    if (error) {
      request.reject(error);
    } else {
      request.resolve(newToken);
    }
  });
  failedQueue = []; // clear the queue
};

// Response interceptorResponse interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If the error is 401 and we haven't retried the request yet
    if (error.response?.status === 401 && !originalRequest.hasRetried) {
      if (isTokenRefreshing) {
        // If refresh is in progress queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((newToken) => {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return axiosInstance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }
      // To prevent from infinitive loops
      originalRequest.hasRetried = true;
      isTokenRefreshing = true;

      try {
        const response = await axios.post(
          `${BASE_API_URL}/Auth/refresh-token`,
          {},
          { withCredentials: true }
        );

        const newToken = response.data.token;
        setAccessToken(newToken);

        // update authorization header
        axiosInstance.defaults.headers.common[
          'Authorization'
        ] = `Bearer ${newToken}`;
        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        // Process queue of failed requests
        processPendingRequests(null, newToken);

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processPendingRequests(refreshError, null);
        //clear localstorage and redirect
        removeAccessToken();
        localStorage.removeItem('userID');
        localStorage.removeItem('role');
        const navigate = useNavigate();
        navigate('/a/login');
        return Promise.reject(refreshError);
      } finally {
        isTokenRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

//Authentication
export const registerCustomer = async (userDetails) => {
  const response = await axiosInstance.post(
    '/Auth/registerCustomer',
    userDetails
  );
  return response.data;
};

export const registerSeller = async (userDetails) => {
  const response = await axiosInstance.post(
    '/Auth/registerSeller',
    userDetails
  );
  return response.data;
};

export const loginUser = async (userDetails) => {
  const response = await axiosInstance.post('/Auth/login', userDetails);

  //decode token and store in localStorage
  const token = response.data.Token;
  const decoded = jwtDecode(token);
  //Storage token and role in localStorage - TESTING PURPOSES!!!!!!!!!!!!
  localStorage.setItem('authToken', token);
  localStorage.setItem('userID', response.data.UserID);
  localStorage.setItem('role', decoded.role);
  localStorage.setItem('email', decoded.unique_name);
  return decoded;
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

export const createProduct = async (sellerId, productDto) => {
  const response = await axiosInstance.post(
    `/Product/create-product/${sellerId}`,
    productDto
  );
  return response.data;
};

export const getAllProducts = async (sellerId) => {
  const response = await axiosInstance.get(`Product/get-products/${sellerId}`);
  return response.data;
};

export const updateProducts = async (productId, productData) => {
  const response = await axiosInstance.put(
    `Product/update-product/${productId}`,
    productData
  );
  return response.data;
};

export const deleteProducts = async (productId) => {
  const response = await axiosInstance.delete(
    `http://localhost:5264/api/Product/delete-product/${productId}`
  );
  return response.data;
};

//Upload image
export const uploadProductImage = async (productId, file) => {
  try {
    const formData = new FormData();
    formData.append('productImage', file);

    const response = await axiosInstance.post(
      `/UploadImage/upload-product-picture/${productId}`,
      formData
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to upload image');
  }
};

export const updateProductImage = async (productId, file) => {
  const formData = new FormData(); //send file
  formData.append('productImage', file);
  const response = await axiosInstance.put(
    `/UploadImage/update-product-picture/${productId}`,
    formData
  );
  return response.data;
};

export const deleteProductImage = async (productId, file) => {
  const formData = new FormData(); //send file
  formData.append('file', file);
  const response = await axiosInstance.delete(
    `/UploadImage/delete-picture/${productId}`,
    formData
  );
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

//Change order status
export const changeOrderStatus = async (orderId, newStatus) => {
  const response = await axiosInstance.put(
    `/Order/change-order-status/${orderId}?newStatus=${newStatus}`
  );
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
export const updateSeller = async (sellerId, sellerData) => {
  const response = await axiosInstance.put(`/SellerProfile/${sellerId}`, {
    name: sellerData.Name,
    description: sellerData.Description,
  });
  return response.data;
};

export const uploadSellerImage = async (file, sellerId) => {
  const formData = new FormData();
  formData.append('ProductImage', file);
  formData.append('SellerId', sellerId);

  const response = await axiosInstance.post(
    '/UploadImage/upload-seller-picture',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return response.data.ImageUrl;
};

export const updateSellerImage = async (
  selectedImage,
  sellerId,
  existingImageUrl
) => {
  const formData = new FormData();
  formData.append('ProductImage', selectedImage);
  formData.append('SellerId', sellerId); // Assuming SellerId is passed, otherwise change to ProductId based on your logic

  try {
    if (existingImageUrl) {
      // If the seller already has an image, we will update it
      const response = await axiosInstance.put(
        '/UploadImage/update-seller-picture',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      // Return the updated image URL
      return response.data.ImageUrl;
    } else {
      // If no existing image, upload a new one
      const response = await axiosInstance.post(
        '/UploadImage/upload-seller-picture',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      // Return the uploaded image URL
      return response.data.ImageUrl;
    }
  } catch (error) {
    throw new Error('Failed to upload or update the image: ' + error.message);
  }
};
