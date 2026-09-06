import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  GraduationCap, 
  Building2, 
  BookOpen, 
  ArrowRight, 
  CheckCircle2, 
  TrendingUp, 
  Award, 
  Users, 
  ShieldCheck,
  Zap,
  Target
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { switchDemoRole } = useAuth();
  const navigate = useNavigate();

  const handlePersonaSelect = (role) => {
    switchDemoRole(role);
    if (role === 'student') navigate('/student/dashboard');
    if (role === 'recruiter') navigate('/industry/dashboard');
    if (role === 'academician') navigate('/academician/dashboard');
  };

  return (
    <div className="space-y-20 pb-16">
      
      {/* Hero Section */}
      <section className="relative pt-12 pb-16 px-4 text-center max-w-5xl mx-auto space-y-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel border border-blue-500/30 text-xs font-semibold text-blue-400 animate-pulse-glow">
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>Smart India Hackathon Problem SIH26134 Solution</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight">
          AI-Powered Unified Skill, Internship & <br className="hidden sm:block" />
          <span className="gradient-text">Academic Collaboration Platform</span>
        </h1>

        <p className="text-base sm:text-lg text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed">
          Bridging the critical disconnect between <span className="text-blue-400 font-semibold">Students</span>, <span className="text-purple-400 font-semibold">Industries</span>, and <span className="text-emerald-400 font-semibold">Academicians</span> through Google Gemini AI resume scoring, skill gap diagnostics, real-time candidate ranking, and syllabus alignment.
        </p>

        {/* CTA Persona Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-6 max-w-4xl mx-auto">
          
          {/* Student Persona */}
          <div 
            onClick={() => handlePersonaSelect('student')}
            className="glass-card rounded-3xl p-6 border border-blue-500/30 text-left hover:scale-105 transition-all cursor-pointer group space-y-4"
          >
            <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">Role 01</span>
              <h3 className="text-lg font-bold text-slate-100 flex items-center justify-between mt-0.5">
                Students 🎓
                <ArrowRight className="w-4 h-4 text-blue-400 group-hover:translate-x-1 transition-transform" />
              </h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Upload PDF resume for AI scoring, identify missing skill gaps, get course suggestions & matching internships.
              </p>
            </div>
            <button className="w-full py-2.5 rounded-xl bg-blue-600/20 text-blue-300 font-semibold text-xs border border-blue-500/30 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              Explore Student Dashboard
            </button>
          </div>

          {/* Industry Persona */}
          <div 
            onClick={() => handlePersonaSelect('recruiter')}
            className="glass-card rounded-3xl p-6 border border-purple-500/30 text-left hover:scale-105 transition-all cursor-pointer group space-y-4"
          >
            <div className="w-12 h-12 rounded-2xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-400 group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400">Role 02</span>
              <h3 className="text-lg font-bold text-slate-100 flex items-center justify-between mt-0.5">
                Industry Recruiters 🏭
                <ArrowRight className="w-4 h-4 text-purple-400 group-hover:translate-x-1 transition-transform" />
              </h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Post jobs & internships, access AI candidate ranking by skill overlap %, shortlist top talent effortlessly.
              </p>
            </div>
            <button className="w-full py-2.5 rounded-xl bg-purple-600/20 text-purple-300 font-semibold text-xs border border-purple-500/30 group-hover:bg-purple-600 group-hover:text-white transition-colors">
              Explore Industry Portal
            </button>
          </div>

          {/* Academician Persona */}
          <div 
            onClick={() => handlePersonaSelect('academician')}
            className="glass-card rounded-3xl p-6 border border-emerald-500/30 text-left hover:scale-105 transition-all cursor-pointer group space-y-4"
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Role 03</span>
              <h3 className="text-lg font-bold text-slate-100 flex items-center justify-between mt-0.5">
                Academicians 👨‍🏫
                <ArrowRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-1 transition-transform" />
              </h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Monitor student skill trends, track placement readiness, and get AI recommendations to improve curriculum.
              </p>
            </div>
            <button className="w-full py-2.5 rounded-xl bg-emerald-600/20 text-emerald-300 font-semibold text-xs border border-emerald-500/30 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              Explore Academic Portal
            </button>
          </div>

        </div>
      </section>

      {/* Problem vs Solution Section */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="glass-panel rounded-3xl p-8 sm:p-12 border border-slate-700/80 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-400">The Problem Statement</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100">Why NextHire AI?</h2>
            <p className="text-xs text-slate-400">Traditional education suffers from a three-way disconnect.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
              <div className="w-8 h-8 rounded-lg bg-red-500/20 text-red-400 flex items-center justify-center font-bold">1</div>
              <h4 className="text-sm font-bold text-slate-200">Students Lack Clarity</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Students graduate without knowing which modern technical competencies recruiters actually demand.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">2</div>
              <h4 className="text-sm font-bold text-slate-200">Industries Waste Time</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Recruiters filter thousands of unqualified resumes manually, lacking automated skill-match rankings.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">3</div>
              <h4 className="text-sm font-bold text-slate-200">Academicians Lack Visibility</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Professors have limited real-time visibility into industry trends to update university syllabi proactively.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Features Highlight Grid */}
      <section className="max-w-6xl mx-auto px-4 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-400">Core AI Features</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100">Powered by Google Gemini 2.5 API</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="glass-card rounded-2xl p-5 border border-slate-700/60 space-y-3">
            <Sparkles className="w-6 h-6 text-blue-400" />
            <h4 className="text-sm font-bold text-slate-100">AI Resume Analyzer</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Extracts technical & soft skills from PDF, evaluates ATS score (0-100), and highlights strengths & missing skills.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-5 border border-slate-700/60 space-y-3">
            <Target className="w-6 h-6 text-purple-400" />
            <h4 className="text-sm font-bold text-slate-100">Skill Gap Diagnostic</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Compares candidate skill tags against job requirements in real-time to compute % match score.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-5 border border-slate-700/60 space-y-3">
            <Award className="w-6 h-6 text-emerald-400" />
            <h4 className="text-sm font-bold text-slate-100">AI Candidate Ranking</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Ranks recruiter applicants using composite skill overlap and ATS resume scoring algorithms.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-5 border border-slate-700/60 space-y-3">
            <Zap className="w-6 h-6 text-amber-400" />
            <h4 className="text-sm font-bold text-slate-100">24/7 AI Career Chatbot</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Provides interactive career advice, interview questions, and personalized learning pathways.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}
