import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, ResponsiveContainer, YAxis } from 'recharts';

function TrafficChart({ data, color, label, value }) {
  return (
    <div className="flex-1">
      <div className="flex items-center justify-between mb-1">
        <span className="font-display text-[8px] uppercase tracking-widest text-muted-foreground">{label}</span>
        <span className="font-mono text-[10px]" style={{ color }}>{value}</span>
      </div>
      <div className="h-12 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id={`grad-${label}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.4} />
                <stop offset="100%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <YAxis hide domain={[0, 'auto']} />
            <Area
              type="monotone" dataKey="v" stroke={color} strokeWidth={1.5}
              fill={`url(#grad-${label})`} isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default function NetworkMonitor() {
  const [downloadData, setDownloadData] = useState(
    Array.from({ length: 40 }, () => ({ v: Math.random() * 50 + 10 }))
  );
  const [uploadData, setUploadData] = useState(
    Array.from({ length: 40 }, () => ({ v: Math.random() * 20 + 5 }))
  );
  const [connections, setConnections] = useState([
    { ip: '192.168.1.1', port: 443, proto: 'HTTPS', status: 'ESTABLISHED', geo: 'US-East' },
    { ip: '10.0.0.55', port: 5432, proto: 'TCP', status: 'ESTABLISHED', geo: 'Local' },
    { ip: '172.16.0.12', port: 8080, proto: 'HTTP', status: 'LISTENING', geo: 'EU-West' },
    { ip: '203.0.113.42', port: 22, proto: 'SSH', status: 'ESTABLISHED', geo: 'AP-South' },
    { ip: '198.51.100.7', port: 27017, proto: 'TCP', status: 'TIME_WAIT', geo: 'US-West' },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setDownloadData(prev => [...prev.slice(1), { v: Math.max(5, prev[prev.length - 1].v + (Math.random() - 0.45) * 30) }]);
      setUploadData(prev => [...prev.slice(1), { v: Math.max(2, prev[prev.length - 1].v + (Math.random() - 0.48) * 15) }]);
      setConnections(prev => prev.map(c => ({
        ...c,
        status: Math.random() > 0.9 ? ['ESTABLISHED', 'LISTENING', 'TIME_WAIT'][Math.floor(Math.random() * 3)] : c.status,
      })));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const dlSpeed = downloadData[downloadData.length - 1]?.v.toFixed(1);
  const ulSpeed = uploadData[uploadData.length - 1]?.v.toFixed(1);

  const statusColors = {
    ESTABLISHED: 'text-chart-3',
    LISTENING: 'text-chart-4',
    TIME_WAIT: 'text-muted-foreground',
  };

  return (
    <div className="h-full flex flex-col gap-3">
      <div className="flex gap-3">
        <TrafficChart data={downloadData} color="hsl(185, 100%, 50%)" label="Download" value={`${dlSpeed} MB/s`} />
        <TrafficChart data={uploadData} color="hsl(260, 100%, 65%)" label="Upload" value={`${ulSpeed} MB/s`} />
      </div>

      <div className="flex-1 min-h-0">
        <div className="flex items-center justify-between mb-1.5">
          <span className="font-display text-[8px] uppercase tracking-widest text-muted-foreground">Active Connections</span>
          <span className="font-mono text-[9px] text-primary/50">{connections.length} active</span>
        </div>
        <div className="space-y-1 overflow-y-auto max-h-28">
          {connections.map((conn, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-between font-mono text-[9px] px-1.5 py-1 rounded-sm bg-secondary/30"
            >
              <span className="text-foreground">{conn.ip}:{conn.port}</span>
              <span className="text-muted-foreground">{conn.proto}</span>
              <span className={statusColors[conn.status] || 'text-muted-foreground'}>{conn.status}</span>
              <span className="text-primary/40">{conn.geo}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}