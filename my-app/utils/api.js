import { DEV_BASE_URL, PROD_BASE_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useVendorStore } from '../store/useVendorStore'; // ✅ make sure the path is correct

const API_BASE_URL = __DEV__ ? DEV_BASE_URL : PROD_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    Accept: 'application/json',
  },
});

// ✅ Helper to map mime type to extension
const getExtensionFromMime = (type) => {
  if (!type) return 'jpg';
  const map = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/jpg': 'jpg',
  };
  return map[type] || 'jpg';
};

// Request interceptor
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem('authToken');
    }
    return Promise.reject(error);
  }
);

export const vendorAPI = {
  completeRegistration: async () => {
    const { prepareSubmissionData } = useVendorStore.getState();
    const formData = new FormData();
    const data = prepareSubmissionData();

    Object.entries(data).forEach(([key, value]) => {
      if (value && !['nid_front', 'nid_back', 'selfie'].includes(key)) {
        formData.append(key, value);
      }
    });

    if (data.nid_front) {
      formData.append('nid_front', {
        uri: data.nid_front.uri,
        name: `nid_front_${Date.now()}.${getExtensionFromMime(data.nid_front.type)}`,
        type: data.nid_front.type || 'image/jpeg',
      });
    }

    if (data.nid_back) {
      formData.append('nid_back', {
        uri: data.nid_back.uri,
        name: `nid_back_${Date.now()}.${getExtensionFromMime(data.nid_back.type)}`,
        type: data.nid_back.type || 'image/jpeg',
      });
    }

    if (data.selfie) {
      formData.append('selfie', {
        uri: data.selfie.uri,
        name: `selfie_${Date.now()}.${getExtensionFromMime(data.selfie.type)}`,
        type: data.selfie.type || 'image/jpeg',
      });
    }

    return api.post('/vendor/complete-registration', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  registerStep1: (data) => api.post('/vendor/register-step1', data),
  registerStep2: (data) => api.post('/vendor/register-step2', data),
  verifyOTP: (data) => api.post('/vendor/verify-otp', data),

  uploadKYC: (formData) =>
    api.post('/vendor/upload-kyc', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  login: (credentials) => api.post('/vendor/login', credentials),
  requestOTP: (phone) => api.post('/vendor/request-otp', { phone }),

  getProfile: () => api.get('/vendor/profile'),
  updateProfile: (data) => api.patch('/vendor/profile', data),

  checkRegistrationStatus: (email) =>
    api.get(`/vendor/check-status?email=${encodeURIComponent(email)}`),
};

export const handleApiError = (error) => {
  console.error('API Error:', error);

  if (error.response) {
    return {
      message: error.response.data?.message || 'Request failed',
      status: error.response.status,
      data: error.response.data,
    };
  } else if (error.request) {
    return { message: 'No response from server' };
  } else {
    return { message: error.message || 'Network error' };
  }
};

export default api;
