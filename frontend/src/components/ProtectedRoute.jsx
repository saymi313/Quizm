import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const checkAuth = () => {
      const userInfo = localStorage.getItem('userInfo');
      if (userInfo) {
        const user = JSON.parse(userInfo);
        setIsAuthenticated(true);
        setUserRole(user.role);
      } else {
        setIsAuthenticated(false);
        setUserRole(null);
      }
    };
    
    checkAuth();
    
    // Listen for storage changes (logout from another tab)
    const handleStorageChange = () => {
      checkAuth();
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  if (isAuthenticated === null) {
    // Still checking authentication
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  // Protected routes are accessible to both users and admins
  // Admin-only routes are handled by AdminRoute component
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;