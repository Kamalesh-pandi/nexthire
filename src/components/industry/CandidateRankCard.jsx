import React from 'react';
import { Award, Check, X, MessageSquare, ExternalLink, Sparkles, FileText } from 'lucide-react';

export default function CandidateRankCard({ candidate, rank, onStatusChange, onOpenChat }) {
  const { userName, userEmail, userSkills, resumeScore, matchPercentage, status, feedback } = candidate;

  return (
    <div className="glass-card rounded-2xl p-5 border border-slate-700/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="flex items-start gap-4">
        {/* Rank Badge */}
        <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-black text-slate-300 shrink-0">
          #{rank}
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h4 className="text-base font-bold text-slate-100">{userName}</h4>
            <span className="text-xs text-slate-400">({userEmail})</span>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 font-semibold border border-purple-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              AI Match: {matchPercentage}%
            </div>

            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 font-semibold border border-blue-500/30">
              <Award className="w-3.5 h-3.5" />
              ATS Score: {resumeScore}/100
            </div>
          </div>

          {/* Candidate Skill Badges */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {userSkills.map((skill, i) => (
              <span key={i} className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
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
          className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
          title="Message Candidate"
        >
          <MessageSquare className="w-4 h-4" />
        </button>

        <button
          onClick={() => onStatusChange(candidate.id, 'Shortlisted')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
            status === 'Shortlisted'
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20'
              : 'bg-slate-800 hover:bg-emerald-600/20 text-emerald-400 border border-emerald-500/40'
          }`}
        >
          <Check className="w-4 h-4" />
          {status === 'Shortlisted' ? 'Shortlisted' : 'Shortlist'}
        </button>

        <button
          onClick={() => onStatusChange(candidate.id, 'Rejected')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
            status === 'Rejected'
              ? 'bg-red-600 text-white shadow-lg shadow-red-500/20'
              : 'bg-slate-800 hover:bg-red-600/20 text-red-400 border border-red-500/40'
          }`}
        >
          <X className="w-4 h-4" />
          {status === 'Rejected' ? 'Rejected' : 'Reject'}
        </button>
      </div>
    </div>
  );
}
