import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { Sparkles, Send, Loader2, Trash2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const SUGGESTIONS = [
  'Analyze my CPU usage',
  'Show me active processes',
  'What commands should I run for disk cleanup?',
  'Explain network connections',
];

export default function AIAssistant() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'WAVE-AI online. I have access to your system context. Ask me anything about your terminal, processes, or system status.',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async (text) => {
    const msg = text || input.trim();
    if (!msg || loading) return;
    setInput('');

    const userMsg = { role: 'user', content: msg };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    const systemContext = `You are WAVE-AI, a cyberpunk sci-fi terminal assistant embedded in an eDEX-style command center dashboard. 
You have context about the user's system: CPU ~35%, RAM ~58%, 8 cores, processes like node, chrome, vscode, docker, postgres running.
Keep responses concise and terminal-focused. Use technical language. Format code with backticks. Be direct and helpful.`;

    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `${systemContext}\n\nUser: ${msg}`,
      });

      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      console.error('WAVE-AI request failed:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `⚠ System error: ${error.message || 'Failed to reach WAVE-AI backend. Check connection and retry.'}`,
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Messages */}
      <div ref={scrollRef} className="flex-1 min-h-0 overflow-y-auto space-y-3 p-1 pr-2">
        <AnimatePresence>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div className="w-5 h-5 rounded-sm bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Sparkles className="w-3 h-3 text-primary" />
                </div>
              )}
              <div className={`max-w-[85%] rounded-sm px-2.5 py-2 text-[11px] leading-relaxed font-mono ${
                msg.role === 'user'
                  ? 'bg-primary/10 border border-primary/20 text-primary'
                  : 'bg-secondary/40 border border-primary/5 text-foreground'
              }`}>
                {msg.role === 'assistant' ? (
                  <ReactMarkdown
                    className="prose prose-sm max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0 [&_code]:text-primary [&_code]:bg-primary/10 [&_code]:px-1 [&_code]:rounded-sm [&_pre]:bg-secondary [&_pre]:p-2 [&_pre]:rounded-sm [&_strong]:text-primary [&_p]:my-1"
                    components={{ p: ({ children }) => <p className="font-mono text-[11px] text-foreground/90">{children}</p> }}
                  >
                    {msg.content}
                  </ReactMarkdown>
                ) : msg.content}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2 items-center">
            <div className="w-5 h-5 rounded-sm bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Sparkles className="w-3 h-3 text-primary" />
            </div>
            <div className="flex gap-1 items-center px-2.5 py-2 bg-secondary/40 border border-primary/5 rounded-sm">
              {[0, 1, 2].map(i => (
                <motion.div key={i} animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1, delay: i * 0.2, repeat: Infinity }}
                  className="w-1 h-1 rounded-full bg-primary"
                />
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Suggestions */}
      {messages.length <= 1 && (
        <div className="flex flex-wrap gap-1 px-1 pb-2">
          {SUGGESTIONS.map(s => (
            <button key={s} onClick={() => sendMessage(s)}
              className="font-mono text-[8px] px-2 py-1 rounded-sm border border-primary/15 text-muted-foreground hover:border-primary/40 hover:text-primary transition-colors">
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="flex items-center gap-2 border-t border-primary/10 pt-2">
        <input
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask WAVE-AI..."
          className="flex-1 bg-transparent font-mono text-[11px] text-foreground placeholder:text-muted-foreground/40 outline-none caret-primary"
        />
        <div className="flex gap-1">
          {messages.length > 1 && (
            <button onClick={() => setMessages([messages[0]])}
              className="p-1 text-muted-foreground hover:text-destructive transition-colors">
              <Trash2 className="w-3 h-3" />
            </button>
          )}
          <button onClick={() => sendMessage()}
            disabled={!input.trim() || loading}
            className="p-1 text-primary/50 hover:text-primary disabled:opacity-30 transition-colors">
            {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </div>
  );
}