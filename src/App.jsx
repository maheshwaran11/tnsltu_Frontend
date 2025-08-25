import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './store';

import ProtectedRoute from './components/PrivateRoute';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import AddUserForm from './components/AddUserForm';
import Unauthorized from './pages/Unauthorized';
import UserDashboard from './pages/UserDashboard';
import ForgotPassword from './pages/ForgetPassword';
import HomePage from './pages/Homepage';
import EnquiryForm from './components/web/EnquiryForm';
import AboutPage from './pages/AboutPage';
import ServicesPage from './pages/ServicesPage';
import ContactPage from './pages/ContactPage';

import './index.css';
import './App.css';

function RootRedirect() {
  
  const adminRoles = [
  'admin',
  'subadmin',
  'district_admin',
  'taluk_admin',
  'district_subadmin',
  'taluk_subadmin',
];

  const { profile, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (adminRoles.includes(profile?.user_type)) {
    return <Navigate to="/admin-dashboard" />;
  }

  if (profile?.user_type === 'user') {
    return <Navigate to="/user-dashboard" />;
  }

  return <Navigate to="/home" />;
}

function App() {
  const { loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/enquiry" element={<EnquiryForm />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/services" element={<ServicesPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Admin Routes */}
      <Route
        path="/admin-dashboard"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />  
      <Route
        path="/admin-dashboard/add-user"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AddUserForm />
          </ProtectedRoute>
        }
      />
      <Route path="/admin-dashboard/*" element={<AdminDashboard />} />
      {/* <Route
        path="/admin-dashboard/view/:id"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <UserProfileView />
          </ProtectedRoute>
        }
      /> */}
      <Route
        path="/admin-dashboard/edit-user/:id"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AddUserForm />
          </ProtectedRoute>
        }
      />

      {/* User Routes */}
      <Route
        path="/user-dashboard"
        element={
          <ProtectedRoute allowedRoles={['user']}>
            <UserDashboard />
          </ProtectedRoute>
        }
      />

      {/* Root */}
      <Route path="/" element={<RootRedirect />} />
    </Routes>
  );
}

export default App;
