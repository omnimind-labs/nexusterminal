import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Folder, FolderOpen, FileText, FileCode, FileImage, File, Archive,
  ChevronRight, ArrowUp, ArrowLeft, ArrowRight, RefreshCw, Search,
  Home, Download, Settings, List, Grid3x3, Info, Terminal,
  Eye, Copy, Trash2, Edit3, MoreHorizontal, HardDrive, X
} from 'lucide-react';

// ── Data ────────────────────────────────────────────────────
const FILE_TREE = {
  '~': {
    type: 'dir', modified: '2026-06-04', perms: 'drwxr-xr-x',
    children: {
      'Documents': {
        type: 'dir', modified: '2026-06-03', perms: 'drwxr-xr-x',
        children: {
          'report.pdf':    { type: 'file', size: '2.4 MB',  ext: 'pdf',  modified: '2026-05-28', perms: '-rw-r--r--' },
          'notes.md':      { type: 'file', size: '12 KB',   ext: 'md',   modified: '2026-06-01', perms: '-rw-r--r--' },
          'budget.xlsx':   { type: 'file', size: '156 KB',  ext: 'xlsx', modified: '2026-05-20', perms: '-rw-r--r--' },
          'contracts':     { type: 'dir',  modified: '2026-04-10', perms: 'drwxr-xr-x', children: {
            'nda.pdf':       { type: 'file', size: '84 KB',  ext: 'pdf', modified: '2026-04-10', perms: '-rw-r--r--' },
            'agreement.pdf': { type: 'file', size: '112 KB', ext: 'pdf', modified: '2026-04-05', perms: '-rw-r--r--' },
          }},
        }
      },
      'Projects': {
        type: 'dir', modified: '2026-06-04', perms: 'drwxr-xr-x',
        children: {
          'edex-cmd': { type: 'dir', modified: '2026-06-04', perms: 'drwxr-xr-x', children: {
            'index.js':      { type: 'file', size: '8.2 KB', ext: 'js',   modified: '2026-06-04', perms: '-rw-r--r--' },
            'package.json':  { type: 'file', size: '1.1 KB', ext: 'json', modified: '2026-06-03', perms: '-rw-r--r--' },
            'README.md':     { type: 'file', size: '3.4 KB', ext: 'md',   modified: '2026-06-02', perms: '-rw-r--r--' },
            'src': { type: 'dir', modified: '2026-06-04', perms: 'drwxr-xr-x', children: {
              'App.jsx':        { type: 'file', size: '4.2 KB', ext: 'jsx', modified: '2026-06-04', perms: '-rw-r--r--' },
              'styles.css':     { type: 'file', size: '2.1 KB', ext: 'css', modified: '2026-06-03', perms: '-rw-r--r--' },
              'components': { type: 'dir', modified: '2026-06-04', perms: 'drwxr-xr-x', children: {
                'Terminal.jsx':  { type: 'file', size: '6.8 KB', ext: 'jsx', modified: '2026-06-04', perms: '-rw-r--r--' },
                'SystemStats.jsx': { type: 'file', size: '5.1 KB', ext: 'jsx', modified: '2026-06-04', perms: '-rw-r--r--' },
              }},
            }},
          }},
          'neural-net': { type: 'dir', modified: '2026-05-30', perms: 'drwxr-xr-x', children: {
            'model.py': { type: 'file', size: '24 KB', ext: 'py', modified: '2026-05-30', perms: '-rw-r--r--' },
            'train.py': { type: 'file', size: '12 KB', ext: 'py', modified: '2026-05-28', perms: '-rw-r--r--' },
            'data': { type: 'dir', modified: '2026-05-20', perms: 'drwxr-xr-x', children: {
              'train.csv': { type: 'file', size: '42 MB', ext: 'csv', modified: '2026-05-20', perms: '-rw-r--r--' },
              'test.csv':  { type: 'file', size: '8 MB',  ext: 'csv', modified: '2026-05-20', perms: '-rw-r--r--' },
            }},
          }},
          'api-server': { type: 'dir', modified: '2026-06-01', perms: 'drwxr-xr-x', children: {
            'server.go':   { type: 'file', size: '6.8 KB', ext: 'go', modified: '2026-06-01', perms: '-rw-r--r--' },
            'Dockerfile':  { type: 'file', size: '420 B',  ext: '',   modified: '2026-05-28', perms: '-rw-r--r--' },
            'go.mod':      { type: 'file', size: '1.2 KB', ext: 'mod', modified: '2026-05-20', perms: '-rw-r--r--' },
          }},
        }
      },
      'Downloads': {
        type: 'dir', modified: '2026-06-02', perms: 'drwxr-xr-x',
        children: {
          'setup.dmg':        { type: 'file', size: '84 MB',  ext: 'dmg', modified: '2026-06-02', perms: '-rw-r--r--' },
          'archive.tar.gz':   { type: 'file', size: '12 MB',  ext: 'gz',  modified: '2026-06-01', perms: '-rw-r--r--' },
          'screenshot.png':   { type: 'file', size: '1.8 MB', ext: 'png', modified: '2026-05-30', perms: '-rw-r--r--' },
          'waveterm.AppImage':{ type: 'file', size: '132 MB', ext: '',    modified: '2026-05-25', perms: '-rwxr-xr-x' },
        }
      },
      '.config': {
        type: 'dir', modified: '2026-05-15', perms: 'drwxr-xr-x',
        children: {
          'nvim': { type: 'dir', modified: '2026-05-15', perms: 'drwxr-xr-x', children: {
            'init.lua':  { type: 'file', size: '4.2 KB', ext: 'lua',  modified: '2026-05-15', perms: '-rw-r--r--' },
            'plugins.lua':{ type: 'file', size: '2.8 KB', ext: 'lua', modified: '2026-05-10', perms: '-rw-r--r--' },
          }},
          'starship.toml':  { type: 'file', size: '890 B', ext: 'toml', modified: '2026-05-01', perms: '-rw-r--r--' },
          'alacritty.yml':  { type: 'file', size: '2.1 KB', ext: 'yml', modified: '2026-04-20', perms: '-rw-r--r--' },
        }
      },
      'scripts': {
        type: 'dir', modified: '2026-06-03', perms: 'drwxr-xr-x',
        children: {
          'deploy.sh':  { type: 'file', size: '1.4 KB', ext: 'sh', modified: '2026-06-03', perms: '-rwxr-xr-x' },
          'backup.sh':  { type: 'file', size: '820 B',  ext: 'sh', modified: '2026-05-28', perms: '-rwxr-xr-x' },
          'monitor.py': { type: 'file', size: '3.2 KB', ext: 'py', modified: '2026-06-01', perms: '-rwxr-xr-x' },
        }
      },
    }
  }
};

const QUICK_ACCESS = [
  { label: 'Home',      path: ['~'],                    icon: Home },
  { label: 'Projects',  path: ['~', 'Projects'],        icon: FolderOpen },
  { label: 'Downloads', path: ['~', 'Downloads'],       icon: Download },
  { label: 'Scripts',   path: ['~', 'scripts'],         icon: Terminal },
  { label: '.config',   path: ['~', '.config'],         icon: Settings },
];

const CODE_EXTS = new Set(['js','jsx','ts','tsx','py','go','lua','sh','json','toml','yml','yaml','css','html','md','mod','csv']);
const IMG_EXTS  = new Set(['png','jpg','jpeg','gif','svg','webp']);
const ARCH_EXTS = new Set(['gz','tar','zip','dmg','AppImage']);

function getIcon(item, open = false) {
  if (item.type === 'dir') return open ? FolderOpen : Folder;
  if (IMG_EXTS.has(item.ext))  return FileImage;
  if (CODE_EXTS.has(item.ext)) return FileCode;
  if (ARCH_EXTS.has(item.ext)) return Archive;
  if (['pdf','xlsx','txt'].includes(item.ext)) return FileText;
  return File;
}

function getIconColor(item) {
  if (item.type === 'dir') return 'text-chart-4';
  if (IMG_EXTS.has(item.ext))  return 'text-accent';
  if (CODE_EXTS.has(item.ext)) return 'text-primary';
  if (ARCH_EXTS.has(item.ext)) return 'text-chart-5';
  return 'text-muted-foreground';
}

function getNodeAtPath(path) {
  let node = FILE_TREE['~'];
  for (let i = 1; i < path.length; i++) {
    if (!node.children || !node.children[path[i]]) return null;
    node = node.children[path[i]];
  }
  return node;
}

// ── Context Menu ─────────────────────────────────────────────
function ContextMenu({ x, y, item, name, onClose, onOpenTerminal }) {
  const ref = useRef(null);
  useEffect(() => {
    const close = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const actions = [
    { icon: Eye,     label: 'Preview',       action: () => {} },
    { icon: Copy,    label: 'Copy Path',      action: () => { navigator.clipboard.writeText(`~/${name}`); onClose(); } },
    { icon: Edit3,   label: 'Rename',         action: () => { onClose(); } },
    ...(item.type === 'dir' ? [{ icon: Terminal, label: 'Open Terminal Here', action: () => { onOpenTerminal(name); onClose(); } }] : []),
    { icon: Trash2,  label: 'Delete',         action: () => { onClose(); }, danger: true },
  ];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.1 }}
      style={{ position: 'fixed', top: y, left: x, zIndex: 1000 }}
      className="cyber-panel rounded-sm py-1 min-w-[160px] shadow-lg shadow-background/80"
    >
      <div className="px-2 py-1 border-b border-primary/10 mb-1">
        <span className="font-mono text-[9px] text-primary/60 truncate block max-w-[140px]">{name}</span>
      </div>
      {actions.map(({ icon: Icon, label, action, danger }) => (
        <button
          key={label}
          onClick={action}
          className={`w-full flex items-center gap-2 px-3 py-1.5 text-left hover:bg-secondary/40 transition-colors ${
            danger ? 'text-destructive/70 hover:text-destructive' : 'text-foreground/70 hover:text-foreground'
          }`}
        >
          <Icon className="w-3 h-3" />
          <span className="font-mono text-[10px]">{label}</span>
        </button>
      ))}
    </motion.div>
  );
}

// ── Main Component ───────────────────────────────────────────
export default function FileExplorerWindow() {
  const [path, setPath]           = useState(['~']);
  const [history, setHistory]     = useState([['~']]);
  const [histIdx, setHistIdx]     = useState(0);
  const [selected, setSelected]   = useState(null);
  const [search, setSearch]       = useState('');
  const [viewMode, setViewMode]   = useState('list'); // 'list' | 'grid'
  const [sortBy, setSortBy]       = useState('name'); // 'name' | 'size' | 'modified'
  const [sortAsc, setSortAsc]     = useState(true);
  const [showHidden, setShowHidden] = useState(false);
  const [ctxMenu, setCtxMenu]     = useState(null);
  const [termOutput, setTermOutput] = useState(null);

  const dir = getNodeAtPath(path);
  const entries = dir?.children ? Object.entries(dir.children) : [];

  const filtered = entries
    .filter(([name]) => showHidden || !name.startsWith('.'))
    .filter(([name]) => !search || name.toLowerCase().includes(search.toLowerCase()));

  const sortFn = ([a, av], [b, bv]) => {
    let cmp = 0;
    if (sortBy === 'name')     cmp = a.localeCompare(b);
    if (sortBy === 'modified') cmp = (av.modified || '').localeCompare(bv.modified || '');
    if (sortBy === 'size')     cmp = a.localeCompare(b);
    // dirs first
    if (av.type !== bv.type) return av.type === 'dir' ? -1 : 1;
    return sortAsc ? cmp : -cmp;
  };

  const sorted = [...filtered].sort(sortFn);

  const navigate = (name) => {
    const item = dir.children[name];
    if (item.type === 'dir') {
      const newPath = [...path, name];
      const newHistory = [...history.slice(0, histIdx + 1), newPath];
      setHistory(newHistory);
      setHistIdx(newHistory.length - 1);
      setPath(newPath);
      setSelected(null);
      setSearch('');
    } else {
      setSelected(name === selected ? null : name);
    }
  };

  const goTo = (newPath) => {
    const newHistory = [...history.slice(0, histIdx + 1), newPath];
    setHistory(newHistory);
    setHistIdx(newHistory.length - 1);
    setPath(newPath);
    setSelected(null);
    setSearch('');
  };

  const goBack = () => {
    if (histIdx > 0) { setHistIdx(i => i - 1); setPath(history[histIdx - 1]); setSelected(null); }
  };

  const goForward = () => {
    if (histIdx < history.length - 1) { setHistIdx(i => i + 1); setPath(history[histIdx + 1]); setSelected(null); }
  };

  const goUp = () => {
    if (path.length > 1) goTo(path.slice(0, -1));
  };

  const handleSort = (col) => {
    if (sortBy === col) setSortAsc(a => !a);
    else { setSortBy(col); setSortAsc(true); }
  };

  const handleContextMenu = (e, name, item) => {
    e.preventDefault();
    setCtxMenu({ x: e.clientX, y: e.clientY, name, item });
  };

  const selectedItem = selected ? dir?.children?.[selected] : null;
  const totalDirs  = sorted.filter(([,v]) => v.type === 'dir').length;
  const totalFiles = sorted.filter(([,v]) => v.type !== 'dir').length;

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* ── Toolbar ── */}
      <div className="flex items-center gap-1.5 px-2 py-1.5 border-b border-primary/10 flex-shrink-0">
        <button onClick={goBack} disabled={histIdx <= 0}
          className="p-1 rounded-sm hover:bg-secondary/50 disabled:opacity-25 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5 text-primary" />
        </button>
        <button onClick={goForward} disabled={histIdx >= history.length - 1}
          className="p-1 rounded-sm hover:bg-secondary/50 disabled:opacity-25 transition-colors">
          <ArrowRight className="w-3.5 h-3.5 text-primary" />
        </button>
        <button onClick={goUp} disabled={path.length <= 1}
          className="p-1 rounded-sm hover:bg-secondary/50 disabled:opacity-25 transition-colors">
          <ArrowUp className="w-3.5 h-3.5 text-primary" />
        </button>
        <button onClick={() => { setSearch(''); }}
          className="p-1 rounded-sm hover:bg-secondary/50 transition-colors">
          <RefreshCw className="w-3.5 h-3.5 text-muted-foreground" />
        </button>

        {/* Breadcrumb */}
        <div className="flex-1 flex items-center gap-0.5 bg-secondary/30 border border-primary/10 rounded-sm px-2 py-0.5 overflow-x-auto">
          {path.map((seg, i) => (
            <React.Fragment key={i}>
              {i > 0 && <ChevronRight className="w-2.5 h-2.5 text-muted-foreground/40 flex-shrink-0" />}
              <button
                onClick={() => goTo(path.slice(0, i + 1))}
                className="font-mono text-[9px] text-primary/70 hover:text-primary whitespace-nowrap transition-colors px-0.5"
              >
                {seg}
              </button>
            </React.Fragment>
          ))}
        </div>

        {/* Search */}
        <div className="flex items-center gap-1 bg-secondary/30 border border-primary/10 rounded-sm px-2 py-0.5 focus-within:border-primary/30 w-32">
          <Search className="w-3 h-3 text-muted-foreground flex-shrink-0" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Filter..."
            className="bg-transparent font-mono text-[9px] text-foreground placeholder:text-muted-foreground/30 outline-none w-full"
          />
          {search && (
            <button onClick={() => setSearch('')}><X className="w-2.5 h-2.5 text-muted-foreground" /></button>
          )}
        </div>

        {/* View toggles */}
        <div className="flex rounded-sm overflow-hidden border border-primary/15">
          {[{m:'list',I:List},{m:'grid',I:Grid3x3}].map(({m,I}) => (
            <button key={m} onClick={() => setViewMode(m)}
              className={`p-1 transition-colors ${viewMode===m ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
              <I className="w-3 h-3" />
            </button>
          ))}
        </div>

        <button onClick={() => setShowHidden(h => !h)}
          className={`p-1 rounded-sm transition-colors text-[8px] font-mono border ${showHidden ? 'border-primary/30 text-primary' : 'border-primary/10 text-muted-foreground'}`}>
          .•
        </button>
      </div>

      {/* ── Body ── */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Sidebar */}
        <div className="w-28 flex-shrink-0 border-r border-primary/10 py-2 overflow-y-auto">
          <div className="px-2 mb-1">
            <span className="font-display text-[7px] uppercase tracking-widest text-muted-foreground/60">Quick Access</span>
          </div>
          {QUICK_ACCESS.map(({ label, path: qpath, icon: Icon }) => {
            const isActive = JSON.stringify(path) === JSON.stringify(qpath);
            return (
              <button key={label} onClick={() => goTo(qpath)}
                className={`w-full flex items-center gap-2 px-2 py-1 text-left transition-colors ${
                  isActive ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-foreground hover:bg-secondary/30'
                }`}>
                <Icon className="w-3 h-3 flex-shrink-0" />
                <span className="font-mono text-[9px] truncate">{label}</span>
              </button>
            );
          })}

          <div className="px-2 mt-3 mb-1">
            <span className="font-display text-[7px] uppercase tracking-widest text-muted-foreground/60">Volumes</span>
          </div>
          {[{ label: 'Macintosh HD', used: 68 }, { label: 'External SSD', used: 34 }].map(v => (
            <div key={v.label} className="px-2 py-1">
              <div className="flex items-center gap-1.5 mb-0.5">
                <HardDrive className="w-3 h-3 text-muted-foreground" />
                <span className="font-mono text-[8px] text-muted-foreground truncate">{v.label}</span>
              </div>
              <div className="h-0.5 bg-secondary/50 rounded-full">
                <div className="h-full bg-primary/40 rounded-full" style={{ width: `${v.used}%` }} />
              </div>
              <span className="font-mono text-[7px] text-muted-foreground/60">{v.used}% used</span>
            </div>
          ))}
        </div>

        {/* Main pane */}
        <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
          {/* Column headers (list mode) */}
          {viewMode === 'list' && (
            <div className="flex items-center gap-2 px-2 py-1 border-b border-primary/5 flex-shrink-0">
              {[
                { col: 'name', label: 'Name', flex: 1 },
                { col: 'size', label: 'Size', w: 'w-16' },
                { col: 'modified', label: 'Modified', w: 'w-20' },
                { col: 'perms', label: 'Perms', w: 'w-24' },
              ].map(({ col, label, flex, w }) => (
                <button key={col} onClick={() => handleSort(col)}
                  className={`flex items-center gap-0.5 font-display text-[7px] uppercase tracking-wider text-muted-foreground/60 hover:text-muted-foreground transition-colors ${flex ? 'flex-1' : w}`}>
                  {label}
                  {sortBy === col && <span className="text-primary">{sortAsc ? '↑' : '↓'}</span>}
                </button>
              ))}
            </div>
          )}

          {/* File list */}
          <div className="flex-1 overflow-y-auto p-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={path.join('/') + search}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.15 }}
              >
                {sorted.length === 0 && (
                  <div className="flex items-center justify-center h-24 text-muted-foreground font-mono text-[10px]">
                    {search ? `No matches for "${search}"` : 'Empty directory'}
                  </div>
                )}

                {viewMode === 'list' ? (
                  <div className="space-y-0.5">
                    {sorted.map(([name, item]) => {
                      const Icon = getIcon(item, false);
                      const isDir = item.type === 'dir';
                      const isSel = selected === name;
                      const childCount = isDir ? Object.keys(item.children || {}).length : null;
                      return (
                        <motion.div
                          key={name}
                          whileHover={{ x: 1 }}
                          onContextMenu={(e) => handleContextMenu(e, name, item)}
                          onClick={() => navigate(name)}
                          onDoubleClick={() => isDir && navigate(name)}
                          className={`flex items-center gap-2 px-2 py-1 rounded-sm cursor-pointer transition-colors group ${
                            isSel ? 'bg-primary/10 border border-primary/20' : 'hover:bg-secondary/25'
                          }`}
                        >
                          <Icon className={`w-3.5 h-3.5 flex-shrink-0 ${getIconColor(item)}`} />
                          <span className={`font-mono text-[10px] flex-1 truncate ${isDir ? 'text-foreground' : 'text-foreground/80'}`}>
                            {name}
                          </span>
                          <span className="font-mono text-[8px] text-muted-foreground w-16 text-right">
                            {isDir ? (childCount !== null ? `${childCount} items` : '—') : item.size}
                          </span>
                          <span className="font-mono text-[8px] text-muted-foreground w-20">{item.modified}</span>
                          <span className="font-mono text-[8px] text-muted-foreground/50 w-24">{item.perms}</span>
                        </motion.div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-2 p-1">
                    {sorted.map(([name, item]) => {
                      const Icon = getIcon(item, false);
                      const isDir = item.type === 'dir';
                      const isSel = selected === name;
                      return (
                        <motion.div
                          key={name}
                          whileHover={{ scale: 1.02 }}
                          onContextMenu={(e) => handleContextMenu(e, name, item)}
                          onClick={() => navigate(name)}
                          onDoubleClick={() => isDir && navigate(name)}
                          className={`flex flex-col items-center gap-1 p-2 rounded-sm cursor-pointer transition-colors text-center ${
                            isSel ? 'bg-primary/10 border border-primary/20' : 'hover:bg-secondary/25'
                          }`}
                        >
                          <Icon className={`w-8 h-8 ${getIconColor(item)}`} />
                          <span className={`font-mono text-[9px] w-full truncate ${isDir ? 'text-foreground' : 'text-foreground/80'}`}>
                            {name}
                          </span>
                          <span className="font-mono text-[7px] text-muted-foreground">
                            {isDir ? `${Object.keys(item.children || {}).length} items` : item.size}
                          </span>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Status bar */}
          <div className="flex items-center gap-3 px-2 py-1 border-t border-primary/5 flex-shrink-0">
            <span className="font-mono text-[8px] text-muted-foreground/60">
              {totalDirs} folder{totalDirs !== 1 ? 's' : ''}, {totalFiles} file{totalFiles !== 1 ? 's' : ''}
              {search && ` (filtered)`}
            </span>
            {selected && selectedItem && (
              <>
                <span className="text-primary/20">·</span>
                <span className="font-mono text-[8px] text-primary/60 truncate">
                  {selected} {selectedItem.size ? `· ${selectedItem.size}` : ''} · {selectedItem.modified}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Info panel — shown when file is selected */}
        <AnimatePresence>
          {selected && selectedItem && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 140, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="border-l border-primary/10 flex-shrink-0 overflow-hidden"
            >
              <div className="w-[140px] h-full flex flex-col p-3 gap-3 overflow-y-auto">
                <div className="flex items-center justify-between">
                  <span className="font-display text-[7px] uppercase tracking-widest text-muted-foreground/60">Info</span>
                  <button onClick={() => setSelected(null)}>
                    <X className="w-3 h-3 text-muted-foreground hover:text-foreground transition-colors" />
                  </button>
                </div>

                {/* Icon preview */}
                <div className="flex justify-center">
                  {(() => { const Icon = getIcon(selectedItem, false); return <Icon className={`w-12 h-12 ${getIconColor(selectedItem)}`} />; })()}
                </div>

                <div className="space-y-2">
                  <div>
                    <div className="font-display text-[7px] uppercase tracking-widest text-muted-foreground/50 mb-0.5">Name</div>
                    <div className="font-mono text-[9px] text-foreground break-all">{selected}</div>
                  </div>
                  <div>
                    <div className="font-display text-[7px] uppercase tracking-widest text-muted-foreground/50 mb-0.5">Type</div>
                    <div className="font-mono text-[9px] text-foreground">{selectedItem.type === 'dir' ? 'Directory' : (selectedItem.ext || 'File').toUpperCase()}</div>
                  </div>
                  {selectedItem.size && (
                    <div>
                      <div className="font-display text-[7px] uppercase tracking-widest text-muted-foreground/50 mb-0.5">Size</div>
                      <div className="font-mono text-[9px] text-foreground">{selectedItem.size}</div>
                    </div>
                  )}
                  <div>
                    <div className="font-display text-[7px] uppercase tracking-widest text-muted-foreground/50 mb-0.5">Modified</div>
                    <div className="font-mono text-[9px] text-foreground">{selectedItem.modified}</div>
                  </div>
                  <div>
                    <div className="font-display text-[7px] uppercase tracking-widest text-muted-foreground/50 mb-0.5">Permissions</div>
                    <div className="font-mono text-[9px] text-primary/80">{selectedItem.perms}</div>
                  </div>
                  <div>
                    <div className="font-display text-[7px] uppercase tracking-widest text-muted-foreground/50 mb-0.5">Path</div>
                    <div className="font-mono text-[9px] text-muted-foreground break-all">{path.join('/')}/{selected}</div>
                  </div>
                </div>

                {/* Quick actions */}
                <div className="space-y-1 border-t border-primary/10 pt-2">
                  <button onClick={() => navigator.clipboard.writeText(`${path.join('/')}/${selected}`)}
                    className="w-full flex items-center gap-1.5 px-2 py-1 rounded-sm bg-secondary/30 hover:bg-secondary/50 transition-colors">
                    <Copy className="w-3 h-3 text-muted-foreground" />
                    <span className="font-mono text-[9px] text-muted-foreground">Copy Path</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Context Menu */}
      <AnimatePresence>
        {ctxMenu && (
          <ContextMenu
            x={ctxMenu.x} y={ctxMenu.y}
            name={ctxMenu.name} item={ctxMenu.item}
            onClose={() => setCtxMenu(null)}
            onOpenTerminal={(name) => setTermOutput(`cd ~/${path.slice(1).join('/')}/${name}`)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}