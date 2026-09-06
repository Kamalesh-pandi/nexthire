import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Target, 
  TrendingUp, 
  CheckCircle2, 
  BookOpen, 
  ArrowRight, 
  Award, 
  Clock, 
  Loader2, 
  ExternalLink,
  PlusCircle,
  BarChart2,
  Brain,
  FileText
} from 'lucide-react';
import { 
  Chart as ChartJS, 
  RadialLinearScale, 
  PointElement, 
  LineElement, 
  Filler, 
  Tooltip, 
  Legend 
} from 'chart.js';
import { Radar } from 'react-chartjs-2';
import { generatePersonalizedRoadmapAI } from '../../services/aiService';
import { useAuth } from '../../context/AuthContext';

// Register ChartJS Radial Scale
ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

export default function SkillRoadmap() {
  const { userProfile } = useAuth();
  
  // Input settings
  const [selectedRole, setSelectedRole] = useState('Full-Stack Developer');
  const [customJd, setCustomJd] = useState('');
  const [isCustomMode, setIsCustomMode] = useState(false);
  
  // Data state
  const [loading, setLoading] = useState(true);
  const [roadmapData, setRoadmapData] = useState(null);
  const [addedSkills, setAddedSkills] = useState([]);

  const studentSkills = userProfile?.technicalSkills || ['React.js', 'Node.js', 'Python', 'SQL', 'Git'];

  const fetchRoadmap = async () => {
    setLoading(true);
    try {
      const data = await generatePersonalizedRoadmapAI(
        studentSkills, 
        selectedRole, 
        isCustomMode ? customJd : ''
      );
      setRoadmapData(data);
    } catch (err) {
      console.error("Failed to generate roadmap:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoadmap();
  }, [selectedRole]);

  // Chart JS Radar Data Config
  const radarData = roadmapData ? {
    labels: roadmapData.radarMetrics.map(m => m.category),
    datasets: [
      {
        label: 'My Current Proficiency',
        data: roadmapData.radarMetrics.map(m => m.studentScore),
        backgroundColor: 'rgba(59, 130, 246, 0.25)',
        borderColor: '#3b82f6',
        borderWidth: 2,
        pointBackgroundColor: '#3b82f6',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#3b82f6'
      },
      {
        label: `${selectedRole} Benchmark`,
        data: roadmapData.radarMetrics.map(m => m.targetScore),
        backgroundColor: 'rgba(16, 185, 129, 0.15)',
        borderColor: '#10b981',
        borderWidth: 2,
        borderDash: [4, 4],
        pointBackgroundColor: '#10b981',
        pointBorderColor: '#fff'
      }
    ]
  } : null;

  const radarOptions = {
    scales: {
      r: {
        angleLines: { color: 'rgba(226, 232, 240, 0.8)' },
        grid: { color: 'rgba(226, 232, 240, 0.8)' },
        pointLabels: {
          font: { size: 11, weight: 'bold' },
          color: '#475569'
        },
        ticks: { display: false, stepSize: 20 },
        suggestedMin: 0,
        suggestedMax: 100
      }
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: { size: 12, weight: 'bold' },
          usePointStyle: true
        }
      }
    },
    maintainAspectRatio: false
  };

  const handleAddSkill = (skillName) => {
    if (!addedSkills.includes(skillName)) {
      setAddedSkills(prev => [...prev, skillName]);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 text-white p-6 sm:p-8 shadow-xl">
        <div className="absolute right-0 top-0 -mt-8 -mr-8 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-semibold backdrop-blur-md border border-purple-400/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>NextHire AI Career Intelligence</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Skill Gap Radar & 4-Week AI Roadmap
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl">
              Benchmark your skills against top recruiter expectations or any custom job posting. Get a visual radar breakdown and a personalized week-by-week upskilling pathway.
            </p>
          </div>

          {roadmapData && (
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 text-center shrink-0 min-w-[140px]">
              <div className="text-xs uppercase font-bold tracking-wider text-purple-200">Role Fit Index</div>
              <div className="text-3xl font-black text-emerald-400">{roadmapData.overallMatchScore}%</div>
              <div className="text-[11px] text-slate-300 font-medium mt-0.5">
                {roadmapData.overallMatchScore >= 80 ? '🌟 High Alignment' : '🚀 Growth Pathway'}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Role Selection & Custom JD Switcher */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Target className="w-5 h-5 text-indigo-600" />
            <h3 className="text-base font-bold text-slate-800">Target Role & Industry Benchmark</h3>
          </div>

          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setIsCustomMode(false)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                !isCustomMode ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Standard Job Roles
            </button>
            <button
              onClick={() => setIsCustomMode(true)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                isCustomMode ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Paste Custom Job Description
            </button>
          </div>
        </div>

        {!isCustomMode ? (
          <div className="flex flex-wrap items-center gap-3 pt-2">
            {[
              'Full-Stack Developer',
              'AI / Machine Learning Engineer',
              'DevOps & Cloud Engineer',
              'Data Engineer & Analytics',
              'Backend Systems Architect'
            ].map(role => (
              <button
                key={role}
                onClick={() => setSelectedRole(role)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedRole === role
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                    : 'bg-slate-50 text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 border border-slate-200'
                }`}
              >
                {role}
              </button>
            ))}
          </div>
        ) : (
          <div className="space-y-3 pt-2">
            <textarea
              value={customJd}
              onChange={(e) => setCustomJd(e.target.value)}
              rows={3}
              placeholder="Paste a job description from LinkedIn, Glassdoor, or a recruiter email here to generate a tailored skill gap radar..."
              className="w-full bg-slate-50 border border-slate-300 rounded-2xl p-3 text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
            <button
              onClick={fetchRoadmap}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-all shadow-md"
            >
              <Sparkles className="w-4 h-4" />
              <span>Analyze Custom Job Description</span>
            </button>
          </div>
        )}
      </div>

      {loading ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-4">
          <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mx-auto" />
          <h3 className="text-lg font-bold text-slate-800">Calculating Skill Gap Radar...</h3>
          <p className="text-sm text-slate-500">Gemini AI is analyzing requirement metrics for {selectedRole}...</p>
        </div>
      ) : roadmapData ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Visual Radar Chart */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <BarChart2 className="w-5 h-5 text-indigo-600" />
                  <span>Skill Gap Radar</span>
                </h3>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
                  Live Analytics
                </span>
              </div>

              {/* Chart Container */}
              <div className="h-72 w-full pt-2">
                {radarData && <Radar data={radarData} options={radarOptions} />}
              </div>

              {/* Metrics Table */}
              <div className="space-y-2 pt-4 border-t border-slate-100">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-2">Category Competency Breakdown</h4>
                {roadmapData.radarMetrics.map((m, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs py-1 border-b border-slate-50">
                    <span className="font-semibold text-slate-700">{m.category}</span>
                    <div className="flex items-center gap-2 font-mono font-bold">
                      <span className="text-blue-600">{m.studentScore}%</span>
                      <span className="text-slate-300">/</span>
                      <span className="text-emerald-600">{m.targetScore}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Skills Add Card */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl p-6 border border-indigo-100 space-y-3">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-indigo-900 flex items-center gap-2">
                <PlusCircle className="w-4 h-4 text-indigo-600" />
                <span>Recommended Skill Badges</span>
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Click to mark off skills as you learn them during your 4-week roadmap:
              </p>
              
              <div className="flex flex-wrap items-center gap-2 pt-1">
                {['Docker', 'Redis', 'Kubernetes', 'GraphQL', 'PyTorch', 'System Design'].map(sk => {
                  const isAdded = addedSkills.includes(sk);
                  return (
                    <button
                      key={sk}
                      onClick={() => handleAddSkill(sk)}
                      className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
                        isAdded
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'bg-white text-slate-700 border border-slate-200 hover:border-indigo-300'
                      }`}
                    >
                      {isAdded ? <CheckCircle2 className="w-3.5 h-3.5" /> : <PlusCircle className="w-3.5 h-3.5 text-indigo-500" />}
                      <span>{sk}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: 4-Week AI Roadmap Timeline */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <Brain className="w-5 h-5 text-indigo-600" />
                <span>Personalized 4-Week Learning Pathway</span>
              </h3>
              <span className="text-xs text-slate-500 font-semibold">
                Updated for {selectedRole}
              </span>
            </div>

            <div className="space-y-4">
              {roadmapData.weeks.map((w) => (
                <div 
                  key={w.weekNumber}
                  className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4 hover:border-indigo-300 transition-all group"
                >
                  <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
                    <span className="text-xs font-black uppercase tracking-wider px-3 py-1 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-100">
                      {w.title}
                    </span>
                    <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>7 Days</span>
                    </span>
                  </div>

                  <div>
                    <h4 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {w.focusArea}
                    </h4>
                  </div>

                  {/* Action Items */}
                  <div className="space-y-2">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">Action Checklist</span>
                    <ul className="space-y-1.5 text-xs text-slate-700">
                      {w.actionItems.map((item, iIdx) => (
                        <li key={iIdx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          <span className="leading-snug">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Hands-on Project & Resource */}
                  <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="text-xs">
                      <span className="font-extrabold text-slate-500 uppercase tracking-wider block">Recommended Capstone Project:</span>
                      <span className="font-bold text-indigo-900">{w.recommendedProject}</span>
                    </div>

                    {w.resourceLink && (
                      <a
                        href={w.resourceLink}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-3 py-1.5 rounded-xl hover:bg-indigo-100 transition-all shrink-0"
                      >
                        <span>Learning Guide</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>
      ) : null}
    </div>
  );
}
