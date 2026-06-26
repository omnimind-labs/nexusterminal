import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Plus, Trash2, Save, RotateCcw, Check, Palette,
  Settings, Monitor, Terminal as TermIcon, Layers, Layout
} from 'lucide-react';
import { WIDGET_REGISTRY, DEFAULT_PROFILES } from '../../lib/layoutProfiles';

const TABS = [
  { id: 'profiles',   label: 'Profiles',   icon: Layout },
  { id: 'widgets',    label: 'Widgets',    icon: Layers },
  { id: 'terminal',   label: 'Terminal',   icon: TermIcon },
  { id: 'appearance', label: 'Appearance', icon: Palette },
];

const ACCENT_COLORS = [
  { label: 'Cyan',    hsl: '185 100% 50%' },
  { label: 'Green',   hsl: '120 80% 50%'  },
  { label: 'Purple',  hsl: '260 100% 65%' },
  { label: 'Orange',  hsl: '30 100% 55%'  },
  { label: 'Pink',    hsl: '320 90% 60%'  },
  { label: 'Blue',    hsl: '210 100% 60%' },
  { label: 'Red',     hsl: '0 80% 55%'    },
  { label: 'Yellow',  hsl: '45 100% 55%'  },
];

const TERMINAL_THEMES = [
  { id: 'cyber',    label: 'Cyber',       bg: '#050d12', fg: '#00e5ff', prompt: '#00e5ff' },
  { id: 'matrix',   label: 'Matrix',      bg: '#000',    fg: '#00ff41', prompt: '#00ff41' },
  { id: 'dracula',  label: 'Dracula',     bg: '#282a36', fg: '#f8f8f2', prompt: '#bd93f9' },
  { id: 'monokai',  label: 'Monokai',     bg: '#272822', fg: '#f8f8f2', prompt: '#a6e22e' },
  { id: 'nord',     label: 'Nord',        bg: '#2e3440', fg: '#d8dee9', prompt: '#88c0d0' },
  { id: 'solarized',label: 'Solarized',   bg: '#002b36', fg: '#839496', prompt: '#268bd2' },
  { id: 'gruvbox',  label: 'Gruvbox',     bg: '#282828', fg: '#ebdbb2', prompt: '#fabd2f' },
  { id: 'retro',    label: 'Retro Amber', bg: '#1a0e00', fg: '#ffb300', prompt: '#ff8c00' },
];

const FONT_SIZES = ['10px', '11px', '12px', '13px', '14px'];

const STORAGE_KEY_TERMINAL = 'wave_cmd_terminal_prefs';

function loadTerminalPrefs() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_TERMINAL);
    return raw ? JSON.parse(raw) : { themeId: 'cyber', fontSize: '12px', cursorBlink: true, showTimestamp: false };
  } catch {
    return { themeId: 'cyber', fontSize: '12px', cursorBlink: true, showTimestamp: false };
  }
}

function saveTerminalPrefs(prefs) {
  try { localStorage.setItem(STORAGE_KEY_TERMINAL, JSON.stringify(prefs)); } catch (error) { console.warn('Failed to save terminal preferences to localStorage:', error); }
}

export default function SettingsModal({
  profiles, activeProfileId, onClose,
  onSaveProfile, onDeleteProfile, onSwitchProfile, onResetProfile,
  themeSettings, onThemeChange,
}) {
  const [tab, setTab] = useState('profiles');
  const [newProfileName, setNewProfileName] = useState('');
  const [terminalPrefs, setTerminalPrefs] = useState(loadTerminalPrefs);

  const activeProfile = profiles[activeProfileId];

  const handleCreateProfile = () => {
    const name = newProfileName.trim();
    if (!name) return;
    const id = `custom_${Date.now()}`;
    const base = activeProfile
      ? { ...activeProfile, name }
      : { name, layout: DEFAULT_PROFILES.dashboard.layout };
    onSaveProfile(id, base);
    setNewProfileName('');
  };

  const handleToggleWidget = (widgetId) => {
    if (!activeProfile) return;
    const hasWidget = activeProfile.layout.some(l => l.i === widgetId);
    let newLayout;
    if (hasWidget) {
      if (activeProfile.layout.length <= 1) return;
      newLayout = activeProfile.layout.filter(l => l.i !== widgetId);
    } else {
      const maxY = activeProfile.layout.reduce((m, l) => Math.max(m, l.y + l.h), 0);
      newLayout = [...activeProfile.layout, { i: widgetId, x: 0, y: maxY, w: 8, h: 8, minW: 3, minH: 4 }];
    }
    onSaveProfile(activeProfileId, { ...activeProfile, layout: newLayout });
  };

  const updateTerminalPref = (key, value) => {
    const next = { ...terminalPrefs, [key]: value };
    setTerminalPrefs(next);
    saveTerminalPrefs(next);
  };

  const selectedTermTheme = TERMINAL_THEMES.find(t => t.id === terminalPrefs.themeId) || TERMINAL_THEMES[0];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ duration: 0.25 }}
          className="cyber-panel w-full max-w-2xl rounded-sm border border-primary/30 overflow-hidden"
          style={{ maxHeight: '90vh' }}
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center gap-3 px-5 py-3 border-b border-primary/15 flex-shrink-0">
            <Settings className="w-4 h-4 text-primary" />
            <h2 className="font-display text-xs uppercase tracking-[0.2em] text-primary glow-text flex-1">
              Command Center — Settings
            </h2>
            <button onClick={onClose} className="text-muted-foreground hover:text-destructive transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Tab Nav */}
          <div className="flex border-b border-primary/10 flex-shrink-0 overflow-x-auto">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={`flex items-center gap-1.5 px-4 py-2.5 font-display text-[9px] uppercase tracking-wider transition-colors whitespace-nowrap ${
                  tab === id
                    ? 'text-primary border-b-2 border-primary bg-primary/5'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon className="w-3 h-3" />
                {label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="p-5 overflow-y-auto space-y-4" style={{ maxHeight: 'calc(90vh - 130px)' }}>

            {/* ── PROFILES TAB ── */}
            {tab === 'profiles' && (
              <div className="space-y-4">
                <p className="font-mono text-[10px] text-muted-foreground">
                  Manage layout profiles. Your current window positions are auto-saved per profile.
                </p>

                <div className="space-y-2">
                  {Object.entries(profiles).map(([id, profile]) => {
                    const isActive = id === activeProfileId;
                    const isBuiltIn = !!DEFAULT_PROFILES[id];
                    return (
                      <div
                        key={id}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-sm border transition-all ${
                          isActive
                            ? 'border-primary/40 bg-primary/5'
                            : 'border-primary/10 hover:border-primary/25 hover:bg-secondary/20'
                        }`}
                      >
                        <button
                          onClick={() => onSwitchProfile(id)}
                          className="flex-1 flex items-center gap-2 text-left"
                        >
                          {isActive
                            ? <Check className="w-3 h-3 text-primary flex-shrink-0" />
                            : <div className="w-3 h-3 flex-shrink-0" />
                          }
                          <span className="font-mono text-[11px] text-foreground">{profile.name}</span>
                          {isBuiltIn && (
                            <span className="font-mono text-[8px] text-muted-foreground bg-secondary/50 px-1.5 py-0.5 rounded-sm">
                              built-in
                            </span>
                          )}
                          <span className="font-mono text-[9px] text-muted-foreground ml-auto">
                            {profile.layout.length} widgets
                          </span>
                        </button>
                        <div className="flex gap-1">
                          {isBuiltIn ? (
                            <button
                              onClick={() => onResetProfile(id)}
                              title="Reset window positions to default"
                              className="p-1 text-muted-foreground hover:text-chart-4 transition-colors"
                            >
                              <RotateCcw className="w-3 h-3" />
                            </button>
                          ) : (
                            <button
                              onClick={() => onDeleteProfile(id)}
                              title="Delete profile"
                              className="p-1 text-muted-foreground hover:text-destructive transition-colors"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* New profile */}
                <div className="flex gap-2 pt-2 border-t border-primary/10">
                  <input
                    value={newProfileName}
                    onChange={e => setNewProfileName(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleCreateProfile()}
                    placeholder="New profile name (clones current layout)..."
                    className="flex-1 bg-secondary/30 border border-primary/15 rounded-sm px-3 py-1.5 font-mono text-[11px] text-foreground placeholder:text-muted-foreground/40 outline-none focus:border-primary/40"
                  />
                  <button
                    onClick={handleCreateProfile}
                    disabled={!newProfileName.trim()}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 border border-primary/25 rounded-sm font-display text-[9px] uppercase tracking-wider text-primary hover:bg-primary/20 disabled:opacity-30 transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                    Clone
                  </button>
                </div>
              </div>
            )}

            {/* ── WIDGETS TAB ── */}
            {tab === 'widgets' && (
              <div className="space-y-3">
                <p className="font-mono text-[10px] text-muted-foreground">
                  Toggle widgets on/off for: <span className="text-primary">{activeProfile?.name}</span>
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(WIDGET_REGISTRY).map(([id, widget]) => {
                    const active = activeProfile?.layout.some(l => l.i === id);
                    return (
                      <button
                        key={id}
                        onClick={() => handleToggleWidget(id)}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-sm border text-left transition-all ${
                          active
                            ? 'border-primary/35 bg-primary/8 text-primary'
                            : 'border-primary/10 text-muted-foreground hover:border-primary/25 hover:bg-secondary/10'
                        }`}
                      >
                        <div className={`w-2 h-2 rounded-full flex-shrink-0 transition-colors ${
                          active ? 'bg-primary shadow-[0_0_6px_hsl(var(--primary))]' : 'bg-muted-foreground/30'
                        }`} />
                        <span className="font-mono text-[10px]">{widget.label}</span>
                        <span className={`ml-auto font-display text-[8px] uppercase tracking-wider ${
                          active ? 'text-primary/60' : 'text-muted-foreground/40'
                        }`}>
                          {active ? 'ON' : 'OFF'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ── TERMINAL TAB ── */}
            {tab === 'terminal' && (
              <div className="space-y-5">
                <p className="font-mono text-[10px] text-muted-foreground">
                  Customize the terminal appearance and behavior.
                </p>

                {/* Theme preview */}
                <div
                  className="rounded-sm border border-primary/15 p-3 font-mono text-[11px] leading-relaxed"
                  style={{ background: selectedTermTheme.bg, color: selectedTermTheme.fg }}
                >
                  <span style={{ color: selectedTermTheme.prompt }}>user@wave</span>
                  <span style={{ color: selectedTermTheme.fg }}>:~$ </span>
                  <span style={{ color: selectedTermTheme.fg }}>ls -la /var/log</span>
                  <br />
                  <span style={{ color: selectedTermTheme.fg, opacity: 0.7 }}>drwxr-xr-x  system/  network/  app.log</span>
                  <br />
                  <span style={{ color: selectedTermTheme.prompt }}>user@wave</span>
                  <span style={{ color: selectedTermTheme.fg }}>:~$ <span className="typing-cursor">_</span></span>
                </div>

                {/* Theme grid */}
                <div className="space-y-1.5">
                  <label className="font-display text-[9px] uppercase tracking-wider text-muted-foreground">Color Theme</label>
                  <div className="grid grid-cols-4 gap-2">
                    {TERMINAL_THEMES.map(theme => (
                      <button
                        key={theme.id}
                        onClick={() => updateTerminalPref('themeId', theme.id)}
                        className={`flex flex-col items-center gap-1.5 px-2 py-2 rounded-sm border transition-all ${
                          terminalPrefs.themeId === theme.id
                            ? 'border-primary/50 bg-primary/8'
                            : 'border-primary/10 hover:border-primary/25'
                        }`}
                      >
                        <div className="flex gap-1">
                          <div className="w-4 h-4 rounded-sm" style={{ background: theme.bg, border: '1px solid rgba(255,255,255,0.1)' }} />
                          <div className="w-4 h-4 rounded-sm" style={{ background: theme.fg }} />
                          <div className="w-4 h-4 rounded-sm" style={{ background: theme.prompt }} />
                        </div>
                        <span className="font-mono text-[9px] text-muted-foreground">{theme.label}</span>
                        {terminalPrefs.themeId === theme.id && (
                          <Check className="w-3 h-3 text-primary" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Font size */}
                <div className="space-y-1.5">
                  <label className="font-display text-[9px] uppercase tracking-wider text-muted-foreground">Font Size</label>
                  <div className="flex gap-2">
                    {FONT_SIZES.map(size => (
                      <button
                        key={size}
                        onClick={() => updateTerminalPref('fontSize', size)}
                        className={`px-3 py-1.5 rounded-sm border font-mono text-[10px] transition-all ${
                          terminalPrefs.fontSize === size
                            ? 'border-primary/50 bg-primary/10 text-primary'
                            : 'border-primary/15 text-muted-foreground hover:border-primary/30'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Toggles */}
                {[
                  { key: 'cursorBlink',    label: 'Cursor Blink',       desc: 'Animate the terminal cursor' },
                  { key: 'showTimestamp',  label: 'Show Timestamps',    desc: 'Prefix output with time' },
                ].map(({ key, label, desc }) => (
                  <div key={key} className="flex items-center justify-between py-2 border-b border-primary/10">
                    <div>
                      <span className="font-mono text-[11px] text-foreground">{label}</span>
                      <p className="font-mono text-[9px] text-muted-foreground">{desc}</p>
                    </div>
                    <button
                      onClick={() => updateTerminalPref(key, !terminalPrefs[key])}
                      className={`w-10 h-5 rounded-full border transition-all relative flex-shrink-0 ${
                        terminalPrefs[key]
                          ? 'bg-primary/20 border-primary/50'
                          : 'bg-secondary/40 border-primary/15'
                      }`}
                    >
                      <div className={`absolute top-0.5 w-4 h-4 rounded-full transition-all ${
                        terminalPrefs[key] ? 'left-5 bg-primary' : 'left-0.5 bg-muted-foreground/40'
                      }`} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* ── APPEARANCE TAB ── */}
            {tab === 'appearance' && (
              <div className="space-y-5">
                <p className="font-mono text-[10px] text-muted-foreground">
                  Global visual style for the entire command center.
                </p>

                {/* Accent color */}
                <div className="space-y-2">
                  <label className="font-display text-[9px] uppercase tracking-wider text-muted-foreground">Accent Color</label>
                  <div className="grid grid-cols-8 gap-2">
                    {ACCENT_COLORS.map(c => (
                      <button
                        key={c.label}
                        onClick={() => onThemeChange('accentHsl', c.hsl)}
                        style={{ background: `hsl(${c.hsl})` }}
                        className={`w-8 h-8 rounded-sm border-2 transition-all ${
                          themeSettings.accentHsl === c.hsl ? 'border-white scale-110 shadow-lg' : 'border-transparent opacity-70 hover:opacity-100'
                        }`}
                        title={c.label}
                      />
                    ))}
                  </div>
                  <p className="font-mono text-[9px] text-muted-foreground">
                    Current: <span className="text-primary" style={{ color: `hsl(${themeSettings.accentHsl})` }}>
                      {ACCENT_COLORS.find(c => c.accentHsl === themeSettings.accentHsl)?.label || 'Custom'}
                    </span>
                  </p>
                </div>

                {/* Background density / effect toggles */}
                <div className="space-y-1.5">
                  <label className="font-display text-[9px] uppercase tracking-wider text-muted-foreground">Visual Effects</label>
                  {[
                    { key: 'scanlines',  label: 'Scanline Overlay',   desc: 'Moving horizontal scanline across screen' },
                    { key: 'flicker',    label: 'CRT Flicker',        desc: 'Subtle screen flicker like an old CRT monitor' },
                    { key: 'glowText',   label: 'Glow Text',          desc: 'Neon glow on primary headings and labels' },
                  ].map(({ key, label, desc }) => (
                    <div key={key} className="flex items-center justify-between py-2 border-b border-primary/10">
                      <div>
                        <span className="font-mono text-[11px] text-foreground">{label}</span>
                        <p className="font-mono text-[9px] text-muted-foreground">{desc}</p>
                      </div>
                      <button
                        onClick={() => onThemeChange(key, !themeSettings[key])}
                        className={`w-10 h-5 rounded-full border transition-all relative flex-shrink-0 ${
                          themeSettings[key]
                            ? 'bg-primary/20 border-primary/50'
                            : 'bg-secondary/40 border-primary/15'
                        }`}
                      >
                        <div className={`absolute top-0.5 w-4 h-4 rounded-full transition-all ${
                          themeSettings[key] ? 'left-5 bg-primary' : 'left-0.5 bg-muted-foreground/40'
                        }`} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Footer */}
          <div className="px-5 py-3 border-t border-primary/10 flex items-center justify-between flex-shrink-0">
            <span className="font-mono text-[9px] text-muted-foreground">All changes save automatically</span>
            <button
              onClick={onClose}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-primary/10 border border-primary/25 rounded-sm font-display text-[9px] uppercase tracking-wider text-primary hover:bg-primary/20 transition-colors"
            >
              <Save className="w-3 h-3" />
              Close
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}