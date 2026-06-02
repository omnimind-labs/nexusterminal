import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const STATS = [
  { label: 'PACKETS IN', baseValue: 1247832, rate: 127 },
  { label: 'PACKETS OUT', baseValue: 892451, rate: 89 },
  { label: 'LATENCY', baseValue: 12, rate: 0, suffix: 'ms', random: true, min: 5, max: 45 },
  { label: 'BANDWIDTH', baseValue: 847, rate: 0, suffix: 'Mbps', random: true, min: 600, max: 1000 },
  { label: 'DISK I/O', baseValue: 234, rate: 0, suffix: 'MB/s', random: true, min: 100, max: 500 },
  { label: 'ENTROPY', baseValue: 7.98, rate: 0, suffix: '/8', random: true, min: 7.5, max: 8.0, decimals: 2 },
];

export default function QuickStats() {
  const [values, setValues] = useState(STATS.map(s => s.baseValue));

  useEffect(() => {
    const interval = setInterval(() => {
      setValues(prev => prev.map((v, i) => {
        const stat = STATS[i];
        if (stat.random) {
          return stat.min + Math.random() * (stat.max - stat.min);
        }
        return v + stat.rate + Math.floor(Math.random() * 20);
      }));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-3 gap-2">
      {STATS.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.1 }}
          className="flex flex-col items-center p-2 rounded-sm bg-secondary/20 border border-primary/5"
        >
          <span className="font-display text-[6px] uppercase tracking-[0.2em] text-muted-foreground mb-1">
            {stat.label}
          </span>
          <span className="font-mono text-[11px] text-primary glow-text tabular-nums">
            {stat.decimals
              ? values[i].toFixed(stat.decimals)
              : Math.round(values[i]).toLocaleString()
            }
            {stat.suffix && <span className="text-[8px] text-primary/50 ml-0.5">{stat.suffix}</span>}
          </span>
        </motion.div>
      ))}
    </div>
  );
}