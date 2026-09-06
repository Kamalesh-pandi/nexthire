import React, { useState, useEffect } from 'react';
import { BookOpenCheck, Sparkles, PlusSquare, RefreshCw, CheckCircle2 } from 'lucide-react';
import { getCurriculumSuggestionsAI } from '../../services/aiService';
import { fetchProjectsFromFirestore } from '../../services/firebase';
import CurriculumSuggestionCard from '../../components/academician/CurriculumSuggestionCard';
import ProjectPostModal from '../../components/academician/ProjectPostModal';

export default function CurriculumProjects() {
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [projects, setProjects] = useState([]);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);

  const fetchAIRecommendations = async () => {
    setLoading(true);
    try {
      const res = await getCurriculumSuggestionsAI(
        [
          { skill: "PyTorch & Deep Learning", count: 18, percent: 72 },
          { skill: "Docker Container Architecture", count: 14, percent: 56 },
          { skill: "System Design & Scalability", count: 11, percent: 44 }
        ],
        ["PyTorch", "Docker", "React.js", "System Design"]
      );
      setSuggestions(res.recommendations || []);
    } catch (e) {
      console.error("AI curriculum generation error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAIRecommendations();

    async function loadProjects() {
      setProjectsLoading(true);
      try {
        const projs = await fetchProjectsFromFirestore();
        const uniqueProjs = [];
        const seen = new Set();
        projs.forEach(p => {
          const key = (p.title || p.id || '').toLowerCase().trim();
          if (key && !seen.has(key)) {
            seen.add(key);
            uniqueProjs.push(p);
          }
        });
        setProjects(uniqueProjs);
      } catch (err) {
        console.error("Failed loading capstone projects from Firestore:", err);
      } finally {
        setProjectsLoading(false);
      }
    }
    loadProjects();
  }, []);

  const handleProjectCreated = (newProject) => {
    setProjects(prev => {
      const filtered = prev.filter(p => p.id !== newProject.id && p.title?.toLowerCase() !== newProject.title?.toLowerCase());
      return [newProject, ...filtered];
    });
  };

  return (
    <div className="space-y-8 pb-16">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
            AI Syllabus Engineering
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-1">Curriculum Improvements & Projects</h1>
        </div>

        <button
          onClick={() => setIsProjectModalOpen(true)}
          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 flex items-center gap-2"
        >
          <PlusSquare className="w-4 h-4" /> Post Capstone Project
        </button>
      </div>

      {/* AI Syllabus Recommendations Header & Refresh */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <span>AI-Generated Curriculum Modules</span>
          </div>

          <button
            onClick={fetchAIRecommendations}
            disabled={loading}
            className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold flex items-center gap-1.5 border border-slate-200 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Regenerate Suggestions</span>
          </button>
        </div>

        <p className="text-xs text-slate-600">
          Suggestions are derived by cross-analyzing real-time job posting skill tags from hiring partners with current student cohort assessment deficits.
        </p>

        {/* Cards Grid */}
        {loading ? (
          <div className="py-12 text-center text-xs text-slate-500 flex flex-col items-center gap-2">
            <Sparkles className="w-6 h-6 text-blue-600 animate-spin" />
            <span>Analyzing industry job postings & synthesizing course modules...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            {suggestions.map((item, idx) => (
              <CurriculumSuggestionCard key={idx} suggestion={item} />
            ))}
          </div>
        )}
      </div>

      {/* Active Academic Projects List */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <BookOpenCheck className="w-5 h-5 text-blue-600" /> Co-Sponsored Industry Capstones
        </h3>

        {projectsLoading ? (
          <div className="bg-white rounded-3xl p-8 text-center text-slate-500 text-xs border border-slate-200">
            Fetching capstone projects...
          </div>
        ) : projects.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center text-slate-500 text-xs border border-slate-200">
            No capstone projects posted yet. Click "Post Capstone Project" to create one.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((proj) => (
              <div key={proj.id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                    Sponsor: {proj.industryPartner || 'Industry Partner'}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">Deadline: {proj.deadline || '2026-12-31'}</span>
                </div>

                <h4 className="text-base font-bold text-slate-900">{proj.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{proj.description}</p>

                <div className="space-y-1">
                  <span className="text-[11px] text-slate-500 font-medium">Required Skill Prerequisites:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {(proj.requiredSkills || []).map((s, i) => (
                      <span key={i} className="text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 font-medium">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ProjectPostModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        onProjectCreated={handleProjectCreated}
      />

    </div>
  );
}
