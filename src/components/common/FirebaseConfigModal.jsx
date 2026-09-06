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
      authDomain: authDomain || `${projectId}.appdomain.com`,
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
      setSeedStatus({ success: true, message: "Cloud database successfully seeded with collections: users, jobs, applications, courses, projects!" });
    } catch (err) {
      setSeedStatus({ success: false, message: err.message || "Failed to seed database. Verify your cloud configuration & security rules." });
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="w-full max-w-xl bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-6 my-8 animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold border border-blue-200">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">Cloud BaaS Connection</h2>
              <p className="text-xs text-slate-500">Manage real-time cloud database & auth credentials</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Status Indicator */}
        <div className={`p-4 rounded-2xl border flex items-center justify-between ${
          isLiveFirebaseConfigured
            ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
            : 'bg-amber-50 border-amber-200 text-amber-800'
        }`}>
          <div className="flex items-center gap-3">
            {isLiveFirebaseConfigured ? (
              <ShieldCheck className="w-6 h-6 text-emerald-600" />
            ) : (
              <AlertCircle className="w-6 h-6 text-amber-600" />
            )}
            <div>
              <h4 className="text-xs font-bold text-slate-900">
                {isLiveFirebaseConfigured ? 'Live Cloud Backend Connected' : 'Running in Offline / Interactive Demo Mode'}
              </h4>
              <p className="text-[11px] text-slate-600">
                {isLiveFirebaseConfigured 
                  ? `Connected to Database Project: ${projectId || 'Live Project'}`
                  : 'You can test the platform immediately in demo mode, or add your Database keys below.'}
              </p>
            </div>
          </div>
        </div>

        {/* Seed Database Button */}
        {isLiveFirebaseConfigured && (
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-blue-600" /> Seed Cloud Database
              </span>
              <button
                onClick={handleSeedDatabase}
                disabled={seeding}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 flex items-center gap-1.5 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${seeding ? 'animate-spin' : ''}`} />
                <span>Seed Collections</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-600">
              Populates your cloud database with sample data collections: <code className="text-blue-700 font-semibold bg-blue-50 px-1 rounded">users</code>, <code className="text-blue-700 font-semibold bg-blue-50 px-1 rounded">jobs</code>, <code className="text-blue-700 font-semibold bg-blue-50 px-1 rounded">applications</code>, <code className="text-blue-700 font-semibold bg-blue-50 px-1 rounded">courses</code>, <code className="text-blue-700 font-semibold bg-blue-50 px-1 rounded">projects</code>.
            </p>
            {seedStatus && (
              <div className={`p-2.5 rounded-xl text-xs font-semibold ${seedStatus.success ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
                {seedStatus.message}
              </div>
            )}
          </div>
        )}

        {/* Form to enter Database Credentials */}
        <form onSubmit={handleSaveCredentials} className="space-y-4">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <Key className="w-4 h-4 text-amber-600" /> Custom Database API Configuration
          </h4>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Database API Key (apiKey)</label>
            <input
              type="text"
              placeholder="AIzaSy..."
              value={apiKey}
              onChange={e => setApiKey(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-600 transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Project ID (projectId)</label>
              <input
                type="text"
                placeholder="nexthire-sih26134"
                value={projectId}
                onChange={e => setProjectId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-600 transition-colors"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Auth Domain (authDomain)</label>
              <input
                type="text"
                placeholder="nexthire-sih26134.cloud.com"
                value={authDomain}
                onChange={e => setAuthDomain(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-600 transition-colors"
              />
            </div>
          </div>

          <div className="flex justify-between items-center pt-3 border-t border-slate-200">
            <a
              href="https://console.cloud.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-600 hover:text-blue-700 font-semibold hover:underline flex items-center gap-1"
            >
              Open Database Console <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20"
            >
              {savedSuccess ? 'Saved! Reloading...' : 'Save & Connect Database'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
