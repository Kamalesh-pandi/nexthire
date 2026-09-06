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
import { fetchApplicationsFromFirestore, fetchJobsFromFirestore } from '../../services/firebase';
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
        setJobs(jobsList);
      } catch (err) {
        console.error("Failed loading student database data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [currentUser]);

  const DEFAULT_TARGET_ROLES = [
    {
      id: "role_fsd",
      title: "Full-Stack Web Engineer",
      companyName: "NexusTech AI Solutions",
      skillsRequired: ["React.js", "Node.js", "Python", "SQL", "Docker", "Git", "REST APIs", "TypeScript"]
    },
    {
      id: "role_aiml",
      title: "AI / ML Engineering Intern",
      companyName: "Cognitive Labs",
      skillsRequired: ["Python", "Machine Learning", "Deep Learning", "PyTorch", "TensorFlow", "FastAPI", "Docker"]
    },
    {
      id: "role_devops",
      title: "Cloud & DevOps Specialist",
      companyName: "CloudScale Systems",
      skillsRequired: ["Docker", "Kubernetes", "AWS Cloud", "Linux", "CI/CD Pipelines", "Python", "Git"]
    },
    {
      id: "role_sde",
      title: "Software Development Engineer (SDE)",
      companyName: "Global Tech Innovations",
      skillsRequired: ["Java", "Python", "C++", "SQL", "Git", "REST APIs", "Microservices"]
    }
  ];

  // Merge live Firestore jobs with default target roles
  const allAvailableJobs = jobs && jobs.length > 0 
    ? [...jobs, ...DEFAULT_TARGET_ROLES.filter(r => !jobs.some(j => j.title.toLowerCase() === r.title.toLowerCase()))]
    : DEFAULT_TARGET_ROLES;

  const [selectedJobId, setSelectedJobId] = useState(allAvailableJobs[0]?.id || 'role_fsd');
  const activeJob = allAvailableJobs.find(j => j.id === selectedJobId) || allAvailableJobs[0];

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
      skillKeywords: ["pytorch", "deep learning", "neural networks", "machine learning", "tensorflow"],
      id: "course_pytorch",
      title: "Deep Learning Specialization with PyTorch",
      provider: "Coursera & DeepLearning.AI",
      rating: 4.9,
      duration: "4 Weeks",
      skillsCovered: ["PyTorch", "Neural Networks", "Deep Learning"],
      link: "https://coursera.org"
    },
    {
      skillKeywords: ["docker", "kubernetes", "containers", "microservices"],
      id: "course_docker",
      title: "Docker & Container Architecture for Microservices",
      provider: "Udemy & Linux Foundation",
      rating: 4.8,
      duration: "2 Weeks",
      skillsCovered: ["Docker", "Kubernetes", "Microservices"],
      link: "https://udemy.com"
    },
    {
      skillKeywords: ["aws", "aws cloud", "cloud", "devops"],
      id: "course_aws",
      title: "AWS Cloud Practitioner & Solutions Architect",
      provider: "AWS Training & Certification",
      rating: 4.9,
      duration: "3 Weeks",
      skillsCovered: ["AWS Cloud", "EC2", "S3"],
      link: "https://aws.amazon.com/training/"
    },
    {
      skillKeywords: ["react", "react.js", "next.js", "typescript", "frontend"],
      id: "course_react",
      title: "Full-Stack React 19 & Next.js Architecture",
      provider: "Coursera",
      rating: 4.9,
      duration: "4 Weeks",
      skillsCovered: ["React.js", "Next.js", "TypeScript"],
      link: "https://coursera.org"
    },
    {
      skillKeywords: ["node", "node.js", "express", "backend", "api", "rest apis"],
      id: "course_node",
      title: "Production Node.js & REST API Design",
      provider: "Udemy",
      rating: 4.8,
      duration: "3 Weeks",
      skillsCovered: ["Node.js", "Express.js", "REST APIs"],
      link: "https://udemy.com"
    },
    {
      skillKeywords: ["sql", "postgresql", "mongodb", "database"],
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
    }
  ];

  // Dynamically select courses that target the student's actual missing skills!
  const recommendedCourses = (() => {
    const missingLower = missingSkills.map(s => s.toLowerCase());
    const matched = [];
    for (const c of COURSE_CATALOG) {
      if (c.skillKeywords.some(sk => missingLower.some(m => m.includes(sk) || sk.includes(m)))) {
        matched.push(c);
      }
      if (matched.length >= 4) break;
    }
    if (matched.length < 4) {
      for (const c of COURSE_CATALOG) {
        if (!matched.some(m => m.id === c.id)) {
          matched.push(c);
        }
        if (matched.length >= 4) break;
      }
    }
    return matched;
  })();

  return (
    <div className="space-y-8 pb-12">
      
      {/* Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-blue-500/30 relative overflow-hidden bg-gradient-to-r from-blue-950/40 via-slate-900/80 to-purple-950/40">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
              🎓 Student Workspace
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100">
              Welcome back, {currentUser?.name || 'Student Candidate'}!
            </h1>
            <p className="text-xs text-slate-300 max-w-xl">
              {currentUser?.collegeName || currentUser?.institution || 'IIT Delhi'} • {currentUser?.departmentName || currentUser?.degree || currentUser?.department || 'B.Tech CSE'}
            </p>
          </div>

          <Link
            to="/student/resume-analyzer"
            className="self-start md:self-center px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-xl shadow-blue-500/30 flex items-center gap-2 transform hover:-translate-y-0.5 transition-all"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Launch AI Resume Analyzer</span>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        <div className="glass-card rounded-2xl p-5 border border-slate-700/60 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium">ATS Resume Score</p>
            {(() => {
              const currentScore = currentUser?.resumeScore ?? calculateInitialATSScore(currentUser?.skills, currentUser?.departmentName, currentUser?.collegeName);
              const scoreStatus = currentUser?.resumeFileName 
                ? 'AI Verified Resume'
                : (currentScore >= 80 ? 'Strong Skill Baseline' : currentScore >= 65 ? 'Moderate Stack' : 'Initial Evaluation');
              return (
                <>
                  <h3 className="text-2xl font-black text-blue-400 mt-1">{currentScore}/100</h3>
                  <span className="text-[10px] text-emerald-400 flex items-center gap-1 mt-1">
                    <TrendingUp className="w-3 h-3" /> {scoreStatus}
                  </span>
                </>
              );
            })()}
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
            <Award className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-slate-700/60 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium">Active Applications</p>
            <h3 className="text-2xl font-black text-purple-400 mt-1">{applications.length}</h3>
            <span className="text-[10px] text-purple-300 mt-1 block">Live Firestore Database Records</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
            <Briefcase className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-slate-700/60 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium">Acquired Skill Badges</p>
            <h3 className="text-2xl font-black text-emerald-400 mt-1">{currentUser?.skills?.length || 0}</h3>
            <span className="text-[10px] text-slate-400 mt-1 block">Verified From Resume</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-slate-700/60 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium">Target Job Match</p>
            <h3 className={`text-2xl font-black mt-1 ${
              matchPercentage >= 80 ? 'text-emerald-400' : matchPercentage >= 50 ? 'text-amber-400' : 'text-red-400'
            }`}>
              {matchPercentage}%
            </h3>
            <span className={`text-[10px] font-semibold mt-1 block truncate max-w-[140px] ${
              matchPercentage >= 80 ? 'text-emerald-300' : 'text-amber-300'
            }`}>
              {activeJob.title}
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
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
              <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-blue-400" />
                Track Application Status
              </h3>
              <Link to="/student/jobs" className="text-xs text-blue-400 hover:underline font-semibold">
                View All Opportunities →
              </Link>
            </div>

            {loading ? (
              <div className="p-6 text-center text-xs text-slate-400 glass-panel rounded-2xl border border-slate-700/80">
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
          <div className="glass-card rounded-3xl p-6 border border-emerald-500/30 bg-gradient-to-br from-emerald-950/30 to-slate-900 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-700/50 pb-2.5">
              <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4" /> Assigned Academic Mentor
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
                Verified Faculty
              </span>
            </div>

            <div className="space-y-1">
              <h4 className="text-base font-extrabold text-slate-100">
                {currentUser?.mentorName || 'Prof. Rajesh Kumar'}
              </h4>
              <p className="text-xs text-slate-400 font-mono">
                {currentUser?.mentorEmail || 'rajesh.prof@iitd.ac.in'}
              </p>
              <p className="text-[11px] text-emerald-300 font-medium">
                {currentUser?.departmentName || 'Dept of Computer Science'} • {currentUser?.collegeName || currentUser?.institution || 'IIT Delhi'}
              </p>
            </div>

            <button
              onClick={() => setChatRecipient({
                name: currentUser?.mentorName || 'Prof. Rajesh Kumar',
                role: 'Academic Mentor'
              })}
              className="w-full mt-2 py-2 rounded-xl bg-emerald-600/30 hover:bg-emerald-600 text-emerald-200 font-bold text-xs border border-emerald-500/40 flex items-center justify-center gap-2 transition-colors"
            >
              <span>Contact Mentor</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-emerald-300" />
            </button>
          </div>

          <div className="glass-card rounded-3xl p-6 border border-slate-700/60 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-700/50">
              <h4 className="text-sm font-bold text-slate-200">Verified Technical Skills</h4>
              <Link to="/student/profile" className="text-xs text-blue-400 hover:underline font-medium">Edit</Link>
            </div>

            <div className="flex flex-wrap gap-2">
              {(currentUser?.skills || []).map((skill, i) => (
                <span key={i} className="text-xs px-3 py-1.5 rounded-xl bg-slate-800 text-slate-200 border border-slate-700/70 font-medium">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* AI Career Mentor Spotlight Card */}
          <div className="glass-card rounded-3xl p-6 border border-indigo-500/30 bg-gradient-to-br from-indigo-950/40 to-slate-900 space-y-4">
            <div className="flex items-center gap-2 text-indigo-300 font-bold text-sm">
              <Sparkles className="w-5 h-5 text-amber-300" />
              <span>AI Career Insight</span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Based on your React.js and Python skillset, recruiters in <span className="text-white font-semibold">Bengaluru</span> are offering a 28% higher stipend for candidates with <span className="text-amber-300 font-semibold">PyTorch & Docker</span> experience.
            </p>

            <Link
              to="/student/resume-analyzer"
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 transition-colors"
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
