import React from 'react';
import { BookOpen, ExternalLink, Star, Clock, Award } from 'lucide-react';

export default function CourseRecommendationCard({ course }) {
  if (!course) return null;

  const skills = course.skillsCovered || course.skills || course.skillsRequired || [];
  const providerName = course.provider || course.platform || 'Coursera';
  const ratingValue = course.rating || 4.8;
  const courseDuration = course.duration || '4 Weeks';
  const courseLink = course.link || '#';

  return (
    <div className="glass-card rounded-2xl p-5 border border-slate-700/60 flex flex-col justify-between space-y-4 hover:border-blue-500/50 transition-all">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold px-2.5 py-1 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            {providerName}
          </span>
          <div className="flex items-center gap-1 text-amber-400 text-xs font-semibold">
            <Star className="w-3.5 h-3.5 fill-amber-400" />
            <span>{ratingValue}</span>
          </div>
        </div>

        <h4 className="text-base font-bold text-slate-100 line-clamp-2 leading-snug">
          {course.title}
        </h4>

        <div className="flex items-center gap-3 text-xs text-slate-400">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {courseDuration}
          </span>
          <span>•</span>
          <span className="text-blue-400 font-medium">Mapped Course</span>
        </div>

        {skills.length > 0 && (
          <div className="space-y-1">
            <span className="text-[11px] text-slate-400">Covers Skills:</span>
            <div className="flex flex-wrap gap-1.5">
              {skills.map((skill, i) => (
                <span key={i} className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <a
        href={courseLink}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-600/90 hover:bg-blue-600 text-white font-semibold text-xs transition-colors shadow-md shadow-blue-500/20"
      >
        <span>Enroll Now</span>
        <ExternalLink className="w-3.5 h-3.5" />
      </a>
    </div>
  );
}
