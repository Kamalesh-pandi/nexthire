import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

// Components
import Navbar from './components/common/Navbar';
import Sidebar from './components/common/Sidebar';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';
import PublicRoute from './components/common/PublicRoute';
import AICareerChatbot from './components/common/AICareerChatbot';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import WaitingApproval from './pages/WaitingApproval';
import AdminDashboard from './pages/Admin/AdminDashboard';

// Student Pages
import StudentDashboard from './pages/Student/StudentDashboard';
import StudentProfile from './pages/Student/StudentProfile';
import ResumeAnalyzer from './pages/Student/ResumeAnalyzer';
import JobsAndInternships from './pages/Student/JobsAndInternships';

// Industry Pages
import IndustryDashboard from './pages/Industry/IndustryDashboard';
import PostJob from './pages/Industry/PostJob';
import ApplicantsList from './pages/Industry/ApplicantsList';
import StudentSearch from './pages/Industry/StudentSearch';

// Academician Pages
import AcademicianDashboard from './pages/Academician/AcademicianDashboard';
import Analytics from './pages/Academician/Analytics';
import StudentMonitoring from './pages/Academician/StudentMonitoring';
import CurriculumProjects from './pages/Academician/CurriculumProjects';

function LayoutContent() {
  const location = useLocation();
  const isStandalonePage = ['/', '/login', '/register', '/waiting-approval'].includes(location.pathname);

  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-50 text-slate-900 selection:bg-blue-600 selection:text-white">
      <Navbar />

      <div className="flex-1 flex w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {!isStandalonePage && <Sidebar />}

        <main className={`flex-1 w-full ${!isStandalonePage ? 'lg:pl-8' : ''}`}>
          <Routes>
            {/* Public & General Pages (Automatically redirects active session to user dashboard, and expired session to login/landing) */}
            <Route path="/" element={
              <PublicRoute>
                <Home />
              </PublicRoute>
            } />
            <Route path="/login" element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } />
            <Route path="/register" element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            } />
            <Route path="/waiting-approval" element={
              <ProtectedRoute allowedRoles={['waiting', 'pending', 'student', 'industry', 'recruiter', 'academician', 'admin']}>
                <WaitingApproval />
              </ProtectedRoute>
            } />

            {/* Admin Module Protected Routes */}
            <Route path="/admin/dashboard" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } />

            {/* Student Module Protected Routes */}
            <Route path="/student/dashboard" element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentDashboard />
              </ProtectedRoute>
            } />
            <Route path="/student/profile" element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentProfile />
              </ProtectedRoute>
            } />
            <Route path="/student/resume-analyzer" element={
              <ProtectedRoute allowedRoles={['student']}>
                <ResumeAnalyzer />
              </ProtectedRoute>
            } />
            <Route path="/student/jobs" element={
              <ProtectedRoute allowedRoles={['student']}>
                <JobsAndInternships />
              </ProtectedRoute>
            } />

            {/* Industry Recruiter Module Protected Routes */}
            <Route path="/industry/dashboard" element={
              <ProtectedRoute allowedRoles={['industry', 'recruiter']}>
                <IndustryDashboard />
              </ProtectedRoute>
            } />
            <Route path="/industry/post-job" element={
              <ProtectedRoute allowedRoles={['industry', 'recruiter']}>
                <PostJob />
              </ProtectedRoute>
            } />
            <Route path="/industry/applicants" element={
              <ProtectedRoute allowedRoles={['industry', 'recruiter']}>
                <ApplicantsList />
              </ProtectedRoute>
            } />
            <Route path="/industry/search-students" element={
              <ProtectedRoute allowedRoles={['industry', 'recruiter']}>
                <StudentSearch />
              </ProtectedRoute>
            } />

            {/* Academician Module Protected Routes */}
            <Route path="/academician/dashboard" element={
              <ProtectedRoute allowedRoles={['academician']}>
                <AcademicianDashboard />
              </ProtectedRoute>
            } />
            <Route path="/academician/analytics" element={
              <ProtectedRoute allowedRoles={['academician']}>
                <Analytics />
              </ProtectedRoute>
            } />
            <Route path="/academician/monitoring" element={
              <ProtectedRoute allowedRoles={['academician']}>
                <StudentMonitoring />
              </ProtectedRoute>
            } />
            <Route path="/academician/curriculum-projects" element={
              <ProtectedRoute allowedRoles={['academician']}>
                <CurriculumProjects />
              </ProtectedRoute>
            } />

            {/* Fallback */}
            <Route path="*" element={<Home />} />
          </Routes>
        </main>
      </div>

      <AICareerChatbot />
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <LayoutContent />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}
