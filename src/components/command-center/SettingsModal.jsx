import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Trash2, Save, RotateCcw, Check, Layers, Palette, Settings } from 'lucide-react';
import { WIDGET_REGISTRY, DEFAULT_PROFILES } from '../../lib/layoutProfiles';

const TABS = ['Profiles', 'Widgets', 'Appearance'];

export default function SettingsModal({ profiles, activeProfileId, onClose, onSaveProfile, onDeleteProfile, onSwitchProfile, onResetProfile, themeSettings, onThemeChange }) {
  const [tab, setTab] = useState('Profiles');
  const [newProfileName, setNewProfileName] = useState('');
  const [editingProfile, setEditingProfile] = useState(null);

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
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center gap-3 px-5 py-3 border-b border-primary/15">
            <Settings className="w-4 h-4 text-primary" />
            <h2 className="font-display text-xs uppercase tracking-[0.2em] text-primary glow-text flex-1">
              Command Center — Settings
            </h2>
            <button onClick={onClose} className="text-muted-foreground hover:text-destructive transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Nav */}
          <div className="flex border-b border-primary/10">
            {TABS.map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-5 py-2 font-display text-[9px] uppercase tracking-wider transition-colors ${
                  tab === t
                    ? 'text-primary border-b border-primary bg-primary/5'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="p-5 max-h-[60vh] overflow-y-auto space-y-4">

            {/* ── PROFILES TAB ── */}
            {tab === 'Profiles' && (
              <div className="space-y-4">
                <p className="font-mono text-[10px] text-muted-foreground">
                  Save and switch between workspace layout profiles. Your current layout is auto-saved.
                </p>

                <div className="space-y-2">
                  {Object.entries(profiles).map(([id, profile]) => (
                    <div
                      key={id}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-sm border transition-all ${
                        id === activeProfileId
                          ? 'border-primary/40 bg-primary/5'
                          : 'border-primary/10 hover:border-primary/25 hover:bg-secondary/20'
                      }`}
                    >
                      <button
                        onClick={() => onSwitchProfile(id)}
                        className="flex-1 flex items-center gap-2 text-left"
                      >
                        {id === activeProfileId && <Check className="w-3 h-3 text-primary flex-shrink-0" />}
                        <span className="font-mono text-[11px] text-foreground">{profile.name}</span>
                        {DEFAULT_PROFILES[id] && (
                          <span className="font-mono text-[8px] text-muted-foreground bg-secondary/50 px-1.5 py-0.5 rounded-sm">
                            built-in
                          </span>
                        )}
                        <span className="font-mono text-[9px] text-muted-foreground ml-auto">
                          {profile.layout.length} widgets
                        </span>
                      </button>
                      <div className="flex gap-1">
                        {DEFAULT_PROFILES[id] && (
                          <button
                            onClick={() => onResetProfile(id)}
                            title="Reset to default"
                            className="p-1 text-muted-foreground hover:text-chart-4 transition-colors"
                          >
                            <RotateCcw className="w-3 h-3" />
                          </button>
                        )}
                        {!DEFAULT_PROFILES[id] && (
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
                  ))}
                </div>

                {/* New profile */}
                <div className="flex gap-2 pt-2 border-t border-primary/10">
                  <input
                    value={newProfileName}
                    onChange={e => setNewProfileName(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleCreateProfile()}
                    placeholder="New profile name..."
                    className="flex-1 bg-secondary/30 border border-primary/15 rounded-sm px-3 py-1.5 font-mono text-[11px] text-foreground placeholder:text-muted-foreground/40 outline-none focus:border-primary/40"
                  />
                  <button
                    onClick={handleCreateProfile}
                    disabled={!newProfileName.trim()}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 border border-primary/25 rounded-sm font-display text-[9px] uppercase tracking-wider text-primary hover:bg-primary/20 disabled:opacity-30 transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                    Clone &amp; Save
                  </button>
                </div>
              </div>
            )}

            {/* ── WIDGETS TAB ── */}
            {tab === 'Widgets' && (
              <div className="space-y-3">
                <p className="font-mono text-[10px] text-muted-foreground">
                  Toggle widgets on/off for the active profile: <span className="text-primary">{activeProfile?.name}</span>
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(WIDGET_REGISTRY).map(([id, widget]) => {
                    const active = activeProfile?.layout.some(l => l.i === id);
                    return (
                      <button
                        key={id}
                        onClick={() => handleToggleWidget(id)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-sm border text-left transition-all ${
                          active
                            ? 'border-primary/35 bg-primary/8 text-primary'
                            : 'border-primary/10 text-muted-foreground hover:border-primary/25'
                        }`}
                      >
                        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${active ? 'bg-primary' : 'bg-muted-foreground/30'}`} />
                        <span className="font-mono text-[10px]">{widget.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ── APPEARANCE TAB ── */}
            {tab === 'Appearance' && (
              <div className="space-y-5">
                <p className="font-mono text-[10px] text-muted-foreground">
                  Customize the visual style of the command center.
                </p>

                {/* Accent color */}
                <div className="space-y-2">
                  <label className="font-display text-[9px] uppercase tracking-wider text-muted-foreground">Accent Color</label>
                  <div className="flex gap-2 flex-wrap">
                    {[
                      { label: 'Cyan',    hsl: '185 100% 50%' },
                      { label: 'Green',   hsl: '120 80% 50%'  },
                      { label: 'Purple',  hsl: '260 100% 65%' },
                      { label: 'Orange',  hsl: '30 100% 55%'  },
                      { label: 'Pink',    hsl: '320 90% 60%'  },
                      { label: 'Blue',    hsl: '210 100% 60%' },
                    ].map(c => (
                      <button
                        key={c.label}
                        onClick={() => onThemeChange('accentHsl', c.hsl)}
                        style={{ background: `hsl(${c.hsl})` }}
                        className={`w-7 h-7 rounded-sm border-2 transition-all ${
                          themeSettings.accentHsl === c.hsl ? 'border-white scale-110' : 'border-transparent'
                        }`}
                        title={c.label}
                      />
                    ))}
                  </div>
                </div>

                {/* Toggles */}
                {[
                  { key: 'scanlines',  label: 'Scanline Effect' },
                  { key: 'flicker',    label: 'CRT Flicker' },
                  { key: 'glowText',   label: 'Glow Text' },
                ].map(({ key, label }) => (
                  <div key={key} className="flex items-center justify-between py-2 border-b border-primary/10">
                    <span className="font-mono text-[11px] text-foreground">{label}</span>
                    <button
                      onClick={() => onThemeChange(key, !themeSettings[key])}
                      className={`w-10 h-5 rounded-full border transition-all relative ${
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
            )}
          </div>

          {/* Footer */}
          <div className="px-5 py-3 border-t border-primary/10 flex justify-end">
            <button
              onClick={onClose}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-primary/10 border border-primary/25 rounded-sm font-display text-[9px] uppercase tracking-wider text-primary hover:bg-primary/20 transition-colors"
            >
              <Save className="w-3 h-3" />
              Close &amp; Save
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}