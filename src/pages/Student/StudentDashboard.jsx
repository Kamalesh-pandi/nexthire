import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  Award, 
  Briefcase, 
  CheckCircle2, 
  ArrowUpRight, 
  GraduationCap, 
  TrendingUp, 
  BookOpen,
  Plus
} from 'lucide-react';
import { useAuth, calculateInitialATSScore } from '../../context/AuthContext';
import { fetchApplicationsFromFirestore, fetchJobsFromFirestore, deduplicateJobs } from '../../services/firebase';
import SkillGapCard from '../../components/student/SkillGapCard';
import ApplicationTracker from '../../components/student/ApplicationTracker';
import CourseRecommendationCard from '../../components/student/CourseRecommendationCard';
import PersonalizedLearningPath from '../../components/student/PersonalizedLearningPath';
import ChatModal from '../../components/common/ChatModal';

export default function StudentDashboard() {
  const { currentUser } = useAuth();
  const [chatRecipient, setChatRecipient] = useState(null);
  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [appsList, jobsList] = await Promise.all([
          fetchApplicationsFromFirestore(currentUser ? { userId: currentUser.id } : {}),
          fetchJobsFromFirestore()
        ]);
        setApplications(appsList);
        setJobs(deduplicateJobs(jobsList));
      } catch (err) {
        console.error("Failed loading student database data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [currentUser]);

  // Target roles for alignment check — strictly use actual industry posted jobs
  const allAvailableJobs = deduplicateJobs(jobs);

  const [selectedJobId, setSelectedJobId] = useState('');

  useEffect(() => {
    if (allAvailableJobs.length > 0 && (!selectedJobId || !allAvailableJobs.some(j => j.id === selectedJobId))) {
      setSelectedJobId(allAvailableJobs[0].id);
    }
  }, [allAvailableJobs, selectedJobId]);

  const activeJob = allAvailableJobs.find(j => j.id === selectedJobId) || allAvailableJobs[0] || {
    id: 'default_job',
    title: 'Flutter Developer',
    companyName: 'SkillSync AI Technology',
    skillsRequired: ['Flutter', 'Dart', 'REST APIs', 'Cloud Services', 'Git']
  };

  // Live Skill Matching against Candidate's Uploaded Resume Skills
  const userSkills = currentUser?.skills || [];
  const userSkillSet = new Set(userSkills.map(s => s.toLowerCase().trim()));
  const requiredSkills = activeJob?.skillsRequired || activeJob?.skills || ["React.js", "Python", "Node.js", "SQL", "Docker"];

  const matchedSkills = [];
  const missingSkills = [];

  requiredSkills.forEach(skill => {
    const cleanSkill = skill.trim();
    const isMatched = Array.from(userSkillSet).some(us => 
      us === cleanSkill.toLowerCase() || 
      us.includes(cleanSkill.toLowerCase()) || 
      cleanSkill.toLowerCase().includes(us)
    );
    if (isMatched) {
      matchedSkills.push(cleanSkill);
    } else {
      missingSkills.push(cleanSkill);
    }
  });

  const matchPercentage = requiredSkills.length > 0
    ? Math.min(100, Math.max(12, Math.round((matchedSkills.length / requiredSkills.length) * 100)))
    : 80;

  let dynamicRecommendation = "";
  if (missingSkills.length === 0) {
    dynamicRecommendation = `Outstanding competency alignment (100%)! Your verified resume skills fulfill all core requirements for ${activeJob.title}. You are top-ranked for interview consideration!`;
  } else if (matchPercentage >= 75) {
    dynamicRecommendation = `Strong alignment (${matchPercentage}%)! Acquiring ${missingSkills.slice(0, 2).join(' & ')} will boost your candidate match to 100% and guarantee top recruiter shortlisting.`;
  } else {
    dynamicRecommendation = `Current alignment is ${matchPercentage}%. Adding projects or certifications in ${missingSkills.slice(0, 3).join(', ')} will significantly strengthen your profile for ${activeJob.title}.`;
  }

  const dynamicGapData = {
    jobTitle: activeJob.title,
    companyName: activeJob.companyName || "Verified Hiring Partner",
    matchPercentage,
    matchedSkills,
    missingSkills,
    recommendation: dynamicRecommendation
  };

  const COURSE_CATALOG = [
    {
      skillKeywords: ["flutter", "dart", "mobile", "mobile app", "cross-platform", "ios", "android"],
      id: "course_flutter",
      title: "Flutter 3 & Dart Complete Development Bootcamp",
      provider: "Coursera & Google Developers",
      rating: 4.9,
      duration: "4 Weeks",
      skillsCovered: ["Flutter", "Dart", "Cross-Platform Mobile"],
      link: "https://coursera.org"
    },
    {
      skillKeywords: ["flutter", "bloc", "provider", "riverpod", "state management", "dart"],
      id: "course_flutter_state",
      title: "Production Flutter State Management (BLoC & Riverpod)",
      provider: "Udemy & Flutter Community",
      rating: 4.9,
      duration: "2 Weeks",
      skillsCovered: ["Flutter", "BLoC Pattern", "State Management"],
      link: "https://udemy.com"
    },
    {
      skillKeywords: ["react native", "expo", "mobile", "react"],
      id: "course_react_native",
      title: "React Native & Expo: Build Native iOS & Android Apps",
      provider: "Udemy",
      rating: 4.8,
      duration: "3 Weeks",
      skillsCovered: ["React Native", "Expo", "Mobile Architecture"],
      link: "https://udemy.com"
    },
    {
      skillKeywords: ["pytorch", "deep learning", "neural networks", "machine learning", "tensorflow", "ai"],
      id: "course_pytorch",
      title: "Deep Learning Specialization with PyTorch",
      provider: "Coursera & DeepLearning.AI",
      rating: 4.9,
      duration: "4 Weeks",
      skillsCovered: ["PyTorch", "Neural Networks", "Deep Learning"],
      link: "https://coursera.org"
    },
    {
      skillKeywords: ["llm", "rag", "langchain", "genai", "ai", "machine learning", "python", "gpt"],
      id: "course_llm_rag",
      title: "Building Production GenAI Applications with RAG & LangChain",
      provider: "DeepLearning.AI",
      rating: 4.9,
      duration: "3 Weeks",
      skillsCovered: ["LangChain", "LLMs", "RAG Pipelines", "Python"],
      link: "https://deeplearning.ai"
    },
    {
      skillKeywords: ["docker", "kubernetes", "containers", "microservices", "devops"],
      id: "course_docker",
      title: "Docker & Container Architecture for Microservices",
      provider: "Udemy & Linux Foundation",
      rating: 4.8,
      duration: "2 Weeks",
      skillsCovered: ["Docker", "Kubernetes", "Microservices"],
      link: "https://udemy.com"
    },
    {
      skillKeywords: ["aws", "aws cloud", "cloud", "devops", "cloud computing"],
      id: "course_aws",
      title: "AWS Cloud Practitioner & Solutions Architect",
      provider: "AWS Training & Certification",
      rating: 4.9,
      duration: "3 Weeks",
      skillsCovered: ["AWS Cloud", "EC2", "S3"],
      link: "https://aws.amazon.com/training/"
    },
    {
      skillKeywords: ["react", "react.js", "next.js", "typescript", "frontend", "web"],
      id: "course_react",
      title: "Full-Stack React 19 & Next.js Architecture",
      provider: "Coursera",
      rating: 4.9,
      duration: "4 Weeks",
      skillsCovered: ["React.js", "Next.js", "TypeScript"],
      link: "https://coursera.org"
    },
    {
      skillKeywords: ["node", "node.js", "express", "backend", "api", "rest apis", "rest api"],
      id: "course_node",
      title: "Production Node.js & REST API Design",
      provider: "Udemy",
      rating: 4.8,
      duration: "3 Weeks",
      skillsCovered: ["Node.js", "Express.js", "REST APIs"],
      link: "https://udemy.com"
    },
    {
      skillKeywords: ["sql", "postgresql", "mongodb", "database", "data"],
      id: "course_db",
      title: "High-Performance Database Indexing & SQL Mastery",
      provider: "edX",
      rating: 4.8,
      duration: "2 Weeks",
      skillsCovered: ["PostgreSQL", "Database Design", "SQL"],
      link: "https://edx.org"
    },
    {
      skillKeywords: ["java", "spring", "spring boot", "backend"],
      id: "course_java",
      title: "Enterprise Java & Spring Boot Microservices",
      provider: "Udemy & Oracle",
      rating: 4.8,
      duration: "4 Weeks",
      skillsCovered: ["Java", "Spring Boot", "Hibernate"],
      link: "https://udemy.com"
    },
    {
      skillKeywords: ["python", "django", "fastapi", "flask"],
      id: "course_python",
      title: "Python for SDEs: AsyncIO, FastAPI & Architecture",
      provider: "Coursera",
      rating: 4.9,
      duration: "3 Weeks",
      skillsCovered: ["Python", "FastAPI", "AsyncIO"],
      link: "https://coursera.org"
    },
    {
      skillKeywords: ["system design", "distributed systems", "algorithms", "dsa", "c++"],
      id: "course_sysdesign",
      title: "Scalable Distributed System Design for Tech Screenings",
      provider: "Educative & MIT OpenCourseWare",
      rating: 4.9,
      duration: "3 Weeks",
      skillsCovered: ["System Design", "Distributed Systems", "Scalability"],
      link: "https://educative.io"
    },
    {
      skillKeywords: ["figma", "ui/ux", "design", "wireframing", "mobile ui"],
      id: "course_uiux",
      title: "Modern Mobile & Web UI/UX Design System with Figma",
      provider: "edX & Figma Academy",
      rating: 4.8,
      duration: "2 Weeks",
      skillsCovered: ["Figma", "UI/UX Design", "Wireframing"],
      link: "https://edx.org"
    }
  ];

  // Dynamically select courses that target the active job role's required and missing skills!
  const recommendedCourses = (() => {
    const missingLower = (missingSkills || []).map(s => s.toLowerCase().trim());
    const requiredLower = (activeJob?.skillsRequired || activeJob?.skills || []).map(s => s.toLowerCase().trim());
    const titleLower = (activeJob?.title || '').toLowerCase().trim();
    const titleWords = titleLower.split(/\s+/);

    const matched = [];
    const addedIds = new Set();

    const addCourse = (course) => {
      if (!addedIds.has(course.id)) {
        addedIds.add(course.id);
        matched.push(course);
      }
    };

    // Priority 1: Match against missing skills for the active target job
    for (const c of COURSE_CATALOG) {
      if (c.skillKeywords.some(sk => missingLower.some(m => m.includes(sk) || sk.includes(m)))) {
        addCourse(c);
      }
      if (matched.length >= 4) break;
    }

    // Priority 2: Match against required skills of the active target job
    if (matched.length < 4) {
      for (const c of COURSE_CATALOG) {
        if (c.skillKeywords.some(sk => requiredLower.some(r => r.includes(sk) || sk.includes(r)))) {
          addCourse(c);
        }
        if (matched.length >= 4) break;
      }
    }

    // Priority 3: Match against job title keywords (e.g. "flutter", "mobile", "devops", "ai")
    if (matched.length < 4) {
      for (const c of COURSE_CATALOG) {
        if (c.skillKeywords.some(sk => titleWords.some(tw => tw.length > 2 && (sk.includes(tw) || tw.includes(sk))))) {
          addCourse(c);
        }
        if (matched.length >= 4) break;
      }
    }

    // Priority 4: Fallback to high rating default courses
    if (matched.length < 4) {
      for (const c of COURSE_CATALOG) {
        addCourse(c);
        if (matched.length >= 4) break;
      }
    }

    return matched.slice(0, 4);
  })();

  return (
    <div className="space-y-8 pb-12">
      
      {/* Banner */}
      <div className="rounded-3xl p-6 sm:p-8 border border-blue-200 relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white shadow-lg shadow-blue-500/15">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-white/20 text-white border border-white/30 backdrop-blur-xs">
              🎓 Student Workspace
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Welcome back, {currentUser?.name || 'Student Candidate'}!
            </h1>
            <p className="text-xs text-blue-100 max-w-xl font-medium">
              {currentUser?.collegeName || currentUser?.institution || 'IIT Delhi'} • {currentUser?.departmentName || currentUser?.degree || currentUser?.department || 'B.Tech CSE'}
            </p>
          </div>

          <Link
            to="/student/resume-analyzer"
            className="self-start md:self-center px-5 py-3 rounded-2xl bg-white hover:bg-blue-50 text-blue-700 font-bold text-xs shadow-md flex items-center gap-2 transform hover:-translate-y-0.5 transition-all"
          >
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>Launch AI Resume Analyzer</span>
          </Link>
        </div>
      </div>

      {/* NEW UNIQUE AI FEATURES SPOTLIGHT ROW */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Link
          to="/student/interview-prep"
          className="bg-gradient-to-br from-blue-900 to-indigo-900 text-white rounded-3xl p-6 shadow-md hover:shadow-xl hover:scale-[1.02] transition-all border border-blue-700/50 space-y-3 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg bg-blue-500/30 text-blue-200 border border-blue-400/30">
              NEW AI COACH
            </span>
            <ArrowUpRight className="w-5 h-5 text-blue-300 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </div>
          <h3 className="text-lg font-bold text-white group-hover:text-blue-200">
            AI Mock Interview Coach
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Practice real technical & behavioral interview questions with voice recording, STAR scoring, and model answers.
          </p>
        </Link>

        <Link
          to="/student/skill-roadmap"
          className="bg-gradient-to-br from-indigo-900 to-purple-950 text-white rounded-3xl p-6 shadow-md hover:shadow-xl hover:scale-[1.02] transition-all border border-purple-700/50 space-y-3 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg bg-purple-500/30 text-purple-200 border border-purple-400/30">
              NEW RADAR
            </span>
            <ArrowUpRight className="w-5 h-5 text-purple-300 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </div>
          <h3 className="text-lg font-bold text-white group-hover:text-purple-200">
            Skill Gap Radar & Roadmap
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Compare your profile against target jobs using Chart.js radar charts and get a personalized 4-week AI action plan.
          </p>
        </Link>

        <Link
          to="/student/challenges"
          className="bg-gradient-to-br from-emerald-950 to-teal-900 text-white rounded-3xl p-6 shadow-md hover:shadow-xl hover:scale-[1.02] transition-all border border-emerald-700/50 space-y-3 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg bg-emerald-500/30 text-emerald-200 border border-emerald-400/30">
              HACKATHON PORTAL
            </span>
            <ArrowUpRight className="w-5 h-5 text-emerald-300 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </div>
          <h3 className="text-lg font-bold text-white group-hover:text-emerald-200">
            Industry Micro-Challenges
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Solve real recruiter problem statements, submit live prototypes, earn Gold Badges, and fast-track interviews.
          </p>
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:shadow-md transition-all flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">ATS Resume Score</p>
            {(() => {
              const currentScore = currentUser?.resumeScore ?? calculateInitialATSScore(currentUser?.skills, currentUser?.departmentName, currentUser?.collegeName);
              const scoreStatus = currentUser?.resumeFileName 
                ? 'AI Verified Resume'
                : (currentScore >= 80 ? 'Strong Skill Baseline' : currentScore >= 65 ? 'Moderate Stack' : 'Initial Evaluation');
              return (
                <>
                  <h3 className="text-2xl font-black text-slate-900 mt-1">{currentScore}/100</h3>
                  <span className="text-[10px] text-blue-600 font-bold flex items-center gap-1 mt-1">
                    <TrendingUp className="w-3 h-3" /> {scoreStatus}
                  </span>
                </>
              );
            })()}
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center font-bold">
            <Award className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:shadow-md transition-all flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Active Applications</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{applications.length}</h3>
            <span className="text-[10px] text-indigo-600 font-bold mt-1 block">Live Database Records</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center font-bold">
            <Briefcase className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:shadow-md transition-all flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Acquired Skill Badges</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{currentUser?.skills?.length || 0}</h3>
            <span className="text-[10px] text-emerald-600 font-bold mt-1 block">Verified From Profile</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:shadow-md transition-all flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Target Job Match</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">
              {matchPercentage}%
            </h3>
            <span className={`text-[10px] font-bold mt-1 block truncate max-w-[140px] ${
              matchPercentage >= 80 ? 'text-emerald-600' : 'text-amber-600'
            }`}>
              {activeJob.title}
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center font-bold">
            <Sparkles className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2-Cols: Skill Gap Analysis & Recommended Jobs */}
        <div className="lg:col-span-2 space-y-8">
          
          <SkillGapCard 
            gapData={dynamicGapData}
            availableJobs={allAvailableJobs}
            selectedJobId={selectedJobId}
            onSelectJob={setSelectedJobId}
          />

          {/* Personalized Learning Path based on Target Job Alignment */}
          <PersonalizedLearningPath 
            targetJob={activeJob}
            missingSkills={missingSkills}
            matchedSkills={matchedSkills}
            matchPercentage={matchPercentage}
            recommendedCourses={recommendedCourses}
          />

          {/* Active Application Status Tracker */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-blue-600" />
                Track Application Status
              </h3>
              <Link to="/student/jobs" className="text-xs text-blue-600 hover:underline font-bold">
                View All Opportunities →
              </Link>
            </div>

            {loading ? (
              <div className="p-6 text-center text-xs text-slate-500 bg-white rounded-2xl border border-slate-200 shadow-xs">
                Fetching applications from database...
              </div>
            ) : (
              <ApplicationTracker 
                applications={applications} 
                onOpenChat={(name, role) => setChatRecipient({ name, role })}
              />
            )}
          </div>

        </div>

        {/* Right 1-Col: Skills Profile & Quick AI Recommendations */}
        <div className="space-y-6">
          
          {/* Assigned Academic Mentor Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-blue-600" /> Assigned Academic Mentor
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                Verified Faculty
              </span>
            </div>

            <div className="space-y-1">
              <h4 className="text-base font-extrabold text-slate-900">
                {currentUser?.mentorName || 'Prof. Rajesh Kumar'}
              </h4>
              <p className="text-xs text-slate-500 font-mono">
                {currentUser?.mentorEmail || 'rajesh.prof@iitd.ac.in'}
              </p>
              <p className="text-[11px] text-slate-600 font-medium">
                {currentUser?.departmentName || 'Dept of Computer Science'} • {currentUser?.collegeName || currentUser?.institution || 'IIT Delhi'}
              </p>
            </div>

            <button
              onClick={() => setChatRecipient({
                name: currentUser?.mentorName || 'Prof. Rajesh Kumar',
                role: 'Academic Mentor'
              })}
              className="w-full mt-2 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs border border-blue-200 flex items-center justify-center gap-2 transition-colors"
            >
              <span>Contact Mentor</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-blue-600" />
            </button>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h4 className="text-sm font-bold text-slate-900">Verified Technical Skills</h4>
              <Link to="/student/profile" className="text-xs text-blue-600 hover:underline font-bold">Edit</Link>
            </div>

            <div className="flex flex-wrap gap-2">
              {(currentUser?.skills || []).map((skill, i) => (
                <span key={i} className="text-xs px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 border border-blue-200/80 font-semibold">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* AI Career Mentor Spotlight Card */}
          <div className="rounded-3xl p-6 border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50/70 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-blue-800 font-bold text-sm">
              <Sparkles className="w-5 h-5 text-blue-600" />
              <span>AI Career Insight</span>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed font-medium">
              Based on your React.js and Python skillset, recruiters in <span className="text-slate-900 font-bold">Bengaluru</span> are offering a 28% higher stipend for candidates with <span className="text-blue-700 font-bold">PyTorch & Docker</span> experience.
            </p>

            <Link
              to="/student/resume-analyzer"
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 transition-colors"
            >
              <span>Re-analyze Resume</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

        </div>

      </div>

      {/* Direct Chat Modal */}
      {chatRecipient && (
        <ChatModal
          recipientName={chatRecipient.name}
          recipientRole={chatRecipient.role}
          onClose={() => setChatRecipient(null)}
        />
      )}

    </div>
  );
}
