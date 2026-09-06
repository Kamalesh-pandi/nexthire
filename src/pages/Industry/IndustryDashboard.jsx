import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  Users, 
  PlusSquare, 
  UserCheck, 
  Sparkles, 
  Briefcase, 
  Search, 
  ArrowUpRight,
  Award
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { fetchJobsFromFirestore, fetchApplicationsFromFirestore } from '../../services/firebase';
import JobPostModal from '../../components/industry/JobPostModal';
import ChatModal from '../../components/common/ChatModal';

export default function IndustryDashboard() {
  const { currentUser } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [chatRecipient, setChatRecipient] = useState(null);

  useEffect(() => {
    async function loadDashboardData() {
      setLoading(true);
      try {
        const [jobsList, appsList] = await Promise.all([
          fetchJobsFromFirestore(),
          fetchApplicationsFromFirestore()
        ]);
        setJobs(jobsList);
        setApplications(appsList);
      } catch (err) {
        console.error("Error loading recruiter dashboard data from Firestore:", err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  const handleJobCreated = (newJob) => {
    setJobs([newJob, ...jobs]);
  };

  const shortlistedCount = applications.filter(a => a.status === 'Shortlisted').length;
  const avgMatchScore = applications.length > 0
    ? Math.round(applications.reduce((acc, a) => acc + (a.matchPercentage || 75), 0) / applications.length)
    : 85;

  return (
    <div className="space-y-8 pb-16">
      
      {/* Recruiter Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-purple-500/30 relative overflow-hidden bg-gradient-to-r from-purple-950/40 via-slate-900/80 to-blue-950/40">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
              🏭 Industry Recruiter Workspace
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100">
              {currentUser?.companyName || 'NexusTech AI Solutions'}
            </h1>
            <p className="text-xs text-slate-300 max-w-xl">
              Recruiter Portal • {currentUser?.name || 'Dr. Priya Nair'}
            </p>
          </div>

          <button
            onClick={() => setIsPostModalOpen(true)}
            className="self-start md:self-center px-5 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-xl shadow-purple-500/30 flex items-center gap-2 transform hover:-translate-y-0.5 transition-all"
          >
            <PlusSquare className="w-4 h-4" />
            <span>Post Opportunity</span>
          </button>
        </div>
      </div>

      {/* Recruiter Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        <div className="glass-card rounded-2xl p-5 border border-slate-700/60 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium">Total Applicants</p>
            <h3 className="text-2xl font-black text-purple-400 mt-1">{applications.length}</h3>
            <span className="text-[10px] text-emerald-400 block mt-1">Real-time Database Count</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-slate-700/60 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium">Active Job Postings</p>
            <h3 className="text-2xl font-black text-blue-400 mt-1">{jobs.length}</h3>
            <span className="text-[10px] text-slate-400 block mt-1">Live Firestore Listings</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
            <Briefcase className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-slate-700/60 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium">Shortlisted Talent</p>
            <h3 className="text-2xl font-black text-emerald-400 mt-1">
              {shortlistedCount}
            </h3>
            <span className="text-[10px] text-emerald-300 block mt-1">Ready for Interview</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
            <UserCheck className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-slate-700/60 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium">Avg Candidate Match</p>
            <h3 className="text-2xl font-black text-amber-400 mt-1">{avgMatchScore}%</h3>
            <span className="text-[10px] text-amber-300 block mt-1">AI Verified Skills</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
            <Sparkles className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Main Recruiter Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Active Job Postings */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-purple-400" /> Active Job & Internship Postings
            </h3>
            <button 
              onClick={() => setIsPostModalOpen(true)}
              className="text-xs text-purple-400 hover:underline font-semibold"
            >
              + Post New
            </button>
          </div>

          <div className="space-y-4">
            {loading ? (
              <div className="p-8 text-center text-slate-400 text-xs font-medium">
                Fetching live opportunities from Firestore...
              </div>
            ) : jobs.length === 0 ? (
              <div className="p-8 text-center glass-card rounded-2xl border border-slate-700/60 text-slate-400 text-xs">
                No active jobs posted yet. Click "+ Post New" to create one.
              </div>
            ) : (
              jobs.map((job) => {
                const jobAppCount = applications.filter(a => a.jobId === job.id).length;
                return (
                  <div key={job.id} className="glass-card rounded-2xl p-5 border border-slate-700/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-semibold">
                          {job.type}
                        </span>
                        <span className="text-slate-500">•</span>
                        <span className="text-slate-400">{job.location}</span>
                      </div>

                      <h4 className="text-base font-bold text-slate-100">{job.title}</h4>

                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {job.skillsRequired && job.skillsRequired.map((s, i) => (
                          <span key={i} className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Link
                        to="/industry/applicants"
                        className="px-4 py-2 rounded-xl bg-purple-600/90 hover:bg-purple-600 text-white font-semibold text-xs shadow-md shadow-purple-500/20 flex items-center gap-1.5"
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>View Applicants ({jobAppCount})</span>
                      </Link>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Top Candidates Spotlight & Search */}
        <div className="space-y-6">
          <div className="glass-card rounded-3xl p-6 border border-slate-700/60 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-700/50">
              <h4 className="text-sm font-bold text-slate-200">Top Candidate Spotlight</h4>
              <Link to="/industry/applicants" className="text-xs text-purple-400 hover:underline font-medium">Rankings</Link>
            </div>

            <div className="space-y-3">
              {applications.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-4">No candidate applications recorded yet.</p>
              ) : (
                applications.slice(0, 3).map((app) => (
                  <div key={app.id} className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-100">{app.userName}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                        {app.matchPercentage}% Match
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">{app.jobTitle}</p>
                    <button
                      onClick={() => setChatRecipient({ name: app.userName, role: 'Student' })}
                      className="w-full py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold transition-colors"
                    >
                      Contact Student
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="glass-card rounded-3xl p-6 border border-purple-500/30 bg-gradient-to-br from-purple-950/40 to-slate-900 space-y-3">
            <h4 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Search className="w-4 h-4 text-purple-400" /> Search Talent Directory
            </h4>
            <p className="text-xs text-slate-400">
              Find students by skill tags, institute name, or ATS resume score.
            </p>
            <Link
              to="/industry/search-students"
              className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20 transition-colors"
            >
              <span>Browse Student Profiles</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

      </div>

      <JobPostModal
        isOpen={isPostModalOpen}
        onClose={() => setIsPostModalOpen(false)}
        onJobCreated={handleJobCreated}
      />

      {chatRecipient && (
        <ChatModal
          recipientName={chatRecipient.name}
          recipientRole={chatRecipient.role}
          onClose={() => setChatRecipient(null)}
        />
      )}

    </div>
  );
}
