import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  TrendingUp, 
  BarChart3, 
  BookOpenCheck, 
  Sparkles, 
  PlusSquare, 
  Users, 
  Award,
  ArrowUpRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { fetchProjectsFromFirestore, fetchStudentsForMentorFromFirestore } from '../../services/firebase';
import StudentSkillMatrix from '../../components/academician/StudentSkillMatrix';
import ProjectPostModal from '../../components/academician/ProjectPostModal';

export default function AcademicianDashboard() {
  const { currentUser } = useAuth();
  const [projects, setProjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [studentsCount, setStudentsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);

  useEffect(() => {
    async function loadData() {
      if (!currentUser) return;
      setLoading(true);
      try {
        const [projs, mentorStudents] = await Promise.all([
          fetchProjectsFromFirestore(),
          fetchStudentsForMentorFromFirestore(currentUser)
        ]);
        
        // Strict deduplication for projects
        const uniqueProjs = [];
        const seenProjs = new Set();
        projs.forEach(p => {
          const key = (p.title || p.id || '').toLowerCase().trim();
          if (key && !seenProjs.has(key)) {
            seenProjs.add(key);
            uniqueProjs.push(p);
          }
        });
        setProjects(uniqueProjs);

        // Strict deduplication for assigned students of this mentor
        const uniqueStds = [];
        const seenStds = new Set();
        mentorStudents.forEach(s => {
          const key = (s.email || s.id || s.name || '').toLowerCase().trim();
          if (key && !seenStds.has(key)) {
            seenStds.add(key);
            uniqueStds.push(s);
          }
        });
        setStudents(uniqueStds);
        setStudentsCount(uniqueStds.length);
      } catch (err) {
        console.error("Failed loading academician dashboard data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [currentUser]);

  const handleProjectCreated = (newProj) => {
    setProjects(prev => {
      const filtered = prev.filter(p => p.id !== newProj.id && p.title?.toLowerCase() !== newProj.title?.toLowerCase());
      return [newProj, ...filtered];
    });
  };

  const placementReadyCount = students.filter(s => (s.resumeScore || 0) >= 75).length;
  const placementRate = students.length > 0 
    ? Math.round((placementReadyCount / students.length) * 100) 
    : 0;

  const avgScore = students.length > 0
    ? Math.round(students.reduce((acc, s) => acc + (s.resumeScore || 75), 0) / students.length)
    : 0;

  return (
    <div className="space-y-8 pb-16">
      
      {/* Academician Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-emerald-500/30 relative overflow-hidden bg-gradient-to-r from-emerald-950/40 via-slate-900/80 to-teal-950/40">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              👨‍🏫 Academician Collaboration Workspace
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100">
              {currentUser?.institution || currentUser?.collegeName || 'IIT Delhi - Dept of Computer Science'}
            </h1>
            <p className="text-xs text-slate-300 max-w-xl">
              Academic Portal • {currentUser?.name || 'Prof. Rajesh Kumar'}
            </p>
          </div>

          <button
            onClick={() => setIsProjectModalOpen(true)}
            className="self-start md:self-center px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-xl shadow-emerald-500/30 flex items-center gap-2 transform hover:-translate-y-0.5 transition-all"
          >
            <PlusSquare className="w-4 h-4" />
            <span>Post Capstone Project</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        <div className="glass-card rounded-2xl p-5 border border-slate-700/60 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium">Assigned Mentees</p>
            <h3 className="text-2xl font-black text-emerald-400 mt-1">{studentsCount}</h3>
            <span className="text-[10px] text-slate-400 block mt-1">Students Mapped to You</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-slate-700/60 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium">Mentee Placement Readiness</p>
            <h3 className="text-2xl font-black text-blue-400 mt-1">{studentsCount > 0 ? `${placementRate}%` : '0%'}</h3>
            <span className="text-[10px] text-emerald-400 block mt-1">{studentsCount > 0 ? 'Based on Live ATS Scores' : 'No Mentees Assigned'}</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-slate-700/60 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium">Average Mentee Score</p>
            <h3 className="text-2xl font-black text-amber-400 mt-1">{studentsCount > 0 ? `${avgScore}%` : '0%'}</h3>
            <span className="text-[10px] text-amber-300 block mt-1">{studentsCount > 0 ? 'Recruiter Benchmark' : 'No Mentees Assigned'}</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
            <Sparkles className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-slate-700/60 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium">Active Capstone Projects</p>
            <h3 className="text-2xl font-black text-purple-400 mt-1">{projects.length}</h3>
            <span className="text-[10px] text-purple-300 block mt-1">Industry Co-Sponsored</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
            <BookOpenCheck className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2-Cols: Student Skill Deficit Matrix */}
        <div className="lg:col-span-2 space-y-6">
          <StudentSkillMatrix students={students} />

          {/* Industry Co-Sponsored Capstone Projects */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <BookOpenCheck className="w-5 h-5 text-emerald-400" /> Academic & Industry Projects
              </h3>
              <button onClick={() => setIsProjectModalOpen(true)} className="text-xs text-emerald-400 hover:underline font-semibold">
                + Add Project
              </button>
            </div>

            <div className="space-y-4">
              {loading ? (
                <div className="glass-card rounded-2xl p-6 text-center text-xs text-slate-400">
                  Fetching capstone projects from database...
                </div>
              ) : projects.length === 0 ? (
                <div className="glass-card rounded-2xl p-6 text-center text-xs text-slate-400">
                  No projects posted yet. Click "+ Add Project" to create one.
                </div>
              ) : (
                projects.map((proj) => (
                  <div key={proj.id} className="glass-card rounded-2xl p-5 border border-slate-700/60 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        Partner: {proj.industryPartner || 'Industry Partner'}
                      </span>
                      <span className="text-xs text-slate-400">Deadline: {proj.deadline || '2026-12-31'}</span>
                    </div>

                    <h4 className="text-base font-bold text-slate-100">{proj.title}</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">{proj.description}</p>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {(proj.requiredSkills || []).map((s, i) => (
                        <span key={i} className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right 1-Col: AI Curriculum Recommendations Trigger & Quick Links */}
        <div className="space-y-6">
          
          <div className="glass-card rounded-3xl p-6 border border-emerald-500/30 bg-gradient-to-br from-emerald-950/40 to-slate-900 space-y-4">
            <div className="flex items-center gap-2 text-emerald-300 font-bold text-sm">
              <Sparkles className="w-5 h-5 text-amber-300" />
              <span>AI Curriculum Engine</span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Gemini AI has identified that adding a 3-week <span className="text-emerald-400 font-semibold">PyTorch RAG & Vector DB</span> practical lab will boost overall department placement alignment by 18%.
            </p>

            <Link
              to="/academician/curriculum-projects"
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-colors"
            >
              <span>View AI Syllabus Modules</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="glass-card rounded-3xl p-6 border border-slate-700/60 space-y-4">
            <h4 className="text-sm font-bold text-slate-200 pb-3 border-b border-slate-700/50">Quick Academic Tools</h4>
            <div className="space-y-2">
              <Link
                to="/academician/analytics"
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 text-xs font-semibold border border-slate-700/60"
              >
                <span>Cohort Analytics & Gap Trends</span>
                <BarChart3 className="w-4 h-4 text-blue-400" />
              </Link>
              <Link
                to="/academician/monitoring"
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 text-xs font-semibold border border-slate-700/60"
              >
                <span>Student Placement Readiness</span>
                <TrendingUp className="w-4 h-4 text-emerald-400" />
              </Link>
            </div>
          </div>

        </div>

      </div>

      <ProjectPostModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        onProjectCreated={handleProjectCreated}
      />

    </div>
  );
}
