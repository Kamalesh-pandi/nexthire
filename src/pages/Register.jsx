import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  User, 
  Mail, 
  Lock, 
  GraduationCap, 
  Building2, 
  BookOpen, 
  ArrowRight, 
  Key, 
  ShieldAlert, 
  Award, 
  UserCheck,
  Eye,
  EyeOff
} from 'lucide-react';
import { useAuth, getUserDashboardPath } from '../context/AuthContext';
import { 
  fetchCollegesFromFirestore, 
  fetchDepartmentsFromFirestore, 
  fetchMentorsByDepartmentFromFirestore,
  saveRegisteredMentorLocally
} from '../services/firebase';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState('student');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [skills, setSkills] = useState('');
  const [inviteCode, setInviteCode] = useState('');

  // Academic Hierarchy States
  const [colleges, setColleges] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [availableMentors, setAvailableMentors] = useState([]);
  const [loadingMentors, setLoadingMentors] = useState(false);

  const [selectedCollegeId, setSelectedCollegeId] = useState('');
  const [collegeSearch, setCollegeSearch] = useState('');
  const [selectedStateFilter, setSelectedStateFilter] = useState('All');
  const [selectedDepartmentId, setSelectedDepartmentId] = useState('');
  const [selectedMentorId, setSelectedMentorId] = useState('');

  const [companyName, setCompanyName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 1. Fetch Colleges on component mount
  useEffect(() => {
    async function loadColleges() {
      const colData = await fetchCollegesFromFirestore();
      setColleges(colData);
      if (colData.length > 0) {
        setSelectedCollegeId(colData[0].id);
      }
    }
    loadColleges();
  }, []);

  // 2. Fetch Departments when selectedCollegeId changes
  useEffect(() => {
    if (!selectedCollegeId) return;
    let isCancelled = false;

    async function loadDepts() {
      try {
        const deptData = await fetchDepartmentsFromFirestore(selectedCollegeId);
        if (isCancelled) return;
        setDepartments(deptData);

        if (deptData.length > 0) {
          setSelectedDepartmentId(prev => {
            if (prev && deptData.some(d => d.id === prev)) return prev;
            return deptData[0].id;
          });
        }
      } catch (err) {
        console.error("Error loading departments:", err);
      }
    }

    loadDepts();
    return () => { isCancelled = true; };
  }, [selectedCollegeId]);

  // 3. Fetch Mentors whenever selectedCollegeId, selectedDepartmentId, colleges, or departments changes
  useEffect(() => {
    if (!selectedCollegeId) return;
    let isCancelled = false;

    async function loadMentors() {
      setLoadingMentors(true);
      try {
        const activeCollege = colleges.find(c => c.id === selectedCollegeId);
        const activeDept = departments.find(d => d.id === selectedDepartmentId);

        const mentors = await fetchMentorsByDepartmentFromFirestore(
          selectedCollegeId,
          selectedDepartmentId,
          activeCollege?.name || activeCollege?.institution || '',
          activeDept?.name || ''
        );

        if (isCancelled) return;
        setAvailableMentors(mentors);

        if (mentors.length > 0) {
          setSelectedMentorId(prev => {
            const stillValid = mentors.some(m => (m.id === prev || m.uid === prev));
            return stillValid ? prev : (mentors[0].id || mentors[0].uid);
          });
        } else {
          setSelectedMentorId('');
        }
      } catch (err) {
        console.error("Error loading mentors:", err);
      } finally {
        if (!isCancelled) setLoadingMentors(false);
      }
    }

    loadMentors();
    return () => { isCancelled = true; };
  }, [selectedCollegeId, selectedDepartmentId, colleges, departments]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const skillsArray = skills.split(',').map(s => s.trim()).filter(Boolean);

    // Resolve College & Department Names
    const activeCollege = colleges.find(c => c.id === selectedCollegeId);
    const activeDept = departments.find(d => d.id === selectedDepartmentId);

    // Mentor Assignment Logic
    let assignedMentor = null;
    if (role === 'student' && availableMentors.length > 0) {
      if (selectedMentorId && selectedMentorId !== 'auto') {
        assignedMentor = availableMentors.find(m => (m.id === selectedMentorId || m.uid === selectedMentorId)) || availableMentors[0];
      } else {
        assignedMentor = availableMentors[0];
      }
    }

    try {
      const user = await register(name, email, password, role, {
        institution: activeCollege ? activeCollege.name : 'University',
        collegeId: selectedCollegeId,
        collegeName: activeCollege ? activeCollege.name : '',
        departmentId: selectedDepartmentId,
        departmentName: activeDept ? activeDept.name : '',
        mentorId: assignedMentor ? (assignedMentor.id || assignedMentor.uid) : null,
        mentorName: assignedMentor ? assignedMentor.name : null,
        mentorEmail: assignedMentor ? assignedMentor.email : null,
        skills: skillsArray,
        inviteCode,
        companyName: role === 'industry' ? companyName : undefined
      });

      if (role === 'academician') {
        saveRegisteredMentorLocally({
          id: user.id || user.uid,
          uid: user.uid || user.id,
          name: name,
          email: email,
          role: 'academician',
          collegeId: selectedCollegeId,
          collegeName: activeCollege ? activeCollege.name : '',
          departmentId: selectedDepartmentId,
          departmentName: activeDept ? activeDept.name : '',
          designation: 'Faculty Academician & Mentor'
        });
      }

      navigate(getUserDashboardPath(user));
    } catch (err) {
      console.error("Registration error:", err);
      if (err.code === 'auth/configuration-not-found' || err.message?.includes('configuration-not-found')) {
        setError('Firebase Auth Configuration Required: Go to Firebase Console -> Authentication -> Sign-in method tab and enable "Email/Password" provider.');
      } else {
        setError(err.message || 'Registration failed. Please check your credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-xl glass-panel rounded-3xl p-8 border border-slate-700/80 shadow-2xl space-y-6">
        
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-purple-600 mx-auto flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-100">Create Account</h2>
          <p className="text-xs text-slate-400">Join NextHire Academic Hierarchy Platform</p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-500/20 border border-red-500/30 text-red-300 text-xs font-medium text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          
          {/* Role Selection Dropdown */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">Select User Role</label>
            <select
              value={role}
              onChange={e => setRole(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
            >
              <option value="student">🎓 Student (Instant Auto Mentor Assignment)</option>
              <option value="academician">👨‍🏫 Academician / Mentor (Requires Admin Approval)</option>
              <option value="industry">🏭 Industry Recruiter (Requires Admin Approval)</option>
            </select>
          </div>

          {/* Role Access Callout */}
          {role !== 'student' && (
            <div className="p-3 rounded-2xl bg-amber-950/20 border border-amber-500/30 text-amber-300 text-[11px] space-y-1">
              <span className="font-bold flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5" /> Restricted Account Notice:
              </span>
              <p className="text-slate-400">
                Industry & Academician accounts require Admin verification. Your account will enter <code className="text-amber-300">waiting</code> status until approved, unless you provide an invite code below.
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Full Name</label>
              <input
                type="text"
                required
                placeholder="Full Name"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Email Address</label>
              <input
                type="email"
                required
                placeholder="Email Address"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-3.5 pr-10 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-2.5 text-slate-500 hover:text-slate-300 transition-colors"
                title={showPassword ? "Hide Password" : "Show Password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Academic Hierarchy Selection for Students & Academicians */}
          {role !== 'industry' ? (
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4" /> Academic Hierarchy Mapping (Maharashtra Colleges & Universities)
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-semibold">
                  {colleges.length}+ Maharashtra Colleges
                </span>
              </div>

              {/* City / District Filter & Instant Search Filter */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div className="sm:col-span-1">
                  <select
                    value={selectedStateFilter}
                    onChange={e => setSelectedStateFilter(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="All">All Cities / Regions (Maharashtra)</option>
                    {Array.from(new Set(colleges.map(c => c.city || 'Other').filter(Boolean))).sort().map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <input
                    type="text"
                    placeholder="🔍 Search Maharashtra Colleges (e.g. IIT Bombay, COEP, VJTI, SPIT, Pune, Mumbai)..."
                    value={collegeSearch}
                    onChange={e => setCollegeSearch(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* College Selection */}
                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">1. Select College / University</label>
                  <select
                    value={selectedCollegeId}
                    onChange={e => setSelectedCollegeId(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  >
                    {colleges
                      .filter(c => {
                        const matchesCity = selectedStateFilter === 'All' || c.city === selectedStateFilter || c.location?.toLowerCase().includes(selectedStateFilter.toLowerCase());
                        const matchesSearch = !collegeSearch || 
                          c.name.toLowerCase().includes(collegeSearch.toLowerCase()) || 
                          c.location?.toLowerCase().includes(collegeSearch.toLowerCase()) ||
                          c.city?.toLowerCase().includes(collegeSearch.toLowerCase());
                        return matchesCity && matchesSearch;
                      })
                      .map(c => (
                        <option key={c.id} value={c.id}>{c.name} — {c.location || 'Maharashtra'}</option>
                      ))}
                  </select>
                </div>

                {/* Department Selection */}
                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">2. Select Department</label>
                  <select
                    value={selectedDepartmentId}
                    onChange={e => setSelectedDepartmentId(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  >
                    {departments.map(d => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Student Mentor Assignment Control */}
              {role === 'student' && (
                <div className="pt-3 border-t border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold text-slate-200 flex items-center gap-1.5">
                      <UserCheck className="w-4 h-4 text-emerald-400" />
                      3. Assigned Academic Mentor for {departments.find(d => d.id === selectedDepartmentId)?.name || 'Department'}
                    </label>
                    <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-semibold border ${
                      availableMentors.length > 0 
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' 
                        : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                    }`}>
                      {loadingMentors ? 'Loading...' : `${availableMentors.length} Mentor(s) Available`}
                    </span>
                  </div>

                  {loadingMentors ? (
                    <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-center gap-2 text-xs text-slate-400">
                      <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                      <span>Finding verified mentors for this college & department...</span>
                    </div>
                  ) : availableMentors.length > 0 ? (
                    <div className="space-y-2.5">
                      {/* Mentor Selection Dropdown */}
                      <select
                        value={selectedMentorId}
                        onChange={e => setSelectedMentorId(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                      >
                        {availableMentors.map(m => {
                          const mId = m.id || m.uid;
                          return (
                            <option key={mId} value={mId}>
                              👨‍🏫 {m.name} — {m.designation || 'Academic Mentor'} ({m.email || 'Verified'})
                            </option>
                          );
                        })}
                      </select>

                      {/* Visual Clickable Mentor Cards */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {availableMentors.map(m => {
                          const mId = m.id || m.uid;
                          const isSelected = selectedMentorId === mId;
                          return (
                            <div
                              key={mId}
                              onClick={() => setSelectedMentorId(mId)}
                              className={`p-2.5 rounded-xl border transition-all cursor-pointer text-left flex items-start gap-2.5 ${
                                isSelected
                                  ? 'bg-blue-600/20 border-blue-500/80 shadow-md shadow-blue-500/10'
                                  : 'bg-slate-800/70 border-slate-700/70 hover:border-slate-600'
                              }`}
                            >
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                                isSelected ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300'
                              }`}>
                                {m.name?.charAt(0) || 'M'}
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center justify-between gap-1">
                                  <p className="text-xs font-bold text-slate-200 truncate">{m.name}</p>
                                  {isSelected && (
                                    <span className="text-[9px] px-1.5 py-0.5 bg-blue-500/30 text-blue-300 rounded font-semibold shrink-0">
                                      Active
                                    </span>
                                  )}
                                </div>
                                <p className="text-[10px] text-slate-400 truncate">{m.designation || 'Faculty Academician'}</p>
                                <p className="text-[9px] text-blue-400 truncate">{m.email}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      <div className="p-2 rounded-xl bg-blue-950/30 border border-blue-500/20 text-[10px] text-blue-300 flex items-center gap-2">
                        <UserCheck className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                        <span>
                          Selected mentor will evaluate your projects, monitor skill roadmaps, and approve you for placement drives.
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-1">
                      <div className="flex items-center gap-1.5 text-amber-300 font-semibold text-[11px]">
                        <UserCheck className="w-3.5 h-3.5 text-amber-400" />
                        <span>No specific mentor assigned to this department yet</span>
                      </div>
                      <p className="text-[10px] text-slate-400 leading-relaxed">
                        You can still complete student registration. When an academician for this college or department registers, NextHire will automatically connect you.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Company / Organization Name</label>
              <input
                type="text"
                required
                placeholder="Company / Organization Name"
                value={companyName}
                onChange={e => setCompanyName(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
          )}

          {role === 'student' ? (
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Technical Skills (Comma Separated)</label>
              <input
                type="text"
                placeholder="Enter skills separated by comma (e.g. React.js, Python, SQL)"
                value={skills}
                onChange={e => setSkills(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
          ) : (
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Invite Code (Optional for Instant Auto-Approval)</label>
              <div className="relative">
                <Key className="w-4 h-4 text-slate-500 absolute left-3.5 top-2.5" />
                <input
                  type="text"
                  placeholder="Invite Code (Optional)"
                  value={inviteCode}
                  onChange={e => setInviteCode(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <span>{loading ? 'Creating Account...' : 'Register Account'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-center text-xs text-slate-400">
          Already registered?{' '}
          <Link to="/login" className="text-blue-400 font-semibold hover:underline">
            Sign In Here
          </Link>
        </p>

      </div>
    </div>
  );
}
