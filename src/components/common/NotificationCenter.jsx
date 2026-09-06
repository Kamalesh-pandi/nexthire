import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, CheckCircle2, AlertCircle, X, Sparkles, UserCheck, Briefcase, Award } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getLiveNotificationsForUser, markAllUserNotificationsRead, removeNotificationById } from '../../services/notificationService';

export default function NotificationCenter({ onClose }) {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadNotifications = async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      const liveNotifs = await getLiveNotificationsForUser(currentUser);
      setNotifications(liveNotifs);
    } catch (err) {
      console.error("Error loading live notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();

    const handleUpdate = () => {
      loadNotifications();
    };

    window.addEventListener('nexthire-notification-updated', handleUpdate);
    return () => {
      window.removeEventListener('nexthire-notification-updated', handleUpdate);
    };
  }, [currentUser]);

  const handleMarkAllRead = () => {
    markAllUserNotificationsRead(currentUser);
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleRemove = (e, id) => {
    e.stopPropagation();
    removeNotificationById(id);
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleItemClick = (n) => {
    if (n.link) {
      navigate(n.link);
      if (onClose) onClose();
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl p-4 border border-slate-200 z-50 animate-in fade-in slide-in-from-top-2">
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-blue-600" />
          <span className="font-bold text-sm text-slate-900">Live Notifications</span>
          {unreadCount > 0 && (
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-blue-50 text-blue-700 font-extrabold border border-blue-200 animate-pulse">
              {unreadCount} New
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button 
              onClick={handleMarkAllRead} 
              className="text-[11px] text-blue-600 font-bold hover:underline"
            >
              Mark read
            </button>
          )}
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto mt-2 space-y-1">
        {loading ? (
          <div className="py-8 text-center text-xs text-slate-400 font-semibold flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-600 animate-spin" /> Loading real-time notifications...
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-8">
            <Bell className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-xs text-slate-500 font-bold">No new notifications</p>
            <p className="text-[11px] text-slate-400 mt-1">Application updates and shortlisting alerts will appear here live.</p>
          </div>
        ) : (
          notifications.map(n => {
            const isShortlisted = (n.type === 'shortlisted' || (n.title && n.title.includes('Shortlisted')));
            const isApplied = (n.type === 'applied' || (n.title && n.title.includes('Submitted')));

            return (
              <div 
                key={n.id} 
                onClick={() => handleItemClick(n)}
                className={`py-3 px-3 rounded-xl flex items-start justify-between gap-3 transition-colors cursor-pointer hover:bg-slate-50 ${
                  !n.read ? 'bg-blue-50/70 border border-blue-100' : 'bg-white'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 shrink-0">
                    {isShortlisted ? (
                      <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      </div>
                    ) : isApplied ? (
                      <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                        <Briefcase className="w-4 h-4 text-blue-600" />
                      </div>
                    ) : (
                      <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                        <Sparkles className="w-4 h-4 text-indigo-600" />
                      </div>
                    )}
                  </div>

                  <div>
                    <h4 className="text-xs font-extrabold text-slate-900">{n.title}</h4>
                    <p className="text-[11px] text-slate-600 leading-snug mt-0.5 font-medium">{n.message}</p>
                    <span className="text-[10px] text-slate-400 mt-1 block font-semibold">{n.timestamp}</span>
                  </div>
                </div>

                <button 
                  onClick={(e) => handleRemove(e, n.id)}
                  className="text-slate-400 hover:text-slate-600 p-1 shrink-0"
                  title="Remove notification"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
