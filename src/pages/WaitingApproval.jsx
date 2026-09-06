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
      <div className="w-full max-w-lg glass-panel rounded-3xl p-8 border border-slate-700/80 shadow-2xl space-y-6 text-center">
        
        {/* Status Icon Header */}
        <div className="mx-auto w-16 h-16 rounded-3xl flex items-center justify-center shadow-xl transition-transform hover:scale-105 ${
          isRejected ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
        }">
          {isRejected ? <AlertTriangle className="w-8 h-8 text-red-400" /> : <Clock className="w-8 h-8 text-amber-400 animate-spin" />}
        </div>

        <div className="space-y-2">
          <span className={`text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full border ${
            isRejected ? 'bg-red-500/20 text-red-300 border-red-500/30' : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
          }`}>
            {isRejected ? 'Application Declined' : 'Account Under Review'}
          </span>
          <h2 className="text-2xl font-extrabold text-slate-100">
            {isRejected ? 'Access Restricted' : 'Waiting for Admin Approval'}
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed max-w-md mx-auto">
            {isRejected 
              ? 'Your requested role registration was reviewed and declined by the system administrator. Contact admin support if you believe this was an error.' 
              : 'Your account is under review by admin. You will be notified once approved.'}
          </p>
        </div>

        {/* User Application Details Card */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-left space-y-3 text-xs">
          <div className="flex justify-between items-center pb-2 border-b border-slate-800">
            <span className="text-slate-400">Applicant Name</span>
            <span className="font-bold text-slate-100">{currentUser?.name || 'User'}</span>
          </div>

          <div className="flex justify-between items-center pb-2 border-b border-slate-800">
            <span className="text-slate-400">Registered Email</span>
            <span className="font-mono text-slate-300 text-[11px]">{currentUser?.email}</span>
          </div>

          <div className="flex justify-between items-center pb-2 border-b border-slate-800">
            <span className="text-slate-400">Requested Role</span>
            <span className="font-bold text-purple-400 uppercase tracking-wider text-[11px] flex items-center gap-1">
              {currentUser?.requestedRole === 'industry' ? <Building2 className="w-3.5 h-3.5" /> : <BookOpen className="w-3.5 h-3.5" />}
              {currentUser?.requestedRole || 'Privileged Role'}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-400">Status</span>
            <span className={`font-bold capitalize px-2 py-0.5 rounded text-[10px] ${
              isRejected ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-300'
            }`}>
              {currentUser?.status || 'waiting'}
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={handleRefreshState}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 flex items-center gap-2 transition-colors"
          >
            <RefreshCw className="w-4 h-4 text-blue-400" />
            <span>Check Status Live</span>
          </button>

          <button
            onClick={handleLogout}
            className="px-5 py-2.5 rounded-xl bg-red-600/20 hover:bg-red-600/30 text-red-300 font-semibold text-xs border border-red-500/30 flex items-center gap-2 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>

      </div>
    </div>
  );
}
