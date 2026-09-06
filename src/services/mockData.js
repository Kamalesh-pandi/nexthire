// Comprehensive Mock Dataset for Offline Demo & Instant Testing

export const MOCK_COLLEGES = [
  { id: "col_001", name: "Indian Institute of Technology Bombay (IIT Bombay)", location: "Powai, Mumbai, Maharashtra", state: "Maharashtra", createdAt: "2026-01-01" },
  { id: "col_002", name: "College of Engineering Pune (COEP Technological University)", location: "Shivajinagar, Pune, Maharashtra", state: "Maharashtra", createdAt: "2026-01-01" },
  { id: "col_003", name: "Veermata Jijabai Technological Institute (VJTI)", location: "Matunga, Mumbai, Maharashtra", state: "Maharashtra", createdAt: "2026-01-01" },
  { id: "col_004", name: "Savitribai Phule Pune University (SPPU)", location: "Ganeshkhind, Pune, Maharashtra", state: "Maharashtra", createdAt: "2026-01-01" }
];

export const MOCK_DEPARTMENTS = [
  { id: "dept_001", name: "Computer Science & Engineering (CSE)", collegeId: "col_001" },
  { id: "dept_002", name: "Information Technology (IT)", collegeId: "col_001" },
  { id: "dept_003", name: "Electronics & Communication (ECE)", collegeId: "col_001" },
  { id: "dept_004", name: "Computer Science & Engineering (CSE)", collegeId: "col_002" },
  { id: "dept_005", name: "Data Science & Artificial Intelligence", collegeId: "col_002" },
  { id: "dept_006", name: "Computer Science & Engineering (CSE)", collegeId: "col_003" }
];

export const MOCK_USERS = {
  student: {
    id: "std_001",
    name: "Aarav Sharma",
    email: "aarav.student@nexthire.ai",
    role: "student",
    status: "approved",
    collegeId: "col_001",
    collegeName: "Indian Institute of Technology Bombay (IIT Bombay)",
    departmentId: "dept_001",
    departmentName: "Computer Science & Engineering (CSE)",
    mentorId: "acad_001",
    mentorName: "Prof. Rajesh Kumar",
    mentorEmail: "rajesh.prof@iitb.ac.in",
    degree: "B.Tech Computer Science & Engineering",
    graduationYear: 2025,
    bio: "Passionate Full-Stack & AI student enthusiastic about building scalable web applications and intelligent systems.",
    skills: ["React.js", "Node.js", "Python", "Tailwind CSS", "JavaScript", "SQL", "Git"],
    interests: ["Machine Learning", "Cloud Computing", "Full Stack Development"],
    resumeScore: 88,
    resumeUrl: "https://example.com/aarav_resume.pdf",
    createdAt: new Date().toISOString()
  },
  student2: {
    id: "std_002",
    name: "Neha Gupta",
    email: "neha.gupta@institute.edu",
    role: "student",
    status: "approved",
    collegeId: "col_001",
    collegeName: "Indian Institute of Technology Bombay (IIT Bombay)",
    departmentId: "dept_001",
    departmentName: "Computer Science & Engineering (CSE)",
    mentorId: "acad_001",
    mentorName: "Prof. Rajesh Kumar",
    mentorEmail: "rajesh.prof@iitb.ac.in",
    degree: "B.Tech Computer Science",
    graduationYear: 2025,
    skills: ["Python", "PyTorch", "Machine Learning", "Deep Learning", "TensorFlow"],
    interests: ["Artificial Intelligence", "Deep Learning"],
    resumeScore: 94,
    createdAt: new Date().toISOString()
  },
  student3: {
    id: "std_003",
    name: "Vikram Patel",
    email: "vikram.p@univ.edu",
    role: "student",
    status: "approved",
    collegeId: "col_001",
    collegeName: "Indian Institute of Technology Bombay (IIT Bombay)",
    departmentId: "dept_001",
    departmentName: "Computer Science & Engineering (CSE)",
    mentorId: "acad_002",
    mentorName: "Dr. Sunita Sharma",
    mentorEmail: "sunita.sharma@iitb.ac.in",
    degree: "B.Tech Computer Science",
    graduationYear: 2026,
    skills: ["Java", "C++", "SQL"],
    interests: ["Software Engineering"],
    resumeScore: 62,
    createdAt: new Date().toISOString()
  },
  recruiter: {
    id: "rec_001",
    name: "Dr. Priya Nair",
    email: "priya.recruiter@techcorp.com",
    role: "recruiter",
    status: "approved",
    companyName: "NexusTech AI Solutions",
    companyWebsite: "https://nexustech.ai",
    designation: "Senior Talent Acquisition Manager",
    location: "Mumbai, Maharashtra",
    skillsRequired: ["React", "Python", "Machine Learning", "System Design"],
    createdAt: new Date().toISOString()
  },
  academician: {
    id: "acad_001",
    name: "Prof. Rajesh Kumar",
    email: "rajesh.prof@iitb.ac.in",
    role: "academician",
    status: "approved",
    collegeId: "col_001",
    collegeName: "Indian Institute of Technology Bombay (IIT Bombay)",
    departmentId: "dept_001",
    departmentName: "Computer Science & Engineering (CSE)",
    designation: "Head of Training & Placement",
    createdAt: new Date().toISOString()
  },
  academician2: {
    id: "acad_002",
    name: "Dr. Sunita Sharma",
    email: "sunita.sharma@iitb.ac.in",
    role: "academician",
    status: "approved",
    collegeId: "col_001",
    collegeName: "Indian Institute of Technology Bombay (IIT Bombay)",
    departmentId: "dept_001",
    departmentName: "Computer Science & Engineering (CSE)",
    designation: "Associate Professor",
    createdAt: new Date().toISOString()
  },
  admin: {
    id: "admin_001",
    name: "System Administrator",
    email: "admin@nexthire.ai",
    role: "admin",
    status: "approved",
    institution: "NextHire Central Administration",
    createdAt: new Date().toISOString()
  }
};

export const MOCK_JOBS = [
  {
    id: "job_101",
    title: "AI / ML Engineering Intern",
    companyId: "rec_001",
    companyName: "NexusTech AI Solutions",
    location: "Bengaluru (Hybrid)",
    type: "Internship",
    stipend: "₹35,000 / month",
    duration: "6 Months",
    deadline: "2026-09-30",
    description: "Work directly with our core AI team on LLM fine-tuning, RAG pipelines, and API integrations using Python and React interfaces.",
    skillsRequired: ["Python", "Machine Learning", "PyTorch", "React.js", "API Integration"],
    applicantsCount: 14,
    createdAt: "2026-08-25"
  },
  {
    id: "job_102",
    title: "Full-Stack Software Engineer (SDE-1)",
    companyId: "rec_001",
    companyName: "NexusTech AI Solutions",
    location: "Remote",
    type: "Full-Time",
    stipend: "₹12,00,000 / annum",
    duration: "Permanent",
    deadline: "2026-10-15",
    description: "Building resilient microservices and high-performance React web interfaces. Strong proficiency in Node.js, PostgreSQL, and modern Frontend frameworks required.",
    skillsRequired: ["React.js", "Node.js", "JavaScript", "SQL", "Tailwind CSS", "Docker"],
    applicantsCount: 29,
    createdAt: "2026-08-28"
  },
  {
    id: "job_103",
    title: "Data Analyst & Business Intelligence Intern",
    companyId: "rec_002",
    companyName: "DataGrid Analytics",
    location: "Hyderabad",
    type: "Internship",
    stipend: "₹25,000 / month",
    duration: "3 Months",
    deadline: "2026-09-20",
    description: "Transform complex enterprise datasets into actionable insights using SQL, Python, and PowerBI interactive dashboards.",
    skillsRequired: ["Python", "SQL", "Data Analysis", "PowerBI", "Excel"],
    applicantsCount: 8,
    createdAt: "2026-08-30"
  },
  {
    id: "job_104",
    title: "Cloud DevOps & Infrastructure Engineer",
    companyId: "rec_003",
    companyName: "CloudScale India",
    location: "Pune",
    type: "Full-Time",
    stipend: "₹14,50,000 / annum",
    duration: "Permanent",
    deadline: "2026-10-01",
    description: "Maintain multi-region Kubernetes clusters, CI/CD pipelines, and infrastructure as code using Terraform & AWS.",
    skillsRequired: ["AWS", "Docker", "Kubernetes", "Linux", "CI/CD"],
    applicantsCount: 19,
    createdAt: "2026-08-20"
  }
];

export const MOCK_APPLICATIONS = [
  {
    id: "app_201",
    jobId: "job_101",
    jobTitle: "AI / ML Engineering Intern",
    companyName: "NexusTech AI Solutions",
    userId: "std_001",
    userName: "Aarav Sharma",
    userEmail: "aarav.student@nexthire.ai",
    userSkills: ["React.js", "Node.js", "Python", "Tailwind CSS", "JavaScript", "SQL"],
    resumeScore: 88,
    matchPercentage: 80,
    status: "Shortlisted",
    appliedAt: "2026-08-26",
    feedback: "High resume score and strong skill alignment. Invited for technical round."
  },
  {
    id: "app_202",
    jobId: "job_102",
    jobTitle: "Full-Stack Software Engineer (SDE-1)",
    companyName: "NexusTech AI Solutions",
    userId: "std_001",
    userName: "Aarav Sharma",
    userEmail: "aarav.student@nexthire.ai",
    userSkills: ["React.js", "Node.js", "Python", "Tailwind CSS", "JavaScript", "SQL"],
    resumeScore: 88,
    matchPercentage: 83,
    status: "Applied",
    appliedAt: "2026-08-29",
    feedback: "Under initial recruiter review."
  },
  {
    id: "app_203",
    jobId: "job_101",
    jobTitle: "AI / ML Engineering Intern",
    companyName: "NexusTech AI Solutions",
    userId: "std_002",
    userName: "Neha Gupta",
    userEmail: "neha.gupta@institute.edu",
    userSkills: ["Python", "PyTorch", "Machine Learning", "Deep Learning", "TensorFlow"],
    resumeScore: 94,
    matchPercentage: 92,
    status: "Shortlisted",
    appliedAt: "2026-08-27",
    feedback: "Excellent Machine Learning project background."
  },
  {
    id: "app_204",
    jobId: "job_101",
    jobTitle: "AI / ML Engineering Intern",
    companyName: "NexusTech AI Solutions",
    userId: "std_003",
    userName: "Vikram Patel",
    userEmail: "vikram.p@univ.edu",
    userSkills: ["Java", "C++", "SQL"],
    resumeScore: 62,
    matchPercentage: 40,
    status: "Applied",
    appliedAt: "2026-08-28",
    feedback: "Missing key Machine Learning and React requirements."
  }
];

export const MOCK_COURSES = [
  {
    id: "crs_301",
    title: "PyTorch for Deep Learning & Neural Networks",
    skillsCovered: ["PyTorch", "Machine Learning", "Deep Learning"],
    provider: "Coursera",
    link: "https://coursera.org",
    rating: 4.8,
    duration: "4 Weeks",
    recommendedFor: ["AI / ML Engineering Intern"]
  },
  {
    id: "crs_302",
    title: "Docker & Kubernetes Mastery for Developers",
    skillsCovered: ["Docker", "Kubernetes", "DevOps"],
    provider: "Udemy",
    link: "https://udemy.com",
    rating: 4.7,
    duration: "6 Weeks",
    recommendedFor: ["Full-Stack Software Engineer (SDE-1)"]
  },
  {
    id: "crs_303",
    title: "System Design & Microservices Architecture",
    skillsCovered: ["System Design", "Microservices", "Scalability"],
    provider: "NPTEL / Swayam",
    link: "https://nptel.ac.in",
    rating: 4.9,
    duration: "8 Weeks",
    recommendedFor: ["Cloud DevOps & Infrastructure Engineer"]
  }
];

export const MOCK_PROJECTS = [
  {
    id: "proj_401",
    title: "Industry Capstone: Edge AI Inference for IoT Sensors",
    academicianId: "acad_001",
    academicianName: "Prof. Rajesh Kumar",
    institution: "IIT Delhi",
    industryPartner: "NexusTech AI Solutions",
    description: "Build low-latency PyTorch model deployment pipeline targeting Raspberry Pi and NVIDIA Jetson edge nodes.",
    requiredSkills: ["Python", "PyTorch", "C++", "IoT"],
    deadline: "2026-11-30",
    status: "Open for Applications"
  },
  {
    id: "proj_402",
    title: "Distributed Microservices Monitoring Dashboard",
    academicianId: "acad_001",
    academicianName: "Prof. Rajesh Kumar",
    institution: "IIT Delhi",
    industryPartner: "CloudScale India",
    description: "Develop real-time web dashboard monitoring Kubernetes node health and Prometheus metric alerts.",
    requiredSkills: ["React.js", "Docker", "Node.js", "Prometheus"],
    deadline: "2026-12-15",
    status: "Open for Applications"
  }
];

export const MOCK_NOTIFICATIONS = [
  {
    id: "notif_501",
    userId: "std_001",
    title: "Application Shortlisted! 🎉",
    message: "NexusTech AI Solutions shortlisted your application for AI / ML Engineering Intern.",
    timestamp: "2 hours ago",
    read: false
  },
  {
    id: "notif_502",
    userId: "std_001",
    title: "New AI Recommendation 💡",
    message: "Based on your recent skill updates, 2 new matching internships were posted.",
    timestamp: "1 day ago",
    read: true
  }
];

export const MOCK_STUDENT_ANALYTICS = {
  totalStudents: 450,
  placementReadinessRate: 78, // %
  topMissingSkills: [
    { skill: "PyTorch & ML Frameworks", count: 184, percent: 41 },
    { skill: "Docker & Containerization", count: 162, percent: 36 },
    { skill: "System Design & Architecture", count: 145, percent: 32 },
    { skill: "Cloud Deployment (AWS/GCP)", count: 130, percent: 29 },
    { skill: "GraphQL & Microservices", count: 110, percent: 24 }
  ],
  industryRequirementAlignment: 84,
  activeProjects: 12
};
