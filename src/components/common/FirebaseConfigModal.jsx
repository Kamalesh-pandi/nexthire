import React, { useState } from 'react';
import { X, Database, ShieldCheck, CheckCircle2, AlertCircle, RefreshCw, Sparkles, Key, ExternalLink } from 'lucide-react';
import { isLiveFirebaseConfigured, seedFirestoreData } from '../../services/firebase';

export default function FirebaseConfigModal({ isOpen, onClose }) {
  const [seeding, setSeeding] = useState(false);
  const [seedStatus, setSeedStatus] = useState(null);
  
  const initialConfig = JSON.parse(localStorage.getItem('nexthire_firebase_config') || '{}');
  const [apiKey, setApiKey] = useState(initialConfig.apiKey || import.meta.env.VITE_FIREBASE_API_KEY || '');
  const [projectId, setProjectId] = useState(initialConfig.projectId || import.meta.env.VITE_FIREBASE_PROJECT_ID || '');
  const [authDomain, setAuthDomain] = useState(initialConfig.authDomain || import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '');
  const [storageBucket, setStorageBucket] = useState(initialConfig.storageBucket || import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSaveCredentials = (e) => {
    e.preventDefault();
    const configObj = {
      apiKey,
      projectId,
      authDomain: authDomain || `${projectId}.firebaseapp.com`,
      storageBucket: storageBucket || `${projectId}.appspot.com`
    };
    localStorage.setItem('nexthire_firebase_config', JSON.stringify(configObj));
    setSavedSuccess(true);
    setTimeout(() => {
      window.location.reload();
    }, 1200);
  };

  const handleSeedDatabase = async () => {
    setSeeding(true);
    setSeedStatus(null);
    try {
      await seedFirestoreData();
      setSeedStatus({ success: true, message: "Firestore database successfully seeded with collections: users, jobs, applications, courses, projects!" });
    } catch (err) {
      setSeedStatus({ success: false, message: err.message || "Failed to seed Firestore. Verify your Firebase config & security rules." });
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="w-full max-w-xl glass-panel rounded-3xl border border-slate-700/80 shadow-2xl p-6 sm:p-8 space-y-6 my-8 animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-700/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-100">Firebase BaaS Connection</h2>
              <p className="text-xs text-slate-400">Manage real-time Firestore database & Auth credentials</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Status Indicator */}
        <div className={`p-4 rounded-2xl border flex items-center justify-between ${
          isLiveFirebaseConfigured
            ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
            : 'bg-amber-950/20 border-amber-500/30 text-amber-300'
        }`}>
          <div className="flex items-center gap-3">
            {isLiveFirebaseConfigured ? (
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
            ) : (
              <AlertCircle className="w-6 h-6 text-amber-400" />
            )}
            <div>
              <h4 className="text-xs font-bold text-slate-100">
                {isLiveFirebaseConfigured ? 'Live Firebase Backend Connected' : 'Running in Offline / Interactive Demo Mode'}
              </h4>
              <p className="text-[11px] text-slate-400">
                {isLiveFirebaseConfigured 
                  ? `Connected to Firestore Project: ${projectId || 'Live Project'}`
                  : 'You can test the platform immediately in demo mode, or add your Firebase keys below.'}
              </p>
            </div>
          </div>
        </div>

        {/* Seed Database Button */}
        {isLiveFirebaseConfigured && (
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-indigo-400" /> Seed Firestore Database
              </span>
              <button
                onClick={handleSeedDatabase}
                disabled={seeding}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-500/20 flex items-center gap-1.5 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${seeding ? 'animate-spin' : ''}`} />
                <span>Seed Collections</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-400">
              Populates your Firestore project with sample data collections: <code className="text-indigo-300">users</code>, <code className="text-indigo-300">jobs</code>, <code className="text-indigo-300">applications</code>, <code className="text-indigo-300">courses</code>, <code className="text-indigo-300">projects</code>.
            </p>
            {seedStatus && (
              <div className={`p-2.5 rounded-xl text-xs font-semibold ${seedStatus.success ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'}`}>
                {seedStatus.message}
              </div>
            )}
          </div>
        )}

        {/* Form to enter Firebase Credentials */}
        <form onSubmit={handleSaveCredentials} className="space-y-4">
          <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
            <Key className="w-4 h-4 text-amber-400" /> Custom Firebase API Configuration
          </h4>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Firebase API Key (apiKey)</label>
            <input
              type="text"
              placeholder="AIzaSy..."
              value={apiKey}
              onChange={e => setApiKey(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Project ID (projectId)</label>
              <input
                type="text"
                placeholder="nexthire-sih26134"
                value={projectId}
                onChange={e => setProjectId(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Auth Domain (authDomain)</label>
              <input
                type="text"
                placeholder="nexthire-sih26134.firebaseapp.com"
                value={authDomain}
                onChange={e => setAuthDomain(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="flex justify-between items-center pt-3 border-t border-slate-700/60">
            <a
              href="https://console.firebase.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-amber-400 hover:underline flex items-center gap-1"
            >
              Open Firebase Console <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20"
            >
              {savedSuccess ? 'Saved! Reloading...' : 'Save & Connect Firebase'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
