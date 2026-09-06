import React from 'react';
import { Target, CheckCircle2, AlertTriangle, ArrowUpRight, Sparkles } from 'lucide-react';

export default function SkillGapCard({ gapData, availableJobs = [], selectedJobId, onSelectJob }) {
  if (!gapData) return null;

  const { jobTitle, companyName, matchPercentage, matchedSkills, missingSkills, recommendation } = gapData;

  return (
    <div className="glass-card rounded-3xl p-6 border border-slate-700/60 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center gap-1">
              <Target className="w-3 h-3" /> Target Job Alignment
            </span>
            <span className="text-[10px] text-emerald-400 font-mono font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              Live Resume Synced
            </span>
          </div>

          {availableJobs && availableJobs.length > 1 ? (
            <div className="mt-2.5 space-y-1">
              <label className="text-[11px] text-slate-400 block font-medium">Select Target Role to Compare:</label>
              <select
                value={selectedJobId}
                onChange={(e) => onSelectJob && onSelectJob(e.target.value)}
                className="w-full max-w-md bg-slate-800 border border-slate-700 hover:border-blue-500 rounded-xl px-3 py-2 text-xs text-white font-bold focus:outline-none focus:border-blue-400 cursor-pointer shadow-sm transition-colors"
              >
                {availableJobs.map(job => (
                  <option key={job.id} value={job.id} className="bg-slate-900 text-slate-200">
                    {job.title} {job.companyName ? `• ${job.companyName}` : ''}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="mt-2">
              <h3 className="text-lg font-bold text-slate-100">{jobTitle}</h3>
              {companyName && <p className="text-xs text-slate-400">{companyName}</p>}
            </div>
          )}
        </div>

        <div className="text-left sm:text-right shrink-0">
          <span className={`text-3xl font-black ${
            matchPercentage >= 80 ? 'text-emerald-400' :
            matchPercentage >= 50 ? 'text-amber-400' : 'text-red-400'
          }`}>
            {matchPercentage}%
          </span>
          <p className="text-[11px] text-slate-400 font-medium">Resume Competency Match</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden p-0.5 border border-slate-700">
        <div 
          className={`h-full rounded-full transition-all duration-1000 ${
            matchPercentage >= 80 ? 'bg-gradient-to-r from-emerald-500 to-teal-400' :
            matchPercentage >= 50 ? 'bg-gradient-to-r from-amber-500 to-yellow-400' : 'bg-gradient-to-r from-red-500 to-pink-500'
          }`}
          style={{ width: `${matchPercentage}%` }}
        />
      </div>

      {/* Skill Tags Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        {/* Acquired Matched Skills */}
        <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/20 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
            <span>Acquired Skills ({matchedSkills.length})</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {matchedSkills.map((s, i) => (
              <span key={i} className="text-xs px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* Missing Required Skills */}
        <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/20 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-400">
            <AlertTriangle className="w-4 h-4" />
            <span>Missing Skill Gaps ({missingSkills.length})</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {missingSkills.map((s, i) => (
              <span key={i} className="text-xs px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/30">
                + {s}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* AI Recommendation Banner */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
        <div>
          <h4 className="text-xs font-semibold text-slate-200">AI Upskilling Insight</h4>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">{recommendation}</p>
        </div>
      </div>
    </div>
  );
}
