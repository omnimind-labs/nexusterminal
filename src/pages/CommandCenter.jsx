import React, { useState, useEffect, useCallback } from 'react';
import TopBar from '../components/command-center/TopBar';
import TabBar from '../components/command-center/TabBar';
import GridLayout from '../components/command-center/GridLayout';
import BootSequence from '../components/command-center/BootSequence';
import SettingsModal from '../components/command-center/SettingsModal';
import ShortcutsOverlay from '../components/command-center/ShortcutsOverlay';
import { DEFAULT_PROFILES, WIDGET_REGISTRY, loadProfiles, saveProfiles } from '../lib/layoutProfiles';

const DEFAULT_THEME = {
  accentHsl: '185 100% 50%',
  scanlines: true,
  flicker: true,
  glowText: true,
};

function loadTheme() {
  try {
    const raw = localStorage.getItem('wave_cmd_theme');
    return raw ? { ...DEFAULT_THEME, ...JSON.parse(raw) } : DEFAULT_THEME;
  } catch {
    return DEFAULT_THEME;
  }
}

function applyTheme(theme) {
  const root = document.documentElement;
  root.style.setProperty('--primary', theme.accentHsl);
  root.style.setProperty('--ring', theme.accentHsl);
}

// Build the initial profiles map from defaults + any saved custom profiles
function buildInitialProfiles() {
  const saved = loadProfiles();
  const base = Object.fromEntries(
    Object.entries(DEFAULT_PROFILES).map(([id, p]) => [id, { ...p }])
  );
  if (!saved) return base;
  // Merge: keep built-in defaults but apply any saved layout overrides + custom profiles
  return { ...base, ...saved };
}

const TAB_LABEL = {
  dashboard: 'Dashboard',
  ai: 'WAVE-AI',
  ssh: 'SSH',
  files: 'Files',
  preview: 'Preview',
  browser: 'Browser',
};
const TAB_TYPE_CYCLE = Object.keys(DEFAULT_PROFILES);

export default function CommandCenter() {
  const [booted, setBooted] = useState(false);
  const [profiles, setProfiles] = useState(buildInitialProfiles);
  const [tabs, setTabs] = useState([
    { id: 'tab-1', label: 'Dashboard', type: 'dashboard' },
    { id: 'tab-2', label: 'WAVE-AI',   type: 'ai' },
    { id: 'tab-3', label: 'SSH',       type: 'ssh' },
    { id: 'tab-4', label: 'Files',     type: 'files' },
    { id: 'tab-5', label: 'Preview',   type: 'preview' },
    { id: 'tab-6', label: 'Browser',   type: 'browser' },
  ]);
  const [activeTab, setActiveTab] = useState('tab-1');
  const [isLocked, setIsLocked] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [theme, setTheme] = useState(loadTheme);

  // Apply theme on change
  useEffect(() => {
    applyTheme(theme);
    try { localStorage.setItem('wave_cmd_theme', JSON.stringify(theme)); } catch (error) { console.warn('Failed to persist theme to localStorage:', error); }
  }, [theme]);

  // Persist profiles whenever they change
  useEffect(() => {
    saveProfiles(profiles);
  }, [profiles]);

  const activeTabData = tabs.find(t => t.id === activeTab);
  const activeProfileId = activeTabData?.type || 'dashboard';
  const activeLayout = profiles[activeProfileId]?.layout || DEFAULT_PROFILES.dashboard.layout;

  const handleLayoutChange = useCallback((newLayout) => {
    if (isLocked) return;
    setProfiles(prev => ({
      ...prev,
      [activeProfileId]: {
        ...prev[activeProfileId],
        layout: newLayout.map(item => ({
          ...item,
          minW: prev[activeProfileId]?.layout?.find(l => l.i === item.i)?.minW || 3,
          minH: prev[activeProfileId]?.layout?.find(l => l.i === item.i)?.minH || 4,
        })),
      },
    }));
  }, [activeProfileId, isLocked]);

  const handleSaveProfile = useCallback((id, profile) => {
    setProfiles(prev => ({ ...prev, [id]: profile }));
  }, []);

  const handleDeleteProfile = useCallback((id) => {
    setProfiles(prev => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
    // If a tab was using the deleted profile, switch it
    setTabs(prev => prev.map(t => t.type === id ? { ...t, type: 'dashboard', label: 'Dashboard' } : t));
  }, []);

  const handleResetProfile = useCallback((id) => {
    if (!DEFAULT_PROFILES[id]) return;
    setProfiles(prev => ({ ...prev, [id]: { ...DEFAULT_PROFILES[id] } }));
  }, []);

  const handleSwitchProfile = useCallback((profileId) => {
    // Switch the active tab to use this profile
    setTabs(prev => prev.map(t =>
      t.id === activeTab
        ? { ...t, type: profileId, label: profiles[profileId]?.name || profileId }
        : t
    ));
  }, [activeTab, profiles]);

  const handleThemeChange = useCallback((key, value) => {
    setTheme(prev => ({ ...prev, [key]: value }));
  }, []);

  // Toggle a widget in the active profile
  const handleToggleWidget = useCallback((widgetId) => {
    setProfiles(prev => {
      const profile = prev[activeProfileId];
      if (!profile) return prev;
      const hasWidget = profile.layout.some(l => l.i === widgetId);
      let newLayout;
      if (hasWidget) {
        if (profile.layout.length <= 1) return prev;
        newLayout = profile.layout.filter(l => l.i !== widgetId);
      } else {
        const maxY = profile.layout.reduce((m, l) => Math.max(m, l.y + l.h), 0);
        newLayout = [...profile.layout, { i: widgetId, x: 0, y: maxY, w: 8, h: 8, minW: 3, minH: 4 }];
      }
      return { ...prev, [activeProfileId]: { ...profile, layout: newLayout } };
    });
  }, [activeProfileId]);

  const addTab = useCallback(() => {
    const id = `tab-${Date.now()}`;
    const type = TAB_TYPE_CYCLE[tabs.length % TAB_TYPE_CYCLE.length];
    setTabs(prev => [...prev, { id, label: TAB_LABEL[type] || type, type }]);
    setActiveTab(id);
  }, [tabs]);

  const closeTab = useCallback((id) => {
    setTabs(prev => {
      const next = prev.filter(t => t.id !== id);
      if (activeTab === id && next.length > 0) setActiveTab(next[next.length - 1].id);
      return next;
    });
  }, [activeTab]);

  // Widget shortcut map: Alt+1..9 → widget ids in order
  const WIDGET_SHORTCUT_MAP = Object.keys(WIDGET_REGISTRY).slice(0, 9);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e) => {
      // Ignore when typing in an input
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

      if ((e.ctrlKey || e.metaKey) && e.key === 't') { e.preventDefault(); addTab(); return; }
      if ((e.ctrlKey || e.metaKey) && e.key === 'w') { e.preventDefault(); if (tabs.length > 1) closeTab(activeTab); return; }
      if ((e.ctrlKey || e.metaKey) && e.key === ',') { e.preventDefault(); setShowSettings(s => !s); return; }

      // Tab switching Ctrl+1–6
      if (e.ctrlKey && !e.altKey) {
        const n = parseInt(e.key);
        if (n >= 1 && n <= tabs.length) { e.preventDefault(); setActiveTab(tabs[n - 1].id); return; }
      }

      // Alt+L — toggle lock/edit mode
      if (e.altKey && e.key.toLowerCase() === 'l') { e.preventDefault(); setIsLocked(l => !l); return; }

      // Alt+1–9 — toggle widgets
      if (e.altKey && !e.ctrlKey) {
        const n = parseInt(e.key);
        if (n >= 1 && n <= 9) {
          e.preventDefault();
          const widgetId = WIDGET_SHORTCUT_MAP[n - 1];
          if (widgetId) handleToggleWidget(widgetId);
          return;
        }
      }

      // ? — show shortcuts overlay (no modifier)
      if (!e.ctrlKey && !e.altKey && !e.metaKey && e.key === '?') {
        setShowShortcuts(s => !s);
        return;
      }

      // Esc — close any overlay
      if (e.key === 'Escape') {
        setShowShortcuts(false);
        setShowSettings(false);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [tabs, activeTab, addTab, closeTab, handleToggleWidget]);

  const bodyClass = [
    'h-screen w-screen overflow-hidden bg-background',
    theme.scanlines ? 'scanline-overlay' : '',
    theme.flicker ? 'flicker' : '',
  ].join(' ');

  return (
    <div className={bodyClass} style={{ display: 'flex', flexDirection: 'column' }}>
      {!booted && <BootSequence onComplete={() => setBooted(true)} />}

      {booted && (
        <>
          <TopBar
            isLocked={isLocked}
            onToggleLock={() => setIsLocked(l => !l)}
            onOpenSettings={() => setShowSettings(true)}
            onOpenShortcuts={() => setShowShortcuts(true)}
          />
          <TabBar
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onAddTab={addTab}
            onCloseTab={closeTab}
          />
          <div style={{ flex: 1, minHeight: 0, padding: '4px', overflowY: 'auto' }}>
            <GridLayout
              key={activeProfileId}
              layout={activeLayout}
              onLayoutChange={handleLayoutChange}
              isLocked={isLocked}
            />
          </div>
        </>
      )}

      {showShortcuts && (
        <ShortcutsOverlay onClose={() => setShowShortcuts(false)} />
      )}

      {showSettings && (
        <SettingsModal
          profiles={profiles}
          activeProfileId={activeProfileId}
          onClose={() => setShowSettings(false)}
          onSaveProfile={handleSaveProfile}
          onDeleteProfile={handleDeleteProfile}
          onResetProfile={handleResetProfile}
          onSwitchProfile={handleSwitchProfile}
          themeSettings={theme}
          onThemeChange={handleThemeChange}
        />
      )}
    </div>
  );
}