import React, { useState, useEffect, useRef } from 'react';
import { Plus, X, Sparkles, Check, ChevronDown } from 'lucide-react';

// Comprehensive Dictionary of Modern Tech, Engineering, AI & Software Skills
export const POPULAR_SKILLS_DIRECTORY = [
  "React.js",
  "React Native",
  "Node.js",
  "Express.js",
  "Next.js",
  "Vue.js",
  "Angular",
  "TypeScript",
  "JavaScript",
  "Python",
  "PyTorch",
  "TensorFlow",
  "Scikit-Learn",
  "Pandas",
  "NumPy",
  "Java",
  "Spring Boot",
  "C++",
  "C#",
  ".NET Core",
  "Go (Golang)",
  "Rust",
  "PHP",
  "Laravel",
  "Swift",
  "Kotlin",
  "SQL",
  "PostgreSQL",
  "MySQL",
  "MongoDB",
  "Redis",
  "GraphQL",
  "REST APIs",
  "Docker",
  "Kubernetes",
  "Amazon Web Services (AWS)",
  "Google Cloud Platform (GCP)",
  "Microsoft Azure",
  "DevOps & CI/CD",
  "Git & GitHub",
  "Linux & Shell Scripting",
  "Tailwind CSS",
  "Bootstrap",
  "HTML5 & CSS3",
  "System Design & Scalability",
  "Microservices Architecture",
  "Data Structures & Algorithms",
  "Machine Learning",
  "Deep Learning",
  "Natural Language Processing (NLP)",
  "Computer Vision",
  "Artificial Intelligence",
  "Large Language Models (LLMs)",
  "Vector Databases & RAG",
  "Cybersecurity & Ethical Hacking",
  "UI/UX Design",
  "Figma",
  "Flutter",
  "Android Development",
  "iOS Development",
  "Data Engineering",
  "Apache Spark",
  "Hadoop",
  "Tableau & Power BI",
  "Blockchain & Solidity",
  "Software Testing & Jest",
  "Agile & Scrum Methodologies"
];

// Top Trending Quick-Add Skill Suggestions
const TRENDING_RECOMMENDATIONS = [
  "Python", "React.js", "PyTorch", "Docker", "Node.js", 
  "System Design", "SQL", "TypeScript", "AWS", "Kubernetes"
];

export default function SkillInputWithSuggestions({ 
  skills = [], 
  onAddSkill, 
  onRemoveSkill,
  placeholder = "Type a skill (e.g. PyTorch, React, Docker) & press Enter...",
  accentColor = "blue" // 'blue' | 'purple' | 'emerald'
}) {
  const [inputValue, setInputValue] = useState('');
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  // Accent styling helpers for light blue/white theme
  const accentClasses = {
    blue: {
      border: 'focus:border-blue-600',
      badgeBg: 'bg-blue-50 text-blue-800 border-blue-200',
      buttonBg: 'bg-blue-600 hover:bg-blue-700',
      activeItem: 'bg-blue-50 text-blue-900 font-bold',
      ring: 'focus:ring-blue-500/20'
    },
    purple: {
      border: 'focus:border-purple-600',
      badgeBg: 'bg-purple-50 text-purple-800 border-purple-200',
      buttonBg: 'bg-purple-600 hover:bg-purple-700',
      activeItem: 'bg-purple-50 text-purple-900 font-bold',
      ring: 'focus:ring-purple-500/20'
    },
    emerald: {
      border: 'focus:border-emerald-600',
      badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      buttonBg: 'bg-emerald-600 hover:bg-emerald-700',
      activeItem: 'bg-emerald-50 text-emerald-900 font-bold',
      ring: 'focus:ring-emerald-500/20'
    }
  }[accentColor] || {
    border: 'focus:border-blue-600',
    badgeBg: 'bg-blue-50 text-blue-800 border-blue-200',
    buttonBg: 'bg-blue-600 hover:bg-blue-700',
    activeItem: 'bg-blue-50 text-blue-900 font-bold',
    ring: 'focus:ring-blue-500/20'
  };

  // Filter dictionary based on input value
  useEffect(() => {
    const query = inputValue.trim().toLowerCase();
    if (!query) {
      setFilteredSuggestions([]);
      setIsOpen(false);
      setSelectedIndex(-1);
      return;
    }

    const currentSkillsLower = new Set(skills.map(s => s.toLowerCase()));
    
    // Priority 1: Starts with query
    const startsWithMatches = POPULAR_SKILLS_DIRECTORY.filter(s => 
      s.toLowerCase().startsWith(query) && !currentSkillsLower.has(s.toLowerCase())
    );
    
    // Priority 2: Contains query
    const containsMatches = POPULAR_SKILLS_DIRECTORY.filter(s => 
      !s.toLowerCase().startsWith(query) && 
      s.toLowerCase().includes(query) && 
      !currentSkillsLower.has(s.toLowerCase())
    );

    const matches = [...startsWithMatches, ...containsMatches].slice(0, 8);
    setFilteredSuggestions(matches);
    setIsOpen(matches.length > 0);
    setSelectedIndex(-1);
  }, [inputValue, skills]);

  // Click Outside Listener
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectSkill = (skillToAdd) => {
    const cleanSkill = skillToAdd.trim();
    if (cleanSkill && !skills.some(s => s.toLowerCase() === cleanSkill.toLowerCase())) {
      onAddSkill(cleanSkill);
    }
    setInputValue('');
    setIsOpen(false);
    setSelectedIndex(-1);
    if (inputRef.current) inputRef.current.focus();
  };

  const handleKeyDown = (e) => {
    if (isOpen && filteredSuggestions.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev < filteredSuggestions.length - 1 ? prev + 1 : 0));
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : filteredSuggestions.length - 1));
        return;
      }
      if (e.key === 'Enter') {
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < filteredSuggestions.length) {
          handleSelectSkill(filteredSuggestions[selectedIndex]);
        } else if (inputValue.trim()) {
          handleSelectSkill(inputValue.trim());
        }
        return;
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
        return;
      }
    }

    if (e.key === 'Enter') {
      e.preventDefault();
      if (inputValue.trim()) {
        handleSelectSkill(inputValue.trim());
      }
    }
  };

  // Remaining quick recommendations
  const quickSuggestions = TRENDING_RECOMMENDATIONS.filter(
    rec => !skills.some(s => s.toLowerCase() === rec.toLowerCase())
  ).slice(0, 6);

  return (
    <div className="space-y-3 w-full" ref={dropdownRef}>
      
      {/* Input and Add Button Wrapper */}
      <div className="relative">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              ref={inputRef}
              type="text"
              placeholder={placeholder}
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => {
                if (inputValue.trim() && filteredSuggestions.length > 0) {
                  setIsOpen(true);
                }
              }}
              className={`w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white ${accentClasses.border} transition-all`}
            />
            {inputValue && (
              <button
                type="button"
                onClick={() => { setInputValue(''); setIsOpen(false); }}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => {
              if (selectedIndex >= 0 && selectedIndex < filteredSuggestions.length) {
                handleSelectSkill(filteredSuggestions[selectedIndex]);
              } else if (inputValue.trim()) {
                handleSelectSkill(inputValue.trim());
              }
            }}
            className={`px-4 py-2.5 rounded-xl ${accentClasses.buttonBg} text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-blue-500/20 transition-transform active:scale-95 shrink-0`}
          >
            <Plus className="w-4 h-4" /> Add Skill
          </button>
        </div>

        {/* Live Autocomplete Suggestions Overlay */}
        {isOpen && filteredSuggestions.length > 0 && (
          <div className="absolute left-0 right-0 top-full mt-1.5 z-50 bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden py-1.5 animate-in fade-in slide-in-from-top-1">
            <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-500" />
                Matching Skill Suggestions
              </span>
              <span className="text-[9px] text-slate-400">Press Enter ↵ or Click to Select</span>
            </div>

            <ul className="max-h-56 overflow-y-auto divide-y divide-slate-100">
              {filteredSuggestions.map((suggestion, idx) => {
                const isSelected = idx === selectedIndex;
                return (
                  <li
                    key={suggestion}
                    onClick={() => handleSelectSkill(suggestion)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`px-4 py-2.5 text-xs font-semibold cursor-pointer flex items-center justify-between transition-colors ${
                      isSelected 
                        ? `${accentClasses.activeItem} pl-5` 
                        : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-blue-600' : 'bg-slate-300'}`} />
                      {suggestion}
                    </span>
                    {isSelected && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                        Press Enter ↵
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>

      {/* Quick Click Recommendations Pills */}
      {quickSuggestions.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1 mr-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Suggested:
          </span>
          {quickSuggestions.map(rec => (
            <button
              key={rec}
              type="button"
              onClick={() => handleSelectSkill(rec)}
              className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 hover:border-blue-300 flex items-center gap-1 transition-all transform hover:-translate-y-0.5 font-medium"
            >
              <Plus className="w-3 h-3 text-slate-400" />
              <span>{rec}</span>
            </button>
          ))}
        </div>
      )}

      {/* Selected Skill Tags Display Chips */}
      <div className="flex flex-wrap gap-2 pt-2">
        {skills.length === 0 ? (
          <p className="text-xs text-slate-400 italic py-1">No skill tags added yet. Type above to add.</p>
        ) : (
          skills.map((skill, i) => (
            <span
              key={i}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border ${accentClasses.badgeBg} shadow-xs group transition-all`}
            >
              <span>{skill}</span>
              <button
                type="button"
                onClick={() => onRemoveSkill(skill)}
                className="text-slate-400 hover:text-red-600 p-0.5 rounded-md hover:bg-slate-100 transition-colors"
                title={`Remove ${skill}`}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          ))
        )}
      </div>

    </div>
  );
}
