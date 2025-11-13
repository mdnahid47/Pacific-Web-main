// providers/AuthProvider.js
import { createContext, useContext, useState } from 'react';

// Create context with proper initialization
const AuthContext = createContext({
  user: null,
  loading: false,
  login: () => Promise.resolve(),
  register: () => Promise.resolve(),
  logout: () => Promise.resolve(),
});

// Add displayName for better debugging
AuthContext.displayName = 'AuthContext';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    try {
      // Replace with your actual login logic
      const user = { email, role: 'vendor' }; // Mock user
      setUser(user);
      return user;
    } finally {
      setLoading(false);
    }
  };

  const register = async (data) => {
    setLoading(true);
    try {
      // Replace with your actual registration logic
      const user = { ...data, role: 'vendor' }; // Mock user
      setUser(user);
      return user;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}