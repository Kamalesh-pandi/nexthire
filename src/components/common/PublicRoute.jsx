import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth, getUserDashboardPath } from '../../context/AuthContext';

/**
 * PublicRoute component for unauthenticated routes like Login, Register, and Home landing page.
 * If user session is NOT expired (user is logged in), directly redirects to the user's dashboard page.
 * If user session IS expired or user is logged out, renders the public children.
 */
export default function PublicRoute({ children }) {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-400 font-medium font-sans">Checking session status...</p>
        </div>
      </div>
    );
  }

  if (currentUser) {
    return <Navigate to={getUserDashboardPath(currentUser)} replace />;
  }

  return children;
}
