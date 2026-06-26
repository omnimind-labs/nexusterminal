import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  WIDGET_REGISTRY,
  DEFAULT_PROFILES,
  loadProfiles,
  saveProfiles,
} from './layoutProfiles';

describe('WIDGET_REGISTRY', () => {
  it('contains all expected widget keys', () => {
    const expectedKeys = [
      'terminal', 'system', 'network', 'processes', 'files',
      'datastream', 'globe', 'quickstats', 'ai', 'ssh',
      'filepreview', 'browser', 'fileexplorer', 'cpumem',
    ];
    expect(Object.keys(WIDGET_REGISTRY)).toEqual(expectedKeys);
  });

  it('each widget has label and type properties', () => {
    for (const [key, widget] of Object.entries(WIDGET_REGISTRY)) {
      expect(widget).toHaveProperty('label');
      expect(widget).toHaveProperty('type');
      expect(typeof widget.label).toBe('string');
      expect(typeof widget.type).toBe('string');
    }
  });

  it('widget type matches its key', () => {
    for (const [key, widget] of Object.entries(WIDGET_REGISTRY)) {
      expect(widget.type).toBe(key);
    }
  });
});

describe('DEFAULT_PROFILES', () => {
  it('contains all expected profile keys', () => {
    const expectedProfiles = ['dashboard', 'ai', 'ssh', 'files', 'preview', 'browser'];
    expect(Object.keys(DEFAULT_PROFILES)).toEqual(expectedProfiles);
  });

  it('each profile has a name and layout', () => {
    for (const [key, profile] of Object.entries(DEFAULT_PROFILES)) {
      expect(profile).toHaveProperty('name');
      expect(profile).toHaveProperty('layout');
      expect(typeof profile.name).toBe('string');
      expect(Array.isArray(profile.layout)).toBe(true);
    }
  });

  it('each layout item has required grid properties', () => {
    for (const profile of Object.values(DEFAULT_PROFILES)) {
      for (const item of profile.layout) {
        expect(item).toHaveProperty('i');
        expect(item).toHaveProperty('x');
        expect(item).toHaveProperty('y');
        expect(item).toHaveProperty('w');
        expect(item).toHaveProperty('h');
        expect(item).toHaveProperty('minW');
        expect(item).toHaveProperty('minH');
      }
    }
  });

  it('all layout widget ids reference valid widgets in the registry', () => {
    for (const profile of Object.values(DEFAULT_PROFILES)) {
      for (const item of profile.layout) {
        expect(WIDGET_REGISTRY).toHaveProperty(item.i);
      }
    }
  });

  it('dashboard profile includes terminal widget', () => {
    const dashboardIds = DEFAULT_PROFILES.dashboard.layout.map(l => l.i);
    expect(dashboardIds).toContain('terminal');
  });

  it('ai profile includes ai widget', () => {
    const aiIds = DEFAULT_PROFILES.ai.layout.map(l => l.i);
    expect(aiIds).toContain('ai');
  });

  it('ssh profile includes ssh widget', () => {
    const sshIds = DEFAULT_PROFILES.ssh.layout.map(l => l.i);
    expect(sshIds).toContain('ssh');
  });
});

describe('loadProfiles', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns null when no profiles are stored', () => {
    expect(loadProfiles()).toBeNull();
  });

  it('returns parsed profiles from localStorage', () => {
    const profiles = { custom: { name: 'Custom', layout: [] } };
    localStorage.setItem('wave_cmd_profiles', JSON.stringify(profiles));
    expect(loadProfiles()).toEqual(profiles);
  });

  it('returns null on invalid JSON', () => {
    localStorage.setItem('wave_cmd_profiles', 'not-json');
    expect(loadProfiles()).toBeNull();
  });
});

describe('saveProfiles', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('saves profiles to localStorage', () => {
    const profiles = { test: { name: 'Test', layout: [] } };
    saveProfiles(profiles);
    expect(localStorage.getItem('wave_cmd_profiles')).toBe(JSON.stringify(profiles));
  });

  it('overwrites existing profiles', () => {
    saveProfiles({ first: { name: 'First', layout: [] } });
    saveProfiles({ second: { name: 'Second', layout: [] } });
    const stored = JSON.parse(localStorage.getItem('wave_cmd_profiles'));
    expect(stored).toHaveProperty('second');
    expect(stored).not.toHaveProperty('first');
  });

  it('handles empty object', () => {
    saveProfiles({});
    expect(localStorage.getItem('wave_cmd_profiles')).toBe('{}');
  });
});
