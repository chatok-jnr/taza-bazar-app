import React, { createContext, useState, useContext, useEffect } from 'react';

const UserContext = createContext();

export function useUser() {
  return useContext(UserContext);
}

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Add loading state

  // Check for stored auth data on app load
  useEffect(() => {
    const storedUser = localStorage.getItem('userData');
    const storedToken = localStorage.getItem('jwtToken');
    
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
    
    setIsLoading(false); // Set loading to false after checking localStorage
  }, []);

  const login = (userData, token) => {

    console.log(userData);

    const userInfo = {
      user_id: userData._id,
      user_name: userData.user_name,
      user_email: userData.user_email,
    };
    
    setUser(userInfo);
    setIsAuthenticated(true);
    
    // Store in localStorage for persistence
    localStorage.setItem('userData', JSON.stringify(userInfo));
    localStorage.setItem('jwtToken', token);
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    
    // Clear localStorage
    localStorage.removeItem('userData');
    localStorage.removeItem('jwtToken');
  };

  const getToken = () => {
    return localStorage.getItem('jwtToken');
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    getToken,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}
