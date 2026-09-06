import React, { useState } from 'react';
import { X, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { createProjectInFirestore } from '../../services/firebase';
import SkillInputWithSuggestions from '../common/SkillInputWithSuggestions';

export default function ProjectPostModal({ isOpen, onClose, onProjectCreated }) {
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    industryPartner: 'NexusTech AI Solutions',
    deadline: '',
    description: ''
  });
  const [requiredSkills, setRequiredSkills] = useState(['Python', 'PyTorch']);

  if (!isOpen) return null;

  const handleAddSkill = (skillToAdd) => {
    if (skillToAdd && !requiredSkills.some(s => s.toLowerCase() === skillToAdd.toLowerCase())) {
      setRequiredSkills([...requiredSkills, skillToAdd]);
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setRequiredSkills(requiredSkills.filter(s => s !== skillToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title) return;

    const newProject = {
      title: formData.title,
      academicianId: currentUser?.id || 'acad_001',
      academicianName: currentUser?.name || 'Prof. Rajesh Kumar',
      institution: currentUser?.institution || 'IIT Delhi',
      industryPartner: formData.industryPartner,
      description: formData.description,
      requiredSkills,
      deadline: formData.deadline || '2026-12-01',
      status: 'Open for Applications'
    };

    const savedProject = await createProjectInFirestore(newProject);
    onProjectCreated(savedProject);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="w-full max-w-xl glass-panel rounded-3xl border border-slate-700/80 shadow-2xl p-6 sm:p-8 space-y-6 my-8 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between pb-4 border-b border-slate-700/60">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Academic Portal
            </span>
            <h2 className="text-xl font-extrabold text-slate-100 mt-1">Post Industry Capstone Project</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Project Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Edge AI Inference for IoT Nodes"
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Industry Sponsor / Partner</label>
              <input
                type="text"
                placeholder="e.g. NexusTech AI Solutions"
                value={formData.industryPartner}
                onChange={e => setFormData({ ...formData, industryPartner: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Submission Deadline</label>
              <input
                type="date"
                value={formData.deadline}
                onChange={e => setFormData({ ...formData, deadline: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Required Prerequisites</label>
            <SkillInputWithSuggestions
              skills={requiredSkills}
              onAddSkill={handleAddSkill}
              onRemoveSkill={handleRemoveSkill}
              placeholder="Type required prerequisite for suggestions..."
              accentColor="emerald"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Project Description & Goals</label>
            <textarea
              rows={4}
              required
              placeholder="Outline project deliverables, academic mentor guidance, and industry outcome expectations..."
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
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
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-500/25 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" /> Publish Capstone
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
