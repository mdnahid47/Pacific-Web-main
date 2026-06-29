// import { useEffect, useState } from "react";
// import { Navigate } from "react-router-dom";
// import api from "../api"; // Make sure this path is correct

// const ProtectedRoute = ({ children, role }) => {
//   const [authStatus, setAuthStatus] = useState({
//     loading: true,
//     isAllowed: false,
//     error: null
//   });

//   useEffect(() => {
//     const checkAuth = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         if (!token) {
//           throw new Error("No authentication token found");
//         }

//         // Use api instance, not axios directly
//         const res = await api.get("/auth/verify-role", {
//           headers: { Authorization: `Bearer ${token}` },
//           params: { requiredRole: Array.isArray(role) ? role.join(",") : role },
//         });

//         setAuthStatus({
//           loading: false,
//           isAllowed: res.data.isValid,
//           error: null
//         });
//       } catch (err) {
//         if (err.response?.status === 401 || err.response?.status === 403) {
//           localStorage.removeItem("token");
//           localStorage.removeItem("user");
//         }
        
//         setAuthStatus({
//           loading: false,
//           isAllowed: false,
//           error: err.response?.data?.message || err.message
//         });
//       }
//     };

//     checkAuth();
//   }, [role]);

//   if (authStatus.loading) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
//         <p className="text-gray-400">Checking permissions...</p>
//       </div>
//     );
//   }

//   if (!authStatus.isAllowed) {
//     if (authStatus.error?.includes("No authentication token")) {
//       return <Navigate to="/login" replace />;
//     }
    
//     return (
//       <Navigate 
//         to="/admin/dashboard" 
//         state={{ 
//           error: authStatus.error || "You don't have permission to access this page",
//           from: window.location.pathname 
//         }} 
//         replace
//       />
//     );
//   }

//   return children;
// };

// export default ProtectedRoute;

import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import api from "../api";

const ProtectedRoute = ({ children, role }) => {
  const [authStatus, setAuthStatus] = useState({
    loading: true,
    isAllowed: false,
    error: null
  });
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token");
        
        if (!token) {
          throw new Error("No authentication token found");
        }

        console.log('🔐 Checking authentication...'); 

        // API call to verify role
        const res = await api.get("/auth/verify-role", {
          params: { 
            requiredRole: Array.isArray(role) ? role.join(",") : role 
          },
        });

        console.log('✅ Auth response:', res.data);

        setAuthStatus({
          loading: false,
          isAllowed: res.data.isValid === true,
          error: null
        });
      } catch (err) {
        console.error('❌ Auth Error:', err);
        
        // network error handling
        if (err.code === 'ERR_NETWORK' || err.message === 'Network Error') {
          setAuthStatus({
            loading: false,
            isAllowed: false,
            error: "Unable to connect to server. Please check your internet connection."
          });
          return;
        }

        // others error handling
        if (err.response?.status === 401 || err.response?.status === 403) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        }
        
        setAuthStatus({
          loading: false,
          isAllowed: false,
          error: err.response?.data?.message || err.message || "Authentication failed"
        });
      }
    };

    checkAuth();
  }, [role]);

  // loading state handling
  if (authStatus.loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-gray-400">Checking permissions...</p>
        <p className="text-xs text-gray-600 mt-2">
          Connecting to: {import.meta.env.PROD ? 'Production Server' : 'Development Server'}
        </p>
      </div>
    );
  }

  // error state handling
  if (!authStatus.isAllowed) {
    // network connection error
    if (authStatus.error?.includes("Unable to connect")) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-4">
          <div className="bg-gray-800 p-8 rounded-xl max-w-md text-center">
            <div className="text-6xl mb-4">🌐</div>
            <h2 className="text-2xl text-red-400 mb-4">Connection Error</h2>
            <p className="text-gray-300 mb-6">{authStatus.error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              Retry Connection
            </button>
          </div>
        </div>
      );
    }

    // no authentication token found
    if (authStatus.error?.includes("No authentication token")) {
      return <Navigate to="/login" state={{ from: location.pathname }} replace />;
    }
    
    // other permission errors
    return (
      <Navigate 
        to="/login" 
        state={{ 
          error: authStatus.error || "You don't have permission to access this page",
          from: location.pathname 
        }} 
        replace
      />
    );
  }

  return children;
};

export default ProtectedRoute;