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
    <aside className="w-64 bg-white border-r border-slate-200 hidden lg:flex flex-col justify-between py-6 px-4 shrink-0 min-h-[calc(100vh-4rem)]">
      <div className="space-y-6">
        
        {/* Role Header Badge */}
        <div className="px-3 py-2 rounded-xl bg-blue-50 border border-blue-100 flex items-center gap-2.5">
          <div className={`w-2.5 h-2.5 rounded-full ${
            userRole === 'student' ? 'bg-blue-600' :
            userRole === 'recruiter' ? 'bg-indigo-600' : 'bg-emerald-600'
          }`} />
          <div className="text-xs font-bold text-blue-900 uppercase tracking-wider">
            {userRole === 'student' && '🎓 Student Workspace'}
            {userRole === 'recruiter' && '🏭 Industry Workspace'}
            {userRole === 'academician' && '👨‍🏫 Academician Portal'}
            {userRole === 'admin' && '🛡️ Admin Control'}
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
                  `flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20 font-semibold'
                      : 'text-slate-600 hover:text-blue-700 hover:bg-blue-50/70'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <IconComponent className="w-4 h-4" />
                  <span>{link.label}</span>
                </div>
                {link.badge && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-blue-100 text-blue-800 border border-blue-200">
                    {link.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* AI Assistant Callout Box */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-50 via-indigo-50/50 to-white border border-blue-200/80 text-xs text-slate-700 space-y-2">
        <div className="flex items-center gap-2 text-blue-700 font-bold">
          <Sparkles className="w-4 h-4 text-blue-600" />
          <span>Gemini 2.5 AI Engine</span>
        </div>
        <p className="text-[11px] leading-relaxed text-slate-600">
          Real-time skill extraction, ATS scoring, candidate ranking, and curriculum alignment engine.
        </p>
      </div>
    </aside>
  );
}
