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
    const jobTitleLower = (jobTitle || '').toLowerCase();
    
    // Check dominant skill areas
    const hasAI = missingLower.some(s => s.includes('python') || s.includes('pytorch') || s.includes('tensorflow') || s.includes('machine learning') || s.includes('deep learning')) || jobTitleLower.includes('ai') || jobTitleLower.includes('machine learning');
    const hasCloudDevOps = missingLower.some(s => s.includes('docker') || s.includes('kubernetes') || s.includes('aws') || s.includes('cloud') || s.includes('ci/cd')) || jobTitleLower.includes('devops') || jobTitleLower.includes('cloud');
    const hasBackend = missingLower.some(s => s.includes('node') || s.includes('express') || s.includes('sql') || s.includes('mongodb') || s.includes('database') || s.includes('api')) || jobTitleLower.includes('backend');
    const hasFrontend = missingLower.some(s => s.includes('react') || s.includes('next') || s.includes('vue') || s.includes('typescript') || s.includes('tailwind') || s.includes('frontend')) || jobTitleLower.includes('frontend');
    const hasMobile = missingLower.some(s => s.includes('flutter') || s.includes('dart') || s.includes('mobile') || s.includes('react native') || s.includes('ios') || s.includes('android')) || jobTitleLower.includes('flutter') || jobTitleLower.includes('mobile');

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

    if (hasMobile) {
      phase1Title = 'Cross-Platform Mobile UI & Widget Architecture';
      phase1Desc = 'Master Flutter & Dart widget trees, reactive layouts, and native app lifecycle state.';
      phase1Outcomes = [
        'Build custom responsive widgets and smooth mobile animations',
        'Configure state management (BLoC / Provider) for clean app data flow',
        'Setup Android Studio / VS Code mobile emulators and native build tools'
      ];
    } else if (hasAI && (phase1Skills.some(s => s.toLowerCase().includes('pytorch') || s.toLowerCase().includes('machine')))) {
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

    if (hasMobile) {
      phase2Title = 'Mobile Backend Integration & State Persistence';
      phase2Desc = 'Connect mobile apps to RESTful APIs, offline databases, and push notification services.';
      phase2Outcomes = [
        'Implement HTTP API services with dio/http and JSON serialization',
        'Configure local offline storage using Hive, Sqflite, or Shared Preferences',
        'Implement authentication flows with secure token storage'
      ];
    } else if (hasAI) {
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

    if (hasMobile) {
      capstoneTitle = 'Cross-Platform Enterprise Mobile Application';
      capstoneBullet = `Engineered a feature-rich Flutter & Dart mobile app with BLoC state management and REST API integration; published APK build and achieved 60fps UI performance across Android & iOS.`;
    } else if (hasAI) {
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
    <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-6">
      
      {/* Header with Title and Dynamic Target Pill */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              AI Learning Advisor
            </span>
            <span className="text-[10px] text-slate-500 font-semibold">
              Target Role: <strong className="text-slate-900">{jobTitle}</strong>
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-blue-600 shrink-0" />
            Personalized Learning Path
          </h3>
          <p className="text-xs text-slate-600 max-w-2xl leading-relaxed font-medium">
            Custom-tailored curriculum to eliminate your <span className="text-amber-700 font-bold">{missingCount} missing skill {missingCount === 1 ? 'gap' : 'gaps'}</span> and boost your resume match to <strong className="text-emerald-600">100%</strong>.
          </p>
        </div>

        {/* Impact Metric Badge */}
        <div className="flex items-center gap-3 self-start md:self-center bg-blue-50/70 p-3 rounded-2xl border border-blue-200 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-black text-sm shadow-xs">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1 text-xs font-bold text-emerald-700">
              <Flame className="w-3.5 h-3.5 fill-emerald-600 text-emerald-600" />
              <span>+{potentialBoost}% Potential Gain</span>
            </div>
            <p className="text-[11px] text-slate-600 font-medium">
              Target: <span className="text-slate-900 font-bold">100% Alignment</span>
            </p>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('roadmap')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'roadmap'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Structured Roadmap ({phases.length} Phases)</span>
          </button>

          <button
            onClick={() => setActiveTab('courses')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'courses'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Curated Courses & Certs ({recommendedCourses.length})</span>
          </button>
        </div>

        {activeTab === 'roadmap' && (
          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500 font-medium">
            <span>Milestones: <strong className="text-slate-900">{completedCount}/{totalSteps}</strong></span>
            <div className="w-20 bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
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
          <div className="relative border-l-2 border-slate-200 ml-4 sm:ml-6 pl-6 sm:pl-8 space-y-8">
            {phases.map((item, idx) => {
              const isCompleted = !!completedSteps[item.id];

              return (
                <div key={item.id} className="relative group">
                  {/* Timeline Node Icon */}
                  <button
                    onClick={() => toggleStep(item.id)}
                    className={`absolute -left-[35px] sm:-left-[43px] top-1.5 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                      isCompleted
                        ? 'bg-emerald-500 text-white ring-4 ring-emerald-100 shadow-md'
                        : 'bg-white border-2 border-slate-300 text-slate-600 hover:border-blue-600 hover:text-blue-600'
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
                      ? 'bg-emerald-50/40 border-emerald-200' 
                      : 'bg-slate-50/70 hover:bg-white border-slate-200 hover:border-blue-300 shadow-2xs'
                  }`}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                          {item.phase}
                        </span>
                        <span className="text-xs text-slate-500 flex items-center gap-1 font-medium">
                          <Clock className="w-3 h-3 text-slate-400" />
                          {item.duration}
                        </span>
                      </div>

                      {item.impact && (
                        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200 self-start sm:self-auto">
                          {item.impact}
                        </span>
                      )}
                    </div>

                    <h4 className="text-base font-bold text-slate-900 mt-2">
                      {item.title}
                    </h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed font-medium">
                      {item.description}
                    </p>

                    {/* Targeted Skill Badges */}
                    {item.skills && item.skills.length > 0 && (
                      <div className="mt-3 flex flex-wrap items-center gap-1.5">
                        <span className="text-[11px] text-slate-500 font-semibold mr-1">Targets:</span>
                        {item.skills.map((s, i) => (
                          <span key={i} className="text-xs px-2.5 py-0.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 font-semibold">
                            {s}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Key Learning Milestones Checklist */}
                    {item.outcomes && item.outcomes.length > 0 && (
                      <div className="mt-4 space-y-1.5 bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                          Core Milestones & Competencies:
                        </span>
                        {item.outcomes.map((outcome, i) => (
                          <div key={i} className="flex items-start gap-2 text-xs text-slate-700 font-medium">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                            <span>{outcome}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Capstone Project Deliverable if applicable */}
                    {item.project && (
                      <div className="mt-4 p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 space-y-1.5">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800">
                          <Code2 className="w-4 h-4 text-amber-600" />
                          <span>Recommended Resume Project Deliverable:</span>
                        </div>
                        <p className="text-xs text-slate-800 font-mono bg-white p-2.5 rounded-lg border border-amber-200 shadow-2xs">
                          {item.project}
                        </p>
                      </div>
                    )}

                    {/* Action Button */}
                    <div className="mt-4 flex items-center justify-between pt-2 border-t border-slate-200/80">
                      <button
                        onClick={() => toggleStep(item.id)}
                        className={`text-xs font-bold flex items-center gap-1.5 transition-colors ${
                          isCompleted ? 'text-emerald-700 hover:text-emerald-800' : 'text-slate-600 hover:text-blue-600'
                        }`}
                      >
                        {isCompleted ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            <span>Marked as Completed</span>
                          </>
                        ) : (
                          <>
                            <Circle className="w-4 h-4 text-slate-400" />
                            <span>Mark Phase as Complete</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => setActiveTab('courses')}
                        className="text-xs text-blue-600 hover:text-blue-700 font-bold flex items-center gap-1"
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
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium px-1">
            <span>Directly mapped to address missing requirements for <strong className="text-slate-900">{jobTitle}</strong></span>
            <span className="text-blue-700 font-bold">Industry-Recognized Providers</span>
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
