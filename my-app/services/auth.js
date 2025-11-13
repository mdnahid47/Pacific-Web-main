import axios from 'axios';
import { storeToken, getToken, clearToken } from './storage';

const API_URL = 'https://your-api-url.com/api';

export const registerVendor = async (data) => {
  const formData = new FormData();
  formData.append('fullName', data.fullName);
  formData.append('email', data.email);
  formData.append('password', data.password);
  formData.append('phone', data.phone);
  formData.append('nidNumber', data.nid.number);
  
  formData.append('nidFront', {
    uri: data.nid.frontImage,
    name: 'nid_front.jpg',
    type: 'image/jpeg'
  });

  if (data.nid.backImage) {
    formData.append('nidBack', {
      uri: data.nid.backImage,
      name: 'nid_back.jpg',
      type: 'image/jpeg'
    });
  }

  const response = await axios.post(`${API_URL}/auth/register`, formData);
  await storeToken(response.data.token);
  return response.data.user;
};

export const loginUser = async (email, password) => {
  const response = await axios.post(`${API_URL}/auth/login`, { email, password });
  await storeToken(response.data.token);
  return response.data.user;
};

export const getCurrentUser = async () => {
  const token = await getToken();
  if (!token) return null;
  
  const response = await axios.get(`${API_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const logoutUser = async () => {
  await clearToken();
};