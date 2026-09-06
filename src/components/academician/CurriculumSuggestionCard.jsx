import React from 'react';
import { BookOpen, Sparkles, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';

export default function CurriculumSuggestionCard({ suggestion }) {
  const { subject, gapIdentified, proposedSyllabus, industryAlignment } = suggestion;

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4 hover:border-blue-400 transition-all">
      <div className="flex items-center justify-between">
        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
          industryAlignment.includes('Critical') 
            ? 'bg-red-50 text-red-800 border border-red-200' 
            : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
        }`}>
          {industryAlignment}
        </span>
        <span className="text-xs text-slate-500 font-semibold flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" /> AI Syllabus Recommendation
        </span>
      </div>

      <h4 className="text-base font-bold text-slate-900">{subject}</h4>

      <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200 leading-relaxed">
        <span className="font-bold text-slate-800">Market Gap Identified:</span> {gapIdentified}
      </p>

      <div className="space-y-2">
        <span className="text-xs font-bold text-slate-800 block">Proposed Course Modules:</span>
        <div className="space-y-1.5">
          {proposedSyllabus.map((topic, idx) => (
            <div key={idx} className="flex items-center gap-2 text-xs text-slate-700 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span>{topic}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
