import { useContext, createContext } from 'react';

export const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext);
};