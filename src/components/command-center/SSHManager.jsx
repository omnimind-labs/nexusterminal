import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Server, Plus, Wifi, WifiOff, Terminal, Trash2, Edit2, Check, X, ShieldCheck } from 'lucide-react';

const INITIAL_HOSTS = [
  { id: 1, name: 'prod-server-01', host: '192.168.1.100', user: 'deploy', port: 22, status: 'connected', latency: 12, tags: ['prod'] },
  { id: 2, name: 'dev-box', host: '10.0.0.55', user: 'operator', port: 22, status: 'connected', latency: 4, tags: ['dev'] },
  { id: 3, name: 'db-replica', host: '172.16.0.12', user: 'postgres', port: 5432, status: 'idle', latency: 28, tags: ['db'] },
  { id: 4, name: 'staging-web', host: '203.0.113.42', user: 'www', port: 22, status: 'offline', latency: null, tags: ['staging'] },
  { id: 5, name: 'vpn-gateway', host: '198.51.100.1', user: 'root', port: 22, status: 'idle', latency: 55, tags: ['infra'] },
];

const TAG_COLORS = {
  prod: 'text-destructive border-destructive/30',
  dev: 'text-chart-3 border-chart-3/30',
  db: 'text-chart-4 border-chart-4/30',
  staging: 'text-accent border-accent/30',
  infra: 'text-primary border-primary/30',
};

const STATUS_CONFIG = {
  connected: { icon: Wifi, color: 'text-chart-3', dot: 'bg-chart-3', label: 'CONNECTED' },
  idle: { icon: Wifi, color: 'text-chart-4', dot: 'bg-chart-4', label: 'IDLE' },
  offline: { icon: WifiOff, color: 'text-muted-foreground', dot: 'bg-muted-foreground/40', label: 'OFFLINE' },
};

export default function SSHManager() {
  const [hosts, setHosts] = useState(INITIAL_HOSTS);
  const [selected, setSelected] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [newHost, setNewHost] = useState({ name: '', host: '', user: 'operator', port: 22 });
  const [connecting, setConnecting] = useState(null);

  const connect = (id) => {
    const host = hosts.find(h => h.id === id);
    if (host.status === 'offline') return;
    setConnecting(id);
    setTimeout(() => {
      setHosts(prev => prev.map(h => h.id === id
        ? { ...h, status: h.status === 'connected' ? 'idle' : 'connected', latency: Math.floor(Math.random() * 60 + 5) }
        : h
      ));
      setConnecting(null);
    }, 1200);
  };

  const removeHost = (id) => setHosts(prev => prev.filter(h => h.id !== id));

  const addHost = () => {
    if (!newHost.name || !newHost.host) return;
    setHosts(prev => [...prev, {
      ...newHost,
      id: Date.now(),
      status: 'offline',
      latency: null,
      tags: ['new'],
      port: Number(newHost.port),
    }]);
    setNewHost({ name: '', host: '', user: 'operator', port: 22 });
    setShowAdd(false);
  };

  const selectedHost = hosts.find(h => h.id === selected);

  return (
    <div className="h-full flex flex-col gap-2">
      {/* Host List */}
      <div className="flex-1 min-h-0 overflow-y-auto space-y-1">
        <AnimatePresence>
          {hosts.map(host => {
            const st = STATUS_CONFIG[host.status];
            const isConn = connecting === host.id;
            return (
              <motion.div
                key={host.id}
                layout
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                onClick={() => setSelected(selected === host.id ? null : host.id)}
                className={`px-2 py-1.5 rounded-sm border cursor-pointer transition-all ${
                  selected === host.id
                    ? 'border-primary/40 bg-primary/5'
                    : 'border-primary/5 bg-secondary/20 hover:border-primary/20 hover:bg-secondary/40'
                }`}
              >
                <div className="flex items-center gap-2">
                  <motion.div
                    className={`w-1.5 h-1.5 rounded-full ${st.dot} flex-shrink-0`}
                    animate={host.status === 'connected' ? { opacity: [0.5, 1, 0.5] } : {}}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <span className="font-mono text-[11px] text-foreground flex-1 truncate">{host.name}</span>
                  {host.latency && (
                    <span className="font-mono text-[8px] text-muted-foreground">{host.latency}ms</span>
                  )}
                  <div className="flex gap-1">
                    {host.tags.map(t => (
                      <span key={t} className={`font-display text-[7px] px-1 border rounded-sm ${TAG_COLORS[t] || 'text-muted-foreground border-border'}`}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-1 mt-0.5 ml-3.5">
                  <span className="font-mono text-[9px] text-muted-foreground">{host.user}@{host.host}:{host.port}</span>
                </div>

                <AnimatePresence>
                  {selected === host.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="flex gap-1.5 mt-2 pt-2 border-t border-primary/10">
                        <button
                          onClick={(e) => { e.stopPropagation(); connect(host.id); }}
                          disabled={host.status === 'offline' || isConn}
                          className="flex items-center gap-1 px-2 py-1 rounded-sm bg-primary/10 border border-primary/20 hover:bg-primary/20 disabled:opacity-40 transition-colors"
                        >
                          {isConn
                            ? <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}><Wifi className="w-2.5 h-2.5 text-primary" /></motion.div>
                            : <Terminal className="w-2.5 h-2.5 text-primary" />
                          }
                          <span className="font-display text-[7px] uppercase tracking-wider text-primary">
                            {host.status === 'connected' ? 'Disconnect' : 'Connect'}
                          </span>
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); removeHost(host.id); setSelected(null); }}
                          className="p-1 rounded-sm border border-destructive/20 text-destructive/60 hover:text-destructive hover:bg-destructive/10 transition-colors"
                        >
                          <Trash2 className="w-2.5 h-2.5" />
                        </button>
                        <div className="flex-1" />
                        <div className="flex items-center gap-1">
                          <ShieldCheck className="w-2.5 h-2.5 text-chart-3" />
                          <span className="font-mono text-[8px] text-chart-3">KEY AUTH</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Add Host */}
      <AnimatePresence>
        {showAdd && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-primary/10 pt-2 space-y-1.5"
          >
            {[
              { key: 'name', placeholder: 'Alias (e.g. prod-web)' },
              { key: 'host', placeholder: 'Host / IP' },
              { key: 'user', placeholder: 'Username' },
              { key: 'port', placeholder: 'Port', type: 'number' },
            ].map(field => (
              <input
                key={field.key}
                type={field.type || 'text'}
                placeholder={field.placeholder}
                value={newHost[field.key]}
                onChange={e => setNewHost(prev => ({ ...prev, [field.key]: e.target.value }))}
                className="w-full bg-secondary/30 border border-primary/15 rounded-sm px-2 py-1 font-mono text-[10px] text-foreground placeholder:text-muted-foreground/40 outline-none focus:border-primary/40"
              />
            ))}
            <div className="flex gap-1.5">
              <button onClick={addHost}
                className="flex-1 flex items-center justify-center gap-1 py-1 rounded-sm bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20 transition-colors">
                <Check className="w-3 h-3" />
                <span className="font-display text-[8px] uppercase tracking-wider">Add</span>
              </button>
              <button onClick={() => setShowAdd(false)}
                className="px-3 py-1 rounded-sm border border-primary/10 text-muted-foreground hover:text-foreground transition-colors">
                <X className="w-3 h-3" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!showAdd && (
        <button onClick={() => setShowAdd(true)}
          className="flex items-center justify-center gap-1.5 py-1.5 rounded-sm border border-dashed border-primary/20 text-muted-foreground hover:border-primary/40 hover:text-primary transition-colors">
          <Plus className="w-3 h-3" />
          <span className="font-display text-[8px] uppercase tracking-widest">Add Host</span>
        </button>
      )}
    </div>
  );
}