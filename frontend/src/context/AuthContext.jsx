import React, { createContext, useState, useEffect } from 'react';
import api from '../api/axios';
import { toast } from 'react-toastify';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for saved session on load
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token: jwtToken, user: userData } = response.data;

      localStorage.setItem('token', jwtToken);
      localStorage.setItem('user', JSON.stringify(userData));

      setToken(jwtToken);
      setUser(userData);
      toast.success(response.data.message || 'Login successful!');
      return userData;
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Login failed. Please check credentials.';
      toast.error(errorMsg);
      throw new Error(errorMsg);
    }
  };

  const register = async (name, email, password, address, role) => {
    try {
      const response = await api.post('/auth/register', { name, email, password, address, role });
      const { token: jwtToken, user: userData } = response.data;

      localStorage.setItem('token', jwtToken);
      localStorage.setItem('user', JSON.stringify(userData));

      setToken(jwtToken);
      setUser(userData);
      toast.success(response.data.message || 'Registration successful!');
      return userData;
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Registration failed.';
      toast.error(errorMsg);
      throw new Error(errorMsg);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    toast.info('Logged out successfully.');
  };

  const changePassword = async (oldPassword, newPassword) => {
    try {
      const response = await api.put('/auth/change-password', { oldPassword, newPassword });
      toast.success(response.data.message || 'Password changed successfully!');
      return response.data;
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Failed to change password.';
      toast.error(errorMsg);
      throw new Error(errorMsg);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, changePassword }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
