import React, { useState } from 'react';
import { X, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { createJobInFirestore } from '../../services/firebase';
import SkillInputWithSuggestions from '../common/SkillInputWithSuggestions';

export default function JobPostModal({ isOpen, onClose, onJobCreated }) {
  const { currentUser } = useAuth();
  
  const [formData, setFormData] = useState({
    title: '',
    type: 'Internship',
    stipend: '',
    duration: '6 Months',
    location: 'Remote',
    deadline: '',
    description: ''
  });

  const [skillsRequired, setSkillsRequired] = useState(['React.js', 'Python', 'Machine Learning']);

  if (!isOpen) return null;

  const handleAddSkill = (skillToAdd) => {
    if (skillToAdd && !skillsRequired.some(s => s.toLowerCase() === skillToAdd.toLowerCase())) {
      setSkillsRequired([...skillsRequired, skillToAdd]);
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkillsRequired(skillsRequired.filter(s => s !== skillToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.stipend) return;

    const newJobObj = {
      title: formData.title,
      companyId: currentUser?.id || 'rec_001',
      companyName: currentUser?.companyName || 'NexusTech AI Solutions',
      location: formData.location || 'Remote',
      type: formData.type,
      stipend: formData.stipend,
      duration: formData.duration,
      deadline: formData.deadline || '2026-10-30',
      description: formData.description,
      skillsRequired,
      applicantsCount: 0,
      createdAt: new Date().toISOString().split('T')[0]
    };

    const savedJob = await createJobInFirestore(newJobObj);
    onJobCreated(savedJob);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="w-full max-w-2xl glass-panel rounded-3xl border border-slate-700/80 shadow-2xl p-6 sm:p-8 space-y-6 my-8 animate-in fade-in zoom-in-95">
        
        <div className="flex items-center justify-between pb-4 border-b border-slate-700/60">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
              Recruiter Portal
            </span>
            <h2 className="text-xl font-extrabold text-slate-100 mt-1">Post New Opportunity</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">Opportunity Title</label>
              <input
                type="text"
                required
                placeholder="e.g. AI / ML Engineering Intern"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">Role Type</label>
              <select
                value={formData.type}
                onChange={e => setFormData({ ...formData, type: e.target.value })}
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
              >
                <option value="Internship">Internship</option>
                <option value="Full-Time">Full-Time (SDE)</option>
                <option value="Part-Time Project">Part-Time Project</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">Stipend / CTC</label>
              <input
                type="text"
                required
                placeholder="e.g. ₹35,000 / month"
                value={formData.stipend}
                onChange={e => setFormData({ ...formData, stipend: e.target.value })}
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">Location</label>
              <input
                type="text"
                placeholder="e.g. Bengaluru / Remote"
                value={formData.location}
                onChange={e => setFormData({ ...formData, location: e.target.value })}
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">Application Deadline</label>
              <input
                type="date"
                value={formData.deadline}
                onChange={e => setFormData({ ...formData, deadline: e.target.value })}
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          {/* Skill Tag Adder */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              Required Technical Skills (Used for AI Ranking)
            </label>
            <SkillInputWithSuggestions
              skills={skillsRequired}
              onAddSkill={handleAddSkill}
              onRemoveSkill={handleRemoveSkill}
              placeholder="Type required skill for suggestions..."
              accentColor="purple"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">Job / Internship Description</label>
            <textarea
              rows={4}
              required
              placeholder="Outline responsibilities, key projects, and eligibility requirements..."
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-700/60">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-purple-500/25 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" /> Publish Post
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
