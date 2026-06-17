import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Bot, User, Loader2, Send } from 'lucide-react';
import { ChatMessage } from '../types';

interface MentorChatProps {
  onSuggestQuery?: (sql: string) => void;
}

export default function MentorChat({ onSuggestQuery }: MentorChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'initial',
      role: 'assistant',
      text: "Hello! I am your Senior Data Science Mentor. Let's analyze your consumer purchasing dataset. I can help you with writing Pandas cleansing scripts, explaining SQL window systems like ROW_NUMBER(), designing BI dashboard metrics, or framing resume achievements for recruiters. Let me know what you are studying!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const presetPrompts = [
    { label: 'Exposing NaN fills in Pandas', text: 'How do I explain category-level median imputation for NaN values in a data science interview?' },
    { label: 'Explain SQL Window CTE ranking', text: 'Explain how ROW_NUMBER() OVER(PARTITION BY season ORDER BY sales DESC) works conceptually in PostgreSQL.' },
    { label: 'Recruiter Bullet Points', text: 'Help me draft a bullet point for my resume showcasing this ETL and SQL Portfolio project.' },
  ];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async (e?: React.FormEvent, customText?: string) => {
    if (e) e.preventDefault();
    const textToSend = customText || input;
    if (!textToSend.trim()) return;

    if (!customText) setInput('');

    const userMessage: ChatMessage = {
      id: `m-user-${Date.now()}`,
      role: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          history: messages.map(m => ({ role: m.role, text: m.text }))
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get response from Mentor Service.');
      }

      const data = await response.json();
      
      const botMessage: ChatMessage = {
        id: `m-bot-${Date.now()}`,
        role: 'assistant',
        text: data.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botMessage]);

      // If the model suggests a SQL query, check if we want to bubble it up
      if (data.suggestedSql && onSuggestQuery) {
        onSuggestQuery(data.suggestedSql);
      }
    } catch (err) {
      const errorMessage: ChatMessage = {
        id: `m-err-${Date.now()}`,
        role: 'assistant',
        text: "I am having temporary issues assessing the pipeline configuration. Let's try again shortly! You can also copy your queries directly into the SQL sandbox.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="mentor-chat-section" className="glass-panel rounded-xl flex flex-col h-[580px] shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-indigo-950/40 rounded-lg text-indigo-400 border border-indigo-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-sm text-slate-200">Senior DS Mentor</h3>
            <span className="text-[10px] text-emerald-400 font-mono tracking-wider flex items-center">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full inline-block mr-1.5 animate-pulse"></span>
              ACTIVE ADVISOR
            </span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex items-start space-x-2.5 max-w-[85%] ${m.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
              <div className={`p-2 rounded-lg shrink-0 ${m.role === 'user' ? 'bg-indigo-950/40 border border-indigo-500/20 text-indigo-400' : 'bg-slate-800 border border-slate-700 text-slate-400'}`}>
                {m.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              <div className={`px-4 py-3 rounded-2xl text-xs leading-relaxed whitespace-pre-wrap ${m.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-slate-800/80 text-slate-200 border border-slate-700/60 rounded-tl-none shadow-sm'}`}>
                {m.text}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="flex items-start space-x-2.5 max-w-[85%]">
              <div className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-emerald-400 shrink-0">
                <Loader2 className="w-4 h-4 animate-spin" />
              </div>
              <div className="px-4 py-3 rounded-2xl bg-slate-800/80 text-slate-400 border border-slate-700/60 rounded-tl-none flex items-center space-x-2 text-xs">
                <span>Mentor is reviewing query schema...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Mini Helper chips */}
      <div className="px-4 py-1.5 bg-slate-950 border-t border-slate-800/60 flex items-center gap-1.5 overflow-x-auto whitespace-nowrap scrollbar-none">
        {presetPrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(undefined, p.text)}
            className="text-[11px] bg-slate-850 hover:bg-slate-800 border border-slate-700 text-slate-300 py-1 px-2.5 rounded-full transition-all duration-150 shrink-0 select-none text-left cursor-pointer"
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="p-3 bg-slate-900 border-t border-slate-800 flex items-center space-x-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a technical or analytics career question..."
          className="flex-1 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 py-2.5 px-4 font-sans text-xs focus:outline-none focus:border-indigo-500 transition-all duration-150"
        />
        <button
          type="submit"
          className="p-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-all shadow-md shadow-indigo-600/10 cursor-pointer disabled:opacity-50"
          disabled={isLoading || !input.trim()}
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
