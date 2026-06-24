import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";



const ProtectedRoute = ({ children, role }) => {
  const [authStatus, setAuthStatus] = useState({
    loading: true,
    isAllowed: false,
    error: null
  });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No authentication token found");
        }

        const res = await axios.get(`http://localhost:5001/api/auth/verify-role`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { requiredRole: Array.isArray(role) ? role.join(",") : role },
          withCredentials: true
        });

        setAuthStatus({
          loading: false,
          isAllowed: res.data.isValid,
          error: null
        });
      } catch (err) {
        setAuthStatus({
          loading: false,
          isAllowed: false,
          error: err.response?.data?.message || err.message
        });
      }
    };

    checkAuth();
  }, [role]);

  if (authStatus.loading) {
    return <div className="text-center p-4">Checking permissions...</div>;
  }

  if (!authStatus.isAllowed) {
    return (
      <Navigate 
        to="/admin/dashboard" 
        state={{ 
          error: authStatus.error || "You don't have permission to access this page",
          from: window.location.pathname 
        }} 
      />
    );
  }

  return children;
};

export default ProtectedRoute;