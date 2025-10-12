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
    console.log('Login data received:', userData);

    // Store complete user info for both login and signup scenarios
    const userInfo = {
      user_id: userData._id || userData.user_id,
      user_name: userData.user_name,
      user_email: userData.user_email,
      user_no: userData.user_no,
      user_birth_date: userData.user_birth_date,
      gender: userData.gender,
      location: userData.location || userData.user_location,
      total_revenue: userData.total_revenue || 0,
      active_listing: userData.active_listing || 0,
      createdAt: userData.createdAt,
      // Include any other fields that might be needed
      ...userData
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
