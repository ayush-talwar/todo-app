import { useState } from 'react';
import api from '../api/axios';
import { AuthContext } from './useAuth';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('access_token');
    return token ? { token } : null;
  });

  const login = async (username, password) => {
    const response = await api.post('token/', {username, password});
    localStorage.setItem('access_token', response.data.access);
    localStorage.setItem('refresh_token', response.data.refresh);
    setUser({ username });
  };

  const register = async (username, password, email) => {
    await api.post('register/', {username, password, email});
    await login(username, password);
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};