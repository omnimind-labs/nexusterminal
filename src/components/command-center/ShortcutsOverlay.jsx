import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Keyboard } from 'lucide-react';

const SHORTCUT_GROUPS = [
  {
    title: 'Navigation',
    shortcuts: [
      { keys: ['Ctrl', 'T'],     desc: 'Open new tab' },
      { keys: ['Ctrl', 'W'],     desc: 'Close current tab' },
      { keys: ['Ctrl', '1–6'],   desc: 'Switch to tab N' },
    ],
  },
  {
    title: 'Layout',
    shortcuts: [
      { keys: ['Alt', 'L'],      desc: 'Toggle edit/lock mode' },
      { keys: ['Ctrl', ','],     desc: 'Open settings' },
      { keys: ['?'],             desc: 'Show this cheatsheet' },
    ],
  },
  {
    title: 'Widgets  (toggle on/off)',
    shortcuts: [
      { keys: ['Alt', '1'], desc: 'Terminal' },
      { keys: ['Alt', '2'], desc: 'System Monitor' },
      { keys: ['Alt', '3'], desc: 'Network Traffic' },
      { keys: ['Alt', '4'], desc: 'Processes' },
      { keys: ['Alt', '5'], desc: 'Live Metrics' },
      { keys: ['Alt', '6'], desc: 'WAVE-AI' },
      { keys: ['Alt', '7'], desc: 'SSH Manager' },
      { keys: ['Alt', '8'], desc: 'Globe / Topology' },
      { keys: ['Alt', '9'], desc: 'Data Stream' },
    ],
  },
];

export default function ShortcutsOverlay({ onClose }) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92 }}
          transition={{ duration: 0.2 }}
          className="cyber-panel w-full max-w-lg rounded-sm border border-primary/30 overflow-hidden"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center gap-3 px-5 py-3 border-b border-primary/15">
            <Keyboard className="w-4 h-4 text-primary" />
            <h2 className="font-display text-xs uppercase tracking-[0.2em] text-primary glow-text flex-1">
              Keyboard Shortcuts
            </h2>
            <button onClick={onClose} className="text-muted-foreground hover:text-destructive transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-5 space-y-5 max-h-[75vh] overflow-y-auto">
            {SHORTCUT_GROUPS.map(group => (
              <div key={group.title}>
                <p className="font-display text-[9px] uppercase tracking-widest text-muted-foreground mb-2">
                  {group.title}
                </p>
                <div className="space-y-1.5">
                  {group.shortcuts.map((s, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <span className="font-mono text-[11px] text-foreground/80">{s.desc}</span>
                      <div className="flex items-center gap-1">
                        {s.keys.map((k, ki) => (
                          <React.Fragment key={ki}>
                            {ki > 0 && <span className="font-mono text-[9px] text-muted-foreground">+</span>}
                            <kbd className="px-1.5 py-0.5 rounded-sm border border-primary/25 bg-secondary/50 font-mono text-[9px] text-primary">
                              {k}
                            </kbd>
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="px-5 py-2.5 border-t border-primary/10">
            <p className="font-mono text-[9px] text-muted-foreground text-center">
              Press <kbd className="px-1 py-0.5 rounded-sm border border-primary/20 bg-secondary/40 text-primary text-[8px]">Esc</kbd> or <kbd className="px-1 py-0.5 rounded-sm border border-primary/20 bg-secondary/40 text-primary text-[8px]">?</kbd> to dismiss
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}