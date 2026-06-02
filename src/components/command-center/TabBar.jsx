import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Monitor, Brain, ServerIcon, FileCode, Globe } from 'lucide-react';

const TAB_ICONS = {
  dashboard: Monitor,
  ai: Brain,
  ssh: ServerIcon,
  preview: FileCode,
  browser: Globe,
};

export default function TabBar({ tabs, activeTab, onTabChange, onAddTab, onCloseTab }) {
  return (
    <div className="flex items-center gap-1 px-2 py-1 border-b border-primary/10 bg-card/30 overflow-x-auto flex-shrink-0">
      <AnimatePresence>
        {tabs.map(tab => {
          const Icon = TAB_ICONS[tab.type] || Monitor;
          const isActive = tab.id === activeTab;
          return (
            <motion.div
              key={tab.id}
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.2 }}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-sm cursor-pointer group flex-shrink-0 transition-all ${
                isActive
                  ? 'bg-primary/10 border border-primary/25'
                  : 'border border-transparent hover:bg-secondary/40'
              }`}
              onClick={() => onTabChange(tab.id)}
            >
              <Icon className={`w-3 h-3 flex-shrink-0 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
              <span className={`font-display text-[9px] uppercase tracking-wider whitespace-nowrap ${
                isActive ? 'text-primary' : 'text-muted-foreground'
              }`}>
                {tab.label}
              </span>
              {isActive && (
                <motion.div
                  className="w-1 h-1 rounded-full bg-primary"
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
              {tabs.length > 1 && (
                <button
                  onClick={(e) => { e.stopPropagation(); onCloseTab(tab.id); }}
                  className="ml-0.5 text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-destructive transition-all"
                >
                  <X className="w-2.5 h-2.5" />
                </button>
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>

      <button
        onClick={onAddTab}
        className="flex-shrink-0 p-1 text-muted-foreground hover:text-primary hover:bg-secondary/40 rounded-sm transition-colors ml-1"
      >
        <Plus className="w-3 h-3" />
      </button>
    </div>
  );
}