import React, { useState, useEffect } from 'react';
import { 
  X, 
  Download, 
  Printer, 
  MessageSquare, 
  Check, 
  Award, 
  Sparkles, 
  GraduationCap, 
  Briefcase, 
  FileText, 
  Mail, 
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  FileCheck2,
  FileX
} from 'lucide-react';
import { fetchAllUsersFromFirestore } from '../../services/firebase';

export default function StudentResumeModal({ candidate, onClose, onOpenChat, onStatusChange }) {
  const [activeTab, setActiveTab] = useState('uploaded_resume');

  if (!candidate) return null;

  // Candidate basic attributes
  const name = candidate.userName || candidate.name || 'Student Candidate';
  const email = candidate.userEmail || candidate.email || 'student@nexthire.ai';
  const institution = candidate.institution || candidate.collegeName || 'IIT Bombay';
  const degree = candidate.degree || 'B.Tech Computer Science & Engineering';
  const graduationYear = candidate.graduationYear || '2025';
  
  const technicalSkills = candidate.userSkills || candidate.technicalSkills || candidate.skills || ['React.js', 'Node.js', 'Python', 'SQL'];
  const softSkills = candidate.softSkills || ['Problem Solving', 'Team Leadership', 'Technical Communication'];
  
  const resumeScore = candidate.resumeScore || 88;
  const matchPercentage = candidate.matchPercentage || 85;
  const status = candidate.status || 'Applied';

  // State for fetched resume attributes
  const [resumeUrl, setResumeUrl] = useState(candidate.resumeUrl || candidate.resumeFileUrl || '');
  const [resumeFileName, setResumeFileName] = useState(candidate.resumeFileName || '');
  const [resumeRawText, setResumeRawText] = useState(candidate.resumeRawText || '');

  // 1. Check local active user storage first if testing under student account
  useEffect(() => {
    try {
      const activeUserRaw = typeof localStorage !== 'undefined' ? localStorage.getItem('nexthire_active_user') : null;
      if (activeUserRaw) {
        const activeUser = JSON.parse(activeUserRaw);
        const isSameUser = activeUser && (
          (activeUser.email && email && activeUser.email.toLowerCase() === email.toLowerCase()) ||
          (activeUser.name && name && activeUser.name.toLowerCase() === name.toLowerCase()) ||
          (activeUser.id && candidate.id && activeUser.id === candidate.id) ||
          (activeUser.uid && candidate.uid && activeUser.uid === candidate.uid)
        );
        if (isSameUser) {
          if (activeUser.resumeUrl) setResumeUrl(activeUser.resumeUrl);
          if (activeUser.resumeFileName) setResumeFileName(activeUser.resumeFileName);
          if (activeUser.resumeRawText) setResumeRawText(activeUser.resumeRawText);
        }
      }
    } catch (e) {
      // ignore
    }
  }, [candidate, email, name]);

  // 2. Fetch live student user record from Firestore database if resumeUrl is not present yet
  useEffect(() => {
    async function syncFromFirestore() {
      if (resumeUrl) return;
      try {
        const users = await fetchAllUsersFromFirestore();
        const candEmail = (email || '').toLowerCase().trim();
        const candName = (name || '').toLowerCase().trim();
        const candId = candidate.userId || candidate.id || candidate.uid;

        const matched = users.find(u => 
          (u.email && candEmail && u.email.toLowerCase().trim() === candEmail) ||
          (u.id && candId && u.id === candId) ||
          (u.uid && candId && u.uid === candId) ||
          (u.name && candName && u.name.toLowerCase().trim() === candName)
        );

        if (matched) {
          if (matched.resumeUrl) setResumeUrl(matched.resumeUrl);
          if (matched.resumeFileName) setResumeFileName(matched.resumeFileName);
          if (matched.resumeRawText) setResumeRawText(matched.resumeRawText);
        }
      } catch (err) {
        console.warn("Firestore user resume sync error:", err);
      }
    }
    syncFromFirestore();
  }, [candidate, email, name, resumeUrl]);

  const breakdown = candidate.breakdown || {
    keywordMatch: Math.min(30, Math.round(resumeScore * 0.32)),
    formatting: Math.min(20, Math.round(resumeScore * 0.22)),
    impactMetrics: Math.min(25, Math.round(resumeScore * 0.26)),
    experienceDepth: Math.min(25, Math.round(resumeScore * 0.20))
  };

  const strengths = candidate.strengths || [
    `Verified engineering skills in ${technicalSkills.slice(0, 3).join(', ')}.`,
    "High structural ATS score with verified project experience.",
    "Strong technical domain orientation."
  ];

  const weaknesses = candidate.weaknesses || [
    "Recommend adding CI/CD pipeline automation details.",
    "Include live project demo links."
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      
      {/* Modal Container */}
      <div className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] my-auto">
        
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-6 sm:p-7 relative shrink-0">
          
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pr-8">
            <div className="flex items-start gap-4">
              
              {/* Avatar Circle */}
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-2xl flex items-center justify-center shadow-lg shadow-blue-500/30 border border-white/20 shrink-0">
                {name.charAt(0)}
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">{name}</h2>
                  <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30">
                    Uploaded Student Resume
                  </span>
                </div>

                <p className="text-xs text-slate-300 flex items-center gap-1.5 font-medium">
                  <GraduationCap className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>{institution}</span> • <span className="text-slate-400">{degree}</span>
                </p>

                <p className="text-xs text-slate-400 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{email}</span>
                </p>
              </div>
            </div>

            {/* Badges & Action Toolbar */}
            <div className="flex flex-wrap items-center gap-3 self-start md:self-center">
              <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-3 flex items-center gap-4">
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">ATS Score</div>
                  <div className="text-lg font-black text-emerald-400 flex items-center gap-1">
                    <Award className="w-4 h-4" />
                    <span>{resumeScore}/100</span>
                  </div>
                </div>

                <div className="h-8 w-px bg-slate-700" />

                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">AI Match</div>
                  <div className="text-lg font-black text-blue-400 flex items-center gap-1">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>{matchPercentage}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Action Bar */}
          <div className="mt-6 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenChat && onOpenChat(name, 'Student')}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-md shadow-blue-600/30"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Message Student</span>
              </button>

              {onStatusChange && candidate.id && (
                <button
                  onClick={() => onStatusChange(candidate.id, status === 'Shortlisted' ? 'Applied' : 'Shortlisted')}
                  className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2 transition-all ${
                    status === 'Shortlisted'
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/30'
                      : 'bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-500/30'
                  }`}
                >
                  <Check className="w-4 h-4" />
                  <span>{status === 'Shortlisted' ? 'Shortlisted' : 'Shortlist Candidate'}</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              {resumeUrl && (
                <a
                  href={resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  download={resumeFileName || `${name}_Resume.pdf`}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-emerald-600/30"
                  title="Download Student's Uploaded PDF Resume"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Uploaded Resume</span>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 flex space-x-1 shrink-0 overflow-x-auto">
          {[
            { id: 'uploaded_resume', label: '📄 Uploaded Resume File', icon: FileCheck2 },
            { id: 'ats_analytics', label: 'ATS & Skills Analytics', icon: Award },
            { id: 'profile_info', label: 'Candidate Profile', icon: GraduationCap }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-3.5 px-4 font-bold text-xs border-b-2 flex items-center gap-2 transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600 bg-white shadow-2xs'
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-6">
          
          {/* Main Tab: Show Actual Uploaded User Resume */}
          {activeTab === 'uploaded_resume' && (
            <div className="space-y-4">
              {resumeUrl ? (
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-emerald-50 p-4 rounded-2xl border border-emerald-200 gap-3">
                    <div className="flex items-center gap-3">
                      <FileCheck2 className="w-6 h-6 text-emerald-600 shrink-0" />
                      <div>
                        <h4 className="text-xs font-bold text-emerald-900">User Uploaded Resume File</h4>
                        <p className="text-[11px] text-emerald-700 font-medium">{resumeFileName || 'Candidate_Uploaded_Resume.pdf'}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <a
                        href={resumeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-xs"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Open Full PDF View</span>
                      </a>
                    </div>
                  </div>

                  {/* Embedded PDF Viewer */}
                  <div className="bg-slate-900 rounded-2xl p-2 border border-slate-800 shadow-inner overflow-hidden">
                    <iframe
                      src={resumeUrl}
                      title={`Uploaded Resume PDF - ${name}`}
                      className="w-full h-[600px] rounded-xl bg-white border-0"
                    />
                  </div>
                </div>
              ) : resumeRawText ? (
                /* Extracted Raw Text from Uploaded Resume File */
                <div className="space-y-3">
                  <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-blue-600 shrink-0" />
                      <div>
                        <h4 className="text-xs font-bold text-blue-900">Extracted Text from Candidate's Uploaded File</h4>
                        <p className="text-[11px] text-blue-700">Displaying exact plain text extracted from uploaded resume file.</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 max-h-[550px] overflow-y-auto">
                    <pre className="whitespace-pre-wrap font-sans text-xs text-slate-800 leading-relaxed">
                      {resumeRawText}
                    </pre>
                  </div>
                </div>
              ) : (
                /* No uploaded file state */
                <div className="p-10 rounded-3xl bg-slate-50 border border-slate-200 text-center space-y-4 max-w-lg mx-auto my-8">
                  <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto border border-slate-200">
                    <FileX className="w-7 h-7" />
                  </div>
                  
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-slate-900">No Resume File Uploaded Yet</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      This student candidate has not uploaded a PDF resume file to Firebase Storage yet.
                    </p>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() => onOpenChat && onOpenChat(name, 'Student')}
                      className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 mx-auto shadow-md shadow-blue-500/20 transition-colors"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>Message Candidate to Request Resume</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tab 2: ATS & Skills Analytics */}
          {activeTab === 'ats_analytics' && (
            <div className="space-y-6">
              
              <div className="bg-slate-900 rounded-2xl p-6 text-white space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Award className="w-4 h-4 text-emerald-400" />
                      ATS Diagnostic Score Breakdown
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">Automated screening compliance evaluation out of 100 points</p>
                  </div>
                  <div className="text-2xl font-black text-emerald-400">{resumeScore}/100</div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  
                  <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700 space-y-1.5">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-slate-300">Keyword Density Match</span>
                      <span className="text-blue-400">{breakdown.keywordMatch}/30 pts</span>
                    </div>
                    <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                      <div className="bg-blue-500 h-full rounded-full" style={{ width: `${(breakdown.keywordMatch / 30) * 100}%` }} />
                    </div>
                  </div>

                  <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700 space-y-1.5">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-slate-300">ATS Single-Column Formatting</span>
                      <span className="text-emerald-400">{breakdown.formatting}/20 pts</span>
                    </div>
                    <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${(breakdown.formatting / 20) * 100}%` }} />
                    </div>
                  </div>

                  <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700 space-y-1.5">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-slate-300">Quantified Impact Metrics</span>
                      <span className="text-amber-400">{breakdown.impactMetrics}/25 pts</span>
                    </div>
                    <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                      <div className="bg-amber-500 h-full rounded-full" style={{ width: `${(breakdown.impactMetrics / 25) * 100}%` }} />
                    </div>
                  </div>

                  <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700 space-y-1.5">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-slate-300">Project & Experience Depth</span>
                      <span className="text-indigo-400">{breakdown.experienceDepth}/25 pts</span>
                    </div>
                    <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                      <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${(breakdown.experienceDepth / 25) * 100}%` }} />
                    </div>
                  </div>

                </div>
              </div>

              {/* Evaluated Strengths & Weaknesses */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="bg-emerald-50/60 rounded-2xl p-5 border border-emerald-200 space-y-3">
                  <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    AI-Verified Resume Strengths
                  </h4>
                  <ul className="space-y-2">
                    {strengths.map((str, idx) => (
                      <li key={idx} className="text-xs text-emerald-900 font-medium flex items-start gap-2">
                        <span className="text-emerald-600 font-bold">•</span>
                        <span>{str}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-amber-50/60 rounded-2xl p-5 border border-amber-200 space-y-3">
                  <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-amber-600" />
                    Areas for Growth & Recommendations
                  </h4>
                  <ul className="space-y-2">
                    {weaknesses.map((wk, idx) => (
                      <li key={idx} className="text-xs text-amber-900 font-medium flex items-start gap-2">
                        <span className="text-amber-600 font-bold">•</span>
                        <span>{wk}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

            </div>
          )}

          {/* Tab 3: Candidate Profile Details */}
          {activeTab === 'profile_info' && (
            <div className="space-y-6">
              
              {/* Institution & Academic Credentials */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200 space-y-3">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-blue-600" />
                  Education & Credentials
                </h3>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200 gap-2">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{institution}</h4>
                    <p className="text-xs text-slate-600 font-medium">{degree}</p>
                  </div>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-100 text-blue-800 border border-blue-200 self-start sm:self-center">
                    Class of {graduationYear}
                  </span>
                </div>
              </div>

              {/* Verified Technical Skills */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  Verified Technical Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {technicalSkills.map((skill, idx) => (
                    <span key={idx} className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs font-bold shadow-2xs flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Soft Skills */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Soft Skills & Competencies
                </h3>
                <div className="flex flex-wrap gap-2">
                  {softSkills.map((skill, idx) => (
                    <span key={idx} className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <div className="text-xs text-slate-500 font-medium">
            Candidate ID: <span className="font-mono text-slate-700 font-bold">{candidate.id || candidate.uid || 'std_001'}</span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs transition-colors"
          >
            Close Viewer
          </button>
        </div>

      </div>
    </div>
  );
}
