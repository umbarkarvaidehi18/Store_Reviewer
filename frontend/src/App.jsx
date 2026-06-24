import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoutes';
import DashboardLayout from './layouts/DashboardLayout';

// Auth Pages
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ChangePasswordPage from './pages/ChangePasswordPage';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import StoreManagement from './pages/admin/StoreManagement';
import UserDetails from './pages/admin/UserDetails';

// User Pages
import StoreListing from './pages/user/StoreListing';

// Owner Pages
import OwnerDashboard from './pages/owner/OwnerDashboard';

// Toast Notifications
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Root Redirect component to send users to their default view
const RootRedirect = () => {
  const { user } = useContext(AuthContext);
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'Admin') return <Navigate to="/admin/dashboard" replace />;
  if (user.role === 'Store Owner') return <Navigate to="/owner/dashboard" replace />;
  return <Navigate to="/stores" replace />;
};

const AppContent = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* Protected Routes Layout */}
        <Route element={<ProtectedRoute allowedRoles={['Admin', 'User', 'Store Owner']} />}>
          <Route element={<DashboardLayout />}>
            {/* Common Authenticated Routes */}
            <Route path="/" element={<RootRedirect />} />
            <Route path="/change-password" element={<ChangePasswordPage />} />

            {/* Admin Exclusive Routes */}
            <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<UserManagement />} />
              <Route path="/admin/users/:id" element={<UserDetails />} />
              <Route path="/admin/stores" element={<StoreManagement />} />
            </Route>

            {/* User Exclusive Routes */}
            <Route element={<ProtectedRoute allowedRoles={['User']} />}>
              <Route path="/stores" element={<StoreListing />} />
            </Route>

            {/* Store Owner Exclusive Routes */}
            <Route element={<ProtectedRoute allowedRoles={['Store Owner']} />}>
              <Route path="/owner/dashboard" element={<OwnerDashboard />} />
            </Route>
          </Route>
        </Route>

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <ToastContainer 
        position="top-right" 
        autoClose={3000} 
        hideProgressBar={false} 
        newestOnTop 
        closeOnClick 
        rtl={false} 
        pauseOnFocusLoss 
        draggable 
        pauseOnHover 
        theme="dark"
      />
    </BrowserRouter>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
