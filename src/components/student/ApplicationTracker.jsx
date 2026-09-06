import React from 'react';
import { Briefcase, Building2, Calendar, CheckCircle2, Clock, XCircle, MessageSquare } from 'lucide-react';

export default function ApplicationTracker({ applications, onOpenChat }) {
  if (!applications || applications.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-8 text-center space-y-3 border border-slate-200 shadow-xs">
        <Briefcase className="w-10 h-10 text-slate-400 mx-auto" />
        <h3 className="text-base font-bold text-slate-900">No Job Applications Yet</h3>
        <p className="text-xs text-slate-500 font-medium">Explore the Jobs & Internships portal to match your skills and submit one-click applications.</p>
      </div>
    );
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Shortlisted':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Shortlisted
          </span>
        );
      case 'Rejected':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-200">
            <XCircle className="w-3.5 h-3.5 text-red-600" /> Rejected
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3.5 h-3.5 text-amber-600" /> In Review
          </span>
        );
    }
  };

  return (
    <div className="space-y-4">
      {applications.map((app) => (
        <div key={app.id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-semibold text-slate-700">{app.companyName}</span>
              <span className="text-slate-300">•</span>
              <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                <Calendar className="w-3 h-3 text-slate-400" /> Applied {app.appliedAt}
              </span>
            </div>
            
            <h4 className="text-base font-extrabold text-slate-900">{app.jobTitle}</h4>

            {app.feedback && (
              <p className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-200 font-medium">
                <span className="font-bold text-slate-900">Recruiter Feedback:</span> {app.feedback}
              </p>
            )}
          </div>

          <div className="flex items-center gap-3">
            {getStatusBadge(app.status)}
            <button
              onClick={() => onOpenChat && onOpenChat(app.companyName, 'Recruiter')}
              className="p-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 transition-colors"
              title="Message Recruiter"
            >
              <MessageSquare className="w-4 h-4 text-blue-600" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
