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
  Database,
  LayoutDashboard,
  Briefcase,
  PlusSquare,
  UserCheck,
  Search,
  BarChart3,
  TrendingUp,
  BookOpenCheck
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
                    <div className="absolute right-0 mt-2 w-64 bg-slate-900 rounded-2xl shadow-2xl py-2 border border-slate-700/90 z-50 animate-in fade-in slide-in-from-top-2">
                      <div className="px-4 py-2.5 border-b border-slate-800">
                        <p className="text-sm font-bold text-slate-100">{currentUser.name}</p>
                        <p className="text-xs text-slate-400 truncate mt-0.5">{currentUser.email}</p>
                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded-md border border-blue-500/30">
                            {userRole}
                          </span>
                          <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-medium">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
                            Active
                          </span>
                        </div>
                      </div>

                      {/* Navigation Links for Current Role */}
                      <div className="py-2 border-b border-slate-800 space-y-0.5 px-1">
                        <p className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          Menu Options
                        </p>

                        {/* Student Links */}
                        {userRole === 'student' && (
                          <>
                            <Link
                              to="/student/dashboard"
                              onClick={() => setShowUserDropdown(false)}
                              className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/80 rounded-xl transition-colors"
                            >
                              <LayoutDashboard className="w-4 h-4 text-blue-400" />
                              Dashboard
                            </Link>
                            <Link
                              to="/student/profile"
                              onClick={() => setShowUserDropdown(false)}
                              className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/80 rounded-xl transition-colors"
                            >
                              <User className="w-4 h-4 text-purple-400" />
                              My Profile & Skills
                            </Link>
                            <Link
                              to="/student/resume-analyzer"
                              onClick={() => setShowUserDropdown(false)}
                              className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/80 rounded-xl transition-colors"
                            >
                              <Sparkles className="w-4 h-4 text-amber-400" />
                              AI Resume Analyzer
                            </Link>
                            <Link
                              to="/student/jobs"
                              onClick={() => setShowUserDropdown(false)}
                              className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/80 rounded-xl transition-colors"
                            >
                              <Briefcase className="w-4 h-4 text-emerald-400" />
                              Jobs & Internships
                            </Link>
                          </>
                        )}

                        {/* Academician Links */}
                        {userRole === 'academician' && (
                          <>
                            <Link
                              to="/academician/dashboard"
                              onClick={() => setShowUserDropdown(false)}
                              className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/80 rounded-xl transition-colors"
                            >
                              <LayoutDashboard className="w-4 h-4 text-blue-400" />
                              Placement Dashboard
                            </Link>
                            <Link
                              to="/academician/analytics"
                              onClick={() => setShowUserDropdown(false)}
                              className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/80 rounded-xl transition-colors"
                            >
                              <BarChart3 className="w-4 h-4 text-purple-400" />
                              Skill Gap Analytics
                            </Link>
                            <Link
                              to="/academician/monitoring"
                              onClick={() => setShowUserDropdown(false)}
                              className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/80 rounded-xl transition-colors"
                            >
                              <TrendingUp className="w-4 h-4 text-emerald-400" />
                              Student Readiness
                            </Link>
                            <Link
                              to="/academician/curriculum-projects"
                              onClick={() => setShowUserDropdown(false)}
                              className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/80 rounded-xl transition-colors"
                            >
                              <BookOpenCheck className="w-4 h-4 text-amber-400" />
                              AI Curriculum & Projects
                            </Link>
                          </>
                        )}

                        {/* Recruiter / Industry Links */}
                        {(userRole === 'recruiter' || userRole === 'industry') && (
                          <>
                            <Link
                              to="/industry/dashboard"
                              onClick={() => setShowUserDropdown(false)}
                              className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/80 rounded-xl transition-colors"
                            >
                              <LayoutDashboard className="w-4 h-4 text-blue-400" />
                              Recruiter Dashboard
                            </Link>
                            <Link
                              to="/industry/post-job"
                              onClick={() => setShowUserDropdown(false)}
                              className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/80 rounded-xl transition-colors"
                            >
                              <PlusSquare className="w-4 h-4 text-purple-400" />
                              Post Job / Internship
                            </Link>
                            <Link
                              to="/industry/applicants"
                              onClick={() => setShowUserDropdown(false)}
                              className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/80 rounded-xl transition-colors"
                            >
                              <UserCheck className="w-4 h-4 text-emerald-400" />
                              AI Candidate Ranking
                            </Link>
                            <Link
                              to="/industry/search-students"
                              onClick={() => setShowUserDropdown(false)}
                              className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/80 rounded-xl transition-colors"
                            >
                              <Search className="w-4 h-4 text-amber-400" />
                              Search Students
                            </Link>
                          </>
                        )}

                        {/* Admin Link */}
                        {userRole === 'admin' && (
                          <Link
                            to="/admin/dashboard"
                            onClick={() => setShowUserDropdown(false)}
                            className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/80 rounded-xl transition-colors"
                          >
                            <LayoutDashboard className="w-4 h-4 text-blue-400" />
                            Admin Panel
                          </Link>
                        )}
                      </div>

                      {/* Sign Out Action */}
                      <div className="pt-1 px-1 border-t border-slate-800 mt-1">
                        <button
                          onClick={() => {
                            setShowUserDropdown(false);
                            logout();
                            navigate('/login');
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
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
              <p className="text-xs text-slate-200 font-bold">{currentUser.name}</p>
              <p className="text-[11px] text-slate-400">{currentUser.email}</p>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                  navigate('/login');
                }}
                className="w-full py-2 px-3 bg-red-500/20 text-red-300 rounded-lg text-xs font-semibold hover:bg-red-500/30 transition-colors flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
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
