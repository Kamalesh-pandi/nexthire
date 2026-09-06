import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth, getUserDashboardPath } from '../../context/AuthContext';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { currentUser, userRole, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-900 font-sans">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-500 font-medium font-sans">Authenticating user credentials...</p>
        </div>
      </div>
    );
  }

  // If session is expired or user is not logged in, move directly to login page
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  const isPendingOrWaiting = currentUser.status === 'waiting' || currentUser.role === 'pending';
  const isRejected = currentUser.status === 'rejected';

  // If user is waiting approval or rejected
  if (isPendingOrWaiting || isRejected) {
    if (allowedRoles && allowedRoles.includes('waiting')) {
      return children;
    }
    return <Navigate to="/waiting-approval" replace />;
  }

  // If approved user visits waiting approval page, redirect to user dashboard
  if (allowedRoles && allowedRoles.includes('waiting') && !isPendingOrWaiting && !isRejected) {
    return <Navigate to={getUserDashboardPath(currentUser)} replace />;
  }

  // Role checking
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to={getUserDashboardPath(currentUser)} replace />;
  }

  return children;
}
