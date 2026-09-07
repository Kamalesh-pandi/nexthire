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
  Award,
  FileText
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { fetchJobsFromFirestore, fetchApplicationsFromFirestore, deduplicateJobs, fetchAllUsersFromFirestore } from '../../services/firebase';
import JobPostModal from '../../components/industry/JobPostModal';
import ChatModal from '../../components/common/ChatModal';
import StudentResumeModal from '../../components/industry/StudentResumeModal';

export default function IndustryDashboard() {
  const { currentUser } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [chatRecipient, setChatRecipient] = useState(null);
  const [selectedResumeCandidate, setSelectedResumeCandidate] = useState(null);

  useEffect(() => {
    async function loadDashboardData() {
      setLoading(true);
      try {
        const [jobsList, appsList, usersList] = await Promise.all([
          fetchJobsFromFirestore(),
          fetchApplicationsFromFirestore(),
          fetchAllUsersFromFirestore()
        ]);

        const enrichedApps = appsList.map(app => {
          const user = usersList.find(u => 
            (u.id && app.userId && u.id === app.userId) ||
            (u.uid && app.userId && u.uid === app.userId) ||
            (u.email && app.userEmail && u.email.toLowerCase() === app.userEmail.toLowerCase())
          );
          if (user) {
            return {
              ...app,
              resumeUrl: app.resumeUrl || user.resumeUrl || '',
              resumeFileName: app.resumeFileName || user.resumeFileName || '',
              resumeRawText: app.resumeRawText || user.resumeRawText || '',
              institution: app.institution || user.institution || user.collegeName || '',
              degree: app.degree || user.degree || '',
              bio: app.bio || user.bio || ''
            };
          }
          return app;
        });

        setJobs(deduplicateJobs(jobsList));
        setApplications(enrichedApps);
      } catch (err) {
        console.error("Error loading recruiter dashboard data from Firestore:", err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  const handleJobCreated = (newJob) => {
    setJobs(prev => deduplicateJobs([newJob, ...prev]));
  };

  const shortlistedCount = applications.filter(a => a.status === 'Shortlisted').length;
  const avgMatchScore = applications.length > 0
    ? Math.round(applications.reduce((acc, a) => acc + (a.matchPercentage || 75), 0) / applications.length)
    : 85;

  return (
    <div className="space-y-8 pb-16">
      
      {/* Recruiter Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              🏭 Industry Recruiter Workspace
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {currentUser?.companyName || 'NexusTech AI Solutions'}
            </h1>
            <p className="text-xs text-slate-600 max-w-xl">
              Recruiter Portal • {currentUser?.name || 'Dr. Priya Nair'}
            </p>
          </div>

          <button
            onClick={() => setIsPostModalOpen(true)}
            className="self-start md:self-center px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 flex items-center gap-2 transform hover:-translate-y-0.5 transition-all"
          >
            <PlusSquare className="w-4 h-4" />
            <span>Post Opportunity</span>
          </button>
        </div>
      </div>

      {/* Recruiter Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-semibold">Total Applicants</p>
            <h3 className="text-2xl font-black text-blue-600 mt-1">{applications.length}</h3>
            <span className="text-[10px] text-emerald-600 font-semibold block mt-1">Real-time Database Count</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold border border-blue-100">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-semibold">Active Job Postings</p>
            <h3 className="text-2xl font-black text-indigo-600 mt-1">{jobs.length}</h3>
            <span className="text-[10px] text-slate-400 block mt-1">Open Positions</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold border border-indigo-100">
            <Briefcase className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-semibold">Shortlisted Candidates</p>
            <h3 className="text-2xl font-black text-emerald-600 mt-1">{shortlistedCount}</h3>
            <span className="text-[10px] text-slate-400 block mt-1">In Evaluation Pipeline</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold border border-emerald-100">
            <UserCheck className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-semibold">Avg AI Match Score</p>
            <h3 className="text-2xl font-black text-amber-600 mt-1">{avgMatchScore}%</h3>
            <span className="text-[10px] text-slate-400 block mt-1">Candidate-Job Compatibility</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold border border-amber-100">
            <Sparkles className="w-6 h-6 text-amber-500" />
          </div>
        </div>

      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Active Postings Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-blue-600" /> Active Job & Internship Postings
            </h3>
            <button 
              onClick={() => setIsPostModalOpen(true)}
              className="text-xs text-blue-600 hover:text-blue-700 hover:underline font-bold"
            >
              + Post New
            </button>
          </div>

          <div className="space-y-4">
            {loading ? (
              <div className="p-8 text-center text-slate-500 text-xs font-medium">
                Fetching live opportunities...
              </div>
            ) : jobs.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 text-xs">
                No active jobs posted yet. Click "+ Post New" to create one.
              </div>
            ) : (
              jobs.map((job) => {
                const jobAppCount = applications.filter(a => a.jobId === job.id).length;
                return (
                  <div key={job.id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 font-bold border border-blue-200">
                          {job.type}
                        </span>
                        <span className="text-slate-300">•</span>
                        <span className="text-slate-500 font-medium">{job.location}</span>
                      </div>

                      <h4 className="text-base font-bold text-slate-900">{job.title}</h4>

                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {job.skillsRequired && job.skillsRequired.map((s, i) => (
                          <span key={i} className="text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 font-medium">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Link
                        to="/industry/applicants"
                        className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 flex items-center gap-1.5 transition-colors"
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
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h4 className="text-sm font-bold text-slate-900">Top Candidate Spotlight</h4>
              <Link to="/industry/applicants" className="text-xs text-blue-600 hover:text-blue-700 font-bold hover:underline">Rankings</Link>
            </div>

            <div className="space-y-3">
              {applications.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-4">No candidate applications recorded yet.</p>
              ) : (
                applications.slice(0, 3).map((app) => (
                  <div key={app.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">{app.userName}</span>
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {app.matchPercentage}% Match
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium">{app.jobTitle}</p>
                    <div className="grid grid-cols-2 gap-1.5 pt-1">
                      <button
                        onClick={() => setSelectedResumeCandidate(app)}
                        className="py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-[11px] font-bold flex items-center justify-center gap-1 transition-colors border border-blue-200 shadow-2xs"
                      >
                        <FileText className="w-3 h-3 text-blue-600" /> View Resume
                      </button>
                      <button
                        onClick={() => setChatRecipient({ name: app.userName, role: 'Student' })}
                        className="py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 text-[11px] font-semibold transition-colors border border-slate-200 shadow-2xs"
                      >
                        Contact
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-3">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Search className="w-4 h-4 text-blue-600" /> Search Talent Directory
            </h4>
            <p className="text-xs text-slate-600">
              Find students by skill tags, institute name, or ATS resume score.
            </p>
            <Link
              to="/industry/search-students"
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 transition-colors"
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

      {selectedResumeCandidate && (
        <StudentResumeModal
          candidate={selectedResumeCandidate}
          onClose={() => setSelectedResumeCandidate(null)}
          onOpenChat={(name, role) => {
            setSelectedResumeCandidate(null);
            setChatRecipient({ name, role });
          }}
        />
      )}

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
