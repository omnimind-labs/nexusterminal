import React from 'react';
import { motion } from 'framer-motion';
import { GripHorizontal } from 'lucide-react';

export default function CyberPanel({ title, children, className = '', delay = 0, icon: Icon, isDraggable = false }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.16, 1, 0.3, 1] }}
      className={`cyber-panel rounded-sm p-3 flex flex-col ${className}`}
      style={{ height: '100%' }}
    >
      {title && (
        <div className={`flex items-center gap-2 mb-2 pb-2 border-b border-primary/10 flex-shrink-0 ${isDraggable ? 'drag-handle cursor-grab active:cursor-grabbing' : ''}`}>
          {Icon && <Icon className="w-3.5 h-3.5 text-primary glow-text flex-shrink-0" />}
          <h3 className="font-display text-[10px] uppercase tracking-[0.2em] text-primary/80 glow-text truncate">
            {title}
          </h3>
          <div className="flex-1" />
          {isDraggable && (
            <GripHorizontal className="w-3 h-3 text-primary/25 hover:text-primary/60 transition-colors mr-1" />
          )}
          <div className="flex gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-primary/40 animate-pulse" />
            <div className="w-1.5 h-1.5 rounded-full bg-primary/20" />
          </div>
        </div>
      )}
      <div className="flex-1 min-h-0">{children}</div>
    </motion.div>
  );
}