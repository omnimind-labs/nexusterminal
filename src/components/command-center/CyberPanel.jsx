import React from 'react';
import { motion } from 'framer-motion';

export default function CyberPanel({ title, children, className = '', delay = 0, icon: Icon }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      className={`cyber-panel rounded-sm p-3 flex flex-col ${className}`}
    >
      {title && (
        <div className="flex items-center gap-2 mb-2 pb-2 border-b border-primary/10">
          {Icon && <Icon className="w-3.5 h-3.5 text-primary glow-text" />}
          <h3 className="font-display text-[10px] uppercase tracking-[0.2em] text-primary/80 glow-text">
            {title}
          </h3>
          <div className="flex-1" />
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