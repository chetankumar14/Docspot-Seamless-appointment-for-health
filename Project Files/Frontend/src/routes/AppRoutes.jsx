import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import CustomerDashboardPage from '../pages/Customer/CustomerDashboardPage';
import DoctorDashboardPage from '../pages/Doctor/DoctorDashboardPage';
import AdminDashboardPage from '../pages/Admin/AdminDashboardPage';
import Layout from '../views/Layout'; // A layout component for consistency

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/" element={<LoginPage />} /> {/* Default landing page */}

      {/* Protected Routes */}
      <Route element={<PrivateRoute />}>
        {/* User Dashboard */}
        <Route path="/dashboard" element={<Layout><CustomerDashboardPage /></Layout>} />
        
        {/* Doctor Dashboard */}
        <Route path="/doctor/dashboard" element={<Layout><DoctorDashboardPage /></Layout>} />
        
        {/* Admin Dashboard */}
        <Route path="/admin/dashboard" element={<Layout><AdminDashboardPage /></Layout>} />
        
        {/* Add more protected routes here */}
      </Route>
    </Routes>
  );
};

export default AppRoutes;