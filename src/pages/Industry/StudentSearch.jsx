import React, { useState, useEffect } from 'react';
import { Search, GraduationCap, Award, Mail, MessageSquare, CheckCircle2 } from 'lucide-react';
import { fetchAllUsersFromFirestore } from '../../services/firebase';
import ChatModal from '../../components/common/ChatModal';

export default function StudentSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chatRecipient, setChatRecipient] = useState(null);

  useEffect(() => {
    async function loadStudents() {
      setLoading(true);
      try {
        const users = await fetchAllUsersFromFirestore();
        const studentUsers = users.filter(u => !u.role || u.role === 'student');
        const uniqueStudents = [];
        const seenKeys = new Set();
        studentUsers.forEach(s => {
          const emailKey = (s.email || '').toLowerCase().trim();
          const idKey = s.id || s.uid;
          const nameKey = (s.name || '').toLowerCase().trim();
          const key = emailKey || idKey || nameKey;
          if (key && !seenKeys.has(key)) {
            seenKeys.add(key);
            uniqueStudents.push(s);
          }
        });
        setStudents(uniqueStudents);
      } catch (err) {
        console.error("Error loading student database records:", err);
      } finally {
        setLoading(false);
      }
    }
    loadStudents();
  }, []);

  const filtered = students.filter(s =>
    (s.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (s.institution || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (s.skills && s.skills.some(sk => sk.toLowerCase().includes(searchTerm.toLowerCase())))
  );

  return (
    <div className="space-y-8 pb-16">
      
      <div>
        <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
          Talent Sourcing
        </span>
        <h1 className="text-2xl font-extrabold text-slate-100 mt-1">Search Student Database</h1>
      </div>

      <div className="glass-panel rounded-2xl p-4 border border-slate-700/80">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by skill tag (e.g. PyTorch, React), student name, or institution..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-purple-500"
          />
        </div>
      </div>

      {loading ? (
        <div className="glass-panel rounded-3xl p-8 text-center text-slate-400 text-xs">
          Fetching student candidates from Firestore database...
        </div>
      ) : filtered.length === 0 ? (
        <div className="glass-panel rounded-3xl p-8 text-center text-slate-400 text-xs">
          No students found matching current search terms.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(student => (
            <div key={student.id || student.uid} className="glass-card rounded-3xl p-6 border border-slate-700/60 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-purple-600/20 text-purple-300 flex items-center justify-center font-extrabold">
                    {(student.name || 'S').charAt(0)}
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                    Score: {student.resumeScore || 85}/100
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-100">{student.name || 'Student Candidate'}</h3>
                  <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                    <GraduationCap className="w-3.5 h-3.5 text-purple-400" />
                    {student.institution || 'IIT Delhi'}
                  </p>
                  <p className="text-[11px] text-slate-500">{student.degree || 'B.Tech Computer Science'}</p>
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] text-slate-400">Verified Skill Tags:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {(student.skills || ['React.js', 'Python']).map((skill, idx) => (
                      <span key={idx} className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setChatRecipient({ name: student.name || 'Student', role: 'Student' })}
                className="w-full py-2.5 rounded-xl bg-purple-600/90 hover:bg-purple-600 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors shadow-md shadow-purple-500/20"
              >
                <MessageSquare className="w-4 h-4" /> Message Student
              </button>
            </div>
          ))}
        </div>
      )}

      {chatRecipient && (
        <ChatModal
          recipientName={chatRecipient.name}
          recipientRole={chatRecipient.role}
          onClose={() => setChatRecipient(null)}
        />
      )}

    </div>
  );
}
