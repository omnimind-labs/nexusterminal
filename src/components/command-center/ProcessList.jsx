import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePollingInterval } from '@/hooks/usePollingInterval';
import { randomWalk } from '@/utils/randomWalk';

const INITIAL_PROCESSES = [
  { pid: 1, name: 'systemd', user: 'root', cpu: 0.1, mem: 0.4, threads: 1, state: 'sleeping' },
  { pid: 423, name: 'node', user: 'operator', cpu: 12.3, mem: 8.2, threads: 12, state: 'running' },
  { pid: 891, name: 'chrome', user: 'operator', cpu: 8.7, mem: 15.4, threads: 42, state: 'sleeping' },
  { pid: 1024, name: 'vscode', user: 'operator', cpu: 5.2, mem: 11.1, threads: 18, state: 'sleeping' },
  { pid: 1337, name: 'dockerd', user: 'root', cpu: 3.8, mem: 6.7, threads: 24, state: 'running' },
  { pid: 2048, name: 'postgres', user: 'postgres', cpu: 2.1, mem: 4.3, threads: 8, state: 'sleeping' },
  { pid: 2560, name: 'nginx', user: 'www', cpu: 0.8, mem: 1.2, threads: 4, state: 'sleeping' },
  { pid: 3072, name: 'redis', user: 'redis', cpu: 0.5, mem: 2.1, threads: 4, state: 'sleeping' },
  { pid: 3584, name: 'ssh-agent', user: 'operator', cpu: 0.0, mem: 0.3, threads: 1, state: 'sleeping' },
  { pid: 4096, name: 'tmux', user: 'operator', cpu: 0.2, mem: 0.8, threads: 2, state: 'running' },
];

export default function ProcessList() {
  const [processes, setProcesses] = useState(INITIAL_PROCESSES);
  const [sortBy, setSortBy] = useState('cpu');

  usePollingInterval(() => {
    setProcesses(prev => prev.map(p => ({
      ...p,
      cpu: randomWalk(p.cpu, { volatility: p.name === 'node' ? 6 : 2, min: 0, max: 99 }),
      mem: randomWalk(p.mem, { volatility: 0.5, min: 0.1, max: 30 }),
    })));
  }, 2000);

  const sorted = [...processes].sort((a, b) => b[sortBy] - a[sortBy]);

  const stateColors = {
    running: 'bg-chart-3',
    sleeping: 'bg-primary/30',
  };

  return (
    <div className="h-full flex flex-col">
      <div className="grid grid-cols-[40px_1fr_60px_60px_40px] gap-1 px-1 py-1 border-b border-primary/10">
        {['PID', 'NAME', 'CPU%', 'MEM%', 'THR'].map((header, i) => (
          <button
            key={header}
            onClick={() => setSortBy(['pid', 'name', 'cpu', 'mem', 'threads'][i])}
            className={`font-display text-[7px] uppercase tracking-wider text-left transition-colors ${
              sortBy === ['pid', 'name', 'cpu', 'mem', 'threads'][i]
                ? 'text-primary'
                : 'text-muted-foreground hover:text-primary/60'
            }`}
          >
            {header}
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-y-auto space-y-0.5 py-1">
        <AnimatePresence>
          {sorted.map((proc) => (
            <motion.div
              key={proc.pid}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-[40px_1fr_60px_60px_40px] gap-1 px-1 py-0.5 rounded-sm hover:bg-secondary/30 transition-colors group"
            >
              <span className="font-mono text-[9px] text-muted-foreground">{proc.pid}</span>
              <div className="flex items-center gap-1.5">
                <div className={`w-1.5 h-1.5 rounded-full ${stateColors[proc.state]}`} />
                <span className="font-mono text-[9px] text-foreground truncate">{proc.name}</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="flex-1 h-1 bg-secondary/50 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-primary"
                    animate={{ width: `${Math.min(100, proc.cpu)}%` }}
                    transition={{ duration: 0.5 }}
                    style={{
                      background: proc.cpu > 10
                        ? 'linear-gradient(90deg, hsl(185, 100%, 50%), hsl(45, 100%, 55%))'
                        : 'hsl(185, 100%, 50%)',
                    }}
                  />
                </div>
                <span className="font-mono text-[8px] text-primary/60 w-6 text-right">
                  {proc.cpu.toFixed(1)}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <div className="flex-1 h-1 bg-secondary/50 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-accent"
                    animate={{ width: `${Math.min(100, proc.mem * 3)}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                <span className="font-mono text-[8px] text-accent/60 w-6 text-right">
                  {proc.mem.toFixed(1)}
                </span>
              </div>
              <span className="font-mono text-[9px] text-muted-foreground text-center">{proc.threads}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}