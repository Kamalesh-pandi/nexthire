import React, { useState } from 'react';
import { 
  Trophy, 
  Sparkles, 
  Code2, 
  ExternalLink, 
  GitBranch, 
  Award, 
  Clock, 
  CheckCircle2, 
  PlusSquare, 
  Send, 
  UserCheck, 
  Search, 
  Building2, 
  Loader2,
  ChevronRight,
  Filter,
  Check
} from 'lucide-react';
import { evaluateChallengeSubmissionAI } from '../../services/aiService';
import { useAuth } from '../../context/AuthContext';

// Default Mock Challenges Data
const INITIAL_CHALLENGES = [
  {
    id: 'ch-1',
    title: 'High-Throughput Express API Rate Limiter',
    company: 'TechCorp Innovations',
    category: 'Backend & Systems',
    difficulty: 'Intermediate',
    stipend: '₹15,000 Prize + Fast-Track Interview',
    deadline: 'In 5 Days',
    badgeLevel: 'Recruiter Gold Badge 🏆',
    description: 'Design and deploy an Express.js middleware using Redis to enforce strict sliding-window rate limiting per IP address. Must include unit tests and multi-container Docker compose setup.',
    skillsRequired: ['Node.js', 'Express', 'Redis', 'Docker'],
    submissionsCount: 14
  },
  {
    id: 'ch-2',
    title: 'Generative AI RAG Pipeline with Gemini API',
    company: 'DataScale Labs',
    category: 'AI & Machine Learning',
    difficulty: 'Advanced',
    stipend: 'Direct SDE-1 Offer Fast-Track',
    deadline: 'In 8 Days',
    badgeLevel: 'AI Specialist Badge 🤖',
    description: 'Build a document Q&A web portal using vector embeddings and Gemini 2.0 Flash API. Extract PDF context, store in Pinecone/Faiss, and return cited answers.',
    skillsRequired: ['Python', 'Gemini API', 'Vector DB', 'React'],
    skillsRequiredBadges: ['Python', 'Generative AI', 'Vector DB'],
    submissionsCount: 22
  },
  {
    id: 'ch-3',
    title: 'Real-Time Financial Dashboard with Micro-Animations',
    company: 'FinPulse Systems',
    category: 'Frontend & UI Engineering',
    difficulty: 'Entry-Level',
    stipend: '₹10,000 Stipend Internship',
    deadline: 'In 3 Days',
    badgeLevel: 'UI/UX Master Badge ✨',
    description: 'Construct a dynamic stock/crypto tracking dashboard in React 19 featuring live Chart.js graphs, dark mode toggle, and smooth framer-motion micro-interactions.',
    skillsRequired: ['React.js', 'Tailwind CSS', 'Chart.js', 'WebSockets'],
    submissionsCount: 31
  }
];

export default function IndustryChallenges() {
  const { userRole, userProfile } = useAuth();
  const isRecruiter = userRole === 'recruiter' || userRole === 'industry';

  // State
  const [challenges, setChallenges] = useState(INITIAL_CHALLENGES);
  const [activeTab, setActiveTab] = useState('browse'); // 'browse' | 'create'
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  
  // Student Submission State
  const [githubUrl, setGithubUrl] = useState('');
  const [liveDemoUrl, setLiveDemoUrl] = useState('');
  const [submissionDesc, setSubmissionDesc] = useState('');
  const [evaluating, setEvaluating] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);
  const [userSubmissions, setUserSubmissions] = useState({});

  // Recruiter Create State
  const [newTitle, setNewTitle] = useState('');
  const [newCompany, setNewCompany] = useState(userProfile?.companyName || 'My Industry Org');
  const [newCategory, setNewCategory] = useState('Backend & Systems');
  const [newDifficulty, setNewDifficulty] = useState('Intermediate');
  const [newStipend, setNewStipend] = useState('₹15,000 Prize + Interview');
  const [newDeadline, setNewDeadline] = useState('In 7 Days');
  const [newDescription, setNewDescription] = useState('');
  const [newSkills, setNewSkills] = useState('React, Node.js, Docker');

  // Handle Student Submission
  const handleSubmitSolution = async (e) => {
    e.preventDefault();
    if (!selectedChallenge) return;
    if (!githubUrl.trim()) {
      alert("Please provide a valid GitHub repository URL.");
      return;
    }

    setEvaluating(true);
    try {
      const evaluation = await evaluateChallengeSubmissionAI(
        selectedChallenge.title,
        githubUrl,
        liveDemoUrl,
        submissionDesc
      );

      setSubmissionResult(evaluation);
      setUserSubmissions(prev => ({
        ...prev,
        [selectedChallenge.id]: {
          githubUrl,
          liveDemoUrl,
          evaluation,
          submittedAt: new Date().toLocaleDateString()
        }
      }));
    } catch (err) {
      console.error("Submission evaluation failed:", err);
    } finally {
      setEvaluating(false);
    }
  };

  // Handle Recruiter Challenge Post
  const handleCreateChallenge = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDescription.trim()) {
      alert("Please fill in the challenge title and description.");
      return;
    }

    const created = {
      id: `ch-${Date.now()}`,
      title: newTitle,
      company: newCompany,
      category: newCategory,
      difficulty: newDifficulty,
      stipend: newStipend,
      deadline: newDeadline,
      badgeLevel: 'Recruiter Gold Badge 🏆',
      description: newDescription,
      skillsRequired: newSkills.split(',').map(s => s.trim()).filter(Boolean),
      submissionsCount: 0
    };

    setChallenges(prev => [created, ...prev]);
    setActiveTab('browse');
    setNewTitle('');
    setNewDescription('');
    alert("Micro-Challenge published successfully! Students can now view and submit solutions.");
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-900 text-white p-6 sm:p-8 shadow-xl">
        <div className="absolute right-0 top-0 -mt-8 -mr-8 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold backdrop-blur-md border border-emerald-400/30">
              <Trophy className="w-3.5 h-3.5" />
              <span>NextHire Industry Marketplace</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Industry Micro-Challenges & Hackathon Portal
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl">
              Solve real-world company problem statements, submit live code prototypes, get AI + recruiter code reviews, and earn **Recruiter Verified Badges** to fast-track direct interviews.
            </p>
          </div>

          {isRecruiter && (
            <button
              onClick={() => setActiveTab(activeTab === 'create' ? 'browse' : 'create')}
              className="bg-white text-emerald-950 hover:bg-emerald-50 font-bold px-5 py-3 rounded-2xl shadow-lg transition-all flex items-center gap-2 text-sm shrink-0"
            >
              <PlusSquare className="w-4 h-4 text-emerald-600" />
              <span>{activeTab === 'create' ? 'View Challenges Feed' : 'Post New Micro-Challenge'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      {activeTab === 'create' && isRecruiter ? (
        /* Recruiter Challenge Creation Form */
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6 max-w-3xl mx-auto">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <PlusSquare className="w-5 h-5 text-emerald-600" />
              <span>Create Industry Micro-Challenge</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Post a technical problem statement to crowdsource solutions and evaluate top engineering candidates.
            </p>
          </div>

          <form onSubmit={handleCreateChallenge} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Challenge Title</label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Optimized GraphQL Caching Layer with Redis"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-sm text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Company / Team Name</label>
                <input
                  type="text"
                  value={newCompany}
                  onChange={(e) => setNewCompany(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-sm text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-sm text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none font-semibold"
                >
                  <option value="Backend & Systems">Backend & Systems</option>
                  <option value="AI & Machine Learning">AI & Machine Learning</option>
                  <option value="Frontend & UI Engineering">Frontend & UI Engineering</option>
                  <option value="DevOps & Cloud">DevOps & Cloud</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Reward / Fast-Track Incentive</label>
                <input
                  type="text"
                  value={newStipend}
                  onChange={(e) => setNewStipend(e.target.value)}
                  placeholder="e.g. ₹20,000 Cash + Direct Interview"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-sm text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Required Skills (Comma separated)</label>
                <input
                  type="text"
                  value={newSkills}
                  onChange={(e) => setNewSkills(e.target.value)}
                  placeholder="React, Node.js, Redis"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-sm text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Problem Statement & Requirements</label>
              <textarea
                required
                rows={5}
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="Describe the problem, key evaluation criteria, constraints, and submission expectations..."
                className="w-full bg-slate-50 border border-slate-300 rounded-2xl p-4 text-sm text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setActiveTab('browse')}
                className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-100 text-sm font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/20"
              >
                Publish Micro-Challenge
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* Challenges Feed & Submission Detail Modal */
        <div className="space-y-6">
          
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <Code2 className="w-5 h-5 text-emerald-600" />
              <span>Available Micro-Challenges ({challenges.length})</span>
            </h2>

            <div className="text-xs text-slate-500 font-semibold">
              Filter: <span className="text-slate-800 font-bold">All Domains</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {challenges.map((ch) => {
              const mySub = userSubmissions[ch.id];
              return (
                <div 
                  key={ch.id}
                  className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:border-emerald-400 hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100">
                        {ch.category}
                      </span>
                      <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                        {ch.badgeLevel}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-2">
                      {ch.title}
                    </h3>

                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      <span>{ch.company}</span>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                      {ch.description}
                    </p>

                    {/* Skill Tags */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {ch.skillsRequired.map((sk, sIdx) => (
                        <span key={sIdx} className="text-[10px] bg-slate-100 text-slate-700 font-semibold px-2 py-0.5 rounded-md">
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-emerald-800 bg-emerald-100/80 px-2.5 py-1 rounded-lg">
                        {ch.stipend}
                      </span>
                      <span className="text-slate-400 font-medium flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {ch.deadline}
                      </span>
                    </div>

                    {mySub ? (
                      <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs">
                        <span className="font-bold text-emerald-800 flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          Submitted & Evaluated
                        </span>
                        <span className="font-mono font-black text-emerald-700">
                          {mySub.evaluation?.codeScore} pts
                        </span>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setSelectedChallenge(ch);
                          setSubmissionResult(null);
                          setGithubUrl('');
                          setLiveDemoUrl('');
                          setSubmissionDesc('');
                        }}
                        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white font-bold text-xs transition-all shadow-md"
                      >
                        <span>View Details & Submit Solution</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Submission Modal */}
          {selectedChallenge && (
            <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
              <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
                <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md">
                      {selectedChallenge.category}
                    </span>
                    <h3 className="text-xl font-extrabold text-slate-900">
                      {selectedChallenge.title}
                    </h3>
                    <p className="text-xs text-slate-500 font-semibold">
                      Posted by {selectedChallenge.company} • {selectedChallenge.stipend}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedChallenge(null)}
                    className="text-slate-400 hover:text-slate-600 text-lg font-bold p-1"
                  >
                    ✕
                  </button>
                </div>

                {/* Challenge Description */}
                <div className="space-y-2 bg-slate-50 rounded-2xl p-4 border border-slate-200">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">Problem Details</h4>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    {selectedChallenge.description}
                  </p>
                </div>

                {/* Submission Form */}
                {!submissionResult ? (
                  <form onSubmit={handleSubmitSolution} className="space-y-4 pt-2">
                    <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <GitBranch className="w-4 h-4 text-slate-800" />
                      <span>Submit Solution Prototype</span>
                    </h4>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">GitHub Repository Link *</label>
                      <input
                        type="url"
                        required
                        value={githubUrl}
                        onChange={(e) => setGithubUrl(e.target.value)}
                        placeholder="https://github.com/username/project-repo"
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Live Demo / Deployed URL (Optional)</label>
                      <input
                        type="url"
                        value={liveDemoUrl}
                        onChange={(e) => setLiveDemoUrl(e.target.value)}
                        placeholder="https://my-app.vercel.app or https://my-app.onrender.com"
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Technical Architecture Notes</label>
                      <textarea
                        rows={3}
                        value={submissionDesc}
                        onChange={(e) => setSubmissionDesc(e.target.value)}
                        placeholder="Explain your approach, key libraries used, and how to test your solution..."
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={evaluating}
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm transition-all shadow-md shadow-emerald-600/20 disabled:opacity-50"
                    >
                      {evaluating ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>AI Architecture Evaluation in Progress...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Submit for AI Code Review & Recruiter Badge</span>
                        </>
                      )}
                    </button>
                  </form>
                ) : (
                  /* Evaluation Result View */
                  <div className="bg-gradient-to-br from-slate-900 to-emerald-950 text-white rounded-3xl p-6 space-y-6 shadow-xl border border-emerald-500/30">
                    <div className="flex items-center justify-between border-b border-white/10 pb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 font-black text-xl">
                          {submissionResult.codeScore}
                        </div>
                        <div>
                          <div className="text-xs font-bold uppercase tracking-wider text-emerald-400">Submission Evaluation</div>
                          <div className="text-base font-bold">{submissionResult.overallBadge}</div>
                        </div>
                      </div>

                      {submissionResult.recruiterFastTrack && (
                        <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          Recruiter Fast-Track Qualified!
                        </span>
                      )}
                    </div>

                    <div className="space-y-2">
                      <h5 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">AI Architect Summary</h5>
                      <p className="text-xs text-slate-200 bg-white/5 rounded-2xl p-4 border border-white/10 leading-relaxed">
                        {submissionResult.aiSummary}
                      </p>
                    </div>

                    <button
                      onClick={() => setSelectedChallenge(null)}
                      className="w-full py-2.5 rounded-xl bg-white text-slate-900 font-bold text-xs hover:bg-slate-100 transition-all"
                    >
                      Done
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
}
