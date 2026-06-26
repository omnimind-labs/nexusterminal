import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Globe, ArrowLeft, ArrowRight, RefreshCw, Lock, ExternalLink, Search } from 'lucide-react';

const BOOKMARKS = [
  { label: 'Docs', url: 'https://docs.waveterm.dev' },
  { label: 'GitHub', url: 'https://github.com' },
  { label: 'Hacker News', url: 'https://news.ycombinator.com' },
  { label: 'devdocs.io', url: 'https://devdocs.io' },
];

export default function WebBrowser() {
  const [url, setUrl] = useState('https://devdocs.io');
  const [inputUrl, setInputUrl] = useState('https://devdocs.io');
  const [loading, setLoading] = useState(false);
  const [key, setKey] = useState(0);

  const navigate = (target) => {
    let resolved = target.trim();
    if (!resolved.startsWith('http://') && !resolved.startsWith('https://')) {
      resolved = `https://duckduckgo.com/?q=${encodeURIComponent(resolved)}&theme=dark`;
    }
    try {
      const parsed = new URL(resolved);
      if (!['http:', 'https:'].includes(parsed.protocol)) return;
    } catch {
      return;
    }
    setUrl(resolved);
    setInputUrl(resolved);
    setLoading(true);
    setKey(k => k + 1);
    setTimeout(() => setLoading(false), 1500);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') navigate(inputUrl);
  };

  const isSecure = url.startsWith('https://');

  return (
    <div className="h-full flex flex-col">
      {/* Browser chrome */}
      <div className="flex-shrink-0 space-y-1">
        {/* Nav bar */}
        <div className="flex items-center gap-1.5">
          <button className="p-1 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-30">
            <ArrowLeft className="w-3 h-3" />
          </button>
          <button className="p-1 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-30">
            <ArrowRight className="w-3 h-3" />
          </button>
          <button onClick={() => navigate(url)}
            className={`p-1 text-muted-foreground hover:text-foreground transition-colors ${loading ? 'animate-spin text-primary' : ''}`}>
            <RefreshCw className="w-3 h-3" />
          </button>

          {/* URL bar */}
          <div className="flex-1 flex items-center gap-1.5 bg-secondary/40 border border-primary/10 rounded-sm px-2 py-1 focus-within:border-primary/30">
            {isSecure
              ? <Lock className="w-2.5 h-2.5 text-chart-3 flex-shrink-0" />
              : <Globe className="w-2.5 h-2.5 text-muted-foreground flex-shrink-0" />
            }
            <input
              value={inputUrl}
              onChange={e => setInputUrl(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent font-mono text-[10px] text-foreground outline-none min-w-0"
              spellCheck={false}
            />
            <button onClick={() => navigate(inputUrl)}>
              <Search className="w-2.5 h-2.5 text-muted-foreground hover:text-primary transition-colors" />
            </button>
          </div>

          <a href={url} target="_blank" rel="noopener noreferrer"
            className="p-1 text-muted-foreground hover:text-primary transition-colors">
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Bookmarks bar */}
        <div className="flex gap-1 overflow-x-auto pb-0.5">
          {BOOKMARKS.map(b => (
            <button
              key={b.url}
              onClick={() => navigate(b.url)}
              className={`flex-shrink-0 font-mono text-[8px] px-2 py-0.5 rounded-sm border transition-colors ${
                url.startsWith(b.url.slice(0, 20))
                  ? 'border-primary/30 bg-primary/10 text-primary'
                  : 'border-primary/10 text-muted-foreground hover:text-foreground hover:border-primary/20'
              }`}
            >
              {b.label}
            </button>
          ))}
        </div>
      </div>

      {/* iframe viewport */}
      <div className="flex-1 min-h-0 mt-1.5 relative rounded-sm overflow-hidden border border-primary/10">
        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/80">
            <div className="flex flex-col items-center gap-2">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-6 h-6 border border-primary/30 border-t-primary rounded-full"
              />
              <span className="font-mono text-[9px] text-muted-foreground">Loading...</span>
            </div>
          </div>
        )}
        <iframe
          key={key}
          src={url}
          className="w-full h-full border-0"
          sandbox="allow-scripts allow-forms allow-popups"
          referrerPolicy="no-referrer"
          onLoad={() => setLoading(false)}
          title="browser"
        />
      </div>
    </div>
  );
}