import React, { useEffect, useRef, useState } from 'react';

const NODES = [
  { x: 30, y: 25, label: 'US-E', active: true },
  { x: 15, y: 30, label: 'US-W', active: true },
  { x: 48, y: 22, label: 'EU-W', active: true },
  { x: 55, y: 20, label: 'EU-C', active: false },
  { x: 75, y: 35, label: 'AP-S', active: true },
  { x: 82, y: 28, label: 'AP-E', active: false },
  { x: 40, y: 55, label: 'AF-N', active: true },
  { x: 60, y: 45, label: 'ME', active: false },
  { x: 85, y: 60, label: 'OCE', active: true },
  { x: 25, y: 65, label: 'SA', active: true },
];

const CONNECTIONS = [
  [0, 2], [0, 1], [2, 3], [2, 4], [4, 5],
  [0, 6], [2, 7], [4, 8], [0, 9], [6, 7],
];

export default function GlobeViz() {
  const [activeConn, setActiveConn] = useState(0);
  const [pulses, setPulses] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveConn(prev => (prev + 1) % CONNECTIONS.length);
      setPulses(prev => {
        const connIdx = Math.floor(Math.random() * CONNECTIONS.length);
        const newPulse = { id: Date.now(), conn: connIdx, progress: 0 };
        return [...prev.filter(p => p.progress < 1), newPulse].slice(-5);
      });
    }, 1500);

    const pulseInterval = setInterval(() => {
      setPulses(prev => prev.map(p => ({ ...p, progress: Math.min(1, p.progress + 0.05) })));
    }, 50);

    return () => {
      clearInterval(interval);
      clearInterval(pulseInterval);
    };
  }, []);

  return (
    <div className="h-full w-full relative">
      <svg viewBox="0 0 100 80" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
        <defs>
          <filter id="node-glow">
            <feGaussianBlur stdDeviation="1" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <radialGradient id="pulse-grad">
            <stop offset="0%" stopColor="hsl(185, 100%, 50%)" stopOpacity="0.8" />
            <stop offset="100%" stopColor="hsl(185, 100%, 50%)" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Grid lines */}
        {Array.from({ length: 7 }, (_, i) => (
          <line key={`h${i}`} x1="0" y1={i * 13} x2="100" y2={i * 13}
            stroke="hsl(185, 100%, 50%)" strokeOpacity="0.03" strokeWidth="0.2" />
        ))}
        {Array.from({ length: 9 }, (_, i) => (
          <line key={`v${i}`} x1={i * 12.5} y1="0" x2={i * 12.5} y2="80"
            stroke="hsl(185, 100%, 50%)" strokeOpacity="0.03" strokeWidth="0.2" />
        ))}

        {/* Connections */}
        {CONNECTIONS.map(([from, to], i) => {
          const n1 = NODES[from];
          const n2 = NODES[to];
          const isActive = i === activeConn;
          return (
            <line
              key={`conn-${i}`}
              x1={n1.x} y1={n1.y} x2={n2.x} y2={n2.y}
              stroke={isActive ? 'hsl(185, 100%, 50%)' : 'hsl(185, 100%, 50%)'}
              strokeOpacity={isActive ? 0.5 : 0.1}
              strokeWidth={isActive ? 0.4 : 0.2}
              strokeDasharray={isActive ? '' : '1 1'}
            />
          );
        })}

        {/* Pulse packets traveling along connections */}
        {pulses.map(pulse => {
          const [from, to] = CONNECTIONS[pulse.conn];
          const n1 = NODES[from];
          const n2 = NODES[to];
          const x = n1.x + (n2.x - n1.x) * pulse.progress;
          const y = n1.y + (n2.y - n1.y) * pulse.progress;
          return (
            <circle
              key={pulse.id}
              cx={x} cy={y} r={0.8}
              fill="hsl(185, 100%, 50%)"
              opacity={1 - pulse.progress}
              filter="url(#node-glow)"
            />
          );
        })}

        {/* Nodes */}
        {NODES.map((node, i) => (
          <g key={i}>
            {node.active && (
              <circle cx={node.x} cy={node.y} r="3"
                fill="none" stroke="hsl(185, 100%, 50%)" strokeOpacity="0.15" strokeWidth="0.3">
                <animate attributeName="r" from="2" to="5" dur="3s" repeatCount="indefinite" />
                <animate attributeName="stroke-opacity" from="0.2" to="0" dur="3s" repeatCount="indefinite" />
              </circle>
            )}
            <circle
              cx={node.x} cy={node.y} r="1.2"
              fill={node.active ? 'hsl(185, 100%, 50%)' : 'hsl(185, 100%, 30%)'}
              filter="url(#node-glow)"
              opacity={node.active ? 1 : 0.4}
            />
            <text
              x={node.x} y={node.y - 3}
              textAnchor="middle"
              fill="hsl(185, 80%, 60%)"
              fontSize="2.2"
              fontFamily="'Orbitron', monospace"
              opacity="0.6"
            >
              {node.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}