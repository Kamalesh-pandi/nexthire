import React, { useState, useEffect } from 'react';
import { AlertTriangle, TrendingDown, CheckCircle2, Sparkles, RefreshCw, UserCheck } from 'lucide-react';
import { fetchAllUsersFromFirestore } from '../../services/firebase';

export default function StudentSkillMatrix({ students: propStudents = null }) {
  const [students, setStudents] = useState(propStudents !== null ? propStudents : []);
  const [loading, setLoading] = useState(propStudents === null);

  useEffect(() => {
    // If parent component explicitly provided a student list (even if empty []), use it directly!
    if (propStudents !== null) {
      setStudents(propStudents);
      setLoading(false);
      return;
    }

    async function loadCohort() {
      setLoading(true);
      try {
        const users = await fetchAllUsersFromFirestore();
        const stds = users.filter(u => !u.role || u.role === 'student');
        setStudents(stds);
      } catch (err) {
        console.error("Failed loading cohort students for matrix:", err);
      } finally {
        setLoading(false);
      }
    }
    loadCohort();
  }, [propStudents]);

  const totalStudents = students.length;
  const placementReadyCount = students.filter(s => (s.resumeScore || 0) >= 75).length;
  const placementReadinessRate = totalStudents > 0
    ? Math.round((placementReadyCount / totalStudents) * 100)
    : 0;

  // Real-time deficit calculation across core industry competency benchmarks
  const INDUSTRY_BENCHMARKS = [
    { skill: "PyTorch & ML Frameworks", keywords: ["pytorch", "deep learning", "machine learning", "tensorflow"] },
    { skill: "Docker & Containerization", keywords: ["docker", "kubernetes", "containers"] },
    { skill: "System Design & Architecture", keywords: ["system design", "microservices", "distributed systems", "scalability"] },
    { skill: "Cloud Deployment (AWS/GCP)", keywords: ["aws", "cloud", "gcp", "azure", "devops"] },
    { skill: "Database Indexing & SQL", keywords: ["sql", "postgresql", "mongodb", "database"] }
  ];

  const topMissingSkills = INDUSTRY_BENCHMARKS.map(item => {
    let missingCount = 0;
    students.forEach(s => {
      const sSkills = (s.skills || []).map(sk => sk.toLowerCase());
      const hasSkill = item.keywords.some(kw => sSkills.some(sk => sk.includes(kw) || kw.includes(sk)));
      if (!hasSkill) missingCount++;
    });
    const percent = totalStudents > 0 
      ? Math.round((missingCount / totalStudents) * 100) 
      : 0;
    return {
      skill: item.skill,
      count: missingCount,
      percent: Math.min(100, Math.max(0, percent))
    };
  }).sort((a, b) => b.percent - a.percent);

  return (
    <div className="glass-card rounded-3xl p-6 border border-slate-700/60 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            Assigned Mentee Analytics
          </span>
          <h3 className="text-lg font-bold text-slate-100 mt-2">Cohort Skill Deficit Matrix</h3>
        </div>
        <div className="text-right">
          <span className="text-xl font-extrabold text-emerald-400">
            {totalStudents > 0 ? `${placementReadinessRate}%` : '0%'}
          </span>
          <p className="text-[11px] text-slate-400">Placement Readiness</p>
        </div>
      </div>

      {loading ? (
        <div className="py-8 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
          <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
          <span>Calculating live skill deficits for this mentor...</span>
        </div>
      ) : totalStudents === 0 ? (
        <div className="py-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-800 text-slate-400 mx-auto flex items-center justify-center">
            <UserCheck className="w-6 h-6 text-slate-400" />
          </div>
          <h4 className="text-sm font-bold text-slate-200">No Assigned Students for this Mentor</h4>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            When students register and select you as their faculty mentor, their skill deficit matrix and ATS analytics will appear here.
          </p>
        </div>
      ) : (
        <>
          {/* Skill Gap Progress List */}
          <div className="space-y-4">
            {topMissingSkills.map((item, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                    {item.skill}
                  </span>
                  <span className="text-slate-400 font-medium">
                    {item.count} Students ({item.percent}%)
                  </span>
                </div>

                <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-amber-500 to-red-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${item.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-semibold text-slate-200">Mentor Action Item</h4>
              <p className="text-xs text-slate-400 mt-1">
                {topMissingSkills[0]?.percent}% of your assigned mentees exhibit gaps in {topMissingSkills[0]?.skill}. Introducing a targeted practical lab module will boost their placement readiness.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
