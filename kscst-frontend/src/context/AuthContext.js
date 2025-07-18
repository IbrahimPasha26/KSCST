import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [credentials, setCredentials] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedCredentials = localStorage.getItem('credentials');
    if (storedUser && storedCredentials) {
      const parsedUser = JSON.parse(storedUser);
      const parsedCredentials = JSON.parse(storedCredentials);
      setUser(parsedUser);
      setCredentials(parsedCredentials);
      console.log('AuthContext: Loaded from localStorage', { user: parsedUser, credentials: parsedCredentials });
    }
  }, []);

  const login = (userData, creds) => {
    setUser(userData);
    setCredentials(creds);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('credentials', JSON.stringify(creds));
    console.log('AuthContext: Logged in', { user: userData, credentials: creds });
  };

  const logout = () => {
    setUser(null);
    setCredentials(null);
    localStorage.removeItem('user');
    localStorage.removeItem('credentials');
    console.log('AuthContext: Logged out');
  };

  console.log('AuthContext: Current state', { user, credentials });

  return (
    <AuthContext.Provider value={{ user, credentials, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};