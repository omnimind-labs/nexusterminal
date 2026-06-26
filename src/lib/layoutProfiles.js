// Default widget layouts per profile type
// Each widget: { i: id, x, y, w, h, minW, minH }

export const WIDGET_REGISTRY = {
  terminal:     { label: 'Terminal',        type: 'terminal' },
  system:       { label: 'System Monitor',  type: 'system' },
  network:      { label: 'Network Traffic', type: 'network' },
  processes:    { label: 'Processes',       type: 'processes' },
  files:        { label: 'File System',     type: 'files' },
  datastream:   { label: 'Data Stream',     type: 'datastream' },
  globe:        { label: 'Globe / Topology',type: 'globe' },
  quickstats:   { label: 'Live Metrics',    type: 'quickstats' },
  ai:           { label: 'WAVE-AI',         type: 'ai' },
  ssh:          { label: 'SSH Manager',     type: 'ssh' },
  filepreview:  { label: 'File Preview',    type: 'filepreview' },
  browser:      { label: 'Web Browser',     type: 'browser' },
  fileexplorer: { label: 'File Explorer',   type: 'fileexplorer' },
  cpumem:       { label: 'CPU & Memory',    type: 'cpumem' },
};

export const DEFAULT_PROFILES = {
  dashboard: {
    name: 'Dashboard',
    layout: [
      { i: 'system',     x: 0,  y: 0, w: 5,  h: 8,  minW: 3, minH: 5 },
      { i: 'terminal',   x: 5,  y: 0, w: 11, h: 14, minW: 4, minH: 6 },
      { i: 'globe',      x: 16, y: 0, w: 8,  h: 8,  minW: 4, minH: 5 },
      { i: 'network',    x: 16, y: 8, w: 8,  h: 8,  minW: 4, minH: 5 },
      { i: 'processes',  x: 5,  y: 14,w: 6,  h: 8,  minW: 3, minH: 5 },
      { i: 'quickstats', x: 11, y: 14,w: 5,  h: 8,  minW: 3, minH: 5 },
      { i: 'files',      x: 0,  y: 8, w: 5,  h: 6,  minW: 3, minH: 4 },
      { i: 'datastream', x: 0,  y: 14,w: 5,  h: 8,  minW: 3, minH: 4 },
      { i: 'cpumem',     x: 16, y: 16,w: 8,  h: 10, minW: 5, minH: 7 },
    ],
  },
  ai: {
    name: 'WAVE-AI',
    layout: [
      { i: 'system',    x: 0,  y: 0, w: 5,  h: 10, minW: 3, minH: 5 },
      { i: 'terminal',  x: 5,  y: 0, w: 9,  h: 12, minW: 4, minH: 6 },
      { i: 'ai',        x: 14, y: 0, w: 10, h: 14, minW: 5, minH: 8 },
      { i: 'processes', x: 5,  y: 12,w: 9,  h: 8,  minW: 3, minH: 5 },
      { i: 'network',   x: 0,  y: 10,w: 5,  h: 10, minW: 3, minH: 5 },
    ],
  },
  ssh: {
    name: 'SSH',
    layout: [
      { i: 'ssh',      x: 0,  y: 0, w: 7,  h: 12, minW: 4, minH: 6 },
      { i: 'globe',    x: 0,  y: 12,w: 7,  h: 10, minW: 4, minH: 6 },
      { i: 'terminal', x: 7,  y: 0, w: 10, h: 14, minW: 4, minH: 6 },
      { i: 'network',  x: 17, y: 0, w: 7,  h: 11, minW: 4, minH: 5 },
      { i: 'system',   x: 17, y: 11,w: 7,  h: 11, minW: 3, minH: 5 },
    ],
  },
  files: {
    name: 'Files',
    layout: [
      { i: 'fileexplorer', x: 0,  y: 0, w: 15, h: 22, minW: 6, minH: 8 },
      { i: 'terminal',     x: 15, y: 0, w: 9,  h: 11, minW: 4, minH: 6 },
      { i: 'filepreview',  x: 15, y: 11,w: 9,  h: 11, minW: 4, minH: 6 },
    ],
  },
  preview: {
    name: 'Preview',
    layout: [
      { i: 'files',       x: 0,  y: 0, w: 5,  h: 11, minW: 3, minH: 5 },
      { i: 'system',      x: 0,  y: 11,w: 5,  h: 11, minW: 3, minH: 5 },
      { i: 'terminal',    x: 5,  y: 0, w: 9,  h: 12, minW: 4, minH: 6 },
      { i: 'filepreview', x: 14, y: 0, w: 10, h: 14, minW: 5, minH: 6 },
      { i: 'ai',          x: 14, y: 14,w: 10, h: 8,  minW: 4, minH: 5 },
    ],
  },
  browser: {
    name: 'Browser',
    layout: [
      { i: 'system',  x: 0,  y: 0, w: 5,  h: 11, minW: 3, minH: 5 },
      { i: 'terminal',x: 0,  y: 11,w: 5,  h: 11, minW: 4, minH: 6 },
      { i: 'browser', x: 5,  y: 0, w: 13, h: 22, minW: 6, minH: 8 },
      { i: 'ai',      x: 18, y: 0, w: 6,  h: 12, minW: 4, minH: 6 },
      { i: 'network', x: 18, y: 12,w: 6,  h: 10, minW: 3, minH: 5 },
    ],
  },
};

const STORAGE_KEY = 'wave_cmd_profiles';

export function loadProfiles() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    console.warn('Failed to load layout profiles from localStorage:', error);
    return null;
  }
}

export function saveProfiles(profiles) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
  } catch (error) {
    console.warn('Failed to save layout profiles to localStorage:', error);
  }
}