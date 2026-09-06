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
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1.5 w-fit">
              <ShieldCheck className="w-3.5 h-3.5" /> System Administrator Control Panel
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Academic Hierarchy & Privileged User Access Control
            </h1>
            <p className="text-xs text-slate-600">
              Manage Colleges, Departments, Mentor Assignments, and Onboarding Approvals.
            </p>
          </div>

          <button
            onClick={loadAllData}
            disabled={loading}
            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold border border-slate-300 flex items-center gap-2 transition-colors shrink-0"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh System Data</span>
          </button>
        </div>
      </div>

      {actionSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" /> {actionSuccess}
        </div>
      )}

      {/* Main Mode Tabs */}
      <div className="flex items-center gap-3 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('hierarchy')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'hierarchy'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>Academic Hierarchy Tree</span>
        </button>

        <button
          onClick={() => setActiveTab('approvals')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'approvals'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>User Approvals Queue ({pendingUsers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('manage_colleges')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'manage_colleges'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
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
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-blue-600" />
              Institutional Hierarchy (College → Dept → Mentor → Students)
            </h3>
            <span className="text-xs text-slate-500 font-semibold">Total Registered Colleges: {colleges.length}</span>
          </div>

          <div className="space-y-6">
            {colleges.map(college => {
              const collegeDepts = departments.filter(d => d.collegeId === college.id);
              const collegeUsers = users.filter(u => u.collegeId === college.id || u.institution?.includes(college.name));

              return (
                <div key={college.id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
                  
                  {/* College Node */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center font-bold">
                        <Building2 className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-base font-extrabold text-slate-900">{college.name}</h4>
                        <p className="text-xs text-slate-500">{college.location || 'India'}</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-blue-700 px-3 py-1 bg-blue-50 border border-blue-200 rounded-full">
                      {collegeDepts.length} Departments
                    </span>
                  </div>

                  {/* Department Sub-nodes */}
                  <div className="pl-4 sm:pl-8 space-y-4">
                    {collegeDepts.map(dept => {
                      const deptMentors = users.filter(u => u.role === 'academician' && (u.departmentId === dept.id || u.departmentName === dept.name));
                      const deptStudents = users.filter(u => u.role === 'student' && (u.departmentId === dept.id || u.departmentName === dept.name));

                      return (
                        <div key={dept.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-sm text-slate-900 flex items-center gap-2">
                              <BookOpen className="w-4 h-4 text-blue-600" />
                              {dept.name}
                            </span>
                            <div className="flex gap-2 text-[11px]">
                              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200">
                                {deptMentors.length} Mentors
                              </span>
                              <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 font-semibold border border-blue-200">
                                {deptStudents.length} Students
                              </span>
                            </div>
                          </div>

                          {/* Mentors & Mentees Tree */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                            {deptMentors.map(mentor => {
                              const mentorMentees = deptStudents.filter(s => s.mentorId === mentor.id || s.mentorId === mentor.uid || s.mentorName === mentor.name);

                              return (
                                <div key={mentor.id} className="p-3 rounded-xl bg-white border border-slate-200 shadow-xs space-y-2">
                                  <div className="flex items-center justify-between">
                                    <span className="font-bold text-xs text-blue-700 flex items-center gap-1.5">
                                      <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                                      {mentor.name}
                                    </span>
                                    <span className="text-[10px] text-slate-500 font-semibold">Mentor</span>
                                  </div>
                                  <p className="text-[11px] text-slate-500 font-mono">{mentor.email}</p>

                                  <div className="pt-1.5 border-t border-slate-100 space-y-1">
                                    <span className="text-[10px] text-slate-600 block font-bold">Assigned Mentees ({mentorMentees.length}):</span>
                                    {mentorMentees.length > 0 ? (
                                      mentorMentees.map(st => (
                                        <div key={st.id} className="flex justify-between items-center text-[11px] text-slate-800 px-2 py-0.5 rounded bg-slate-50 border border-slate-200 font-medium">
                                          <span>{st.name}</span>
                                          <span className="text-blue-600 font-mono text-[10px] font-bold">Score: {st.resumeScore || 85}</span>
                                        </div>
                                      ))
                                    ) : (
                                      <span className="text-[10px] text-slate-400 italic block">No mentees assigned yet</span>
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
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                approvalSubTab === 'waiting'
                  ? 'bg-amber-50 text-amber-800 border border-amber-300'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              <span>Pending Approvals ({pendingUsers.length})</span>
            </button>

            <button
              onClick={() => setApprovalSubTab('approved')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                approvalSubTab === 'approved'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Approved Users ({approvedUsers.length})</span>
            </button>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs overflow-x-auto">
            {displayedUsers.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-500">
                No user accounts in category: <span className="font-semibold capitalize text-slate-900">{approvalSubTab}</span>
              </div>
            ) : (
              <table className="w-full text-left text-xs text-slate-700">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                    <th className="pb-3 px-3">Applicant Name</th>
                    <th className="pb-3 px-3">Email Address</th>
                    <th className="pb-3 px-3">Requested Role</th>
                    <th className="pb-3 px-3">Institution / Company</th>
                    <th className="pb-3 px-3 text-center">Status</th>
                    <th className="pb-3 px-3 text-right">Admin Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {displayedUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-4 px-3 font-bold text-slate-900">{u.name}</td>
                      <td className="py-4 px-3 font-mono text-[11px] text-slate-600">{u.email}</td>
                      <td className="py-4 px-3">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 text-blue-800 font-bold text-[11px] border border-blue-200 capitalize">
                          {u.requestedRole === 'industry' ? <Building2 className="w-3 h-3 text-blue-600" /> : <BookOpen className="w-3 h-3 text-blue-600" />}
                          {u.requestedRole || u.role}
                        </span>
                      </td>
                      <td className="py-4 px-3 text-slate-600 font-medium">{u.institution || u.companyName || 'N/A'}</td>
                      <td className="py-4 px-3 text-center">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          u.status === 'approved' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' :
                          u.status === 'rejected' ? 'bg-red-50 text-red-800 border border-red-200' : 'bg-amber-50 text-amber-800 border border-amber-200'
                        }`}>
                          {u.status || 'waiting'}
                        </span>
                      </td>
                      <td className="py-4 px-3 text-right">
                        {u.status === 'waiting' || u.role === 'pending' ? (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleApprove(u.id, u.requestedRole)}
                              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] flex items-center gap-1 shadow-md shadow-emerald-500/20"
                            >
                              <Check className="w-3.5 h-3.5" /> Approve
                            </button>
                            <button
                              onClick={() => handleReject(u.id)}
                              className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-[11px] flex items-center gap-1 shadow-md shadow-red-500/20"
                            >
                              <X className="w-3.5 h-3.5" /> Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-400 italic">No action required</span>
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
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-blue-600" />
              Register New College / Institution
            </h3>

            <form onSubmit={handleCreateCollege} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">College / Institute Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Veermata Jijabai Technological Institute (VJTI), Mumbai"
                  value={newCollegeName}
                  onChange={e => setNewCollegeName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-blue-600 transition-colors"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Location / City (Maharashtra)</label>
                <input
                  type="text"
                  placeholder="e.g. Matunga, Mumbai, Maharashtra"
                  value={newCollegeLocation}
                  onChange={e => setNewCollegeLocation(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-blue-600 transition-colors"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-blue-500/20"
              >
                <Plus className="w-4 h-4" /> Add College to Database
              </button>
            </form>
          </div>

          {/* Add Department Form */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-600" />
              Register Department under College
            </h3>

            <form onSubmit={handleCreateDept} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Select Target College</label>
                <select
                  value={newDeptCollegeId}
                  onChange={e => setNewDeptCollegeId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-blue-600 transition-colors"
                >
                  {colleges.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Department Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Artificial Intelligence & Data Science"
                  value={newDeptName}
                  onChange={e => setNewDeptName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-blue-600 transition-colors"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-blue-500/20"
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
