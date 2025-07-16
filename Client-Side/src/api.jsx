import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5001/api", //
});

// Response interceptor: 
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      alert("Session expired. Please login again.");
      window.location.href = "/login"; 
    }
    return Promise.reject(error);
  }
);

export default api;
