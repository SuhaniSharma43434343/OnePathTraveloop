import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState(!!localStorage.getItem('token'));
  // Track whether user was just set directly via login() to skip the /me fetch
  const skipFetch = useRef(false);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    // If login() already gave us the user object, skip the extra /me fetch
    if (skipFetch.current) {
      skipFetch.current = false;
      setLoading(false);
      return;
    }
    setLoading(true);
    import('../api/userApi').then(({ fetchMe }) =>
      fetchMe(token)
        .then(data => setUser(data))
        .catch(() => {
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
        })
        .finally(() => setLoading(false))
    );
  }, [token]);

  const login = (tokenVal, userData) => {
    skipFetch.current = true;   // we already have user data, no need to re-fetch
    localStorage.setItem('token', tokenVal);
    setUser(userData);
    setToken(tokenVal);         // triggers useEffect, but skipFetch prevents the /me call
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
