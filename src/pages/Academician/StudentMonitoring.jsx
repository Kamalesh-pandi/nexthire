import React, { useState, useEffect } from 'react';
import { GraduationCap, Award, CheckCircle2, AlertTriangle, Send, UserCheck, Search, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { fetchStudentsForMentorFromFirestore } from '../../services/firebase';

export default function StudentMonitoring() {
  const { currentUser } = useAuth();
  const [assignedStudents, setAssignedStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [guidanceMessage, setGuidanceMessage] = useState({});

  useEffect(() => {
    async function loadMentorStudents() {
      if (!currentUser) return;
      setLoading(true);
      const students = await fetchStudentsForMentorFromFirestore(currentUser);
      
      // Strict client-side deduplication by email/name/id
      const uniqueStudents = [];
      const seen = new Set();
      students.forEach(s => {
        const sEmail = (s.email || '').toLowerCase().trim();
        const sName = (s.name || '').toLowerCase().trim();
        const key = sEmail || (sName && sName !== 'student name' ? sName : s.id);
        if (key && !seen.has(key)) {
          seen.add(key);
          uniqueStudents.push(s);
        }
      });

      setAssignedStudents(uniqueStudents);
      setLoading(false);
    }
    loadMentorStudents();
  }, [currentUser]);

  const handleSendGuidance = (studentId, studentName) => {
    alert(`Guidance recommendation sent successfully to ${studentName}!`);
    setGuidanceMessage(prev => ({ ...prev, [studentId]: true }));
  };

  const filteredStudents = assignedStudents.filter(s => 
    s.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.skills?.some(sk => sk.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
            👨‍🏫 Faculty Mentorship Cohort
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-2">Assigned Students Monitoring & Guidance</h1>
          <p className="text-xs text-slate-600 mt-1">
            Managing student cohort under <span className="text-blue-700 font-bold">{currentUser?.name || 'Faculty Mentor'}</span> ({currentUser?.departmentName || currentUser?.department || 'Dept of CSE'})
          </p>
        </div>

        <div className="px-4 py-2 rounded-2xl bg-blue-50 border border-blue-200 text-blue-800 font-bold text-sm flex items-center gap-2">
          <UserCheck className="w-5 h-5 text-blue-600" />
          <span>{assignedStudents.length} Assigned Mentees</span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Filter assigned students by name, email, or skill..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-300 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 transition-colors shadow-xs"
          />
        </div>
      </div>

      {/* Assigned Students Table */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm overflow-x-auto">
        {loading ? (
          <div className="p-8 text-center text-slate-500 text-xs font-medium">
            Fetching assigned students for mentor...
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-500 mx-auto flex items-center justify-center border border-slate-200">
              <UserCheck className="w-6 h-6 text-slate-400" />
            </div>
            <h4 className="text-sm font-bold text-slate-900">No Assigned Students for this Mentor</h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              There are currently no students mapped to <strong className="text-blue-700">{currentUser?.name || 'your mentor profile'}</strong>. When students register and select you as their academic mentor, their verified details, ATS resume scores, and project readiness will appear here.
            </p>
          </div>
        ) : (
          <table className="w-full text-left text-xs text-slate-700">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                <th className="pb-3 px-2">Assigned Student</th>
                <th className="pb-3 px-2">College & Department</th>
                <th className="pb-3 px-2 text-center">ATS Resume Score</th>
                <th className="pb-3 px-2">Key Skills</th>
                <th className="pb-3 px-2 text-center">Readiness Status</th>
                <th className="pb-3 px-2 text-right">Mentor Guidance Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.map((student) => {
                const score = student.resumeScore || 75;
                const isPlacementReady = score >= 75;

                return (
                  <tr key={student.id || student.uid} className="hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-2">
                      <div className="font-bold text-slate-900 flex items-center gap-1.5">
                        {student.name || 'Student Name'}
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono">{student.email}</div>
                    </td>

                    <td className="py-4 px-2">
                      <div className="text-slate-800 font-semibold max-w-[180px] truncate">
                        {student.collegeName || student.institution || 'IIT Delhi'}
                      </div>
                      <div className="text-[10px] text-blue-700 font-medium">
                        {student.departmentName || 'Computer Science & Engineering'}
                      </div>
                    </td>

                    <td className="py-4 px-2 text-center">
                      <span className={`px-2.5 py-1 rounded-full font-extrabold border ${
                        score >= 80 ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
                        score >= 65 ? 'bg-blue-50 text-blue-800 border-blue-200' :
                        'bg-amber-50 text-amber-800 border-amber-200'
                      }`}>
                        {score}/100
                      </span>
                    </td>

                    <td className="py-4 px-2">
                      <div className="flex flex-wrap gap-1 max-w-[200px]">
                        {(student.skills || ['React.js', 'Python']).slice(0, 3).map((sk, i) => (
                          <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 font-medium">
                            {sk}
                          </span>
                        ))}
                        {(student.skills || []).length > 3 && (
                          <span className="text-[10px] text-slate-400 font-semibold">+{student.skills.length - 3}</span>
                        )}
                      </div>
                    </td>

                    <td className="py-4 px-2 text-center">
                      <span className={`px-3 py-1 rounded-full font-bold text-[10px] uppercase tracking-wider inline-flex items-center gap-1 ${
                        isPlacementReady
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}>
                        {isPlacementReady ? <CheckCircle2 className="w-3 h-3 text-emerald-600" /> : <AlertTriangle className="w-3 h-3 text-amber-600" />}
                        {isPlacementReady ? 'Placement Ready' : 'Needs Upskilling'}
                      </span>
                    </td>

                    <td className="py-4 px-2 text-right">
                      <button
                        onClick={() => handleSendGuidance(student.id || student.uid, student.name)}
                        className={`px-3 py-1.5 rounded-xl font-bold text-[11px] inline-flex items-center gap-1.5 transition-all ${
                          guidanceMessage[student.id || student.uid]
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20'
                        }`}
                      >
                        <Send className="w-3 h-3" />
                        <span>{guidanceMessage[student.id || student.uid] ? 'Guidance Sent ✓' : 'Send AI Roadmap'}</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

    </div>
  );
}
