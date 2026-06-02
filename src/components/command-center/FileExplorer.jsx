import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Folder, FileText, FileCode, FileImage, File, ChevronRight, ArrowUp } from 'lucide-react';

const FILE_TREE = {
  '~': {
    type: 'dir',
    children: {
      'Documents': {
        type: 'dir',
        children: {
          'report.pdf': { type: 'file', size: '2.4 MB', ext: 'pdf' },
          'notes.md': { type: 'file', size: '12 KB', ext: 'md' },
          'budget.xlsx': { type: 'file', size: '156 KB', ext: 'xlsx' },
        }
      },
      'Projects': {
        type: 'dir',
        children: {
          'edex-cmd': { type: 'dir', children: { 'index.js': { type: 'file', size: '8.2 KB', ext: 'js' }, 'package.json': { type: 'file', size: '1.1 KB', ext: 'json' }, 'README.md': { type: 'file', size: '3.4 KB', ext: 'md' } } },
          'neural-net': { type: 'dir', children: { 'model.py': { type: 'file', size: '24 KB', ext: 'py' }, 'train.py': { type: 'file', size: '12 KB', ext: 'py' } } },
          'api-server': { type: 'dir', children: { 'server.go': { type: 'file', size: '6.8 KB', ext: 'go' }, 'Dockerfile': { type: 'file', size: '420 B', ext: '' } } },
        }
      },
      'Downloads': {
        type: 'dir',
        children: {
          'setup.dmg': { type: 'file', size: '84 MB', ext: 'dmg' },
          'archive.tar.gz': { type: 'file', size: '12 MB', ext: 'gz' },
          'screenshot.png': { type: 'file', size: '1.8 MB', ext: 'png' },
        }
      },
      '.config': {
        type: 'dir',
        children: {
          'nvim': { type: 'dir', children: { 'init.lua': { type: 'file', size: '4.2 KB', ext: 'lua' } } },
          'starship.toml': { type: 'file', size: '890 B', ext: 'toml' },
          'alacritty.yml': { type: 'file', size: '2.1 KB', ext: 'yml' },
        }
      },
      'scripts': {
        type: 'dir',
        children: {
          'deploy.sh': { type: 'file', size: '1.4 KB', ext: 'sh' },
          'backup.sh': { type: 'file', size: '820 B', ext: 'sh' },
          'monitor.py': { type: 'file', size: '3.2 KB', ext: 'py' },
        }
      },
    }
  }
};

const codeExts = ['js', 'jsx', 'ts', 'py', 'go', 'lua', 'sh', 'json', 'toml', 'yml'];
const imageExts = ['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp'];

function getIcon(item) {
  if (item.type === 'dir') return Folder;
  if (codeExts.includes(item.ext)) return FileCode;
  if (imageExts.includes(item.ext)) return FileImage;
  if (['pdf', 'md', 'txt', 'xlsx'].includes(item.ext)) return FileText;
  return File;
}

export default function FileExplorer() {
  const [path, setPath] = useState(['~']);
  const [selected, setSelected] = useState(null);

  const getCurrentDir = () => {
    let current = FILE_TREE['~'];
    for (let i = 1; i < path.length; i++) {
      current = current.children[path[i]];
    }
    return current;
  };

  const dir = getCurrentDir();
  const entries = dir.children ? Object.entries(dir.children) : [];
  const dirs = entries.filter(([, v]) => v.type === 'dir').sort(([a], [b]) => a.localeCompare(b));
  const files = entries.filter(([, v]) => v.type === 'file').sort(([a], [b]) => a.localeCompare(b));
  const sorted = [...dirs, ...files];

  const navigate = (name) => {
    const item = dir.children[name];
    if (item.type === 'dir') {
      setPath(prev => [...prev, name]);
      setSelected(null);
    } else {
      setSelected(name);
    }
  };

  const goUp = () => {
    if (path.length > 1) {
      setPath(prev => prev.slice(0, -1));
      setSelected(null);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-1.5 px-1 pb-2 border-b border-primary/10">
        <button
          onClick={goUp}
          disabled={path.length <= 1}
          className="p-1 rounded-sm hover:bg-secondary/50 disabled:opacity-30 transition-colors"
        >
          <ArrowUp className="w-3 h-3 text-primary" />
        </button>
        <div className="flex items-center gap-0.5 overflow-x-auto">
          {path.map((segment, i) => (
            <React.Fragment key={i}>
              {i > 0 && <ChevronRight className="w-2.5 h-2.5 text-muted-foreground flex-shrink-0" />}
              <button
                onClick={() => setPath(path.slice(0, i + 1))}
                className="font-mono text-[9px] text-primary/70 hover:text-primary transition-colors whitespace-nowrap"
              >
                {segment}
              </button>
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-1 space-y-0.5">
        <AnimatePresence mode="wait">
          <motion.div
            key={path.join('/')}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-0.5"
          >
            {sorted.map(([name, item]) => {
              const Icon = getIcon(item);
              const isDir = item.type === 'dir';
              const isSelected = selected === name;
              return (
                <motion.button
                  key={name}
                  onClick={() => navigate(name)}
                  onDoubleClick={() => isDir && navigate(name)}
                  whileHover={{ x: 2 }}
                  className={`w-full flex items-center gap-2 px-2 py-1 rounded-sm text-left transition-colors ${
                    isSelected ? 'bg-primary/10 border border-primary/20' : 'hover:bg-secondary/30'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 flex-shrink-0 ${isDir ? 'text-chart-4' : 'text-primary/50'}`} />
                  <span className={`font-mono text-[10px] flex-1 truncate ${isDir ? 'text-foreground' : 'text-foreground/70'}`}>
                    {name}
                  </span>
                  {!isDir && (
                    <span className="font-mono text-[8px] text-muted-foreground">{item.size}</span>
                  )}
                </motion.button>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}