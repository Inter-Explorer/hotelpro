import { createContext, useContext, useState } from 'react';
import { api } from '../api.js';

// Context = a "global variable" that every component can read.
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Start with whatever was saved in the browser, so refresh keeps you logged in.
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  // Login: save the token and user in localStorage, return the user.
  const login = async (email, password) => {
    const data = await api('/auth/login', { method: 'POST', body: { email, password } });
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  // Signup only creates the account. The user then logs in.
  const signup = (form) => api('/auth/register', { method: 'POST', body: form });

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
