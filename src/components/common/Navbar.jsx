import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Sparkles, 
  Sun, 
  Moon, 
  Bell, 
  User, 
  LogOut, 
  GraduationCap, 
  Building2, 
  BookOpen, 
  MessageSquare,
  ShieldCheck,
  ChevronDown,
  Menu,
  X,
  Database
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { isLiveFirebaseConfigured } from '../../services/firebase';
import NotificationCenter from './NotificationCenter';
import FirebaseConfigModal from './FirebaseConfigModal';

export default function Navbar() {
  const { currentUser, userRole, logout, switchDemoRole } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showFirebaseModal, setShowFirebaseModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleRoleSwitch = (role) => {
    switchDemoRole(role);
    if (role === 'student') navigate('/student/dashboard');
    if (role === 'recruiter') navigate('/industry/dashboard');
    if (role === 'academician') navigate('/academician/dashboard');
  };

  const getDashboardPath = () => {
    if (userRole === 'student') return '/student/dashboard';
    if (userRole === 'recruiter') return '/industry/dashboard';
    if (userRole === 'academician') return '/academician/dashboard';
    return '/';
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-700/40 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo */}
          <div className="flex items-center space-x-3">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5 text-white animate-pulse" />
              </div>
              <div>
                <span className="text-xl font-extrabold tracking-tight gradient-text">NextHire</span>
              </div>
            </Link>
          </div>

          {/* Navigation Links for Authenticated User */}
          {currentUser && (
            <div className="hidden md:flex items-center space-x-4 text-xs font-semibold">
              <Link
                to={getDashboardPath()}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
                  location.pathname.includes('/dashboard')
                    ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Dashboard ({userRole})</span>
              </Link>
            </div>
          )}


          {/* Right Navigation & Controls */}
          <div className="flex items-center space-x-3">

            {/* Theme Switcher Button */}
            <button

              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors border border-slate-700/50"
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
            </button>

            {currentUser ? (
              <>
                {/* Notification Dropdown Trigger */}
                <div className="relative">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="relative p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors border border-slate-700/50"
                  >
                    <Bell className="w-4 h-4" />
                    <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-blue-500 animate-ping" />
                    <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-blue-500" />
                  </button>

                  {showNotifications && (
                    <NotificationCenter onClose={() => setShowNotifications(false)} />
                  )}
                </div>

                {/* User Menu Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowUserDropdown(!showUserDropdown)}
                    className="flex items-center space-x-2 p-1.5 rounded-xl border border-slate-700/60 bg-slate-800/40 hover:bg-slate-800 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center font-bold text-white text-sm">
                      {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div className="hidden sm:block text-left">
                      <div className="text-xs font-semibold text-slate-100 max-w-[120px] truncate">{currentUser.name}</div>
                      <div className="text-[10px] text-slate-400 capitalize flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-emerald-400" />
                        {userRole}
                      </div>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {showUserDropdown && (
                    <div className="absolute right-0 mt-2 w-56 glass-panel rounded-2xl shadow-2xl py-2 border border-slate-700/80 z-50 animate-in fade-in slide-in-from-top-2">
                      <div className="px-4 py-2 border-b border-slate-700/50">
                        <p className="text-sm font-semibold text-slate-200">{currentUser.name}</p>
                        <p className="text-xs text-slate-400 truncate">{currentUser.email}</p>
                        <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded-md">
                          {userRole} Mode
                        </span>
                      </div>

                      <Link
                        to={getDashboardPath()}
                        onClick={() => setShowUserDropdown(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800/70 transition-colors"
                      >
                        <Sparkles className="w-4 h-4 text-blue-400" />
                        Dashboard
                      </Link>

                      {userRole === 'student' && (
                        <Link
                          to="/student/profile"
                          onClick={() => setShowUserDropdown(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800/70 transition-colors"
                        >
                          <User className="w-4 h-4 text-purple-400" />
                          My Profile
                        </Link>
                      )}

                      <button
                        onClick={() => {
                          setShowUserDropdown(false);
                          logout();
                          navigate('/login');
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors border-t border-slate-700/50 mt-1"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 rounded-xl shadow-lg shadow-blue-500/25 transition-all transform hover:-translate-y-0.5"
                >
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-panel border-t border-slate-800 px-4 pt-2 pb-4 space-y-2">
          {currentUser && (
            <div className="p-3 bg-slate-800/60 rounded-xl space-y-2">
              <p className="text-xs text-slate-400 font-medium">Switch Persona for Hackathon Demo:</p>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <button
                  onClick={() => { handleRoleSwitch('student'); setMobileMenuOpen(false); }}
                  className="p-2 bg-blue-600/30 text-blue-300 rounded-lg font-medium"
                >
                  Student
                </button>
                <button
                  onClick={() => { handleRoleSwitch('recruiter'); setMobileMenuOpen(false); }}
                  className="p-2 bg-purple-600/30 text-purple-300 rounded-lg font-medium"
                >
                  Recruiter
                </button>
                <button
                  onClick={() => { handleRoleSwitch('academician'); setMobileMenuOpen(false); }}
                  className="p-2 bg-emerald-600/30 text-emerald-300 rounded-lg font-medium"
                >
                  Academician
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <FirebaseConfigModal
        isOpen={showFirebaseModal}
        onClose={() => setShowFirebaseModal(false)}
      />
    </header>
  );
}
