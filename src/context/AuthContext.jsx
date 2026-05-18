import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/user`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Accept': 'application/json'
            }
          });
          if (response.ok) {
            const result = await response.json();
            setUser(result.data || result);
          } else if (response.status === 401) {
            // Token is invalid or expired — clear it
            localStorage.removeItem('token');
            setUser(null);
          }
          // For other errors (500, network, etc.), keep the token and stay logged out temporarily
        } catch (error) {
          // Network error (backend down, XAMPP not started) — DO NOT clear the token
          // The user will remain "unauthenticated" for this session but token stays safe
          console.warn('Auth check failed (network issue). Token preserved for next session.');
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      const errorData = await response.json();
      let errorMessage = errorData.message || 'Login failed';
      if (errorData.errors) {
        const firstError = Object.values(errorData.errors)[0];
        errorMessage = Array.isArray(firstError) ? firstError[0] : firstError;
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    localStorage.setItem('token', data.access_token);
    const userData = data.user.data || data.user;
    setUser(userData);
    return userData;
  };

  const register = async (name, email, password, password_confirmation) => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ name, email, password, password_confirmation })
    });

    if (!response.ok) {
      const errorData = await response.json();
      let errorMessage = errorData.message || 'Registration failed';
      if (errorData.errors) {
        const firstError = Object.values(errorData.errors)[0];
        errorMessage = Array.isArray(firstError) ? firstError[0] : firstError;
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    localStorage.setItem('token', data.access_token);
    const userData = data.user.data || data.user;
    setUser(userData);
    return userData;
  };

  const logout = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      await fetch(`${import.meta.env.VITE_API_URL}/logout`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json' 
        }
      });
    }
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
