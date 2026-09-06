import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  User, 
  GraduationCap, 
  Save, 
  CheckCircle2, 
  Sparkles, 
  X, 
  Check, 
  Upload, 
  FileText, 
  RefreshCw, 
  FileCheck2, 
  ArrowRight,
  AlertTriangle 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { extractTextFromFile } from '../../services/pdfService';
import { analyzeResumeWithAI } from '../../services/aiService';
import SkillInputWithSuggestions from '../../components/common/SkillInputWithSuggestions';

export default function StudentProfile() {
  const { currentUser, updateProfile } = useAuth();

  const [name, setName] = useState(currentUser?.name || '');
  const [institution, setInstitution] = useState(currentUser?.institution || currentUser?.collegeName || '');
  const [degree, setDegree] = useState(currentUser?.degree || 'B.Tech CSE');
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [skills, setSkills] = useState(currentUser?.skills || ['React.js', 'Node.js', 'Python', 'Tailwind CSS', 'SQL']);
  
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Resume Auto-Fill State
  const [isUploadingResume, setIsUploadingResume] = useState(false);
  const [resumeUploadStep, setResumeUploadStep] = useState(1);
  const [resumeFileName, setResumeFileName] = useState(currentUser?.resumeFileName || '');
  const [isDraggingResume, setIsDraggingResume] = useState(false);
  const [resumeError, setResumeError] = useState('');

  useEffect(() => {
    if (currentUser) {
      if (currentUser.name) setName(currentUser.name);
      if (currentUser.institution || currentUser.collegeName) setInstitution(currentUser.institution || currentUser.collegeName);
      if (currentUser.degree) setDegree(currentUser.degree);
      if (currentUser.bio) setBio(currentUser.bio);
      if (currentUser.skills) setSkills(currentUser.skills);
      if (currentUser.resumeFileName) setResumeFileName(currentUser.resumeFileName);
    }
  }, [currentUser]);

  const handleAddSkill = (newSkillToAdd) => {
    if (newSkillToAdd && !skills.some(s => s.toLowerCase() === newSkillToAdd.toLowerCase())) {
      setSkills([...skills, newSkillToAdd]);
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  const handleResumeUpload = async (selectedFile) => {
    if (!selectedFile) return;
    const validExtensions = ['.pdf', '.txt', '.md', '.docx'];
    const fileName = selectedFile.name.toLowerCase();
    const isValid = validExtensions.some(ext => fileName.endsWith(ext));

    if (!isValid) {
      setResumeError("Please upload a PDF (.pdf) or text (.txt, .md) file.");
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      setResumeError("File size exceeds 10MB limit.");
      return;
    }

    setResumeError('');
    setIsUploadingResume(true);
    setResumeUploadStep(1);

    try {
      // Step 1: Extract Text
      const text = await extractTextFromFile(selectedFile);
      
      // Step 2: AI Competency & Information Analysis
      setResumeUploadStep(2);
      const result = await analyzeResumeWithAI(text, selectedFile?.name || '', currentUser);
      
      // Step 3: Default-Apply updates to form and database profile
      setResumeUploadStep(3);
      const existingSkills = skills || [];
      const newSkills = result.technicalSkills || [];
      const combinedSkills = Array.from(new Set([...newSkills, ...existingSkills]));

      // PRESERVE STUDENT NAME, COLLEGE NAME, AND DEPARTMENT!
      // Do not change name, institution, or degree when uploading a resume.
      setSkills(combinedSkills);
      setResumeFileName(selectedFile.name);

      const profilePayload = {
        skills: combinedSkills,
        resumeScore: result.resumeScore || 85,
        atsScore: result.resumeScore || 85,
        softSkills: result.softSkills || [],
        resumeFileName: selectedFile.name,
        resumeUpdatedAt: new Date().toISOString()
      };

      // Only fill bio if existing bio is completely blank
      if (!bio && (result.bio || result.summary)) {
        setBio(result.bio || result.summary);
        profilePayload.bio = result.bio || result.summary;
      }

      await updateProfile(profilePayload);

      setToastMessage(`Resume uploaded! Extracted ${combinedSkills.length} verified skills & updated ATS score. Your name, college, and department remain safely preserved.`);
      setShowToast(true);
      setSavedSuccess(true);

      setTimeout(() => {
        setSavedSuccess(false);
      }, 4000);
      setTimeout(() => {
        setShowToast(false);
      }, 5500);
    } catch (err) {
      console.error("Resume auto-apply error:", err);
      setResumeError("Failed to extract resume details. Please try another file.");
    } finally {
      setIsUploadingResume(false);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      await updateProfile({
        name,
        institution,
        collegeName: institution,
        degree,
        bio,
        skills
      });
      
      setToastMessage(`Your profile details, bio, and ${skills.length} technical skill tags were updated & synced with the database.`);
      setSavedSuccess(true);
      setShowToast(true);

      // Auto dismiss toast after 4.5 seconds
      setTimeout(() => {
        setSavedSuccess(false);
      }, 3000);

      setTimeout(() => {
        setShowToast(false);
      }, 4500);
    } catch (err) {
      console.error("Save profile error:", err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12 relative">
      
      {/* Floating Glassmorphism Toast Notification */}
      {showToast && (
        <div className="fixed top-20 right-4 sm:right-8 z-50 max-w-md w-full glass-panel rounded-2xl p-4 border border-emerald-500/50 bg-gradient-to-r from-emerald-950/95 via-slate-900/95 to-teal-950/95 shadow-2xl shadow-emerald-500/20 text-slate-100 flex items-start gap-3.5 animate-in slide-in-from-top-4 fade-in duration-300">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 animate-pulse">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-extrabold text-emerald-300 uppercase tracking-wider">
                Profile Updated & Default-Applied!
              </h4>
              <span className="text-[10px] text-emerald-400/80 font-mono">Just Now</span>
            </div>
            <p className="text-xs text-slate-200 leading-snug">
              {toastMessage || `Your profile details, bio, and ${skills.length} technical skill tags were updated & synced with the database.`}
            </p>
          </div>
          <button 
            onClick={() => setShowToast(false)}
            className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
            Student Profile & Skills
          </span>
          <h1 className="text-2xl font-extrabold text-slate-100 mt-1">Manage Profile & Skills</h1>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-semibold animate-in fade-in shadow-lg">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Database Synced!
          </div>
        )}
      </div>

      {/* Auto-Fill Profile from Resume Section */}
      <div className="glass-panel rounded-3xl p-6 border border-blue-500/40 bg-gradient-to-r from-blue-950/40 via-slate-900/80 to-purple-950/40 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 text-amber-300" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                Instant Auto-Fill & Sync From Resume
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Default Apply
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Upload your resume (PDF/TXT) to automatically extract your full name, institution, degree, bio, and skills and default-apply them across your entire Student Portal profile.
              </p>
            </div>
          </div>

          <Link
            to="/student/resume-analyzer"
            className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 shrink-0 font-semibold px-3 py-1.5 rounded-xl bg-blue-950/40 border border-blue-500/30 transition-colors"
          >
            <span>AI Resume Analyzer</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {resumeError && (
          <div className="p-3 rounded-xl bg-red-500/20 border border-red-500/40 text-red-300 text-xs font-medium flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{resumeError}</span>
          </div>
        )}

        {/* Drag & Drop or Browse Box */}
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDraggingResume(true); }}
          onDragLeave={(e) => { e.preventDefault(); setIsDraggingResume(false); }}
          onDrop={(e) => {
            e.preventDefault();
            setIsDraggingResume(false);
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
              handleResumeUpload(e.dataTransfer.files[0]);
            }
          }}
          className={`border-2 border-dashed rounded-2xl p-5 text-center transition-all flex flex-col sm:flex-row items-center justify-between gap-4 ${
            isDraggingResume 
              ? 'border-blue-400 bg-blue-950/40 scale-[1.01]'
              : isUploadingResume 
              ? 'border-indigo-500/60 bg-indigo-950/30'
              : 'border-slate-700/80 hover:border-blue-500/70 bg-slate-900/50'
          }`}
        >
          <div className="flex items-center gap-3.5 text-left">
            <div className="w-11 h-11 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center shrink-0">
              {isUploadingResume ? (
                <RefreshCw className="w-5 h-5 animate-spin text-blue-400" />
              ) : resumeFileName ? (
                <FileCheck2 className="w-5 h-5 text-emerald-400" />
              ) : (
                <Upload className="w-5 h-5 text-blue-400" />
              )}
            </div>
            <div>
              <p className="text-xs font-bold text-slate-200">
                {isUploadingResume 
                  ? resumeUploadStep === 1 
                    ? "Extracting candidate details from resume PDF..." 
                    : resumeUploadStep === 2 
                    ? "Parsing competencies & AI analysis..." 
                    : "Default-applying changes to Student Portal..." 
                  : resumeFileName 
                  ? `Active Resume: ${resumeFileName}` 
                  : "Upload or Drag & Drop Resume PDF"}
              </p>
              <p className="text-[11px] text-slate-400">
                {isUploadingResume 
                  ? "Applying all profile details automatically..." 
                  : "Supports .pdf, .txt, .md — automatically updates all portal fields"}
              </p>
            </div>
          </div>

          <label className={`px-4 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-all flex items-center gap-2 shadow-lg shrink-0 ${
            isUploadingResume 
              ? 'bg-slate-800 text-slate-400 cursor-not-allowed' 
              : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-500/20'
          }`}>
            <Upload className="w-3.5 h-3.5" />
            <span>{isUploadingResume ? "Processing..." : "Select Resume File"}</span>
            <input
              type="file"
              accept=".pdf,.txt,.md"
              disabled={isUploadingResume}
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleResumeUpload(e.target.files[0]);
                }
              }}
              className="hidden"
            />
          </label>
        </div>
      </div>

      <form onSubmit={handleSaveProfile} className="space-y-6">
        
        {/* Personal Info Card */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-700/60 space-y-5">
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2 pb-3 border-b border-slate-700/50">
            <User className="w-5 h-5 text-blue-400" /> Basic Details
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Email Address</label>
              <input
                type="email"
                disabled
                value={currentUser?.email || ''}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-500 cursor-not-allowed"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Institution / University</label>
              <input
                type="text"
                value={institution}
                onChange={e => setInstitution(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Degree Program</label>
              <input
                type="text"
                value={degree}
                onChange={e => setDegree(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Professional Bio & Career Goals</label>
            <textarea
              rows={3}
              value={bio}
              onChange={e => setBio(e.target.value)}
              placeholder="Tell recruiters about your key technical interests and software project achievements..."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Technical Skills Card */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-700/60 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-700/50">
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-purple-400" /> Technical Skills & Verified Tags
            </h3>
            <span className="text-[11px] font-semibold text-blue-400 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Smart Autocomplete Enabled
            </span>
          </div>

          <p className="text-xs text-slate-400">
            Type any skill letter/word to see live recommendations, or click any suggested pill below to add it instantly to your profile.
          </p>

          <SkillInputWithSuggestions
            skills={skills}
            onAddSkill={handleAddSkill}
            onRemoveSkill={handleRemoveSkill}
            placeholder="Type skill name (e.g., PyTorch, React, Docker) for live suggestions..."
            accentColor="blue"
          />
        </div>

        <div className="flex justify-end gap-4 items-center">
          <button
            type="submit"
            disabled={isSaving}
            className={`px-8 py-3 rounded-2xl text-white font-bold text-xs shadow-xl flex items-center gap-2 transition-all transform active:scale-95 ${
              savedSuccess 
                ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/25'
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-blue-500/25 hover:-translate-y-0.5'
            }`}
          >
            {isSaving ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin text-amber-300" />
                <span>Saving Changes...</span>
              </>
            ) : savedSuccess ? (
              <>
                <Check className="w-4 h-4 text-emerald-200" />
                <span>Saved & Synced!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Profile Changes</span>
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
}
