import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-950">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-brand-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to default home based on user's actual role
    if (user.role === 'Admin') {
      return <Navigate to="/admin/dashboard" replace />;
    } else if (user.role === 'Store Owner') {
      return <Navigate to="/owner/dashboard" replace />;
    } else {
      return <Navigate to="/stores" replace />;
    }
  }

  return <Outlet />;
};

export default ProtectedRoute;
