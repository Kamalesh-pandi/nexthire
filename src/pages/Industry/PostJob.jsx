import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusSquare, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { createJobInFirestore } from '../../services/firebase';
import SkillInputWithSuggestions from '../../components/common/SkillInputWithSuggestions';

export default function PostJob() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

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

    await createJobInFirestore(newJobObj);
    navigate('/industry/dashboard');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-16">
      
      <div>
        <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
          Recruiter Creation Portal
        </span>
        <h1 className="text-2xl font-extrabold text-slate-900 mt-1">Post Job or Internship Opportunity</h1>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Role Title</label>
              <input
                type="text"
                required
                placeholder="e.g. AI / ML Engineering Intern"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-600 transition-colors"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Opportunity Type</label>
              <select
                value={formData.type}
                onChange={e => setFormData({ ...formData, type: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-blue-600 transition-colors"
              >
                <option value="Internship">Internship</option>
                <option value="Full-Time">Full-Time (SDE)</option>
                <option value="Part-Time Project">Part-Time Project</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Stipend / CTC</label>
              <input
                type="text"
                required
                placeholder="e.g. ₹35,000 / month"
                value={formData.stipend}
                onChange={e => setFormData({ ...formData, stipend: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-blue-600 transition-colors"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Location</label>
              <input
                type="text"
                placeholder="Bengaluru / Remote"
                value={formData.location}
                onChange={e => setFormData({ ...formData, location: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-blue-600 transition-colors"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Application Deadline</label>
              <input
                type="date"
                value={formData.deadline}
                onChange={e => setFormData({ ...formData, deadline: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-blue-600 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Required Skills (AI Match Tagging)</label>
            <SkillInputWithSuggestions
              skills={skillsRequired}
              onAddSkill={handleAddSkill}
              onRemoveSkill={handleRemoveSkill}
              placeholder="Type required skill (e.g. PyTorch, Docker) for suggestions..."
              accentColor="blue"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Job Description</label>
            <textarea
              rows={4}
              required
              placeholder="Outline project expectations, key responsibilities, and team workflow..."
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-600 transition-colors"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              type="submit"
              className="px-8 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" /> Publish Opportunity
            </button>
          </div>

        </form>
      </div>

    </div>
  );
}
