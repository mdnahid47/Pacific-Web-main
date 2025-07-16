// import React, { createContext, useState, useEffect } from "react";

// export const AuthContext = createContext();

// const AuthProvider = ({ children, navigate }) => {
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     const token = localStorage.getItem("token");

//     if (token) {
//       setUser({ name: "John Doe" });
//     } else {
//       setUser(null);
//       if (navigate) navigate("/signin");
//     }
//   }, [navigate]);

//   const logOut = () => {
//     localStorage.removeItem("token");
//     setUser(null);
//     if (navigate) navigate("/signin");
//   };

//   return (
//     <AuthContext.Provider value={{ user, logOut }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export default AuthProvider;

import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for user in localStorage when component mounts
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (storedUser && token) {
      try {
        setUser(JSON.parse(storedUser));
        // Set axios default headers
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      } catch (error) {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', userData.token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`;
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading,
      handleLogin, 
      handleLogout 
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
export default AuthProvider;