import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, AlertTriangle, Sparkles, RefreshCw, UserCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import StudentSkillMatrix from '../../components/academician/StudentSkillMatrix';
import { fetchStudentsForMentorFromFirestore } from '../../services/firebase';

export default function Analytics() {
  const { currentUser } = useAuth();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!currentUser) return;
      setLoading(true);
      try {
        const mentorStudents = await fetchStudentsForMentorFromFirestore(currentUser);
        
        // Strict deduplication for clean database reporting
        const unique = [];
        const seen = new Set();
        mentorStudents.forEach(s => {
          const key = (s.email || s.id || s.name || '').toLowerCase().trim();
          if (key && !seen.has(key)) {
            seen.add(key);
            unique.push(s);
          }
        });
        setStudents(unique);
      } catch (err) {
        console.error("Analytics load error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [currentUser]);

  const total = students.length;

  // Real live proficiency rates computed directly from verified database skills
  const PROFICIENCY_DOMAINS = [
    { name: "Full-Stack Web Development (React / Node)", keywords: ["react", "node", "javascript", "web"], color: "bg-emerald-500", text: "text-emerald-400" },
    { name: "Core Data Structures & Algorithms", keywords: ["dsa", "c++", "java", "algorithms"], color: "bg-emerald-500", text: "text-emerald-400" },
    { name: "Database Engineering & SQL", keywords: ["sql", "database", "mongodb", "postgresql"], color: "bg-blue-500", text: "text-blue-400" },
    { name: "Machine Learning & PyTorch Frameworks", keywords: ["pytorch", "machine learning", "deep learning", "tensorflow", "python"], color: "bg-amber-500", text: "text-amber-400" },
    { name: "Cloud DevOps (Docker / Kubernetes)", keywords: ["docker", "kubernetes", "aws", "cloud", "devops"], color: "bg-purple-500", text: "text-purple-400" }
  ];

  const proficiencies = PROFICIENCY_DOMAINS.map(domain => {
    let count = 0;
    students.forEach(s => {
      const skillsLower = (s.skills || []).map(sk => sk.toLowerCase());
      const has = domain.keywords.some(kw => skillsLower.some(sk => sk.includes(kw) || kw.includes(sk)));
      if (has) count++;
    });
    const percent = total > 0
      ? Math.round((count / total) * 100)
      : 0;
    return {
      name: domain.name,
      percent: Math.min(100, Math.max(0, percent)),
      color: domain.color,
      text: domain.text
    };
  });

  return (
    <div className="space-y-8 pb-16">
      
      <div>
        <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
          Faculty Mentorship Analytics
        </span>
        <h1 className="text-2xl font-extrabold text-slate-100 mt-1">Mentee Skill Gap & Placement Trends</h1>
        <p className="text-xs text-slate-400 mt-1">
          Live real-time aggregation across {students.length} assigned students under <span className="text-emerald-400 font-semibold">{currentUser?.name || 'this mentor'}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <StudentSkillMatrix students={students} />

        <div className="glass-card rounded-3xl p-6 border border-slate-700/60 space-y-6">
          <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-400" /> Mentee Skill Proficiency Distribution
          </h3>

          {loading ? (
            <div className="py-8 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin text-blue-400" />
              <span>Analyzing assigned mentee skill distributions...</span>
            </div>
          ) : students.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-800 text-slate-400 mx-auto flex items-center justify-center">
                <UserCheck className="w-6 h-6 text-slate-400" />
              </div>
              <h4 className="text-sm font-bold text-slate-200">No Assigned Students for this Mentor</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Proficiency metrics will automatically calculate when students are assigned to you.
              </p>
            </div>
          ) : (
            <div className="space-y-4 text-xs">
              {proficiencies.map((item, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between">
                    <span className="font-semibold text-slate-200">{item.name}</span>
                    <span className={`${item.text} font-bold`}>{item.percent}% Proficient</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2">
                    <div className={`${item.color} h-2 rounded-full transition-all duration-700`} style={{ width: `${item.percent}%` }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
