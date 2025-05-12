import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const AdminRoute = () => {
  const [isAdmin, setIsAdmin] = useState(null);

  useEffect(() => {
    const checkAdmin = () => {
      const userInfo = localStorage.getItem('userInfo');
      if (userInfo) {
        const user = JSON.parse(userInfo);
        setIsAdmin(user.role === 'admin');
      } else {
        setIsAdmin(false);
      }
    };
    
    checkAdmin();
  }, []);

  if (isAdmin === null) {
    // Still checking admin status
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return isAdmin ? <Outlet /> : <Navigate to="/login" />;
};

export default AdminRoute;