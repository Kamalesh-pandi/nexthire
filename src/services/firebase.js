// Comprehensive Firebase Configuration & Firestore Service Helper
import { initializeApp, getApps } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut 
} from 'firebase/auth';

import { 
  getFirestore, 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  getDocs, 
  query, 
  where, 
  addDoc, 
  updateDoc,
  onSnapshot
} from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { MOCK_USERS, MOCK_JOBS, MOCK_APPLICATIONS, MOCK_COURSES, MOCK_PROJECTS, MOCK_COLLEGES, MOCK_DEPARTMENTS } from './mockData';

// Retrieve credentials from localStorage override OR import.meta.env
const getFirebaseCredentials = () => {
  const customConfig = localStorage.getItem('nexthire_firebase_config');
  if (customConfig) {
    try {
      return JSON.parse(customConfig);
    } catch (e) {
      console.warn("Invalid stored firebase config:", e);
    }
  }

  return {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBKR-QB9sblfANNUn903OsIU3ITZMJ-a8g",
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "nexthire-f6e4b.firebaseapp.com",
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "nexthire-f6e4b",
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "nexthire-f6e4b.firebasestorage.app",
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "333319758711",
    appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:333319758711:web:ccdf0b243d022242bef772",
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-K8PE304GE8"
  };
};


const firebaseConfig = getFirebaseCredentials();

export const isLiveFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && 
  firebaseConfig.apiKey.length > 10 &&
  firebaseConfig.projectId
);

// Initialize Firebase
let app;
let auth;
let db;
let storage;

try {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
} catch (err) {
  console.warn("Firebase initialization warning (running fallback mode):", err);
}

export { app, auth, db, storage };


// -------------------------------------------------------------
// FIRESTORE DATABASE HELPER API
// -------------------------------------------------------------

// Helper to sanitize objects for Firestore (removes undefined values)
export function sanitizeFirestoreData(data) {
  if (!data || typeof data !== 'object') return data;
  const cleanObj = { ...data };
  Object.keys(cleanObj).forEach(key => {
    if (cleanObj[key] === undefined) {
      delete cleanObj[key];
    }
  });
  return cleanObj;
}

/**
 * 1. USERS COLLECTION
 */
export async function saveUserToFirestore(userData) {
  const cleanData = sanitizeFirestoreData(userData);
  const role = (cleanData?.role || cleanData?.requestedRole || '').toLowerCase();
  if (role === 'academician' || role === 'faculty' || role === 'mentor' || cleanData?.isMentor) {
    saveRegisteredMentorLocally(cleanData);
  }
  if (!isLiveFirebaseConfigured || !db) return cleanData || userData;
  try {
    const userRef = doc(db, 'users', cleanData.id || cleanData.uid);
    await setDoc(userRef, cleanData, { merge: true });
    return cleanData;
  } catch (err) {
    console.error("Firestore saveUser error:", err);
    return userData;
  }
}


export async function getUserFromFirestore(userId) {
  if (!isLiveFirebaseConfigured || !db) return null;
  try {
    const snap = await getDoc(doc(db, 'users', userId));
    return snap.exists() ? snap.data() : null;
  } catch (err) {
    console.error("Firestore getUser error:", err);
    return null;
  }
}

/**
 * ADMIN WORKFLOW FUNCTIONS
 */
export async function fetchPendingUsersFromFirestore() {
  if (!isLiveFirebaseConfigured || !db) return [];
  try {
    const q = query(collection(db, 'users'), where('status', '==', 'waiting'));
    const snap = await getDocs(q);
    const users = [];
    snap.forEach(docSnap => {
      users.push({ id: docSnap.id, ...docSnap.data() });
    });
    return users;
  } catch (err) {
    console.error("Firestore fetchPendingUsers error:", err);
    return [];
  }
}

export async function fetchAllUsersFromFirestore() {
  const users = [];
  const seen = new Set();

  const addUser = (u) => {
    if (!u) return;
    const emailKey = (u.email || '').toLowerCase().trim();
    const idKey = u.id || u.uid;
    const nameKey = (u.name || '').toLowerCase().trim();
    
    // Create unique identifiers to prevent any duplicate entries
    const primaryKey = emailKey || idKey || nameKey;
    if (!primaryKey) return;

    if (!seen.has(primaryKey)) {
      seen.add(primaryKey);
      if (emailKey) seen.add(emailKey);
      if (idKey) seen.add(idKey);
      users.push({ id: idKey || `usr_${Date.now()}`, ...u });
    }
  };

  if (isLiveFirebaseConfigured && db) {
    try {
      const snap = await getDocs(collection(db, 'users'));
      snap.forEach(docSnap => {
        addUser({ id: docSnap.id, ...docSnap.data() });
      });
    } catch (err) {
      console.error("Firestore fetchAllUsers error:", err);
    }
  }

  // Check locally saved registered mentors/users
  try {
    if (typeof localStorage !== 'undefined') {
      const storedMentors = localStorage.getItem('nexthire_registered_mentors');
      if (storedMentors) {
        const parsed = JSON.parse(storedMentors);
        if (Array.isArray(parsed)) parsed.forEach(addUser);
      }
    }
  } catch (e) {
    console.warn("Error reading stored mentors for fetchAllUsers:", e);
  }

  // Fallback to MOCK_USERS if needed
  if (users.length === 0 && typeof MOCK_USERS === 'object') {
    Object.values(MOCK_USERS).forEach(addUser);
  }

  return users;
}

export async function approveUserInFirestore(userId, requestedRole) {
  if (!isLiveFirebaseConfigured || !db) return;
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      role: requestedRole || 'industry',
      status: 'approved',
      approvedAt: new Date().toISOString()
    });
  } catch (err) {
    console.error("Firestore approveUser error:", err);
    throw err;
  }
}

export async function rejectUserInFirestore(userId) {
  if (!isLiveFirebaseConfigured || !db) return;
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      status: 'rejected',
      rejectedAt: new Date().toISOString()
    });
  } catch (err) {
    console.error("Firestore rejectUser error:", err);
    throw err;
  }
}


/**
 * 2. JOBS COLLECTION
 */
export function deduplicateJobs(sourceJobs = []) {
  if (!Array.isArray(sourceJobs)) return [];
  const uniqueJobs = [];
  const seenIds = new Set();
  const seenKeys = new Set();

  sourceJobs.forEach(job => {
    if (!job) return;
    const idKey = (job.id || '').toString().toLowerCase().trim();
    const titleKey = (job.title || '').toLowerCase().trim();
    const companyKey = (job.companyName || job.companyId || '').toLowerCase().trim();
    const titleCompKey = `${titleKey}::${companyKey}`;

    if (idKey && seenIds.has(idKey)) return;
    if (titleCompKey && seenKeys.has(titleCompKey)) return;

    if (idKey) seenIds.add(idKey);
    if (titleCompKey) seenKeys.add(titleCompKey);
    uniqueJobs.push(job);
  });

  return uniqueJobs;
}

export async function fetchJobsFromFirestore() {
  let sourceJobs = [];
  if (isLiveFirebaseConfigured && db) {
    try {
      const q = query(collection(db, 'jobs'));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((docSnap) => {
        sourceJobs.push({ id: docSnap.id, ...docSnap.data() });
      });
    } catch (err) {
      console.error("Firestore fetchJobs error:", err);
    }
  }

  if (sourceJobs.length === 0) {
    sourceJobs = MOCK_JOBS;
  }

  return deduplicateJobs(sourceJobs);
}

export async function createJobInFirestore(jobData) {
  if (!isLiveFirebaseConfigured || !db) return jobData;
  try {
    const docRef = await addDoc(collection(db, 'jobs'), jobData);
    return { id: docRef.id, ...jobData };
  } catch (err) {
    console.error("Firestore createJob error:", err);
    return jobData;
  }
}

/**
 * 3. APPLICATIONS COLLECTION
 */
export async function fetchApplicationsFromFirestore(filterObj = {}) {
  if (!isLiveFirebaseConfigured || !db) return [];
  try {
    let q = query(collection(db, 'applications'));
    if (filterObj.userId) {
      q = query(collection(db, 'applications'), where('userId', '==', filterObj.userId));
    } else if (filterObj.jobId) {
      q = query(collection(db, 'applications'), where('jobId', '==', filterObj.jobId));
    }
    const querySnapshot = await getDocs(q);
    const apps = [];
    querySnapshot.forEach((docSnap) => {
      apps.push({ id: docSnap.id, ...docSnap.data() });
    });
    return apps;
  } catch (err) {
    console.error("Firestore fetchApplications error:", err);
    return [];
  }
}

export async function createApplicationInFirestore(appData) {
  if (!isLiveFirebaseConfigured || !db) return appData;
  try {
    const docRef = await addDoc(collection(db, 'applications'), appData);
    return { id: docRef.id, ...appData };
  } catch (err) {
    console.error("Firestore createApplication error:", err);
    return appData;
  }
}

export async function updateApplicationStatusInFirestore(appId, status, feedback = '') {
  if (!isLiveFirebaseConfigured || !db) return;
  try {
    const appRef = doc(db, 'applications', appId);
    await updateDoc(appRef, { status, feedback });
  } catch (err) {
    console.error("Firestore updateApplicationStatus error:", err);
  }
}

/**
 * 4. PROJECTS COLLECTION
 */
export async function fetchProjectsFromFirestore() {
  if (!isLiveFirebaseConfigured || !db) return [];
  try {
    const querySnapshot = await getDocs(collection(db, 'projects'));
    const projs = [];
    const seen = new Set();
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      const pTitle = (data.title || '').toLowerCase().trim();
      const key = docSnap.id || pTitle;
      if (!seen.has(key) && !seen.has(pTitle)) {
        seen.add(key);
        if (pTitle) seen.add(pTitle);
        projs.push({ id: docSnap.id, ...data });
      }
    });
    return projs;
  } catch (err) {
    console.error("Firestore fetchProjects error:", err);
    return [];
  }
}

export async function createProjectInFirestore(projectData) {
  if (!isLiveFirebaseConfigured || !db) return projectData;
  try {
    const docRef = await addDoc(collection(db, 'projects'), projectData);
    return { id: docRef.id, ...projectData };
  } catch (err) {
    console.error("Firestore createProject error:", err);
    return projectData;
  }
}

/**
 * 5. FIREBASE STORAGE: Resume Upload
 */
export async function uploadResumeToFirebaseStorage(file, userId) {
  if (!file) return "";

  if (isLiveFirebaseConfigured && storage) {
    try {
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const storageRef = ref(storage, `resumes/${userId || 'student'}_${Date.now()}_${sanitizedName}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
    } catch (err) {
      console.warn("Firebase Storage upload error, using local data URL fallback:", err);
    }
  }

  // Fallback when live Firebase Storage is not connected:
  // Convert uploaded PDF file to Data URL (Base64) or Blob URL for local persistence & instant preview
  return new Promise((resolve) => {
    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result || "");
      };
      reader.onerror = () => {
        resolve(URL.createObjectURL(file));
      };
      reader.readAsDataURL(file);
    } catch (e) {
      resolve(URL.createObjectURL(file));
    }
  });
}

import { fetchAllIndianCollegesAPI, getDepartmentsForCollege, normalizeKey, isMaharashtraInstitution } from './collegeApiService';

/**
 * 6. ACADEMIC HIERARCHY API (Colleges, Departments, Mentors, Students)
 */

// Colleges: Fetches all Maharashtra Colleges & Universities via API + Custom Firestore additions
export async function fetchCollegesFromFirestore() {
  const apiColleges = await fetchAllIndianCollegesAPI();
  if (!isLiveFirebaseConfigured || !db) return apiColleges;
  try {
    const snap = await getDocs(collection(db, 'colleges'));
    const firestoreCols = [];
    snap.forEach(docSnap => {
      const data = docSnap.data();
      const colName = data.name || '';
      // Exclude non-Maharashtra institutions from Firestore
      if (isMaharashtraInstitution(colName, data.state || '', data.location || '')) {
        firestoreCols.push({ id: docSnap.id, ...data, state: 'Maharashtra' });
      }
    });
    
    // Merge Firestore colleges with API colleges ensuring strict zero-duplicate uniqueness
    const seen = new Set();
    const merged = [];

    const addUnique = (c) => {
      const name = (c.name || '').trim();
      if (!name || name.length < 3) return;
      const key = normalizeKey(name);
      if (!key || key.length < 3) return;

      if (!seen.has(key)) {
        seen.add(key);
        merged.push({
          ...c,
          name: name,
          state: 'Maharashtra'
        });
      }
    };

    for (const c of firestoreCols) {
      addUnique(c);
    }
    for (const c of apiColleges) {
      addUnique(c);
    }

    return merged.sort((a, b) => a.name.localeCompare(b.name));
  } catch (err) {
    console.error("Firestore fetchColleges error, using Maharashtra colleges API:", err);
    return apiColleges;
  }
}

export async function createCollegeInFirestore(collegeData) {
  if (!isLiveFirebaseConfigured || !db) return collegeData;
  try {
    const docRef = await addDoc(collection(db, 'colleges'), {
      ...collegeData,
      createdAt: new Date().toISOString()
    });
    return { id: docRef.id, ...collegeData };
  } catch (err) {
    console.error("Firestore createCollege error:", err);
    return collegeData;
  }
}

// Departments: Standard Indian academic departments + custom additions
export async function fetchDepartmentsFromFirestore(collegeId = null) {
  const standardDepts = getDepartmentsForCollege(collegeId);
  if (!isLiveFirebaseConfigured || !db) return standardDepts;
  try {
    let q = collection(db, 'departments');
    if (collegeId) {
      q = query(collection(db, 'departments'), where('collegeId', '==', collegeId));
    }
    const snap = await getDocs(q);
    const firestoreDepts = [];
    snap.forEach(docSnap => {
      firestoreDepts.push({ id: docSnap.id, ...docSnap.data() });
    });
    
    const seen = new Set(firestoreDepts.map(d => d.name.toLowerCase()));
    const merged = [...firestoreDepts];
    for (const d of standardDepts) {
      if (!seen.has(d.name.toLowerCase())) {
        seen.add(d.name.toLowerCase());
        merged.push(d);
      }
    }
    return merged;
  } catch (err) {
    console.error("Firestore fetchDepartments error, using standard departments:", err);
    return standardDepts;
  }
}

export async function createDepartmentInFirestore(deptData) {
  if (!isLiveFirebaseConfigured || !db) return deptData;
  try {
    const docRef = await addDoc(collection(db, 'departments'), {
      ...deptData,
      createdAt: new Date().toISOString()
    });
    return { id: docRef.id, ...deptData };
  } catch (err) {
    console.error("Firestore createDepartment error:", err);
    return deptData;
  }
}

// // Local cache helper & Firestore public sync for registered mentors
export async function saveRegisteredMentorLocally(mentorData) {
  if (!mentorData) return;
  const id = mentorData.id || mentorData.uid || `mentor_${Date.now()}`;
  const email = (mentorData.email || '').toLowerCase().trim();

  const cleanRecord = {
    ...mentorData,
    id: id,
    uid: id,
    role: 'academician',
    status: mentorData.status || 'approved',
    name: mentorData.name || mentorData.fullName || (email ? email.split('@')[0] : 'Academic Mentor'),
    email: mentorData.email || '',
    collegeId: mentorData.collegeId || '',
    collegeName: mentorData.collegeName || mentorData.institution || '',
    departmentId: mentorData.departmentId || '',
    departmentName: mentorData.departmentName || mentorData.department || '',
    designation: mentorData.designation || 'Faculty Academician & Mentor'
  };

  // 1. Save to persistent localStorage
  try {
    if (typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem('nexthire_registered_mentors');
      const mentors = stored ? JSON.parse(stored) : [];
      const idx = mentors.findIndex(m => 
        (id && (m.id === id || m.uid === id)) || 
        (email && m.email && m.email.toLowerCase() === email)
      );

      if (idx >= 0) {
        mentors[idx] = { ...mentors[idx], ...cleanRecord };
      } else {
        mentors.push(cleanRecord);
      }
      localStorage.setItem('nexthire_registered_mentors', JSON.stringify(mentors));
    }
  } catch (err) {
    console.warn("Could not cache mentor locally:", err);
  }

  // 2. Concurrently save to public_mentors collection in Firestore (allows unauthenticated students on /register to read)
  if (isLiveFirebaseConfigured && db) {
    try {
      const mentorRef = doc(db, 'public_mentors', id);
      await setDoc(mentorRef, cleanRecord, { merge: true });
    } catch (e) {
      console.warn("Firestore public_mentors save warning:", e);
    }
  }
}

// Mentors (Academicians) in Department
export async function fetchMentorsByDepartmentFromFirestore(collegeId, departmentId, collegeName = '', departmentName = '') {
  const candidatePool = [];
  const candidateSeen = new Set();

  const addCandidate = (u) => {
    if (!u) return;
    const role = (u.role || u.requestedRole || '').toLowerCase();
    const designation = (u.designation || '').toLowerCase();

    // Do not include students/recruiters/admins as mentors
    const isStudentOrRecruiter = role === 'student' || role === 'recruiter' || role === 'industry' || role === 'admin';
    if (isStudentOrRecruiter) return;

    const isMentor = 
      role === 'academician' || 
      role === 'faculty' || 
      role === 'mentor' || 
      u.isMentor === true ||
      designation.includes('academician') ||
      designation.includes('mentor') ||
      designation.includes('faculty') ||
      designation.includes('professor') ||
      designation.includes('teacher') ||
      designation.includes('head') ||
      Boolean(u.collegeName || u.institution || u.departmentName);

    if (!isMentor) return;

    const mId = u.id || u.uid;
    const mEmail = (u.email || '').toLowerCase().trim();
    const dedupeKey = mEmail || mId;
    if (!dedupeKey || candidateSeen.has(dedupeKey)) return;

    candidateSeen.add(dedupeKey);

    const mentorObj = {
      id: mId,
      uid: mId,
      ...u,
      name: u.name || u.fullName || (mEmail ? mEmail.split('@')[0] : 'Faculty Mentor'),
      email: u.email || '',
      collegeId: u.collegeId || u.institutionId || '',
      collegeName: u.collegeName || u.institution || '',
      departmentId: u.departmentId || u.deptId || '',
      departmentName: u.departmentName || u.department || u.deptName || '',
      designation: u.designation || 'Faculty Academician & Mentor'
    };

    candidatePool.push(mentorObj);
  };

  // Source A: Firestore public_mentors collection (accessible to unauthenticated /register page)
  if (isLiveFirebaseConfigured && db) {
    try {
      const publicSnap = await getDocs(collection(db, 'public_mentors'));
      publicSnap.forEach(docSnap => {
        addCandidate({ id: docSnap.id, uid: docSnap.id, ...docSnap.data() });
      });
    } catch (err) {
      console.warn("Firestore public_mentors fetch warning:", err.message);
    }

    // Source B: Firestore users collection
    try {
      const snap = await getDocs(collection(db, 'users'));
      snap.forEach(docSnap => {
        addCandidate({ id: docSnap.id, uid: docSnap.id, ...docSnap.data() });
      });
    } catch (err) {
      console.warn("Firestore users fetch warning:", err.message);
    }
  }

  // Source C: Persistent localStorage registered mentors
  try {
    if (typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem('nexthire_registered_mentors');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          parsed.forEach(addCandidate);
        }
      }

      // Source D: Active user if mentor
      const activeUser = localStorage.getItem('nexthire_active_user');
      if (activeUser) {
        addCandidate(JSON.parse(activeUser));
      }
    }
  } catch (e) {
    console.warn("localStorage mentor pool read error:", e);
  }

  // Source E: Built-in mock mentors
  if (typeof MOCK_USERS === 'object' && MOCK_USERS) {
    Object.values(MOCK_USERS).forEach(addCandidate);
  }

  // Helper to extract clean tokens from college/department identifiers
  const extractTokens = (str) => {
    if (!str) return '';
    return String(str)
      .toLowerCase()
      .replace(/col_mh_/g, '')
      .replace(/col_/g, '')
      .replace(/[0-9]/g, '')
      .replace(/[^a-z]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  };

  const targetColTokens = extractTokens(`${collegeName} ${collegeId}`);
  const targetDeptTokens = extractTokens(`${departmentName} ${departmentId}`);

  const matchedMentors = [];
  const collegeOnlyMentors = [];
  const seenMentors = new Set();

  for (const mentor of candidatePool) {
    const mentorColTokens = extractTokens(`${mentor.collegeName} ${mentor.institution} ${mentor.collegeId}`);
    const mentorDeptTokens = extractTokens(`${mentor.departmentName} ${mentor.department} ${mentor.departmentId}`);

    // 1. College Matching
    let collegeMatches = false;

    if (!collegeId && !collegeName) {
      collegeMatches = true;
    } else if (targetColTokens && mentorColTokens) {
      if (targetColTokens.includes(mentorColTokens) || mentorColTokens.includes(targetColTokens)) {
        collegeMatches = true;
      } else {
        const normKeyTarget = normalizeKey(collegeName || collegeId);
        const normKeyMentor = normalizeKey(mentor.collegeName || mentor.institution || mentor.collegeId);
        if (normKeyTarget && normKeyMentor && (normKeyTarget.includes(normKeyMentor) || normKeyMentor.includes(normKeyTarget))) {
          collegeMatches = true;
        } else {
          const stopwords = ['college', 'institute', 'university', 'technology', 'engineering', 'autonomous', 'deemed', 'maharashtra', 'of', 'and', 'the', 'for', 'shri', 'dr', 'prof'];
          const tWords = targetColTokens.split(' ').filter(w => w.length >= 3 && !stopwords.includes(w));
          const mWords = mentorColTokens.split(' ').filter(w => w.length >= 3 && !stopwords.includes(w));
          collegeMatches = tWords.some(w => mWords.includes(w));
        }
      }
    }

    if (!collegeMatches) continue;

    const mentorKey = mentor.email || mentor.id;
    if (!seenMentors.has(mentorKey)) {
      seenMentors.add(mentorKey);
      collegeOnlyMentors.push(mentor);
    }

    // 2. Department Matching
    let deptMatches = false;
    if (!departmentId && !departmentName) {
      deptMatches = true;
    } else if (targetDeptTokens && mentorDeptTokens) {
      if (targetDeptTokens.includes(mentorDeptTokens) || mentorDeptTokens.includes(targetDeptTokens)) {
        deptMatches = true;
      } else {
        const disciplineGroups = [
          ['computer', 'cse', 'cs', 'computing', 'software', 'bca', 'mca'],
          ['information technology', 'it', 'infotech'],
          ['data science', 'artificial intelligence', 'aiml', 'ai', 'aids', 'machine learning'],
          ['cyber security', 'digital forensics', 'cyber'],
          ['mechanical', 'mech', 'me', 'automobile', 'automation', 'robotics'],
          ['electrical', 'ee', 'eee'],
          ['electronics', 'telecommunication', 'extc', 'ece', 'etc', 'entc', 'instrumentation'],
          ['civil', 'ce', 'infrastructure'],
          ['chemical', 'biotechnology', 'biotech', 'bioinformatics'],
          ['commerce', 'bcom', 'b.com', 'baf', 'bbi', 'bfm', 'management', 'bms', 'bba', 'mba', 'mms'],
          ['arts', 'humanities', 'literature', 'economics', 'psychology', 'journalism', 'political', 'sociology'],
          ['science', 'mathematics', 'physics', 'chemistry', 'biology', 'microbiology']
        ];

        const matchKeyword = (text, kw) => {
          if (kw.length <= 3) {
            const regex = new RegExp(`\\b${kw}\\b`, 'i');
            return regex.test(text);
          }
          return text.includes(kw);
        };

        deptMatches = disciplineGroups.some(group => 
          group.some(kw => matchKeyword(mentorDeptTokens, kw)) && group.some(kw => matchKeyword(targetDeptTokens, kw))
        );
      }
    }

    if (deptMatches) {
      matchedMentors.push(mentor);
    }
  }

  // Return mentors that strictly match BOTH selected college AND selected department
  return matchedMentors;
}

// Students assigned to Mentor (strictly match only assigned students for this mentor)
export async function fetchStudentsForMentorFromFirestore(mentor) {
  if (!isLiveFirebaseConfigured || !db) return [];
  if (!mentor) return [];

  // Support both mentor object (currentUser) and raw ID string
  const mentorId = typeof mentor === 'string' ? mentor.trim() : (mentor.id || mentor.uid || '').trim();
  const mentorEmail = typeof mentor === 'object' ? (mentor.email || '').toLowerCase().trim() : '';
  const mentorName = typeof mentor === 'object' ? (mentor.name || '').toLowerCase().trim() : '';

  // If no identifying info is provided, return empty
  if (!mentorId && !mentorEmail && !mentorName) return [];

  try {
    const q = query(
      collection(db, 'users'),
      where('role', '==', 'student')
    );
    const snap = await getDocs(q);
    const students = [];
    const seen = new Set();

    snap.forEach(docSnap => {
      const data = docSnap.data();
      const sEmail = (data.email || '').toLowerCase().trim();
      const sName = (data.name || '').toLowerCase().trim();
      const key = sEmail || (sName && sName !== 'student name' ? sName : docSnap.id);

      const studentMentorId = data.mentorId ? String(data.mentorId).trim() : '';
      const studentMentorEmail = (data.mentorEmail || '').toLowerCase().trim();
      const studentMentorName = (data.mentorName || '').toLowerCase().trim();

      // Check if student is explicitly assigned to THIS mentor
      const matchesId = mentorId && studentMentorId && studentMentorId === mentorId;
      const matchesEmail = mentorEmail && studentMentorEmail && studentMentorEmail === mentorEmail;
      const matchesName = mentorName && studentMentorName && studentMentorName === mentorName;

      const isAssigned = Boolean(matchesId || matchesEmail || matchesName);

      if (isAssigned && !seen.has(key)) {
        seen.add(key);
        students.push({ id: docSnap.id, ...data });
      }
    });
    return students;
  } catch (err) {
    console.error("Firestore fetchStudentsForMentor error:", err);
    return [];
  }
}

/**
 * 7. SEED FIRESTORE DATA
 * Populates real Firestore with sample collections (Colleges, Departments, Users, Jobs, Applications, Courses, Projects) in 1 click!
 */
export async function seedFirestoreData() {
  if (!isLiveFirebaseConfigured || !db) {
    throw new Error("Live Firebase is not configured. Please supply valid VITE_FIREBASE_* credentials.");
  }

  // Seed Colleges
  for (const col of MOCK_COLLEGES) {
    await setDoc(doc(db, 'colleges', col.id), col, { merge: true });
  }

  // Seed Departments
  for (const dept of MOCK_DEPARTMENTS) {
    await setDoc(doc(db, 'departments', dept.id), dept, { merge: true });
  }

  // Seed Users
  for (const key of Object.keys(MOCK_USERS)) {
    const user = MOCK_USERS[key];
    await setDoc(doc(db, 'users', user.id), user, { merge: true });
  }

  // Seed Jobs
  for (const job of MOCK_JOBS) {
    await setDoc(doc(db, 'jobs', job.id), job, { merge: true });
  }

  // Seed Applications
  for (const appItem of MOCK_APPLICATIONS) {
    await setDoc(doc(db, 'applications', appItem.id), appItem, { merge: true });
  }

  // Seed Courses
  for (const course of MOCK_COURSES) {
    await setDoc(doc(db, 'courses', course.id), course, { merge: true });
  }

  // Seed Projects
  for (const proj of MOCK_PROJECTS) {
    await setDoc(doc(db, 'projects', proj.id), proj, { merge: true });
  }

  return true;
}

export {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  collection,

  doc,
  getDoc,
  setDoc,
  getDocs,
  query,
  where,
  addDoc,
  updateDoc,
  onSnapshot
};


