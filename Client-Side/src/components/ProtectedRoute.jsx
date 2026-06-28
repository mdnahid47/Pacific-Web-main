import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import api from "../api"; // Import the configured axios instance

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

        const res = await api.get("/api/auth/verify-role", {
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
        // Clear invalid token if authentication fails
        if (err.response?.status === 401 || err.response?.status === 403) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        }
        
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
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
        <p className="text-gray-400">Checking permissions...</p>
      </div>
    );
  }

  if (!authStatus.isAllowed) {
    // Redirect to login if not authenticated
    if (authStatus.error?.includes("No authentication token")) {
      return <Navigate to="/login" replace />;
    }
    
    // Redirect to dashboard with error message
    return (
      <Navigate 
        to="/admin/dashboard" 
        state={{ 
          error: authStatus.error || "You don't have permission to access this page",
          from: window.location.pathname 
        }} 
        replace
      />
    );
  }

  return children;
};

export default ProtectedRoute;