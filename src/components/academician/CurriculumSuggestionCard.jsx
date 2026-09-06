import React from 'react';
import { BookOpen, Sparkles, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';

export default function CurriculumSuggestionCard({ suggestion }) {
  const { subject, gapIdentified, proposedSyllabus, industryAlignment } = suggestion;

  return (
    <div className="glass-card rounded-2xl p-5 border border-slate-700/60 space-y-4 hover:border-emerald-500/50 transition-all">
      <div className="flex items-center justify-between">
        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
          industryAlignment.includes('Critical') 
            ? 'bg-red-500/20 text-red-300 border border-red-500/30' 
            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
        }`}>
          {industryAlignment}
        </span>
        <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> AI Syllabus Recommendation
        </span>
      </div>

      <h4 className="text-base font-bold text-slate-100">{subject}</h4>

      <p className="text-xs text-slate-400 bg-slate-900/60 p-3 rounded-xl border border-slate-800 leading-relaxed">
        <span className="font-semibold text-slate-300">Market Gap Identified:</span> {gapIdentified}
      </p>

      <div className="space-y-2">
        <span className="text-xs font-semibold text-slate-300 block">Proposed Course Modules:</span>
        <div className="space-y-1.5">
          {proposedSyllabus.map((topic, idx) => (
            <div key={idx} className="flex items-center gap-2 text-xs text-slate-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>{topic}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
