import React, { useState, useEffect } from 'react';
import { UserCheck, Sparkles, Filter, CheckCircle2, Award } from 'lucide-react';
import { fetchJobsFromFirestore, fetchApplicationsFromFirestore, updateApplicationStatusInFirestore, deduplicateJobs } from '../../services/firebase';
import { addNotification } from '../../services/notificationService';
import { rankCandidatesForJob } from '../../services/aiService';
import CandidateRankCard from '../../components/industry/CandidateRankCard';
import ChatModal from '../../components/common/ChatModal';

export default function ApplicantsList() {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJobId, setSelectedJobId] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [chatRecipient, setChatRecipient] = useState(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [jobsList, appsList] = await Promise.all([
          fetchJobsFromFirestore(),
          fetchApplicationsFromFirestore()
        ]);
        const uniqueJobs = deduplicateJobs(jobsList);
        setJobs(uniqueJobs);
        setApplications(appsList);
        if (uniqueJobs.length > 0) {
          setSelectedJobId(uniqueJobs[0].id);
        }
      } catch (err) {
        console.error("Firestore error loading applicants list:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const selectedJob = jobs.find(j => j.id === selectedJobId) || jobs[0] || {
    id: 'none',
    title: 'No Job Selected',
    companyName: 'N/A',
    skillsRequired: ['React.js', 'Python']
  };

  const jobApplications = applications.filter(a => a.jobId === selectedJobId || (!selectedJobId && applications.length > 0));
  const rankedCandidates = rankCandidatesForJob(jobApplications, selectedJob.skillsRequired || []);

  const filteredCandidates = rankedCandidates.filter(c => {
    if (statusFilter === 'All') return true;
    return c.status === statusFilter;
  });

  const handleStatusChange = async (appId, newStatus) => {
    const targetApp = applications.find(a => a.id === appId);
    setApplications(prev =>
      prev.map(app => (app.id === appId ? { ...app, status: newStatus } : app))
    );
    await updateApplicationStatusInFirestore(appId, newStatus);

    if (targetApp) {
      if (newStatus === 'Shortlisted') {
        addNotification({
          userId: targetApp.userId,
          userEmail: targetApp.userEmail,
          title: `🎉 Shortlisted: ${targetApp.jobTitle}`,
          message: `Congratulations! ${targetApp.companyName || 'Recruiter'} has shortlisted your candidate profile for ${targetApp.jobTitle}.`,
          type: 'shortlisted',
          link: '/student/dashboard'
        });
      } else if (newStatus === 'Rejected') {
        addNotification({
          userId: targetApp.userId,
          userEmail: targetApp.userEmail,
          title: `ℹ️ Application Update: ${targetApp.jobTitle}`,
          message: `${targetApp.companyName || 'Recruiter'} has updated your application status for ${targetApp.jobTitle}.`,
          type: 'info',
          link: '/student/dashboard'
        });
      }
    }
  };

  return (
    <div className="space-y-8 pb-16">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
            Recruiter Intelligence
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-1">AI Candidate Ranking & Evaluation</h1>
        </div>
      </div>

      {/* Select Job & Status Filter */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="w-full md:w-1/2 space-y-1">
          <label className="text-xs font-semibold text-slate-700">Select Job Posting</label>
          {loading ? (
            <div className="text-xs text-slate-500 py-2">Loading job listings...</div>
          ) : (
            <select
              value={selectedJobId}
              onChange={(e) => setSelectedJobId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2 text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-blue-600 transition-colors"
            >
              {jobs.length === 0 ? (
                <option value="">No Jobs Found in Database</option>
              ) : (
                jobs.map(j => (
                  <option key={j.id} value={j.id}>{j.title} ({j.companyName || 'Company'})</option>
                ))
              )}
            </select>
          )}
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto self-end">
          {['All', 'Shortlisted', 'Applied', 'Rejected'].map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                statusFilter === st
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Job Required Skills Pill Summary */}
      {selectedJob && (
        <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 flex items-center gap-3">
          <Sparkles className="w-5 h-5 text-amber-500 shrink-0" />
          <div className="flex-1 space-y-1">
            <span className="text-xs font-bold text-slate-900">AI Match Criteria for "{selectedJob.title}":</span>
            <div className="flex flex-wrap gap-1.5">
              {selectedJob.skillsRequired && selectedJob.skillsRequired.map((skill, i) => (
                <span key={i} className="text-xs px-2.5 py-0.5 rounded bg-white text-blue-800 border border-blue-200 font-semibold shadow-xs">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Ranked Candidate List */}
      <div className="space-y-4">
        {loading ? (
          <div className="bg-white rounded-3xl p-8 text-center text-slate-500 text-xs border border-slate-200">
            Loading candidate applications from database...
          </div>
        ) : filteredCandidates.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center text-slate-500 text-xs border border-slate-200">
            No candidate applications matching criteria for this role.
          </div>
        ) : (
          filteredCandidates.map((candidate, idx) => (
            <CandidateRankCard
              key={candidate.id}
              candidate={candidate}
              rank={idx + 1}
              onStatusChange={handleStatusChange}
              onOpenChat={(name, role) => setChatRecipient({ name, role })}
            />
          ))
        )}
      </div>

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
