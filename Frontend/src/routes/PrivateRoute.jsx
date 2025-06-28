import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = ({ requiredRole }) => {
  const { userInfo } = useSelector((state) => state.auth);

  if (!userInfo) {
    // If not authenticated, redirect to login page
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && userInfo.role !== requiredRole) {
    // If authenticated but wrong role, redirect to unauthorized page or dashboard
    return <Navigate to="/dashboard" replace />;
  }

  // If authenticated and has the required role, render the child routes
  return <Outlet />;
};

export default PrivateRoute;