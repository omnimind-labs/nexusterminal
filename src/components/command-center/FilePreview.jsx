import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { FileText, FileCode, FileImage, File, X, ChevronLeft, Eye, Code } from 'lucide-react';

const SAMPLE_FILES = {
  'README.md': {
    ext: 'md',
    content: `# edex-command-center

A modernized sci-fi terminal command center built on Wave Terminal concepts.

## Features

- **Real-time system monitoring** — CPU, RAM, disk, temperature
- **Interactive terminal** — with command history and autocomplete
- **Network topology** — live connection map
- **AI Assistant** — context-aware WAVE-AI
- **SSH Manager** — manage remote connections
- **File Preview** — render markdown, code, and more

## Quick Start

\`\`\`bash
npm install
npm run dev
\`\`\`

## Architecture

| Component | Purpose |
|-----------|---------|
| SystemStats | CPU/RAM/Disk gauges |
| Terminal | Interactive shell |
| NetworkMonitor | Traffic charts |
| AIAssistant | LLM chat |

> Built with React + Framer Motion + Recharts
`,
  },
  'deploy.sh': {
    ext: 'sh',
    content: `#!/bin/bash
# Deployment script for production servers

set -euo pipefail

SERVERS=("prod-01" "prod-02" "prod-03")
DEPLOY_PATH="/var/www/app"
RELEASE_TAG=$(git describe --tags --abbrev=0)

echo "🚀 Deploying $RELEASE_TAG to production..."

for server in "\${SERVERS[@]}"; do
  echo "→ Deploying to $server"
  ssh deploy@$server "
    cd $DEPLOY_PATH &&
    git fetch origin &&
    git checkout $RELEASE_TAG &&
    npm ci --production &&
    pm2 reload all
  "
  echo "✓ $server done"
done

echo "✅ Deployment complete: $RELEASE_TAG"
`,
  },
  'monitor.py': {
    ext: 'py',
    content: `#!/usr/bin/env python3
"""System monitoring script with alerting."""

import psutil
import time
import json
from datetime import datetime

THRESHOLDS = {
    "cpu_percent": 85.0,
    "memory_percent": 90.0,
    "disk_percent": 95.0,
}

def get_stats():
    return {
        "timestamp": datetime.utcnow().isoformat(),
        "cpu": psutil.cpu_percent(interval=1),
        "memory": psutil.virtual_memory().percent,
        "disk": psutil.disk_usage("/").percent,
        "net": psutil.net_io_counters()._asdict(),
        "processes": len(psutil.pids()),
    }

def check_alerts(stats):
    for metric, threshold in THRESHOLDS.items():
        key = metric.replace("_percent", "")
        if stats.get(key, 0) > threshold:
            print(f"⚠ ALERT: {metric} = {stats[key]:.1f}% (threshold: {threshold}%)")

if __name__ == "__main__":
    print("Starting monitor... (Ctrl+C to stop)")
    while True:
        stats = get_stats()
        print(json.dumps(stats, indent=2))
        check_alerts(stats)
        time.sleep(5)
`,
  },
  'init.lua': {
    ext: 'lua',
    content: `-- Neovim configuration
vim.opt.number = true
vim.opt.relativenumber = true
vim.opt.tabstop = 2
vim.opt.shiftwidth = 2
vim.opt.expandtab = true
vim.opt.termguicolors = true

-- Plugin manager (lazy.nvim)
local plugins = {
  { "nvim-treesitter/nvim-treesitter", build = ":TSUpdate" },
  { "nvim-lualine/lualine.nvim" },
  { "neovim/nvim-lspconfig" },
  { "hrsh7th/nvim-cmp" },
  { "catppuccin/nvim", name = "catppuccin" },
}

-- Keymaps
vim.keymap.set("n", "<leader>ff", ":Telescope find_files<CR>")
vim.keymap.set("n", "<leader>fg", ":Telescope live_grep<CR>")
vim.keymap.set("n", "<leader>e", ":NvimTreeToggle<CR>")

vim.cmd.colorscheme("catppuccin-mocha")
`,
  },
};

const LANG_COLORS = {
  sh: 'text-chart-3',
  py: 'text-chart-4',
  lua: 'text-accent',
  js: 'text-yellow-400',
  ts: 'text-blue-400',
  json: 'text-orange-400',
};

export default function FilePreview() {
  const [activeFile, setActiveFile] = useState('README.md');
  const [viewMode, setViewMode] = useState('rendered'); // 'rendered' | 'source'

  const file = SAMPLE_FILES[activeFile];
  const isMarkdown = file.ext === 'md';
  const canRender = isMarkdown;

  return (
    <div className="h-full flex flex-col">
      {/* File tabs */}
      <div className="flex gap-0.5 overflow-x-auto pb-1 flex-shrink-0">
        {Object.keys(SAMPLE_FILES).map(name => (
          <button
            key={name}
            onClick={() => { setActiveFile(name); setViewMode('rendered'); }}
            className={`flex items-center gap-1 px-2 py-1 rounded-sm text-[9px] font-mono whitespace-nowrap transition-colors flex-shrink-0 ${
              activeFile === name
                ? 'bg-primary/15 border border-primary/30 text-primary'
                : 'text-muted-foreground hover:text-foreground hover:bg-secondary/30'
            }`}
          >
            <FileCode className="w-2.5 h-2.5" />
            {name}
          </button>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between border-b border-primary/10 pb-1.5 mb-1.5 flex-shrink-0">
        <span className={`font-mono text-[9px] ${LANG_COLORS[file.ext] || 'text-muted-foreground'}`}>
          .{file.ext}
        </span>
        {canRender && (
          <div className="flex rounded-sm overflow-hidden border border-primary/15">
            {['rendered', 'source'].map(mode => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`flex items-center gap-1 px-2 py-0.5 text-[8px] font-display uppercase tracking-wider transition-colors ${
                  viewMode === mode ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {mode === 'rendered' ? <Eye className="w-2.5 h-2.5" /> : <Code className="w-2.5 h-2.5" />}
                {mode}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeFile}-${viewMode}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="h-full"
          >
            {isMarkdown && viewMode === 'rendered' ? (
              <ReactMarkdown
                className="prose prose-sm max-w-none prose-invert
                  [&_h1]:text-primary [&_h1]:font-display [&_h1]:tracking-wider [&_h1]:text-sm [&_h1]:mb-2
                  [&_h2]:text-foreground [&_h2]:font-display [&_h2]:text-xs [&_h2]:tracking-wide [&_h2]:mt-3 [&_h2]:mb-1
                  [&_p]:text-foreground/80 [&_p]:text-[11px] [&_p]:font-mono [&_p]:leading-relaxed
                  [&_code]:text-primary [&_code]:bg-primary/10 [&_code]:px-1 [&_code]:text-[10px] [&_code]:rounded-sm
                  [&_pre]:bg-secondary/50 [&_pre]:p-2 [&_pre]:rounded-sm [&_pre]:border [&_pre]:border-primary/10
                  [&_li]:text-foreground/80 [&_li]:text-[11px] [&_li]:font-mono
                  [&_strong]:text-primary [&_strong]:font-normal
                  [&_table]:border-collapse [&_table]:w-full
                  [&_th]:text-primary [&_th]:text-[9px] [&_th]:font-display [&_th]:uppercase [&_th]:tracking-wider [&_th]:border [&_th]:border-primary/20 [&_th]:px-2 [&_th]:py-1
                  [&_td]:text-foreground/80 [&_td]:text-[10px] [&_td]:font-mono [&_td]:border [&_td]:border-primary/10 [&_td]:px-2 [&_td]:py-1
                  [&_blockquote]:border-l-2 [&_blockquote]:border-primary/30 [&_blockquote]:pl-2 [&_blockquote]:text-muted-foreground
                "
              >
                {file.content}
              </ReactMarkdown>
            ) : (
              <pre className="font-mono text-[10px] text-foreground/80 whitespace-pre-wrap leading-relaxed">
                {file.content}
              </pre>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}