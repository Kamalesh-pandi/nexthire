import React, { useState } from 'react';
import { 
  BookOpen, 
  MapPin, 
  CheckCircle2, 
  Circle, 
  ArrowRight, 
  Sparkles, 
  Clock, 
  Award, 
  ExternalLink, 
  Star, 
  Flame, 
  Layers, 
  Code2, 
  FileCheck,
  ChevronRight
} from 'lucide-react';
import CourseRecommendationCard from './CourseRecommendationCard';

export default function PersonalizedLearningPath({ 
  targetJob, 
  missingSkills = [], 
  matchedSkills = [], 
  matchPercentage = 80,
  recommendedCourses = []
}) {
  const [activeTab, setActiveTab] = useState('roadmap'); // 'roadmap' | 'courses'
  const [completedSteps, setCompletedSteps] = useState({});

  const toggleStep = (stepId) => {
    setCompletedSteps(prev => ({
      ...prev,
      [stepId]: !prev[stepId]
    }));
  };

  const jobTitle = targetJob?.title || 'Target Role';
  const missingCount = missingSkills.length;
  const potentialBoost = Math.max(0, 100 - matchPercentage);

  // Synthesize tailored learning phases based on missing skills & target role
  const generateRoadmapPhases = () => {
    const missingLower = missingSkills.map(s => s.toLowerCase().trim());
    
    // Check dominant skill areas
    const hasAI = missingLower.some(s => s.includes('python') || s.includes('pytorch') || s.includes('tensorflow') || s.includes('machine learning') || s.includes('deep learning'));
    const hasCloudDevOps = missingLower.some(s => s.includes('docker') || s.includes('kubernetes') || s.includes('aws') || s.includes('cloud') || s.includes('ci/cd'));
    const hasBackend = missingLower.some(s => s.includes('node') || s.includes('express') || s.includes('sql') || s.includes('mongodb') || s.includes('database') || s.includes('api'));
    const hasFrontend = missingLower.some(s => s.includes('react') || s.includes('next') || s.includes('vue') || s.includes('typescript') || s.includes('tailwind') || s.includes('frontend'));

    if (missingCount === 0) {
      return [
        {
          id: 'phase_1',
          phase: 'Phase 1: High-Performance Architecture',
          duration: '1-2 Weeks',
          title: 'System Design & Scalability Optimization',
          description: `You already meet 100% of the core skills for ${jobTitle}! Elevate your candidacy by mastering distributed systems, caching layers, and database concurrency.`,
          skills: ['System Design', 'Microservices', 'Low-Latency Caching'],
          outcomes: [
            'Design scalable multi-tier architectures for high concurrency',
            'Implement Redis caching and database query optimization',
            'Conduct load testing with k6 or Apache JMeter'
          ],
          project: 'Design a distributed rate-limiter and URL shortener capable of handling 50k requests/sec'
        },
        {
          id: 'phase_2',
          phase: 'Phase 2: Recruiter Shortlisting & Interview Drills',
          duration: '1 Week',
          title: 'Mock Technical Screenings & System Interviews',
          description: 'Refine technical communication, LeetCode patterns, and behavioral STAR stories.',
          skills: ['Data Structures & Algorithms', 'Technical Communication', 'STAR Method'],
          outcomes: [
            'Solve top 50 company-specific coding questions',
            'Walk through system design tradeoffs clearly on a virtual whiteboard',
            'Polish LinkedIn and GitHub portfolio with live production deployments'
          ],
          project: 'Complete 3 peer mock technical interviews with verified mentors'
        }
      ];
    }

    const phases = [];

    // Phase 1: Core Foundation & Tooling for Primary Missing Gap
    const phase1Skills = missingSkills.slice(0, 2);
    let phase1Title = `Foundation in ${phase1Skills.join(' & ')}`;
    let phase1Desc = `Master core syntax, development environments, and foundational best practices for ${phase1Skills.join(', ')}.`;
    let phase1Outcomes = [
      `Understand fundamentals, core APIs, and idioms of ${phase1Skills[0]}`,
      phase1Skills[1] ? `Build initial modules utilizing ${phase1Skills[1]}` : 'Configure local development environment and CLI tooling',
      'Solve practical coding exercises and study production syntax patterns'
    ];

    if (hasAI && (phase1Skills.some(s => s.toLowerCase().includes('pytorch') || s.toLowerCase().includes('machine')))) {
      phase1Title = 'Deep Learning & Tensor Mathematics';
      phase1Desc = 'Master PyTorch tensor mechanics, automatic differentiation, and dataset pipelines.';
      phase1Outcomes = [
        'Understand tensor broadcasting, GPU CUDA acceleration, and autograd',
        'Build custom PyTorch Dataset and DataLoader pipelines',
        'Train baseline neural networks with cross-entropy loss and Adam optimizer'
      ];
    } else if (hasCloudDevOps && (phase1Skills.some(s => s.toLowerCase().includes('docker') || s.toLowerCase().includes('aws')))) {
      phase1Title = 'Containerization & Cloud Infrastructure';
      phase1Desc = 'Build multi-stage Dockerfiles, network bridges, and deploy cloud resources.';
      phase1Outcomes = [
        'Write secure, lightweight multi-stage Dockerfiles',
        'Configure Docker Compose for multi-container local microservices',
        'Deploy serverless containers to AWS or cloud provider'
      ];
    }

    phases.push({
      id: 'phase_1',
      phase: 'Phase 1: Bridge Immediate Skill Gaps',
      duration: '1-2 Weeks',
      title: phase1Title,
      description: phase1Desc,
      skills: phase1Skills,
      outcomes: phase1Outcomes,
      impact: `+${Math.round(potentialBoost * 0.55)}% Match Gain`
    });

    // Phase 2: Advanced Integration & Remaining Gaps
    const phase2Skills = missingSkills.length > 2 ? missingSkills.slice(2, 4) : missingSkills.slice(1, 2);
    const activePhase2Skills = phase2Skills.length > 0 ? phase2Skills : missingSkills.slice(0, 1);
    
    let phase2Title = `Production Engineering with ${activePhase2Skills.join(' & ')}`;
    let phase2Desc = `Integrate ${activePhase2Skills.join(' & ')} into enterprise architectural workflows.`;
    let phase2Outcomes = [
      'Architect robust error handling, logging, and security validations',
      'Write integration tests and optimize throughput/performance',
      'Deploy service with CI/CD pipeline and environment secrets'
    ];

    if (hasAI) {
      phase2Title = 'Model Architecture & Deployment Pipelines';
      phase2Desc = 'Fine-tuning, transfer learning, and deploying models behind high-speed REST endpoints.';
      phase2Outcomes = [
        'Implement Convolutional & Transformer architectures',
        'Containerize PyTorch models using ONNX runtime and FastAPI',
        'Track experiments using Weights & Biases or MLflow'
      ];
    } else if (hasCloudDevOps) {
      phase2Title = 'Kubernetes Orchestration & CI/CD Pipelines';
      phase2Desc = 'Automate deployment pipelines and manage zero-downtime cluster rollouts.';
      phase2Outcomes = [
        'Define Kubernetes Deployments, Services, and Ingress controllers',
        'Automate testing and deployment with GitHub Actions',
        'Configure Prometheus & Grafana cluster health monitoring'
      ];
    } else if (hasBackend) {
      phase2Title = 'RESTful Architecture & High-Performance Database Design';
      phase2Desc = 'Design scalable relational schemas, indexing strategies, and secure authentication.';
      phase2Outcomes = [
        'Write normalized SQL schemas with foreign keys and compound indexes',
        'Implement stateless JWT authentication and role-based access control',
        'Optimize query response times with Redis caching'
      ];
    }

    phases.push({
      id: 'phase_2',
      phase: 'Phase 2: Enterprise Integration & Production Patterns',
      duration: '2-3 Weeks',
      title: phase2Title,
      description: phase2Desc,
      skills: activePhase2Skills,
      outcomes: phase2Outcomes,
      impact: `+${Math.round(potentialBoost * 0.45)}% Match Gain (Reach 100%)`
    });

    // Phase 3: Resume Capstone Deliverable
    let capstoneTitle = `Full-Scale Capstone Project for ${jobTitle}`;
    let capstoneStack = [...missingSkills, ...matchedSkills.slice(0, 2)];
    let capstoneBullet = `Engineered an end-to-end ${jobTitle.toLowerCase()} platform utilizing ${missingSkills.slice(0, 3).join(', ')}, demonstrating 99.9% uptime and automated testing.`;

    if (hasAI) {
      capstoneTitle = 'End-to-End AI Prediction & Inference Platform';
      capstoneBullet = `Developed a real-time deep learning inference pipeline with PyTorch and FastAPI; decreased model latency by 35% through ONNX quantization and Docker containerization.`;
    } else if (hasCloudDevOps) {
      capstoneTitle = 'Automated Cloud Microservices Infrastructure with CI/CD';
      capstoneBullet = `Built a fault-tolerant microservice cluster on AWS EKS using Kubernetes and Terraform; achieved zero-downtime blue/green deployments with automated GitHub Actions.`;
    } else if (hasBackend) {
      capstoneTitle = 'Scalable Multi-Tenant REST API & Data Engine';
      capstoneBullet = `Engineered high-concurrency RESTful backend handling 2,000+ RPS; reduced database query latency by 45% using PostgreSQL indexing and Redis caching.`;
    }

    phases.push({
      id: 'phase_3',
      phase: 'Phase 3: Portfolio Capstone & Resume Validation',
      duration: '1 Week',
      title: capstoneTitle,
      description: `Build a production-grade portfolio piece that directly showcases all missing skills to recruiters during ${jobTitle} interview screenings.`,
      skills: capstoneStack.slice(0, 4),
      outcomes: [
        'Deploy live working demo on Vercel/AWS/Render with public GitHub repository',
        'Write comprehensive README with architectural diagrams and setup guide',
        'Add quantitative bullet points to your resume under Projects'
      ],
      project: capstoneBullet,
      impact: 'Guaranteed 100% Recruiter Shortlist Alignment'
    });

    return phases;
  };

  const phases = generateRoadmapPhases();
  const totalSteps = phases.length;
  const completedCount = Object.values(completedSteps).filter(Boolean).length;
  const progressPercent = Math.round((completedCount / totalSteps) * 100);

  return (
    <div className="glass-card rounded-3xl p-6 sm:p-7 border border-slate-700/60 space-y-6">
      
      {/* Header with Title and Dynamic Target Pill */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-700/50 pb-5">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              AI Learning Advisor
            </span>
            <span className="text-[10px] text-slate-400 font-medium">
              Target Role: <strong className="text-slate-200">{jobTitle}</strong>
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-slate-100 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-indigo-400 shrink-0" />
            Personalized Learning Path
          </h3>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            Custom-tailored curriculum to eliminate your <span className="text-amber-400 font-bold">{missingCount} missing skill {missingCount === 1 ? 'gap' : 'gaps'}</span> and boost your resume match to <strong className="text-emerald-400">100%</strong>.
          </p>
        </div>

        {/* Impact Metric Badge */}
        <div className="flex items-center gap-3 self-start md:self-center bg-slate-900/80 p-3 rounded-2xl border border-slate-800 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black text-sm">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1 text-xs font-bold text-emerald-400">
              <Flame className="w-3.5 h-3.5 fill-emerald-400" />
              <span>+{potentialBoost}% Potential Gain</span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">
              Target: <span className="text-white font-semibold">100% Alignment</span>
            </p>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('roadmap')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'roadmap'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Structured Roadmap ({phases.length} Phases)</span>
          </button>

          <button
            onClick={() => setActiveTab('courses')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'courses'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Curated Courses & Certs ({recommendedCourses.length})</span>
          </button>
        </div>

        {activeTab === 'roadmap' && (
          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400">
            <span>Milestones: <strong className="text-slate-200">{completedCount}/{totalSteps}</strong></span>
            <div className="w-20 bg-slate-800 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-emerald-500 h-full rounded-full transition-all"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Tab 1: Structured Step-by-Step Roadmap */}
      {activeTab === 'roadmap' && (
        <div className="space-y-6">
          <div className="relative border-l-2 border-slate-700/60 ml-4 sm:ml-6 pl-6 sm:pl-8 space-y-8">
            {phases.map((item, idx) => {
              const isCompleted = !!completedSteps[item.id];

              return (
                <div key={item.id} className="relative group">
                  {/* Timeline Node Icon */}
                  <button
                    onClick={() => toggleStep(item.id)}
                    className={`absolute -left-[35px] sm:-left-[43px] top-1.5 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                      isCompleted
                        ? 'bg-emerald-500 text-slate-950 ring-4 ring-emerald-500/20 shadow-lg shadow-emerald-500/30'
                        : 'bg-slate-800 border-2 border-slate-600 text-slate-300 hover:border-blue-400 hover:text-blue-400'
                    }`}
                    title={isCompleted ? 'Mark as incomplete' : 'Mark phase as completed'}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    ) : (
                      <span>{idx + 1}</span>
                    )}
                  </button>

                  {/* Phase Content Box */}
                  <div className={`p-5 rounded-2xl border transition-all ${
                    isCompleted 
                      ? 'bg-slate-900/50 border-emerald-500/30 opacity-90' 
                      : 'bg-slate-800/40 hover:bg-slate-800/60 border-slate-700/60 hover:border-blue-500/40 shadow-sm'
                  }`}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-800 text-blue-400 border border-slate-700">
                          {item.phase}
                        </span>
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          {item.duration}
                        </span>
                      </div>

                      {item.impact && (
                        <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-md border border-emerald-500/20 self-start sm:self-auto">
                          {item.impact}
                        </span>
                      )}
                    </div>

                    <h4 className="text-base font-bold text-slate-100 mt-2">
                      {item.title}
                    </h4>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      {item.description}
                    </p>

                    {/* Targeted Skill Badges */}
                    {item.skills && item.skills.length > 0 && (
                      <div className="mt-3 flex flex-wrap items-center gap-1.5">
                        <span className="text-[11px] text-slate-400 font-medium mr-1">Targets:</span>
                        {item.skills.map((s, i) => (
                          <span key={i} className="text-xs px-2.5 py-0.5 rounded-lg bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 font-medium">
                            {s}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Key Learning Milestones Checklist */}
                    {item.outcomes && item.outcomes.length > 0 && (
                      <div className="mt-4 space-y-1.5 bg-slate-900/60 p-3.5 rounded-xl border border-slate-800/80">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                          Core Milestones & Competencies:
                        </span>
                        {item.outcomes.map((outcome, i) => (
                          <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                            <span>{outcome}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Capstone Project Deliverable if applicable */}
                    {item.project && (
                      <div className="mt-4 p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/30 space-y-1.5">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
                          <Code2 className="w-4 h-4 text-amber-400" />
                          <span>Recommended Resume Project Deliverable:</span>
                        </div>
                        <p className="text-xs text-slate-200 font-mono bg-slate-900/70 p-2.5 rounded-lg border border-slate-800">
                          {item.project}
                        </p>
                      </div>
                    )}

                    {/* Action Button */}
                    <div className="mt-4 flex items-center justify-between pt-2 border-t border-slate-700/40">
                      <button
                        onClick={() => toggleStep(item.id)}
                        className={`text-xs font-bold flex items-center gap-1.5 transition-colors ${
                          isCompleted ? 'text-emerald-400 hover:text-emerald-300' : 'text-slate-400 hover:text-blue-400'
                        }`}
                      >
                        {isCompleted ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            <span>Marked as Completed</span>
                          </>
                        ) : (
                          <>
                            <Circle className="w-4 h-4" />
                            <span>Mark Phase as Complete</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => setActiveTab('courses')}
                        className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1"
                      >
                        <span>Explore Courses</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 2: Curated Courses & Certifications */}
      {activeTab === 'courses' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span>Directly mapped to address missing requirements for <strong>{jobTitle}</strong></span>
            <span className="text-indigo-400 font-medium">Industry-Recognized Providers</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {recommendedCourses.map((course) => (
              <CourseRecommendationCard key={course.id} course={course} />
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
