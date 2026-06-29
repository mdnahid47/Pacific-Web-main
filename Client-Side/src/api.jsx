// import axios from "axios";

// const api = axios.create({
//   baseURL: import.meta.env.VITE_API_URL,
//   withCredentials: true,
// });

// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (
//       error.response &&
//       (error.response.status === 401 || error.response.status === 403)
//     ) {
//       localStorage.removeItem("token");
//       localStorage.removeItem("user");
//       alert("Session expired. Please login again.");
//       window.location.href = "/login";
//     }
//     return Promise.reject(error);
//   }
// );

// export default api;

import axios from "axios";

// dynamically set baseURL based on environment
const getBaseURL = () => {
  // production url use railway deployment url
  if (import.meta.env.PROD) {
    return 'https://pacific-web-main-production.up.railway.app/api';
  }
  // development localhost url use 
  return import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
};

const api = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true,
  timeout: 30000, 
  headers: {
    'Content-Type': 'application/json',
  }
});

// request interceptor - adding token to headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // debbuging 
    if (import.meta.env.DEV) {
      console.log('📤 API Request:', config.method.toUpperCase(), config.baseURL + config.url);
    }
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

//response interceptor - error handling
api.interceptors.response.use(
  (response) => {
    if (import.meta.env.DEV) {
      console.log('📥 API Response:', response.status, response.config.url);
    }
    return response;
  },
  (error) => {
    // network Error Handling
    if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
      console.error('❌ Network Error - Server might be down');
      // show a user-friendly alert instead of console log
      alert('Cannot connect to server. Please check your internet connection.');
    }

    // 401/403 Error HAndle
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      alert("Session expired. Please login again.");
      window.location.href = "/login";
    }
    
    console.error('❌ API Error:', {
      message: error.message,
      url: error.config?.url,
      status: error.response?.status,
      data: error.response?.data
    });

    return Promise.reject(error);
  }
);

export default api;