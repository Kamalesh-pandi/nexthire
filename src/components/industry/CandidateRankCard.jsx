import React from 'react';
import { Award, Check, X, MessageSquare, ExternalLink, Sparkles, FileText } from 'lucide-react';

export default function CandidateRankCard({ candidate, rank, onStatusChange, onOpenChat }) {
  const { userName, userEmail, userSkills, resumeScore, matchPercentage, status, feedback } = candidate;

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="flex items-start gap-4">
        {/* Rank Badge */}
        <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center font-extrabold text-blue-700 shrink-0">
          #{rank}
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h4 className="text-base font-bold text-slate-900">{userName}</h4>
            <span className="text-xs text-slate-500">({userEmail})</span>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-blue-800 font-extrabold border border-blue-200">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              AI Match: {matchPercentage}%
            </div>

            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-bold border border-slate-200">
              <Award className="w-3.5 h-3.5 text-blue-600" />
              ATS Score: {resumeScore}/100
            </div>
          </div>

          {/* Candidate Skill Badges */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {userSkills.map((skill, i) => (
              <span key={i} className="text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 font-medium">
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Recruiter Action Controls */}
      <div className="flex items-center gap-2 self-end md:self-center">
        <button
          onClick={() => onOpenChat && onOpenChat(userName, 'Student')}
          className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 border border-slate-200 transition-colors"
          title="Message Candidate"
        >
          <MessageSquare className="w-4 h-4" />
        </button>

        <button
          onClick={() => onStatusChange(candidate.id, 'Shortlisted')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
            status === 'Shortlisted'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
              : 'bg-slate-50 hover:bg-emerald-50 text-emerald-700 border border-emerald-300'
          }`}
        >
          <Check className="w-4 h-4" />
          {status === 'Shortlisted' ? 'Shortlisted' : 'Shortlist'}
        </button>

        <button
          onClick={() => onStatusChange(candidate.id, 'Rejected')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
            status === 'Rejected'
              ? 'bg-red-600 text-white shadow-md shadow-red-500/20'
              : 'bg-slate-50 hover:bg-red-50 text-red-700 border border-red-300'
          }`}
        >
          <X className="w-4 h-4" />
          {status === 'Rejected' ? 'Rejected' : 'Reject'}
        </button>
      </div>
    </div>
  );
}
