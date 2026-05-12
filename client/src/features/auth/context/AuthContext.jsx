import React, { createContext, useState, useEffect, useCallback } from 'react';
import authService from '../services/authService';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          const { data } = await authService.getMe();
          const u = data.data;
          setUser(u?.user || u || data);
          setToken(storedToken);
        } catch {
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  const login = useCallback(async (email, password) => {
    const { data } = await authService.login({ email, password });
    const payload = data.data || data;
    const responseToken = payload.token || data.token;
    const responseUser = payload.user || payload;
    localStorage.setItem('token', responseToken);
    setToken(responseToken);
    setUser(responseUser);
    return responseUser;
  }, []);

  const register = useCallback(async (username, email, password) => {
    const { data } = await authService.register({ username, email, password });
    const payload = data.data || data;
    const responseToken = payload.token || data.token;
    const responseUser = payload.user || payload;
    localStorage.setItem('token', responseToken);
    setToken(responseToken);
    setUser(responseUser);
    return responseUser;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  }, []);

  const updateUser = useCallback((updatedData) => {
    setUser((prev) => ({ ...prev, ...updatedData }));
  }, []);

  const value = {
    user,
    token,
    isAuthenticated: !!user,
    loading,
    login,
    register,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
