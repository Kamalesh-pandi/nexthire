import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  Briefcase, 
  UserCheck, 
  Search, 
  PlusSquare, 
  BarChart3, 
  GraduationCap, 
  Sparkles,
  BookOpenCheck,
  TrendingUp,
  Award
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Sidebar() {
  const { userRole } = useAuth();

  const getStudentLinks = () => [
    { to: '/student/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/student/profile', label: 'My Profile & Skills', icon: GraduationCap },
    { to: '/student/resume-analyzer', label: 'AI Resume Analyzer', icon: Sparkles, badge: 'AI' },
    { to: '/student/jobs', label: 'Jobs & Internships', icon: Briefcase },
  ];

  const getIndustryLinks = () => [
    { to: '/industry/dashboard', label: 'Recruiter Dashboard', icon: LayoutDashboard },
    { to: '/industry/post-job', label: 'Post Job / Internship', icon: PlusSquare },
    { to: '/industry/applicants', label: 'AI Candidate Ranking', icon: UserCheck, badge: 'AI' },
    { to: '/industry/search-students', label: 'Search Students', icon: Search },
  ];

  const getAcademicianLinks = () => [
    { to: '/academician/dashboard', label: 'Placement Dashboard', icon: LayoutDashboard },
    { to: '/academician/analytics', label: 'Skill Gap Analytics', icon: BarChart3 },
    { to: '/academician/monitoring', label: 'Student Readiness', icon: TrendingUp },
    { to: '/academician/curriculum-projects', label: 'AI Curriculum & Projects', icon: BookOpenCheck, badge: 'AI' },
  ];

  const getAdminLinks = () => [
    { to: '/admin/dashboard', label: 'Admin Approval Panel', icon: LayoutDashboard, badge: 'ADMIN' },
  ];

  const links = 
    userRole === 'admin' ? getAdminLinks() :
    userRole === 'student' ? getStudentLinks() :
    userRole === 'recruiter' || userRole === 'industry' ? getIndustryLinks() :
    userRole === 'academician' ? getAcademicianLinks() : [];


  return (
    <aside className="w-64 glass-panel border-r border-slate-700/50 hidden lg:flex flex-col justify-between py-6 px-4 shrink-0 min-h-[calc(100vh-4rem)]">
      <div className="space-y-6">
        
        {/* Role Header Badge */}
        <div className="px-3 py-2 rounded-xl bg-slate-800/60 border border-slate-700/50 flex items-center gap-2.5">
          <div className={`w-3 h-3 rounded-full ${
            userRole === 'student' ? 'bg-blue-500 animate-ping' :
            userRole === 'recruiter' ? 'bg-purple-500 animate-ping' : 'bg-emerald-500 animate-ping'
          }`} />
          <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
            {userRole === 'student' && '🎓 Student Workspace'}
            {userRole === 'recruiter' && '🏭 Industry Workspace'}
            {userRole === 'academician' && '👨‍🏫 Academician Portal'}
          </div>
        </div>

        {/* Links Navigation List */}
        <nav className="space-y-1">
          {links.map((link) => {
            const IconComponent = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2.5 rounded-xl font-medium text-sm transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600/90 to-indigo-600/90 text-white shadow-lg shadow-blue-500/20 border border-blue-400/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <IconComponent className="w-4 h-4" />
                  <span>{link.label}</span>
                </div>
                {link.badge && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-gradient-to-r from-amber-500 to-purple-500 text-white">
                    {link.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* AI Assistant Callout Box */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-900/40 via-purple-900/30 to-slate-900/60 border border-indigo-500/30 text-xs text-slate-300 space-y-2">
        <div className="flex items-center gap-2 text-indigo-300 font-semibold">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span>Gemini 2.5 AI Powered</span>
        </div>
        <p className="text-[11px] leading-relaxed text-slate-400">
          Real-time skill extraction, ATS scoring, candidate ranking, and curriculum alignment engine.
        </p>
      </div>
    </aside>
  );
}
