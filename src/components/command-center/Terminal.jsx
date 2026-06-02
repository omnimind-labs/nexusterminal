import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FILESYSTEM = {
  '~': ['Documents', 'Projects', 'Downloads', '.config', '.ssh', 'scripts'],
  '~/Documents': ['report.pdf', 'notes.md', 'budget.xlsx'],
  '~/Projects': ['edex-command-center', 'neural-net', 'api-server', 'data-pipeline'],
  '~/Downloads': ['setup.dmg', 'archive.tar.gz', 'image.png'],
  '~/.config': ['nvim', 'tmux.conf', 'alacritty.yml', 'starship.toml'],
  '~/.ssh': ['id_rsa', 'id_rsa.pub', 'known_hosts', 'config'],
  '~/scripts': ['deploy.sh', 'backup.sh', 'monitor.py', 'cleanup.sh'],
};

const COMMANDS = {
  help: () => [
    '╔══════════════════════════════════════════════╗',
    '║  EDEX COMMAND CENTER v3.0 — HELP             ║',
    '╠══════════════════════════════════════════════╣',
    '║  ls        — list directory contents          ║',
    '║  cd <dir>  — change directory                 ║',
    '║  pwd       — print working directory          ║',
    '║  cat <f>   — display file contents            ║',
    '║  whoami    — display current user             ║',
    '║  date      — display current date/time        ║',
    '║  uname     — system information               ║',
    '║  top       — process snapshot                 ║',
    '║  ping <h>  — ping a host                      ║',
    '║  neofetch  — system info display              ║',
    '║  clear     — clear terminal                   ║',
    '║  history   — command history                  ║',
    '╚══════════════════════════════════════════════╝',
  ],
  whoami: () => ['operator'],
  date: () => [new Date().toString()],
  uname: () => ['eDEX-OS 3.0.0 x86_64 QUANTUM-KERNEL SMP PREEMPT_RT'],
  neofetch: () => [
    '       ▄▄▄▄▄▄▄▄▄▄▄       operator@edex-command',
    '      ▄▀░░░░░░░░░░▀▄      ─────────────────────',
    '     ▐░▀▀▄▄▄▄▄▄▄▀▀░▌      OS: eDEX-OS 3.0 Quantum',
    '     ▐░░░░░░░░░░░░░▌       Kernel: 6.9.0-quantum',
    '      ▀▄░█░░░░░█░▄▀        Uptime: active',
    '        ▀▀█▀▀▀█▀▀          Shell: edex-shell 3.0',
    '       ▄▀▀░░░░░▀▀▄         Terminal: eDEX-CMD',
    '      ▐░░░░░░░░░░░▌        CPU: Quantum vCPU x8',
    '      ▐░░░░░░░░░░░▌        Memory: 32GB DDR6',
    '       ▀▄▄▄▄▄▄▄▄▄▀         Disk: 2TB NVMe SSD',
  ],
  top: () => {
    const procs = [
      { pid: 1, name: 'systemd', cpu: '0.1', mem: '0.4', state: 'S' },
      { pid: 423, name: 'node', cpu: '12.3', mem: '8.2', state: 'R' },
      { pid: 891, name: 'chrome', cpu: '8.7', mem: '15.4', state: 'S' },
      { pid: 1024, name: 'code', cpu: '5.2', mem: '11.1', state: 'S' },
      { pid: 1337, name: 'docker', cpu: '3.8', mem: '6.7', state: 'R' },
      { pid: 2048, name: 'postgres', cpu: '2.1', mem: '4.3', state: 'S' },
      { pid: 2560, name: 'nginx', cpu: '0.8', mem: '1.2', state: 'S' },
      { pid: 3072, name: 'redis', cpu: '0.5', mem: '2.1', state: 'S' },
    ];
    return [
      `  PID  NAME         CPU%   MEM%  ST`,
      `  ───  ──────────   ────   ────  ──`,
      ...procs.map(p =>
        `  ${String(p.pid).padEnd(5)}${p.name.padEnd(13)}${p.cpu.padStart(5)}  ${p.mem.padStart(5)}   ${p.state}`
      ),
    ];
  },
};

export default function Terminal() {
  const [lines, setLines] = useState([
    { type: 'system', text: '▓▓▓ eDEX COMMAND CENTER v3.0 ▓▓▓' },
    { type: 'system', text: 'Quantum shell initialized. Type "help" for commands.' },
    { type: 'system', text: '' },
  ]);
  const [input, setInput] = useState('');
  const [cwd, setCwd] = useState('~');
  const [history, setHistory] = useState([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines]);

  const executeCommand = (cmd) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;

    setHistory(prev => [...prev, trimmed]);
    setHistoryIdx(-1);

    const newLines = [{ type: 'input', text: `${cwd} ❯ ${trimmed}` }];
    const parts = trimmed.split(' ');
    const command = parts[0].toLowerCase();
    const args = parts.slice(1).join(' ');

    if (command === 'clear') {
      setLines([]);
      return;
    }

    if (command === 'history') {
      newLines.push(...history.map((h, i) => ({ type: 'output', text: `  ${i + 1}  ${h}` })));
    } else if (command === 'ls') {
      const dir = args ? (args.startsWith('~/') ? args : `${cwd}/${args}`) : cwd;
      const contents = FILESYSTEM[dir];
      if (contents) {
        newLines.push({ type: 'output', text: contents.join('  ') });
      } else {
        newLines.push({ type: 'error', text: `ls: cannot access '${args}': No such directory` });
      }
    } else if (command === 'cd') {
      if (!args || args === '~') {
        setCwd('~');
        newLines.push({ type: 'output', text: '' });
      } else if (args === '..') {
        const parent = cwd.includes('/') ? cwd.substring(0, cwd.lastIndexOf('/')) || '~' : '~';
        setCwd(parent);
        newLines.push({ type: 'output', text: '' });
      } else {
        const target = args.startsWith('~/') ? args : `${cwd}/${args}`;
        if (FILESYSTEM[target]) {
          setCwd(target);
          newLines.push({ type: 'output', text: '' });
        } else {
          newLines.push({ type: 'error', text: `cd: no such directory: ${args}` });
        }
      }
    } else if (command === 'pwd') {
      newLines.push({ type: 'output', text: `/home/operator${cwd.slice(1)}` });
    } else if (command === 'cat') {
      if (!args) {
        newLines.push({ type: 'error', text: 'cat: missing operand' });
      } else {
        newLines.push(
          { type: 'output', text: `── ${args} ──` },
          { type: 'output', text: `[Binary/text content of ${args}]` },
          { type: 'output', text: `EOF — ${Math.floor(Math.random() * 500 + 50)} bytes` }
        );
      }
    } else if (command === 'ping') {
      if (!args) {
        newLines.push({ type: 'error', text: 'ping: missing host' });
      } else {
        for (let i = 0; i < 4; i++) {
          const ms = (Math.random() * 50 + 5).toFixed(1);
          newLines.push({ type: 'output', text: `64 bytes from ${args}: seq=${i} ttl=64 time=${ms}ms` });
        }
        newLines.push({ type: 'output', text: `--- ${args} ping statistics ---` });
        newLines.push({ type: 'output', text: `4 packets transmitted, 4 received, 0% loss` });
      }
    } else if (COMMANDS[command]) {
      const output = COMMANDS[command](args);
      newLines.push(...output.map(text => ({ type: 'output', text })));
    } else {
      newLines.push({ type: 'error', text: `command not found: ${command}` });
    }

    setLines(prev => [...prev, ...newLines]);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      executeCommand(input);
      setInput('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length > 0) {
        const newIdx = historyIdx < 0 ? history.length - 1 : Math.max(0, historyIdx - 1);
        setHistoryIdx(newIdx);
        setInput(history[newIdx]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIdx >= 0) {
        const newIdx = historyIdx + 1;
        if (newIdx >= history.length) {
          setHistoryIdx(-1);
          setInput('');
        } else {
          setHistoryIdx(newIdx);
          setInput(history[newIdx]);
        }
      }
    }
  };

  const lineColors = {
    system: 'text-primary/50',
    input: 'text-primary',
    output: 'text-foreground',
    error: 'text-destructive',
  };

  return (
    <div
      className="h-full flex flex-col bg-background/50 rounded-sm cursor-text"
      onClick={() => inputRef.current?.focus()}
    >
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-2 space-y-0.5 min-h-0">
        <AnimatePresence>
          {lines.map((line, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.15 }}
              className={`terminal-line text-xs leading-relaxed ${lineColors[line.type]}`}
            >
              {line.text || '\u00A0'}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      <div className="flex items-center p-2 border-t border-primary/10">
        <span className="font-mono text-xs text-accent mr-1">{cwd}</span>
        <span className="font-mono text-xs text-primary mr-2">❯</span>
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent font-mono text-xs text-foreground outline-none caret-primary"
          autoFocus
          spellCheck={false}
        />
        <span className="typing-cursor font-mono text-xs text-primary">▊</span>
      </div>
    </div>
  );
}