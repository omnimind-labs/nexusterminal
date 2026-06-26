import React, { useState, useRef } from 'react';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { Cpu, MemoryStick } from 'lucide-react';

import { usePollingInterval } from '@/hooks/usePollingInterval';
import { randomWalk } from '@/utils/randomWalk';

const MAX_POINTS = 40;

function initSeries(len, base = 30) {
  return Array.from({ length: len }, (_, i) => ({
    t: i,
    v: base + (Math.random() - 0.5) * 20,
  }));
}

const CustomTooltip = ({ active, payload, label, color, unit = '%' }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-primary/20 px-2 py-1 rounded-sm font-mono text-[10px]">
      <span style={{ color }}>{payload[0].value.toFixed(1)}{unit}</span>
    </div>
  );
};

function MiniChart({ data, color, gradientId, label, value, icon: Icon, sublabel }) {
  return (
    <div className="flex flex-col gap-1 flex-1 min-w-0">
      {/* Header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-1.5">
          <Icon className="w-3 h-3" style={{ color }} />
          <span className="font-display text-[9px] uppercase tracking-wider text-muted-foreground">{label}</span>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="font-mono text-lg font-bold" style={{ color, textShadow: `0 0 10px ${color}55` }}>
            {value.toFixed(1)}
          </span>
          <span className="font-mono text-[9px] text-muted-foreground">%</span>
        </div>
      </div>
      {sublabel && (
        <p className="font-mono text-[8px] text-muted-foreground px-1">{sublabel}</p>
      )}
      {/* Chart */}
      <div className="flex-1 min-h-0" style={{ minHeight: 60 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 2, right: 2, left: -30, bottom: 0 }}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.25} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="t" hide />
            <YAxis domain={[0, 100]} tick={{ fontSize: 8, fill: 'hsl(185 40% 40%)' }} tickLine={false} axisLine={false} />
            <Tooltip content={<CustomTooltip color={color} />} />
            <Area
              type="monotoneX"
              dataKey="v"
              stroke={color}
              strokeWidth={1.5}
              fill={`url(#${gradientId})`}
              dot={false}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default function CpuMemoryMonitor() {
  const tickRef = useRef(MAX_POINTS);

  const [cpuData, setCpuData] = useState(() => initSeries(MAX_POINTS, 35));
  const [memData, setMemData] = useState(() => initSeries(MAX_POINTS, 55));
  const [cpuCores, setCpuCores] = useState(() =>
    Array.from({ length: 8 }, () => 20 + Math.random() * 60)
  );
  const [memUsed, setMemUsed] = useState(7.2);
  const memTotal = 16;

  usePollingInterval(() => {
    const t = tickRef.current++;

    setCpuData(prev => {
      const last = prev[prev.length - 1]?.v ?? 35;
      return [...prev.slice(-MAX_POINTS + 1), { t, v: randomWalk(last, { volatility: 14, min: 2, max: 98 }) }];
    });

    setMemData(prev => {
      const last = prev[prev.length - 1]?.v ?? 55;
      return [...prev.slice(-MAX_POINTS + 1), { t, v: randomWalk(last, { volatility: 5, min: 20, max: 90 }) }];
    });

    setCpuCores(prev =>
      prev.map(c => randomWalk(c, { volatility: 18, min: 2, max: 99 }))
    );

    setMemUsed(prev => randomWalk(prev, { volatility: 0.6, min: 2, max: memTotal - 0.5, bias: -0.01 }));
  }, 800);

  const currentCpu = cpuData[cpuData.length - 1]?.v ?? 0;
  const currentMem = memData[memData.length - 1]?.v ?? 0;

  const cpuColor = currentCpu > 80 ? '#ff4444' : currentCpu > 60 ? '#ffb300' : '#00e5ff';
  const memColor = currentMem > 80 ? '#ff4444' : currentMem > 60 ? '#a855f7' : '#00e5ff';

  return (
    <div className="flex flex-col gap-3 h-full p-1">
      {/* Top: two charts side by side */}
      <div className="flex gap-3 flex-1 min-h-0">
        <MiniChart
          data={cpuData}
          color={cpuColor}
          gradientId="cpuGrad"
          label="CPU"
          value={currentCpu}
          icon={Cpu}
          sublabel={`8 cores · avg ${currentCpu.toFixed(0)}%`}
        />
        <div className="w-px bg-primary/10 flex-shrink-0" />
        <MiniChart
          data={memData}
          color={memColor}
          gradientId="memGrad"
          label="Memory"
          value={currentMem}
          icon={MemoryStick}
          sublabel={`${memUsed.toFixed(1)} / ${memTotal} GB used`}
        />
      </div>

      {/* Bottom: CPU cores bar */}
      <div className="border-t border-primary/10 pt-2 flex-shrink-0">
        <p className="font-display text-[8px] uppercase tracking-wider text-muted-foreground mb-1.5 px-1">
          Core Load
        </p>
        <div className="grid grid-cols-8 gap-1 px-1">
          {cpuCores.map((load, i) => (
            <div key={i} className="flex flex-col items-center gap-0.5">
              <div className="w-full bg-secondary/40 rounded-sm overflow-hidden" style={{ height: 28 }}>
                <div
                  className="w-full rounded-sm transition-all duration-700"
                  style={{
                    height: `${load}%`,
                    marginTop: `${100 - load}%`,
                    background: load > 80
                      ? 'linear-gradient(180deg, #ff4444, #ff000088)'
                      : load > 60
                      ? 'linear-gradient(180deg, #ffb300, #ffb30066)'
                      : `linear-gradient(180deg, ${cpuColor}, ${cpuColor}55)`,
                  }}
                />
              </div>
              <span className="font-mono text-[7px] text-muted-foreground">{i + 1}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}