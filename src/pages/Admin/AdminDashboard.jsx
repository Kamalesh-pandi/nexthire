import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  UserCheck, 
  UserX, 
  Clock, 
  Check, 
  X, 
  Building2, 
  BookOpen, 
  Users, 
  RefreshCw,
  Search,
  CheckCircle2,
  Plus,
  GraduationCap,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { 
  fetchPendingUsersFromFirestore, 
  fetchAllUsersFromFirestore, 
  approveUserInFirestore, 
  rejectUserInFirestore,
  fetchCollegesFromFirestore,
  createCollegeInFirestore,
  fetchDepartmentsFromFirestore,
  createDepartmentInFirestore
} from '../../services/firebase';

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [colleges, setColleges] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('hierarchy'); // 'hierarchy' | 'approvals' | 'manage_colleges'
  const [approvalSubTab, setApprovalSubTab] = useState('waiting');
  const [actionSuccess, setActionSuccess] = useState('');

  // Add College Form States
  const [newCollegeName, setNewCollegeName] = useState('');
  const [newCollegeLocation, setNewCollegeLocation] = useState('');

  // Add Dept Form States
  const [newDeptCollegeId, setNewDeptCollegeId] = useState('');
  const [newDeptName, setNewDeptName] = useState('');

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [userList, colList, deptList] = await Promise.all([
        fetchAllUsersFromFirestore(),
        fetchCollegesFromFirestore(),
        fetchDepartmentsFromFirestore()
      ]);
      setUsers(userList);
      setColleges(colList);
      setDepartments(deptList);
      if (colList.length > 0) {
        setNewDeptCollegeId(colList[0].id);
      }
    } catch (err) {
      console.error("Failed to load admin dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const handleApprove = async (userId, requestedRole) => {
    try {
      await approveUserInFirestore(userId, requestedRole || 'industry');
      setActionSuccess(`User approved and granted role: ${requestedRole || 'industry'}`);
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: requestedRole || 'industry', status: 'approved' } : u));
      setTimeout(() => setActionSuccess(''), 4000);
    } catch (err) {
      console.error("Approve user error:", err);
    }
  };

  const handleReject = async (userId) => {
    try {
      await rejectUserInFirestore(userId);
      setActionSuccess(`User request rejected.`);
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: 'rejected' } : u));
      setTimeout(() => setActionSuccess(''), 4000);
    } catch (err) {
      console.error("Reject user error:", err);
    }
  };

  const handleCreateCollege = async (e) => {
    e.preventDefault();
    if (!newCollegeName) return;
    try {
      const newCol = await createCollegeInFirestore({
        name: newCollegeName,
        location: newCollegeLocation || 'India'
      });
      setColleges(prev => [...prev, newCol]);
      setNewCollegeName('');
      setNewCollegeLocation('');
      setActionSuccess(`Added new College: ${newCol.name}`);
      setTimeout(() => setActionSuccess(''), 4000);
    } catch (err) {
      console.error("Create college error:", err);
    }
  };

  const handleCreateDept = async (e) => {
    e.preventDefault();
    if (!newDeptName || !newDeptCollegeId) return;
    try {
      const newDept = await createDepartmentInFirestore({
        name: newDeptName,
        collegeId: newDeptCollegeId
      });
      setDepartments(prev => [...prev, newDept]);
      setNewDeptName('');
      setActionSuccess(`Added Department: ${newDept.name}`);
      setTimeout(() => setActionSuccess(''), 4000);
    } catch (err) {
      console.error("Create department error:", err);
    }
  };

  const pendingUsers = users.filter(u => u.status === 'waiting' || u.role === 'pending');
  const approvedUsers = users.filter(u => u.status === 'approved' && u.role !== 'admin');
  const rejectedUsers = users.filter(u => u.status === 'rejected');

  const displayedUsers = 
    approvalSubTab === 'waiting' ? pendingUsers :
    approvalSubTab === 'approved' ? approvedUsers : rejectedUsers;

  return (
    <div className="space-y-8 pb-16">
      
      {/* Admin Header Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-red-500/30 relative overflow-hidden bg-gradient-to-r from-red-950/40 via-slate-900/80 to-purple-950/40">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-red-500/20 text-red-300 border border-red-500/30 flex items-center gap-1.5 w-fit">
              <ShieldCheck className="w-3.5 h-3.5" /> System Administrator Control Panel
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100">
              Academic Hierarchy & Privileged User Access Control
            </h1>
            <p className="text-xs text-slate-300">
              Manage Colleges, Departments, Mentor Assignments, and Onboarding Approvals.
            </p>
          </div>

          <button
            onClick={loadAllData}
            disabled={loading}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center gap-2 transition-colors shrink-0"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh System Data</span>
          </button>
        </div>
      </div>

      {actionSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4" /> {actionSuccess}
        </div>
      )}

      {/* Main Mode Tabs */}
      <div className="flex items-center gap-3 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('hierarchy')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'hierarchy'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>Academic Hierarchy Tree</span>
        </button>

        <button
          onClick={() => setActiveTab('approvals')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'approvals'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/25'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>User Approvals Queue ({pendingUsers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('manage_colleges')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'manage_colleges'
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/25'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Manage Colleges & Depts</span>
        </button>
      </div>

      {/* TAB 1: ACADEMIC HIERARCHY TREE */}
      {activeTab === 'hierarchy' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-blue-400" />
              Institutional Hierarchy (College → Dept → Mentor → Students)
            </h3>
            <span className="text-xs text-slate-400">Total Registered Colleges: {colleges.length}</span>
          </div>

          <div className="space-y-6">
            {colleges.map(college => {
              const collegeDepts = departments.filter(d => d.collegeId === college.id);
              const collegeUsers = users.filter(u => u.collegeId === college.id || u.institution?.includes(college.name));

              return (
                <div key={college.id} className="glass-panel rounded-3xl p-6 border border-slate-700/80 space-y-4">
                  
                  {/* College Node */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold">
                        <Building2 className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-base font-extrabold text-slate-100">{college.name}</h4>
                        <p className="text-xs text-slate-400">{college.location || 'India'}</p>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-blue-400 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full">
                      {collegeDepts.length} Departments
                    </span>
                  </div>

                  {/* Department Sub-nodes */}
                  <div className="pl-4 sm:pl-8 space-y-4">
                    {collegeDepts.map(dept => {
                      const deptMentors = users.filter(u => u.role === 'academician' && (u.departmentId === dept.id || u.departmentName === dept.name));
                      const deptStudents = users.filter(u => u.role === 'student' && (u.departmentId === dept.id || u.departmentName === dept.name));

                      return (
                        <div key={dept.id} className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-sm text-slate-200 flex items-center gap-2">
                              <BookOpen className="w-4 h-4 text-emerald-400" />
                              {dept.name}
                            </span>
                            <div className="flex gap-2 text-[11px]">
                              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-medium">
                                {deptMentors.length} Mentors
                              </span>
                              <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-medium">
                                {deptStudents.length} Students
                              </span>
                            </div>
                          </div>

                          {/* Mentors & Mentees Tree */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                            {deptMentors.map(mentor => {
                              const mentorMentees = deptStudents.filter(s => s.mentorId === mentor.id || s.mentorId === mentor.uid || s.mentorName === mentor.name);

                              return (
                                <div key={mentor.id} className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60 space-y-2">
                                  <div className="flex items-center justify-between">
                                    <span className="font-semibold text-xs text-emerald-300 flex items-center gap-1.5">
                                      <UserCheck className="w-3.5 h-3.5" />
                                      {mentor.name}
                                    </span>
                                    <span className="text-[10px] text-slate-400">Mentor</span>
                                  </div>
                                  <p className="text-[11px] text-slate-400 font-mono">{mentor.email}</p>

                                  <div className="pt-1.5 border-t border-slate-700/50 space-y-1">
                                    <span className="text-[10px] text-slate-400 block font-semibold">Assigned Mentees ({mentorMentees.length}):</span>
                                    {mentorMentees.length > 0 ? (
                                      mentorMentees.map(st => (
                                        <div key={st.id} className="flex justify-between items-center text-[11px] text-slate-300 px-2 py-0.5 rounded bg-slate-900/60">
                                          <span>{st.name}</span>
                                          <span className="text-blue-400 font-mono text-[10px]">Score: {st.resumeScore || 85}</span>
                                        </div>
                                      ))
                                    ) : (
                                      <span className="text-[10px] text-slate-500 italic block">No mentees assigned yet</span>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: USER APPROVAL QUEUE */}
      {activeTab === 'approvals' && (
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setApprovalSubTab('waiting')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                approvalSubTab === 'waiting'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Pending Approvals ({pendingUsers.length})</span>
            </button>

            <button
              onClick={() => setApprovalSubTab('approved')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                approvalSubTab === 'approved'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Approved Users ({approvedUsers.length})</span>
            </button>
          </div>

          <div className="glass-panel rounded-3xl p-6 border border-slate-700/80 overflow-x-auto">
            {displayedUsers.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-400">
                No user accounts in category: <span className="font-semibold capitalize text-slate-200">{approvalSubTab}</span>
              </div>
            ) : (
              <table className="w-full text-left text-xs text-slate-300">
                <thead>
                  <tr className="border-b border-slate-700/60 text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
                    <th className="pb-3 px-3">Applicant Name</th>
                    <th className="pb-3 px-3">Email Address</th>
                    <th className="pb-3 px-3">Requested Role</th>
                    <th className="pb-3 px-3">Institution / Company</th>
                    <th className="pb-3 px-3 text-center">Status</th>
                    <th className="pb-3 px-3 text-right">Admin Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {displayedUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-4 px-3 font-bold text-slate-100">{u.name}</td>
                      <td className="py-4 px-3 font-mono text-[11px] text-slate-300">{u.email}</td>
                      <td className="py-4 px-3">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 font-bold text-[11px] border border-purple-500/30 capitalize">
                          {u.requestedRole === 'industry' ? <Building2 className="w-3 h-3" /> : <BookOpen className="w-3 h-3" />}
                          {u.requestedRole || u.role}
                        </span>
                      </td>
                      <td className="py-4 px-3 text-slate-400">{u.institution || u.companyName || 'N/A'}</td>
                      <td className="py-4 px-3 text-center">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          u.status === 'approved' ? 'bg-emerald-500/20 text-emerald-300' :
                          u.status === 'rejected' ? 'bg-red-500/20 text-red-300' : 'bg-amber-500/20 text-amber-300'
                        }`}>
                          {u.status || 'waiting'}
                        </span>
                      </td>
                      <td className="py-4 px-3 text-right">
                        {u.status === 'waiting' || u.role === 'pending' ? (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleApprove(u.id, u.requestedRole)}
                              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] flex items-center gap-1 shadow-md shadow-emerald-500/20"
                            >
                              <Check className="w-3.5 h-3.5" /> Approve
                            </button>
                            <button
                              onClick={() => handleReject(u.id)}
                              className="px-3 py-1.5 rounded-xl bg-red-600/80 hover:bg-red-600 text-white font-bold text-[11px] flex items-center gap-1 shadow-md shadow-red-500/20"
                            >
                              <X className="w-3.5 h-3.5" /> Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-500 italic">No action required</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: MANAGE COLLEGES & DEPARTMENTS */}
      {activeTab === 'manage_colleges' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Add College Form */}
          <div className="glass-panel rounded-3xl p-6 border border-slate-700/80 space-y-4">
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-blue-400" />
              Register New College / Institution
            </h3>

            <form onSubmit={handleCreateCollege} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">College / Institute Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Veermata Jijabai Technological Institute (VJTI), Mumbai"
                  value={newCollegeName}
                  onChange={e => setNewCollegeName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Location / City (Maharashtra)</label>
                <input
                  type="text"
                  placeholder="e.g. Matunga, Mumbai, Maharashtra"
                  value={newCollegeLocation}
                  onChange={e => setNewCollegeLocation(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
              >
                <Plus className="w-4 h-4" /> Add College to Firestore
              </button>
            </form>
          </div>

          {/* Add Department Form */}
          <div className="glass-panel rounded-3xl p-6 border border-slate-700/80 space-y-4">
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-400" />
              Register Department under College
            </h3>

            <form onSubmit={handleCreateDept} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Select Target College</label>
                <select
                  value={newDeptCollegeId}
                  onChange={e => setNewDeptCollegeId(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  {colleges.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Department Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Artificial Intelligence & Data Science"
                  value={newDeptName}
                  onChange={e => setNewDeptName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
              >
                <Plus className="w-4 h-4" /> Add Department to College
              </button>
            </form>
          </div>

        </div>
      )}

    </div>
  );
}
