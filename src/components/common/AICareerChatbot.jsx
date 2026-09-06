import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, X, Send, Bot, User, Minimize2, Maximize2, Key, Check, 
  Settings, RefreshCw, Copy, ExternalLink, Lightbulb, ChevronRight, Terminal
} from 'lucide-react';
import { getAICareerChatResponse, getGeminiApiKey, setGeminiApiKey, testGeminiApiKey } from '../../services/aiService';
import { useAuth } from '../../context/AuthContext';

/**
 * Intelligent Markdown Formatter Component
 * Renders headers, lists, code blocks, bold text, and copy-able code snippets
 */
function FormattedMessage({ text }) {
  const [copiedIndex, setCopiedIndex] = useState(null);

  const handleCopyCode = (codeText, idx) => {
    navigator.clipboard.writeText(codeText);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // Split text by code blocks
  const parts = text.split(/(```[\s\S]*?```)/g);

  return (
    <div className="space-y-2 text-xs leading-relaxed">
      {parts.map((part, partIdx) => {
        // Code Block
        if (part.startsWith('```') && part.endsWith('```')) {
          const firstLineEnd = part.indexOf('\n');
          const lang = part.substring(3, firstLineEnd).trim() || 'code';
          const code = part.substring(firstLineEnd + 1, part.length - 3).trim();

          return (
            <div key={partIdx} className="my-2.5 rounded-xl overflow-hidden border border-slate-700 bg-slate-900 font-mono text-[11px]">
              <div className="flex items-center justify-between px-3 py-1.5 bg-slate-950 border-b border-slate-800 text-slate-400">
                <span className="flex items-center gap-1.5 text-[10px] font-semibold uppercase text-blue-400">
                  <Terminal className="w-3 h-3" /> {lang}
                </span>
                <button
                  onClick={() => handleCopyCode(code, partIdx)}
                  className="flex items-center gap-1 px-1.5 py-0.5 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition-colors text-[10px]"
                >
                  {copiedIndex === partIdx ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="p-3 overflow-x-auto text-slate-200 leading-normal scrollbar-thin">
                <code>{code}</code>
              </pre>
            </div>
          );
        }

        // Regular Text & Markdown elements
        const lines = part.split('\n');
        return (
          <div key={partIdx} className="space-y-1.5">
            {lines.map((line, lineIdx) => {
              const trimmed = line.trim();

              if (!trimmed) return <div key={lineIdx} className="h-1" />;

              // Header 3
              if (trimmed.startsWith('### ')) {
                return (
                  <h3 key={lineIdx} className="text-[13px] font-bold text-blue-700 pt-1 flex items-center gap-1.5 border-b border-slate-200 pb-1">
                    {parseInlineMarkdown(trimmed.replace('### ', ''))}
                  </h3>
                );
              }

              // Header 4
              if (trimmed.startsWith('#### ')) {
                return (
                  <h4 key={lineIdx} className="text-xs font-bold text-amber-700 pt-1">
                    {parseInlineMarkdown(trimmed.replace('#### ', ''))}
                  </h4>
                );
              }

              // Blockquote / Callout
              if (trimmed.startsWith('> ')) {
                return (
                  <div key={lineIdx} className="pl-3 py-1 my-1 border-l-2 border-blue-600 bg-blue-50 rounded-r-lg text-slate-700 italic text-[11.5px]">
                    {parseInlineMarkdown(trimmed.replace(/^>\s*/, ''))}
                  </div>
                );
              }

              // Bullet List (- or *)
              if (/^[-*]\s+/.test(trimmed)) {
                return (
                  <div key={lineIdx} className="flex items-start gap-2 pl-1.5 text-slate-700">
                    <span className="text-blue-600 font-bold shrink-0 mt-0.5">•</span>
                    <span>{parseInlineMarkdown(trimmed.replace(/^[-*]\s+/, ''))}</span>
                  </div>
                );
              }

              // Numbered List (1. or 2.)
              if (/^\d+\.\s+/.test(trimmed)) {
                const match = trimmed.match(/^(\d+)\.\s+(.*)/);
                return (
                  <div key={lineIdx} className="flex items-start gap-2 pl-1.5 text-slate-700">
                    <span className="text-blue-700 font-bold shrink-0 text-[10px] mt-0.5 px-1.5 py-0.5 rounded bg-blue-50 border border-blue-200">
                      {match[1]}
                    </span>
                    <span>{parseInlineMarkdown(match[2])}</span>
                  </div>
                );
              }

              // Normal Paragraph
              return (
                <p key={lineIdx} className="text-slate-800 leading-relaxed">
                  {parseInlineMarkdown(trimmed)}
                </p>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

// Helper to parse bold, italic, and inline `code`
function parseInlineMarkdown(text) {
  const segments = text.split(/(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*)/g);

  return segments.map((seg, i) => {
    if (seg.startsWith('`') && seg.endsWith('`')) {
      return (
        <code key={i} className="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-300 text-blue-700 font-mono text-[10.5px]">
          {seg.slice(1, -1)}
        </code>
      );
    }
    if (seg.startsWith('**') && seg.endsWith('**')) {
      return (
        <strong key={i} className="font-bold text-slate-900">
          {seg.slice(2, -2)}
        </strong>
      );
    }
    if (seg.startsWith('*') && seg.endsWith('*')) {
      return (
        <em key={i} className="italic text-slate-600">
          {seg.slice(1, -1)}
        </em>
      );
    }
    return seg;
  });
}

export default function AICareerChatbot() {
  const { userRole } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);
  
  // API Key state & testing
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState(getGeminiApiKey());
  const [hasLiveKey, setHasLiveKey] = useState(Boolean(getGeminiApiKey()));
  const [testingKey, setTestingKey] = useState(false);
  const [keyTestStatus, setKeyTestStatus] = useState(null);

  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: "👋 Hi! I'm **NextHire AI Career & Technical Advisor**.\n\nAsk me anything about **Full-Stack roadmaps**, **AI/ML architectures**, **ATS resume optimization**, **interview prep**, or **Maharashtra college placements**!",
      suggestions: [
        "Full-Stack Web Dev Roadmap",
        "How does NextHire work?",
        "How to score 90+ on ATS resume?",
        "Top colleges in Maharashtra"
      ]
    }
  ]);

  const chatEndRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleTestAndSaveKey = async (e) => {
    e.preventDefault();
    if (!apiKeyInput.trim()) {
      setGeminiApiKey('');
      setHasLiveKey(false);
      setKeyTestStatus({ success: false, message: "Cleared API Key. Using Offline AI Intelligence Engine." });
      return;
    }

    setTestingKey(true);
    setKeyTestStatus(null);
    try {
      const result = await testGeminiApiKey(apiKeyInput.trim());
      setKeyTestStatus(result);
      if (result.success) {
        setGeminiApiKey(apiKeyInput.trim());
        setHasLiveKey(true);
      }
    } catch (err) {
      setKeyTestStatus({ success: false, message: "Connection test failed." });
    } finally {
      setTestingKey(false);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        sender: 'ai',
        text: "🔄 **Chat reset!** What career path, technology, or interview question would you like to explore?",
        suggestions: [
          "Data Scientist Skills in 2026",
          "Machine Learning Roadmap",
          "Explain React Hooks with Example",
          "How to crack tech interviews?"
        ]
      }
    ]);
  };

  const generateSuggestionsForTopic = (query) => {
    const q = query.toLowerCase();
    if (q.includes('react') || q.includes('frontend') || q.includes('web')) {
      return ["Explain useState vs useEffect", "React Performance Optimization", "Best React Portfolio Projects"];
    }
    if (q.includes('ai') || q.includes('machine learning') || q.includes('python')) {
      return ["PyTorch vs TensorFlow in 2026", "What is an Enterprise RAG Pipeline?", "FastAPI vs Django for AI"];
    }
    if (q.includes('resume') || q.includes('ats')) {
      return ["XYZ Resume Formula Examples", "Top Technical Action Verbs", "How to list college projects"];
    }
    if (q.includes('interview') || q.includes('placement') || q.includes('salary')) {
      return ["Behavioral STAR Method Example", "Top 5 LeetCode DSA Patterns", "2026 SDE-1 Salary Ranges"];
    }
    if (q.includes('college') || q.includes('maharashtra') || q.includes('pune')) {
      return ["COEP vs VJTI Placement Stats", "Top Mumbai Engineering Colleges", "How NextHire connects mentors"];
    }
    return [
      "Tell me about high demand skills in 2026",
      "How to prepare for coding round?",
      "How does NextHire work?"
    ];
  };

  const handleSendMessage = async (queryText = null) => {
    const textToSend = (queryText || inputQuery).trim();
    if (!textToSend || loading) return;

    const userMsg = { sender: 'user', text: textToSend };
    setMessages(prev => [...prev, userMsg]);
    if (!queryText) setInputQuery('');
    setLoading(true);

    try {
      // Pass full conversation history for context awareness
      const response = await getAICareerChatResponse(textToSend, userRole, messages);
      const nextSuggestions = generateSuggestionsForTopic(textToSend);

      setMessages(prev => [
        ...prev, 
        { 
          sender: 'ai', 
          text: response,
          suggestions: nextSuggestions
        }
      ]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        { 
          sender: 'ai', 
          text: "I encountered a momentary issue processing your inquiry. Please try asking again or check your Gemini API key.",
          suggestions: ["Try asking again", "Full-Stack Roadmap", "Interview Preparation"]
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const samplePrompts = [
    "What skills for Data Scientist?",
    "Machine Learning roadmap 2026",
    "Explain React hooks with example",
    "How to prepare for interviews?",
    "Top colleges in Maharashtra",
    "How to get 90+ ATS score?",
    "DevOps & Kubernetes guide",
    "SDE-1 salary benchmarks"
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-2.5 px-5 py-3.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-xl shadow-blue-500/25 hover:scale-105 active:scale-95 transition-all duration-200 border border-blue-500/30"
        >
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white animate-pulse" />
          </div>
          <span className="tracking-wide">AI Career Advisor</span>
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white shadow-xs" />
        </button>
      ) : (
        <div 
          className={`bg-white rounded-3xl shadow-2xl flex flex-col border border-slate-200 overflow-hidden transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 ${
            isExpanded 
              ? 'w-[90vw] sm:w-[580px] h-[680px] max-h-[92vh]' 
              : 'w-[90vw] sm:w-[410px] h-[540px]'
          }`}
        >
          
          {/* Header */}
          <div className="p-3.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-white">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-bold text-white">NextHire AI Mentor</h3>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold border ${
                    hasLiveKey 
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' 
                      : 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                  }`}>
                    {hasLiveKey ? 'Gemini Live' : 'AI Engine'}
                  </span>
                </div>
                <p className="text-[10.5px] text-emerald-400 flex items-center gap-1 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Ready to guide your career
                </p>
              </div>
            </div>

            {/* Header Actions */}
            <div className="flex items-center gap-1">
              <button
                onClick={handleResetChat}
                className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                title="Restart Chat Session"
              >
                <RefreshCw className="w-4 h-4" />
              </button>

              <button
                onClick={() => setShowKeyModal(!showKeyModal)}
                className={`p-1.5 rounded-lg transition-colors ${showKeyModal ? 'text-amber-400 bg-slate-800' : 'text-slate-300 hover:text-amber-300 hover:bg-slate-800'}`}
                title="Configure Google Gemini API Key"
              >
                <Key className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors hidden sm:block"
                title={isExpanded ? "Collapse View" : "Expand View"}
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                title="Close Chatbot"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Gemini API Key Configuration Panel */}
          {showKeyModal && (
            <div className="p-3.5 bg-slate-900 border-b border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5" /> Google Gemini API Connection
                </span>
                <span className="text-[10px] text-slate-400">Gemini 2.0 / 1.5 Flash</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-snug">
                Optionally connect your personal Google Gemini API key to enable live cloud multi-turn reasoning.
              </p>
              <form onSubmit={handleTestAndSaveKey} className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="password"
                    placeholder="Paste AIzaSy... key"
                    value={apiKeyInput}
                    onChange={(e) => setApiKeyInput(e.target.value)}
                    className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-400 font-mono"
                  />
                  <button
                    type="submit"
                    disabled={testingKey}
                    className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white font-bold text-xs shadow-md shrink-0"
                  >
                    {testingKey ? "Testing..." : "Test & Save"}
                  </button>
                </div>
                {keyTestStatus && (
                  <p className={`text-[11px] font-medium ${keyTestStatus.success ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {keyTestStatus.success ? '✅ ' : 'ℹ️ '} {keyTestStatus.message}
                  </p>
                )}
              </form>
            </div>
          )}

          {/* Chat Messages */}
          <div className="flex-1 p-3.5 sm:p-4 overflow-y-auto space-y-3.5 bg-slate-50 scrollbar-thin">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'ai' && (
                  <div className="w-7 h-7 rounded-xl bg-blue-600 shrink-0 flex items-center justify-center text-white text-[11px] font-bold shadow-xs mt-0.5">
                    AI
                  </div>
                )}
                
                <div className={`max-w-[88%] space-y-2.5`}>
                  <div
                    className={`p-3.5 rounded-2xl leading-relaxed shadow-xs ${
                      msg.sender === 'user'
                        ? 'bg-blue-600 text-white rounded-br-none font-medium'
                        : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none'
                    }`}
                  >
                    {msg.sender === 'user' ? (
                      <p className="whitespace-pre-wrap">{msg.text}</p>
                    ) : (
                      <FormattedMessage text={msg.text} />
                    )}
                  </div>

                  {/* Follow-up suggestion buttons */}
                  {msg.sender === 'ai' && msg.suggestions && msg.suggestions.length > 0 && idx === messages.length - 1 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {msg.suggestions.map((sug, sIdx) => (
                        <button
                          key={sIdx}
                          onClick={() => handleSendMessage(sug)}
                          className="text-[10px] px-2.5 py-1 rounded-full bg-white text-blue-700 hover:bg-blue-600 hover:text-white border border-blue-200 transition-all flex items-center gap-1 shadow-xs active:scale-95 font-medium"
                        >
                          <ChevronRight className="w-3 h-3 text-blue-600" />
                          <span>{sug}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {msg.sender === 'user' && (
                  <div className="w-7 h-7 rounded-xl bg-slate-200 shrink-0 flex items-center justify-center text-slate-700 text-[11px] mt-0.5 shadow-xs">
                    <User className="w-4 h-4 text-slate-600" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2.5 text-slate-500 text-xs py-2 pl-2">
                <div className="w-7 h-7 rounded-xl bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-600">
                  <Sparkles className="w-3.5 h-3.5 animate-spin" />
                </div>
                <span className="text-slate-600 font-medium animate-pulse">NextHire AI is generating comprehensive guidance...</span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick Prompts Carousel */}
          <div className="px-3 py-2 bg-white border-t border-slate-200 flex gap-1.5 overflow-x-auto text-[10.5px] scrollbar-none">
            {samplePrompts.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(prompt)}
                className="whitespace-nowrap px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 hover:bg-blue-600 hover:text-white border border-slate-200 transition-all active:scale-95 shrink-0 font-medium"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
            className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask anything (e.g. roadmaps, code, interview questions)..."
              className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-600 transition-colors"
            />
            <button
              type="submit"
              disabled={loading || !inputQuery.trim()}
              className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white transition-all shadow-md shadow-blue-500/20 active:scale-95 shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}
    </div>
  );
}
