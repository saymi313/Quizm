import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const AdminRoute = () => {
  const [isAdmin, setIsAdmin] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAdmin = () => {
      const userInfo = localStorage.getItem('userInfo');
      if (userInfo) {
        const user = JSON.parse(userInfo);
        setIsAuthenticated(true);
        setIsAdmin(user.role === 'admin');
      } else {
        setIsAuthenticated(false);
        setIsAdmin(false);
      }
    };
    
    checkAdmin();
    
    // Listen for storage changes (logout from another tab)
    const handleStorageChange = () => {
      checkAdmin();
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  if (isAdmin === null) {
    // Still checking admin status
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  // Redirect to home if not admin (instead of login, as they might be logged in as user)
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (!isAdmin) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
};

export default AdminRoute;