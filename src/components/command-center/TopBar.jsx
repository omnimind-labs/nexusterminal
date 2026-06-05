import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Wifi, Zap, Clock, Lock, Unlock, Settings } from 'lucide-react';

export default function TopBar({ isLocked, onToggleLock, onOpenSettings }) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (d) => {
    return d.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const formatDate = (d) => {
    return d.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="flex items-center justify-between px-4 py-2 border-b border-primary/15 bg-card/50 backdrop-blur-sm"
    >
      <div className="flex items-center gap-3">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="w-6 h-6 border border-primary/40 rounded-full flex items-center justify-center"
        >
          <div className="w-2 h-2 bg-primary/60 rounded-full" />
        </motion.div>
        <div>
          <h1 className="font-display text-sm font-bold tracking-[0.15em] text-primary glow-text">
            eDEX COMMAND CENTER
          </h1>
          <p className="font-mono text-[8px] text-muted-foreground tracking-wider">v3.0.0 — QUANTUM SHELL</p>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-4">
          <StatusIndicator icon={Shield} label="SECURE" color="text-chart-3" />
          <StatusIndicator icon={Wifi} label="CONNECTED" color="text-primary" />
          <StatusIndicator icon={Zap} label="NOMINAL" color="text-chart-4" />
        </div>

        {/* Lock & Settings */}
        <div className="flex items-center gap-1 pl-4 border-l border-primary/10">
          <button
            onClick={onToggleLock}
            title={isLocked ? 'Unlock layout' : 'Lock layout'}
            className={`flex items-center gap-1 px-2 py-1 rounded-sm border text-[8px] font-display uppercase tracking-wider transition-all ${
              isLocked
                ? 'border-chart-4/40 bg-chart-4/10 text-chart-4'
                : 'border-primary/20 bg-primary/5 text-primary hover:bg-primary/15'
            }`}
          >
            {isLocked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
            <span className="hidden lg:block">{isLocked ? 'Locked' : 'Unlock'}</span>
          </button>
          <button
            onClick={onOpenSettings}
            title="Settings (Ctrl+,)"
            className="flex items-center gap-1 px-2 py-1 rounded-sm border border-primary/20 bg-primary/5 text-primary hover:bg-primary/15 text-[8px] font-display uppercase tracking-wider transition-all"
          >
            <Settings className="w-3 h-3" />
            <span className="hidden lg:block">Settings</span>
          </button>
        </div>

        <div className="flex items-center gap-2 pl-4 border-l border-primary/10">
          <Clock className="w-3 h-3 text-primary/50" />
          <div className="text-right">
            <div className="font-mono text-xs text-primary glow-text tracking-wider">
              {formatTime(time)}
            </div>
            <div className="font-mono text-[8px] text-muted-foreground">
              {formatDate(time)}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function StatusIndicator({ icon: Icon, label, color }) {
  return (
    <div className="flex items-center gap-1.5">
      <motion.div
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <Icon className={`w-3 h-3 ${color}`} />
      </motion.div>
      <span className="font-display text-[7px] uppercase tracking-widest text-muted-foreground hidden lg:block">
        {label}
      </span>
    </div>
  );
}