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
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              👨‍🏫 Academician Collaboration Workspace
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {currentUser?.institution || currentUser?.collegeName || 'IIT Delhi - Dept of Computer Science'}
            </h1>
            <p className="text-xs text-slate-600 max-w-xl">
              Academic Portal • {currentUser?.name || 'Prof. Rajesh Kumar'}
            </p>
          </div>

          <button
            onClick={() => setIsProjectModalOpen(true)}
            className="self-start md:self-center px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 flex items-center gap-2 transform hover:-translate-y-0.5 transition-all"
          >
            <PlusSquare className="w-4 h-4" />
            <span>Post Capstone Project</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-semibold">Assigned Mentees</p>
            <h3 className="text-2xl font-black text-blue-600 mt-1">{studentsCount}</h3>
            <span className="text-[10px] text-slate-400 block mt-1">Students Mapped to You</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold border border-blue-100">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-semibold">Mentee Placement Readiness</p>
            <h3 className="text-2xl font-black text-emerald-600 mt-1">{studentsCount > 0 ? `${placementRate}%` : '0%'}</h3>
            <span className="text-[10px] text-emerald-600 font-semibold block mt-1">{studentsCount > 0 ? 'Based on Live ATS Scores' : 'No Mentees Assigned'}</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold border border-emerald-100">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-semibold">Average Mentee Score</p>
            <h3 className="text-2xl font-black text-amber-600 mt-1">{studentsCount > 0 ? `${avgScore}%` : '0%'}</h3>
            <span className="text-[10px] text-amber-700 font-semibold block mt-1">{studentsCount > 0 ? 'Recruiter Benchmark' : 'No Mentees Assigned'}</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold border border-amber-100">
            <Sparkles className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-semibold">Active Capstone Projects</p>
            <h3 className="text-2xl font-black text-indigo-600 mt-1">{projects.length}</h3>
            <span className="text-[10px] text-indigo-600 font-semibold block mt-1">Industry Co-Sponsored</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold border border-indigo-100">
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
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <BookOpenCheck className="w-5 h-5 text-blue-600" /> Academic & Industry Projects
              </h3>
              <button onClick={() => setIsProjectModalOpen(true)} className="text-xs text-blue-600 hover:text-blue-700 hover:underline font-bold">
                + Add Project
              </button>
            </div>

            <div className="space-y-4">
              {loading ? (
                <div className="bg-white rounded-2xl p-6 text-center text-xs text-slate-500 border border-slate-200">
                  Fetching capstone projects from database...
                </div>
              ) : projects.length === 0 ? (
                <div className="bg-white rounded-2xl p-6 text-center text-xs text-slate-500 border border-slate-200">
                  No projects posted yet. Click "+ Add Project" to create one.
                </div>
              ) : (
                projects.map((proj) => (
                  <div key={proj.id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                        Partner: {proj.industryPartner || 'Industry Partner'}
                      </span>
                      <span className="text-xs text-slate-500">Deadline: {proj.deadline || '2026-12-31'}</span>
                    </div>

                    <h4 className="text-base font-bold text-slate-900">{proj.title}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">{proj.description}</p>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {(proj.requiredSkills || []).map((s, i) => (
                        <span key={i} className="text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 font-medium">
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
          
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-blue-700 font-bold text-sm">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <span>AI Curriculum Engine</span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Gemini AI has identified that adding a 3-week <span className="text-blue-700 font-bold">PyTorch RAG & Vector DB</span> practical lab will boost overall department placement alignment by 18%.
            </p>

            <Link
              to="/academician/curriculum-projects"
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 transition-colors"
            >
              <span>View AI Syllabus Modules</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <h4 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-200">Quick Academic Tools</h4>
            <div className="space-y-2">
              <Link
                to="/academician/analytics"
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-blue-50 text-slate-800 hover:text-blue-900 text-xs font-semibold border border-slate-200 transition-colors"
              >
                <span>Cohort Analytics & Gap Trends</span>
                <BarChart3 className="w-4 h-4 text-blue-600" />
              </Link>
              <Link
                to="/academician/monitoring"
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-blue-50 text-slate-800 hover:text-blue-900 text-xs font-semibold border border-slate-200 transition-colors"
              >
                <span>Student Placement Readiness</span>
                <TrendingUp className="w-4 h-4 text-emerald-600" />
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
