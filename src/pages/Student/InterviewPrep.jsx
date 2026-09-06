import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Mic, 
  MicOff, 
  Play, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle, 
  Award, 
  RotateCcw, 
  ChevronRight, 
  BrainCircuit, 
  Send,
  Loader2,
  FileCode,
  ShieldCheck,
  TrendingUp,
  Volume2
} from 'lucide-react';
import { generateInterviewQuestionsAI, evaluateInterviewResponseAI } from '../../services/aiService';
import { useAuth } from '../../context/AuthContext';

export default function InterviewPrep() {
  const { userProfile } = useAuth();
  
  // Settings
  const [selectedRole, setSelectedRole] = useState('Full-Stack Developer');
  const [difficulty, setDifficulty] = useState('Campus Placement / Mid-Level');
  
  // State
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [questionsData, setQuestionsData] = useState(null);
  const [activeQuestionIdx, setActiveQuestionIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [evaluations, setEvaluations] = useState({});
  const [evaluatingIdx, setEvaluatingIdx] = useState(null);
  
  // Voice Input
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState(null);

  // Initialize Web Speech Recognition if available
  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = 'en-US';

      rec.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        if (transcript) {
          const activeQId = questionsData?.questions[activeQuestionIdx]?.id;
          if (activeQId) {
            setUserAnswers(prev => ({
              ...prev,
              [activeQId]: (prev[activeQId] || '') + ' ' + transcript
            }));
          }
        }
      };

      rec.onerror = (err) => {
        console.warn('Speech recognition error:', err);
        setIsRecording(false);
      };

      rec.onend = () => {
        setIsRecording(false);
      };

      setRecognition(rec);
    }
  }, [questionsData, activeQuestionIdx]);

  // Load Questions on Mount or Role change
  const fetchQuestions = async () => {
    setLoadingQuestions(true);
    setUserAnswers({});
    setEvaluations({});
    setActiveQuestionIdx(0);
    try {
      const data = await generateInterviewQuestionsAI(selectedRole, difficulty);
      setQuestionsData(data);
    } catch (err) {
      console.error("Failed to load interview questions:", err);
    } finally {
      setLoadingQuestions(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [selectedRole, difficulty]);

  // Handle Speech Toggle
  const toggleRecording = () => {
    if (!recognition) {
      alert("Speech Recognition is not supported in this browser. You can type your response in the text area.");
      return;
    }
    if (isRecording) {
      recognition.stop();
      setIsRecording(false);
    } else {
      recognition.start();
      setIsRecording(true);
    }
  };

  // Evaluate Answer for current active question
  const handleEvaluateAnswer = async () => {
    const currentQ = questionsData?.questions[activeQuestionIdx];
    if (!currentQ) return;
    
    const answer = userAnswers[currentQ.id] || '';
    if (answer.trim().length < 5) {
      alert("Please enter or record a response before submitting for AI evaluation.");
      return;
    }

    setEvaluatingIdx(activeQuestionIdx);
    try {
      const result = await evaluateInterviewResponseAI(currentQ.question, answer, selectedRole);
      setEvaluations(prev => ({
        ...prev,
        [currentQ.id]: result
      }));
    } catch (err) {
      console.error("Evaluation failed:", err);
    } finally {
      setEvaluatingIdx(null);
    }
  };

  const currentQuestion = questionsData?.questions[activeQuestionIdx];
  const currentAnswer = currentQuestion ? (userAnswers[currentQuestion.id] || '') : '';
  const currentEvaluation = currentQuestion ? evaluations[currentQuestion.id] : null;

  // Calculate Overall Interview Score across all evaluated questions
  const evaluatedKeys = Object.keys(evaluations);
  const avgScore = evaluatedKeys.length > 0
    ? Math.round(evaluatedKeys.reduce((acc, key) => acc + (evaluations[key]?.overallScore || 0), 0) / evaluatedKeys.length)
    : null;

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-6 sm:p-8 shadow-xl">
        <div className="absolute right-0 top-0 -mt-8 -mr-8 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold backdrop-blur-md border border-blue-400/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>NextHire AI Practice Coach</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              AI Mock Technical & Behavioral Interview
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl">
              Practice real-world coding, system design, and STAR behavioral interview questions. Get instant AI evaluation, STAR scoring, technical depth breakdown, and model answers.
            </p>
          </div>

          {/* Quick Score Badge if evaluated */}
          {avgScore !== null && (
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 text-center shrink-0 min-w-[140px]">
              <div className="text-xs uppercase font-bold tracking-wider text-blue-200">Session Score</div>
              <div className="text-3xl font-black text-emerald-400">{avgScore} <span className="text-sm text-slate-300 font-normal">/ 100</span></div>
              <div className="text-[11px] text-slate-300 font-medium mt-0.5">
                {avgScore >= 85 ? '🏆 Interview Ready' : '📈 Good Progress'}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Role & Difficulty Selectors Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Target Role</label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="bg-slate-50 border border-slate-300 text-slate-800 text-sm font-semibold rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="Full-Stack Developer">Full-Stack Developer</option>
              <option value="AI / Machine Learning Engineer">AI / Machine Learning Engineer</option>
              <option value="DevOps & Cloud Engineer">DevOps & Cloud Engineer</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Difficulty Level</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="bg-slate-50 border border-slate-300 text-slate-800 text-sm font-semibold rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="Campus Placement / Entry-Level">Campus Placement / Entry-Level</option>
              <option value="Mid-Level (1-3 YOE)">Mid-Level (1-3 YOE)</option>
              <option value="Senior SDE / Architect">Senior SDE / Architect</option>
            </select>
          </div>
        </div>

        <button
          onClick={fetchQuestions}
          disabled={loadingQuestions}
          className="w-full md:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-all shadow-md shadow-blue-600/20 disabled:opacity-50"
        >
          {loadingQuestions ? <Loader2 className="w-4 h-4 animate-spin" /> : <RotateCcw className="w-4 h-4" />}
          <span>Generate New Question Set</span>
        </button>
      </div>

      {/* Main Practice Workspace */}
      {loadingQuestions ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-4">
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin mx-auto" />
          <h3 className="text-lg font-bold text-slate-800">Generating Tailored Interview Questions...</h3>
          <p className="text-sm text-slate-500">Gemini AI is crafting realistic questions for {selectedRole}...</p>
        </div>
      ) : questionsData && currentQuestion ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Questions List Navigation */}
          <div className="lg:col-span-4 space-y-3">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 px-1">
              Interview Questions ({questionsData.questions.length})
            </h3>

            <div className="space-y-2.5">
              {questionsData.questions.map((q, idx) => {
                const isCurrent = idx === activeQuestionIdx;
                const isEvaluated = !!evaluations[q.id];
                const score = evaluations[q.id]?.overallScore;

                return (
                  <button
                    key={q.id}
                    onClick={() => setActiveQuestionIdx(idx)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all flex items-start justify-between gap-3 ${
                      isCurrent
                        ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/20'
                        : 'bg-white text-slate-800 border-slate-200 hover:border-blue-300 hover:bg-blue-50/50'
                    }`}
                  >
                    <div className="space-y-1">
                      <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                        isCurrent ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                      }`}>
                        Q{idx + 1} • {q.category}
                      </span>
                      <p className={`text-xs font-medium line-clamp-2 ${isCurrent ? 'text-blue-50' : 'text-slate-700'}`}>
                        {q.question}
                      </p>
                    </div>

                    {isEvaluated && (
                      <span className={`shrink-0 text-xs font-bold px-2 py-1 rounded-lg ${
                        isCurrent ? 'bg-white text-blue-900' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {score} pts
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Pro Tip Box */}
            <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-100 text-xs text-indigo-900 space-y-2">
              <div className="font-bold flex items-center gap-1.5">
                <BrainCircuit className="w-4 h-4 text-indigo-600" />
                <span>Interview Mastery Tip</span>
              </div>
              <p className="text-[11px] leading-relaxed text-indigo-700">
                Structure behavioral questions with the **STAR Method** (Situation, Task, Action, Result). For technical questions, mention time/space complexity ($O(N)$) and trade-offs.
              </p>
            </div>
          </div>

          {/* Right Column: Active Question & Answer Box */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Active Question Card */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-lg">
                  Question {activeQuestionIdx + 1} of {questionsData.questions.length} — {currentQuestion.category}
                </span>
                <span className="text-xs font-medium text-slate-400">
                  Target: {selectedRole}
                </span>
              </div>

              <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
                {currentQuestion.question}
              </h2>

              {/* Key Concepts / Hints */}
              {currentQuestion.keyConcepts && (
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="text-xs text-slate-500 font-semibold">Key Concepts:</span>
                  {currentQuestion.keyConcepts.map((concept, cIdx) => (
                    <span key={cIdx} className="text-xs bg-slate-100 text-slate-700 font-medium px-2.5 py-0.5 rounded-full border border-slate-200">
                      {concept}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Answer Input Card */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-bold text-slate-800">
                  Your Response (Type or Record Voice)
                </label>

                {/* Speech Recording Button */}
                <button
                  type="button"
                  onClick={toggleRecording}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    isRecording 
                      ? 'bg-rose-500 text-white animate-pulse shadow-md shadow-rose-500/30' 
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {isRecording ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5 text-blue-600" />}
                  <span>{isRecording ? 'Recording... (Click to Stop)' : 'Voice Input'}</span>
                </button>
              </div>

              <textarea
                value={currentAnswer}
                onChange={(e) => {
                  const val = e.target.value;
                  setUserAnswers(prev => ({ ...prev, [currentQuestion.id]: val }));
                }}
                rows={6}
                placeholder="Type your response here... (e.g. 'In my previous project, I architected a RESTful API using Node.js and Redis. We faced high latency under concurrent requests, so...')"
                className="w-full bg-slate-50 border border-slate-300 rounded-2xl p-4 text-sm text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all placeholder:text-slate-400"
              />

              <div className="flex items-center justify-between pt-2">
                <div className="text-xs text-slate-500">
                  Word Count: <span className="font-bold text-slate-800">{currentAnswer.trim() ? currentAnswer.trim().split(/\s+/).length : 0}</span> words
                </div>

                <button
                  onClick={handleEvaluateAnswer}
                  disabled={evaluatingIdx === activeQuestionIdx || currentAnswer.trim().length < 5}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm transition-all shadow-md shadow-emerald-600/20 disabled:opacity-50"
                >
                  {evaluatingIdx === activeQuestionIdx ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Evaluating Answer...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Submit for AI Evaluation</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* AI Evaluation Results Panel */}
            {currentEvaluation && (
              <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl border border-indigo-500/30">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 font-black text-xl">
                      {currentEvaluation.overallScore}
                    </div>
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider text-emerald-400">AI Evaluation Score</div>
                      <div className="text-lg font-bold">{currentEvaluation.ratingBadge}</div>
                    </div>
                  </div>

                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                    {currentEvaluation.starGrade}
                  </span>
                </div>

                {/* Feedback Summary */}
                <div className="space-y-2">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">Recruiter Feedback Summary</h4>
                  <p className="text-sm text-slate-200 leading-relaxed bg-white/5 rounded-2xl p-4 border border-white/10">
                    {currentEvaluation.feedbackSummary}
                  </p>
                </div>

                {/* Grid: Strengths & Missed Concepts */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-2xl p-4 space-y-2">
                    <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Key Strengths</span>
                    </div>
                    <ul className="space-y-1 text-xs text-slate-300">
                      {currentEvaluation.strengths.map((str, sIdx) => (
                        <li key={sIdx} className="flex items-start gap-1.5">
                          <span className="text-emerald-400 font-bold">•</span>
                          <span>{str}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-amber-950/40 border border-amber-500/30 rounded-2xl p-4 space-y-2">
                    <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
                      <AlertCircle className="w-4 h-4" />
                      <span>Points to Enhance</span>
                    </div>
                    <ul className="space-y-1 text-xs text-slate-300">
                      {currentEvaluation.missedConcepts.map((m, mIdx) => (
                        <li key={mIdx} className="flex items-start gap-1.5">
                          <span className="text-amber-400 font-bold">•</span>
                          <span>{m}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Ideal Model Answer */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-blue-400 font-bold text-xs">
                    <BrainCircuit className="w-4 h-4" />
                    <span>AI Model Answer Reference</span>
                  </div>
                  <div className="bg-blue-950/40 border border-blue-500/30 rounded-2xl p-4 text-xs text-slate-200 leading-relaxed font-mono">
                    {currentEvaluation.modelAnswer}
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>
      ) : null}
    </div>
  );
}
