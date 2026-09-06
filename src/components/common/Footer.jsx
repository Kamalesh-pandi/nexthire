import React from 'react';
import { Sparkles, Heart, Code2, Globe } from 'lucide-react';


export default function Footer() {
  return (
    <footer className="w-full border-t border-slate-800 bg-slate-950/80 py-8 px-4 sm:px-6 lg:px-8 mt-12 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-blue-600 flex items-center justify-center text-white">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <span className="font-bold text-slate-200 text-sm">NextHire AI</span>
          <span>• Smart India Hackathon Problem SIH26134</span>
        </div>

        <div className="flex items-center gap-1 text-slate-400">
          <span>Built with</span>
          <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 inline" />
          <span>using React, Gemini AI, Tailwind CSS & Firebase BaaS</span>
        </div>

        <div className="flex items-center space-x-4">
          <a href="#" className="hover:text-white transition-colors flex items-center gap-1">
            <Code2 className="w-4 h-4" /> Source Code
          </a>

          <a href="#" className="hover:text-white transition-colors flex items-center gap-1">
            <Globe className="w-4 h-4" /> SIH Portal
          </a>
        </div>

      </div>
    </footer>
  );
}
