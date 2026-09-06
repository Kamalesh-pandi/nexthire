import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Heart, Code2, ShieldCheck, ExternalLink, Globe } from 'lucide-react';
import { useAuth, getUserDashboardPath } from '../../context/AuthContext';

export default function Footer() {
  const { currentUser } = useAuth();
  const dashboardPath = currentUser ? getUserDashboardPath(currentUser) : '/login';

  return (
    <footer className="w-full border-t border-slate-200 bg-white py-12 px-4 sm:px-6 lg:px-8 mt-16 text-slate-600 text-xs">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Main Footer Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Col 1: Brand & Tagline */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-lg font-extrabold tracking-tight text-blue-950">Next<span className="text-blue-600">Hire</span></span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed max-w-sm">
              Empowering students, academicians, and industry recruiters with AI-driven ATS resume evaluation, skill gap diagnostics, and automated candidate matching.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-slate-500">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>All Systems Operational • Real-Time Database Sync</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider">Quick Navigation</h4>
            <ul className="space-y-2 text-slate-600 font-medium">
              <li>
                <Link to="/" className="hover:text-blue-600 transition-colors">Home Page</Link>
              </li>
              <li>
                <Link to={dashboardPath} className="hover:text-blue-600 transition-colors">My Workspace Dashboard</Link>
              </li>
              <li>
                <Link to="/student/resume-analyzer" className="hover:text-blue-600 transition-colors flex items-center gap-1">
                  <span>AI Resume Analyzer</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-blue-50 text-blue-700 font-bold border border-blue-200">AI</span>
                </Link>
              </li>
              <li>
                <Link to="/student/jobs" className="hover:text-blue-600 transition-colors">Jobs & Placement Drives</Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Platform Tech Stack & Specs */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider">Platform Architecture</h4>
            <div className="space-y-1.5 text-[11px] text-slate-500">
              <p className="flex items-center gap-1.5 font-medium">
                <Code2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>React.js & Tailwind CSS UI Engine</span>
              </p>
              <p className="flex items-center gap-1.5 font-medium">
                <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>Google Gemini 2.5 Multi-turn AI</span>
              </p>
              <p className="flex items-center gap-1.5 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Cloud BaaS Real-Time Database</span>
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Copyright Row */}
        <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} NextHire Academic & Recruitment Platform. All rights reserved.</p>
          
          <div className="flex items-center space-x-6 font-semibold">
            <a href="#" className="hover:text-blue-600 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-blue-600 transition-colors flex items-center gap-1">
              <Globe className="w-3.5 h-3.5 text-blue-600" /> SIH Portal
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}
