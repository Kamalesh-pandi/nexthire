import React, { useState, useEffect } from 'react';
import { Search, Briefcase, Building2, MapPin, DollarSign, Calendar, Sparkles, CheckCircle2, Send, RefreshCw } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { fetchJobsFromFirestore, createApplicationInFirestore, fetchApplicationsFromFirestore } from '../../services/firebase';

export default function JobsAndInternships() {
  const { currentUser } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [appliedSuccess, setAppliedSuccess] = useState(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [jobsList, userApps] = await Promise.all([
          fetchJobsFromFirestore(),
          fetchApplicationsFromFirestore(currentUser ? { userId: currentUser.id } : {})
        ]);
        setJobs(jobsList);
        setAppliedJobs(userApps.map(a => a.jobId));
      } catch (err) {
        console.error("Firestore data fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [currentUser]);

  const calculateMatchScore = (requiredSkills) => {
    if (!currentUser?.skills || !requiredSkills) return 75;
    const userSkillSet = new Set(currentUser.skills.map(s => s.toLowerCase()));
    let matches = 0;
    requiredSkills.forEach(skill => {
      if (userSkillSet.has(skill.toLowerCase())) matches++;
    });
    return Math.round((matches / requiredSkills.length) * 100);
  };

  const handleApply = async (job) => {
    if (!appliedJobs.includes(job.id)) {
      const matchScore = calculateMatchScore(job.skillsRequired);
      const appData = {
        jobId: job.id,
        jobTitle: job.title,
        companyName: job.companyName,
        companyId: job.companyId || 'rec_001',
        userId: currentUser?.id || 'std_demo',
        userName: currentUser?.name || 'Student Candidate',
        userEmail: currentUser?.email || 'student@nexthire.ai',
        userSkills: currentUser?.skills || ['React.js', 'Python'],
        resumeScore: currentUser?.resumeScore || 85,
        matchPercentage: matchScore,
        status: 'Applied',
        appliedAt: new Date().toISOString().split('T')[0]
      };

      await createApplicationInFirestore(appData);
      setAppliedJobs([...appliedJobs, job.id]);
      setAppliedSuccess(job.title);
      setTimeout(() => setAppliedSuccess(null), 4000);
    }
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (job.skillsRequired && job.skillsRequired.some(s => s.toLowerCase().includes(searchTerm.toLowerCase())));
    const matchesType = filterType === 'All' || job.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-8 pb-16">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
            Real-Time Firestore Jobs
          </span>
          <h1 className="text-2xl font-extrabold text-slate-100 mt-1">Jobs & AI-Matched Internships</h1>
        </div>

        {appliedSuccess && (
          <div className="px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4" /> Application Submitted to Firestore for {appliedSuccess}!
          </div>
        )}
      </div>

      {/* Filter Bar */}
      <div className="glass-panel rounded-2xl p-4 border border-slate-700/80 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by job title, company, or required skill (e.g. React, PyTorch)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-800/80 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          {['All', 'Internship', 'Full-Time'].map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                filterType === type
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Jobs Listing */}
      {loading ? (
        <div className="py-12 text-center text-xs text-slate-400 flex flex-col items-center gap-2">
          <RefreshCw className="w-6 h-6 text-blue-400 animate-spin" />
          <span>Fetching real-time opportunities from Firestore...</span>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredJobs.map((job) => {
            const matchPercent = calculateMatchScore(job.skillsRequired);
            const isApplied = appliedJobs.includes(job.id);

            return (
              <div key={job.id} className="glass-card rounded-3xl p-6 border border-slate-700/60 space-y-4 hover:border-blue-500/50 transition-all">
                
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-semibold text-blue-400 flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5" /> {job.companyName}
                      </span>
                      <span className="text-slate-600">•</span>
                      <span className="text-slate-400 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" /> {job.location}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-100">{job.title}</h3>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                      <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-semibold border border-slate-700">
                        {job.type}
                      </span>
                      <span className="text-emerald-400 font-semibold">{job.stipend}</span>
                      <span>Deadline: {job.deadline}</span>
                    </div>
                  </div>

                  {/* AI Match Badge & Apply Button */}
                  <div className="flex flex-col items-start md:items-end gap-3 shrink-0">
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-bold">
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      <span>Skill Match: {matchPercent}%</span>
                    </div>

                    <button
                      onClick={() => handleApply(job)}
                      disabled={isApplied}
                      className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all ${
                        isApplied
                          ? 'bg-slate-800 text-emerald-400 cursor-not-allowed border border-emerald-500/30'
                          : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-500/20'
                      }`}
                    >
                      {isApplied ? (
                        <>
                          <CheckCircle2 className="w-4 h-4" /> Applied
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" /> Apply Now
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed pt-2 border-t border-slate-800">
                  {job.description}
                </p>

                {/* Skill Tags Required */}
                <div className="space-y-1">
                  <span className="text-[11px] text-slate-400">Required Skills:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {(job.skillsRequired || []).map((skill, i) => (
                      <span key={i} className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
