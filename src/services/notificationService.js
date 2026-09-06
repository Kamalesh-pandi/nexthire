// Comprehensive Live Notification Helper Service for NextHire
import { fetchApplicationsFromFirestore } from './firebase';

const NOTIFICATIONS_STORAGE_KEY = 'nexthire_live_notifications';

// Helper to get raw stored custom notifications from localStorage
export function getStoredNotifications() {
  try {
    if (typeof localStorage === 'undefined') return [];
    const data = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.warn("Failed to read live notifications from localStorage:", e);
    return [];
  }
}

// Helper to save raw notifications to localStorage
export function saveStoredNotifications(notifications) {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(notifications));
      // Dispatch custom DOM event for instant cross-component UI reactivity
      window.dispatchEvent(new Event('nexthire-notification-updated'));
    }
  } catch (e) {
    console.warn("Failed to save live notifications to localStorage:", e);
  }
}

/**
 * Add a new real-time notification
 */
export function addNotification({ userId, userEmail, title, message, type = 'info', link = '' }) {
  const existing = getStoredNotifications();
  const newNotif = {
    id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    userId: userId || 'all',
    userEmail: userEmail ? userEmail.toLowerCase().trim() : '',
    title,
    message,
    type, // 'shortlisted' | 'applied' | 'ats' | 'mentor' | 'info'
    read: false,
    link,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', ' + new Date().toLocaleDateString([], { month: 'short', day: 'numeric' })
  };

  const updated = [newNotif, ...existing];
  saveStoredNotifications(updated);
  return newNotif;
}

/**
 * Fetch and synthesize all live notifications for the current user
 */
export async function getLiveNotificationsForUser(currentUser) {
  if (!currentUser) return [];

  const userId = currentUser.id || currentUser.uid;
  const userEmail = (currentUser.email || '').toLowerCase().trim();
  const role = currentUser.role || 'student';

  const storedNotifs = getStoredNotifications().filter(n => {
    if (!n) return false;
    if (n.userId === 'all') return true;
    if (n.userId && n.userId === userId) return true;
    if (n.userEmail && userEmail && n.userEmail === userEmail) return true;
    return false;
  });

  // Synthesize notifications directly from live applications in Firestore / Database
  const liveAppNotifs = [];

  try {
    if (role === 'student') {
      const apps = await fetchApplicationsFromFirestore({ userId });
      
      apps.forEach(app => {
        if (!app) return;
        const statusLower = (app.status || '').toLowerCase();
        
        if (statusLower === 'shortlisted') {
          liveAppNotifs.push({
            id: `app_notif_short_${app.id}`,
            userId,
            title: `🎉 Shortlisted: ${app.jobTitle}`,
            message: `Great news! ${app.companyName || 'Recruiter'} shortlisted your profile for ${app.jobTitle}. ${app.feedback ? `Feedback: "${app.feedback}"` : 'Invited for technical interview.'}`,
            type: 'shortlisted',
            read: false,
            timestamp: app.appliedAt || 'Recently',
            link: '/student/dashboard'
          });
        } else if (statusLower === 'accepted' || statusLower === 'hired') {
          liveAppNotifs.push({
            id: `app_notif_acc_${app.id}`,
            userId,
            title: `🌟 Offer Accepted: ${app.jobTitle}`,
            message: `Congratulations! ${app.companyName} accepted your application for ${app.jobTitle}.`,
            type: 'shortlisted',
            read: false,
            timestamp: app.appliedAt || 'Recently',
            link: '/student/dashboard'
          });
        } else if (statusLower === 'applied') {
          liveAppNotifs.push({
            id: `app_notif_app_${app.id}`,
            userId,
            title: `📩 Application Submitted: ${app.jobTitle}`,
            message: `Your application to ${app.companyName} is active with ${app.matchPercentage || 85}% ATS match.`,
            type: 'applied',
            read: true,
            timestamp: app.appliedAt || 'Recently',
            link: '/student/dashboard'
          });
        }
      });
    } else if (role === 'recruiter' || role === 'industry') {
      const apps = await fetchApplicationsFromFirestore();
      apps.forEach(app => {
        if (!app) return;
        liveAppNotifs.push({
          id: `rec_notif_${app.id}`,
          userId,
          title: `📄 New Applicant: ${app.userName || 'Candidate'}`,
          message: `Applied for ${app.jobTitle} with ${app.matchPercentage || 80}% ATS match score.`,
          type: 'applicant',
          read: false,
          timestamp: app.appliedAt || 'Recently',
          link: '/industry/applicants'
        });
      });
    }
  } catch (err) {
    console.warn("Failed fetching live app notifications:", err);
  }

  // Merge stored custom notifications with synthesized live application notifications (avoiding duplicate IDs)
  const combinedMap = new Map();

  storedNotifs.forEach(n => combinedMap.set(n.id, n));
  liveAppNotifs.forEach(n => {
    if (!combinedMap.has(n.id)) {
      combinedMap.set(n.id, n);
    }
  });

  return Array.from(combinedMap.values());
}

/**
 * Mark all notifications as read for current user
 */
export function markAllUserNotificationsRead(currentUser) {
  const userId = currentUser?.id || currentUser?.uid;
  const userEmail = (currentUser?.email || '').toLowerCase().trim();

  const all = getStoredNotifications();
  const updated = all.map(n => {
    if (n.userId === 'all' || (userId && n.userId === userId) || (userEmail && n.userEmail === userEmail)) {
      return { ...n, read: true };
    }
    return n;
  });

  saveStoredNotifications(updated);
}

/**
 * Clear a specific notification by ID
 */
export function removeNotificationById(id) {
  const all = getStoredNotifications();
  const updated = all.filter(n => n.id !== id);
  saveStoredNotifications(updated);
}
