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
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-200 text-xs font-bold text-blue-700">
          <Sparkles className="w-4 h-4 text-blue-600" />
          <span>Smart India Hackathon Problem SIH26134 Solution</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight text-slate-900">
          AI-Powered Unified Skill, Internship & <br className="hidden sm:block" />
          <span className="text-blue-600">Academic Collaboration Platform</span>
        </h1>

        <p className="text-base sm:text-lg text-slate-600 max-w-3xl mx-auto font-medium leading-relaxed">
          Bridging the critical disconnect between <span className="text-blue-700 font-bold">Students</span>, <span className="text-indigo-700 font-bold">Industries</span>, and <span className="text-emerald-700 font-bold">Academicians</span> through Google Gemini AI resume scoring, skill gap diagnostics, real-time candidate ranking, and syllabus alignment.
        </p>

        {/* CTA Persona Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-6 max-w-4xl mx-auto">
          
          {/* Student Persona */}
          <div 
            onClick={() => handlePersonaSelect('student')}
            className="bg-white rounded-3xl p-6 border border-slate-200 text-left hover:scale-105 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group space-y-4"
          >
            <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">Role 01</span>
              <h3 className="text-lg font-extrabold text-slate-900 flex items-center justify-between mt-0.5">
                Students 🎓
                <ArrowRight className="w-4 h-4 text-blue-600 group-hover:translate-x-1 transition-transform" />
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed font-medium">
                Upload PDF resume for AI scoring, identify missing skill gaps, get course suggestions & matching internships.
              </p>
            </div>
            <button className="w-full py-2.5 rounded-xl bg-blue-50 text-blue-700 font-bold text-xs border border-blue-200 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              Explore Student Dashboard
            </button>
          </div>

          {/* Industry Persona */}
          <div 
            onClick={() => handlePersonaSelect('recruiter')}
            className="bg-white rounded-3xl p-6 border border-slate-200 text-left hover:scale-105 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group space-y-4"
          >
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">Role 02</span>
              <h3 className="text-lg font-extrabold text-slate-900 flex items-center justify-between mt-0.5">
                Industry Recruiters 🏭
                <ArrowRight className="w-4 h-4 text-indigo-600 group-hover:translate-x-1 transition-transform" />
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed font-medium">
                Post jobs & internships, access AI candidate ranking by skill overlap %, shortlist top talent effortlessly.
              </p>
            </div>
            <button className="w-full py-2.5 rounded-xl bg-indigo-50 text-indigo-700 font-bold text-xs border border-indigo-200 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              Explore Industry Portal
            </button>
          </div>

          {/* Academician Persona */}
          <div 
            onClick={() => handlePersonaSelect('academician')}
            className="bg-white rounded-3xl p-6 border border-slate-200 text-left hover:scale-105 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group space-y-4"
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">Role 03</span>
              <h3 className="text-lg font-extrabold text-slate-900 flex items-center justify-between mt-0.5">
                Academicians 👨‍🏫
                <ArrowRight className="w-4 h-4 text-emerald-600 group-hover:translate-x-1 transition-transform" />
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed font-medium">
                Monitor student skill trends, track placement readiness, and get AI recommendations to improve curriculum.
              </p>
            </div>
            <button className="w-full py-2.5 rounded-xl bg-emerald-50 text-emerald-700 font-bold text-xs border border-emerald-200 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              Explore Academic Portal
            </button>
          </div>

        </div>
      </section>

      {/* Problem vs Solution Section */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-xs space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-600">The Problem Statement</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Why NextHire AI?</h2>
            <p className="text-xs text-slate-500 font-medium">Traditional education suffers from a three-way disconnect.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="w-8 h-8 rounded-lg bg-red-100 text-red-700 flex items-center justify-center font-bold">1</div>
              <h4 className="text-sm font-bold text-slate-900">Students Lack Clarity</h4>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Students graduate without knowing which modern technical competencies recruiters actually demand.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold">2</div>
              <h4 className="text-sm font-bold text-slate-900">Industries Waste Time</h4>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Recruiters filter thousands of unqualified resumes manually, lacking automated skill-match rankings.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">3</div>
              <h4 className="text-sm font-bold text-slate-900">Academicians Lack Visibility</h4>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Professors have limited real-time visibility into industry trends to update university syllabi proactively.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Features Highlight Grid */}
      <section className="max-w-6xl mx-auto px-4 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600">Core AI Features</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Powered by Google Gemini 2.5 API</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
            <Sparkles className="w-6 h-6 text-blue-600" />
            <h4 className="text-sm font-bold text-slate-900">AI Resume Analyzer</h4>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Extracts technical & soft skills from PDF, evaluates ATS score (0-100), and highlights strengths & missing skills.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
            <Target className="w-6 h-6 text-indigo-600" />
            <h4 className="text-sm font-bold text-slate-900">Skill Gap Diagnostic</h4>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Compares candidate skill tags against job requirements in real-time to compute % match score.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
            <Award className="w-6 h-6 text-emerald-600" />
            <h4 className="text-sm font-bold text-slate-900">AI Candidate Ranking</h4>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Ranks recruiter applicants using composite skill overlap and ATS resume scoring algorithms.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
            <Zap className="w-6 h-6 text-amber-600" />
            <h4 className="text-sm font-bold text-slate-900">24/7 AI Career Chatbot</h4>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Provides interactive career advice, interview questions, and personalized learning pathways.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}
