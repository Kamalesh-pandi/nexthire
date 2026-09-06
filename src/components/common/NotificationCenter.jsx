import React, { useState } from 'react';
import { Bell, CheckCircle2, AlertCircle, X, Sparkles } from 'lucide-react';
import { MOCK_NOTIFICATIONS } from '../../services/mockData';

export default function NotificationCenter({ onClose }) {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div className="absolute right-0 mt-2 w-80 sm:w-96 glass-panel rounded-2xl shadow-2xl p-4 border border-slate-700/80 z-50 animate-in fade-in slide-in-from-top-2">
      <div className="flex items-center justify-between pb-3 border-b border-slate-700/60">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-blue-400" />
          <span className="font-semibold text-sm text-slate-100">Live Notifications</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-blue-500/20 text-blue-400 font-bold">
            {notifications.filter(n => !n.read).length} New
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={markAllRead} 
            className="text-[11px] text-blue-400 hover:underline"
          >
            Mark read
          </button>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="divide-y divide-slate-800 max-h-80 overflow-y-auto mt-2">
        {notifications.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-6">No new notifications</p>
        ) : (
          notifications.map(n => (
            <div 
              key={n.id} 
              className={`py-3 px-2 flex items-start justify-between gap-3 transition-colors ${
                !n.read ? 'bg-blue-950/20 rounded-xl' : ''
              }`}
            >
              <div className="flex items-start gap-2.5">
                {n.title.includes('Shortlisted') ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <Sparkles className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                )}
                <div>
                  <h4 className="text-xs font-semibold text-slate-200">{n.title}</h4>
                  <p className="text-[11px] text-slate-400 leading-snug mt-0.5">{n.message}</p>
                  <span className="text-[10px] text-slate-500 mt-1 block">{n.timestamp}</span>
                </div>
              </div>

              <button 
                onClick={() => removeNotification(n.id)}
                className="text-slate-500 hover:text-slate-300"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
