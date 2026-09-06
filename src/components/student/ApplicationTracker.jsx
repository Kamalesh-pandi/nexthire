import React from 'react';
import { Briefcase, Building2, Calendar, CheckCircle2, Clock, XCircle, MessageSquare } from 'lucide-react';

export default function ApplicationTracker({ applications, onOpenChat }) {
  if (!applications || applications.length === 0) {
    return (
      <div className="glass-panel rounded-3xl p-8 text-center space-y-3 border border-slate-700/60">
        <Briefcase className="w-10 h-10 text-slate-500 mx-auto" />
        <h3 className="text-base font-semibold text-slate-200">No Job Applications Yet</h3>
        <p className="text-xs text-slate-400">Explore the Jobs & Internships portal to match your skills and submit one-click applications.</p>
      </div>
    );
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Shortlisted':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
            <CheckCircle2 className="w-3.5 h-3.5" /> Shortlisted
          </span>
        );
      case 'Rejected':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-500/20 text-red-300 border border-red-500/40">
            <XCircle className="w-3.5 h-3.5" /> Rejected
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40">
            <Clock className="w-3.5 h-3.5" /> In Review
          </span>
        );
    }
  };

  return (
    <div className="space-y-4">
      {applications.map((app) => (
        <div key={app.id} className="glass-card rounded-2xl p-5 border border-slate-700/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-blue-400" />
              <span className="text-xs font-semibold text-slate-300">{app.companyName}</span>
              <span className="text-slate-600">•</span>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Calendar className="w-3 h-3" /> Applied {app.appliedAt}
              </span>
            </div>
            
            <h4 className="text-base font-bold text-slate-100">{app.jobTitle}</h4>

            {app.feedback && (
              <p className="text-xs text-slate-400 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                <span className="font-semibold text-slate-300">Recruiter Feedback:</span> {app.feedback}
              </p>
            )}
          </div>

          <div className="flex items-center gap-3">
            {getStatusBadge(app.status)}
            <button
              onClick={() => onOpenChat && onOpenChat(app.companyName, 'Recruiter')}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
              title="Message Recruiter"
            >
              <MessageSquare className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
