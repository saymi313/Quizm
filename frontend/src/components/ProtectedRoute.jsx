import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const checkAuth = () => {
      const userInfo = localStorage.getItem('userInfo');
      setIsAuthenticated(!!userInfo);
    };
    
    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    // Still checking authentication
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;