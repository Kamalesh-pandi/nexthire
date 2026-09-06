import React from 'react';
import { Clock, ShieldAlert, LogOut, RefreshCw, Sparkles, Building2, BookOpen, AlertTriangle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function WaitingApproval() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const isRejected = currentUser?.status === 'rejected';

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleRefreshState = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg bg-white rounded-3xl p-8 border border-slate-200 shadow-xl space-y-6 text-center">
        
        {/* Status Icon Header */}
        <div className={`mx-auto w-16 h-16 rounded-3xl flex items-center justify-center shadow-md transition-transform hover:scale-105 ${
          isRejected ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-amber-50 text-amber-600 border border-amber-200'
        }`}>
          {isRejected ? <AlertTriangle className="w-8 h-8 text-red-600" /> : <Clock className="w-8 h-8 text-amber-600 animate-spin" />}
        </div>

        <div className="space-y-2">
          <span className={`text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full border ${
            isRejected ? 'bg-red-50 text-red-800 border-red-200' : 'bg-amber-50 text-amber-800 border-amber-200'
          }`}>
            {isRejected ? 'Application Declined' : 'Account Under Review'}
          </span>
          <h2 className="text-2xl font-extrabold text-slate-900">
            {isRejected ? 'Access Restricted' : 'Waiting for Admin Approval'}
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed max-w-md mx-auto">
            {isRejected 
              ? 'Your requested role registration was reviewed and declined by the system administrator. Contact admin support if you believe this was an error.' 
              : 'Your account is under review by admin. You will be notified once approved.'}
          </p>
        </div>

        {/* User Application Details Card */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-3 text-xs">
          <div className="flex justify-between items-center pb-2 border-b border-slate-200">
            <span className="text-slate-500">Applicant Name</span>
            <span className="font-bold text-slate-900">{currentUser?.name || 'User'}</span>
          </div>

          <div className="flex justify-between items-center pb-2 border-b border-slate-200">
            <span className="text-slate-500">Registered Email</span>
            <span className="font-mono text-slate-700 text-[11px]">{currentUser?.email}</span>
          </div>

          <div className="flex justify-between items-center pb-2 border-b border-slate-200">
            <span className="text-slate-500">Requested Role</span>
            <span className="font-bold text-blue-700 uppercase tracking-wider text-[11px] flex items-center gap-1">
              {currentUser?.requestedRole === 'industry' ? <Building2 className="w-3.5 h-3.5" /> : <BookOpen className="w-3.5 h-3.5" />}
              {currentUser?.requestedRole || 'Privileged Role'}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-500">Status</span>
            <span className={`font-bold capitalize px-2 py-0.5 rounded text-[10px] ${
              isRejected ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-800'
            }`}>
              {currentUser?.status || 'waiting'}
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={handleRefreshState}
            className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs border border-slate-300 flex items-center gap-2 transition-colors"
          >
            <RefreshCw className="w-4 h-4 text-blue-600" />
            <span>Check Status Live</span>
          </button>

          <button
            onClick={handleLogout}
            className="px-5 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 font-semibold text-xs border border-red-200 flex items-center gap-2 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>

      </div>
    </div>
  );
}
