import React, { useState, useRef, useEffect } from 'react';
import { Send, X, Sparkles, Loader2 } from 'lucide-react';
import { chatWithAssistant } from '@/services/geminiService';
import { AppData } from '@/types';

interface Props {
  data: AppData;
}

interface ChatMessage {
  role: 'user' | 'ai';
  text: string;
}

export const GeminiAssistant: React.FC<Props> = ({ data }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'ai', text: 'Hello! I am your Wedding Assistant. Ask me about your budget, guests, or tasks.' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setIsLoading(true);

    // Prepare context
    const context = JSON.stringify({
      guestCount: data.guests.length,
      totalBudget: data.events.reduce((acc, e) => acc + e.budget, 0),
      pendingTasks: data.tasks.filter(t => !t.completed).map(t => t.name),
      vendors: data.vendors.map(v => `${v.name} (${v.serviceType})`),
    });

    const aiResponse = await chatWithAssistant(userMsg, context);
    setMessages(prev => [...prev, { role: 'ai', text: aiResponse }]);
    setIsLoading(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 p-4 rounded-full shadow-lg bg-gradient-to-r from-primary to-purple-600 text-white hover:scale-105 transition-transform z-50 ${isOpen ? 'hidden' : 'flex'}`}
      >
        <Sparkles className="w-6 h-6 mr-2" />
        <span className="font-semibold">AI Assistant</span>
      </button>

      {isOpen && (
        <div className="fixed bottom-6 right-6 w-80 md:w-96 h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden z-50 border border-slate-200">
          <div className="bg-gradient-to-r from-primary to-purple-600 p-4 flex justify-between items-center text-white">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              <h3 className="font-bold">Wedding AI</h3>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1 rounded">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto bg-slate-50 space-y-3">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-lg text-sm ${
                  msg.role === 'user' 
                    ? 'bg-primary text-white rounded-br-none' 
                    : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none shadow-sm'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-primary" />
                  <span className="text-xs text-slate-500">Thinking...</span>
                </div>
              </div>
            )}
          </div>

          <div className="p-3 bg-white border-t border-slate-200 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about budget, tasks..."
              className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
            />
            <button 
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="p-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};