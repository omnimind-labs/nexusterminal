import React, { useState, useEffect, useRef } from 'react';
import { Cpu, MemoryStick, HardDrive, Thermometer } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function GaugeRing({ value, label, icon: Icon, color = 'primary', size = 80 }) {
  const radius = (size - 10) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  const colorMap = {
    primary: { stroke: 'hsl(185, 100%, 50%)', glow: 'hsl(185, 100%, 50%)' },
    accent: { stroke: 'hsl(260, 100%, 65%)', glow: 'hsl(260, 100%, 65%)' },
    green: { stroke: 'hsl(120, 80%, 50%)', glow: 'hsl(120, 80%, 50%)' },
    orange: { stroke: 'hsl(45, 100%, 55%)', glow: 'hsl(45, 100%, 55%)' },
  };

  const c = colorMap[color] || colorMap.primary;

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none" stroke="hsl(185, 100%, 50%, 0.08)" strokeWidth="3"
          />
          <motion.circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none" stroke={c.stroke} strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1, ease: 'easeOut' }}
            style={{ filter: `drop-shadow(0 0 6px ${c.glow})` }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <Icon className="w-3 h-3 mb-0.5" style={{ color: c.stroke }} />
          <span className="font-mono text-xs font-bold" style={{ color: c.stroke }}>
            {Math.round(value)}%
          </span>
        </div>
      </div>
      <span className="font-display text-[8px] uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
    </div>
  );
}

function CoreBar({ index, load }) {
  return (
    <div className="flex items-center gap-2">
      <span className="font-mono text-[9px] text-muted-foreground w-8">C{index}</span>
      <div className="flex-1 h-1.5 bg-secondary/50 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{
            background: `linear-gradient(90deg, hsl(185, 100%, 50%), ${load > 70 ? 'hsl(45, 100%, 55%)' : 'hsl(185, 100%, 70%)'})`,
            boxShadow: '0 0 8px hsl(185, 100%, 50%, 0.4)',
          }}
          animate={{ width: `${load}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
      <span className="font-mono text-[9px] text-primary/60 w-8 text-right">{Math.round(load)}%</span>
    </div>
  );
}

export default function SystemStats() {
  const [stats, setStats] = useState({
    cpu: 32,
    ram: 58,
    disk: 45,
    temp: 52,
    cores: [28, 45, 12, 67, 33, 22, 55, 41],
    uptime: 0,
  });

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      setStats(prev => ({
        cpu: Math.max(5, Math.min(95, prev.cpu + (Math.random() - 0.48) * 8)),
        ram: Math.max(30, Math.min(90, prev.ram + (Math.random() - 0.5) * 3)),
        disk: Math.max(40, Math.min(70, prev.disk + (Math.random() - 0.5) * 0.5)),
        temp: Math.max(35, Math.min(85, prev.temp + (Math.random() - 0.48) * 4)),
        cores: prev.cores.map(c => Math.max(2, Math.min(98, c + (Math.random() - 0.48) * 15))),
        uptime: Math.floor((Date.now() - startTime) / 1000),
      }));
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  // Keep cores capped to available display space
  const formatUptime = (s) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  return (
    <div className="h-full flex flex-col gap-3">
      <div className="flex justify-around">
        <GaugeRing value={stats.cpu} label="CPU" icon={Cpu} color="primary" size={72} />
        <GaugeRing value={stats.ram} label="RAM" icon={MemoryStick} color="accent" size={72} />
        <GaugeRing value={stats.disk} label="DISK" icon={HardDrive} color="green" size={72} />
        <GaugeRing value={stats.temp} label="TEMP" icon={Thermometer} color="orange" size={72} />
      </div>

      <div className="flex-1 space-y-1.5 px-1">
        <div className="flex items-center justify-between mb-1">
          <span className="font-display text-[8px] uppercase tracking-widest text-muted-foreground">Core Activity</span>
          <span className="font-mono text-[9px] text-primary/50">UPTIME {formatUptime(stats.uptime)}</span>
        </div>
        {stats.cores.map((load, i) => (
          <CoreBar key={i} index={i} load={load} />
        ))}
      </div>
    </div>
  );
}