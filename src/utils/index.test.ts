import { describe, it, expect } from 'vitest';
import { createPageUrl } from './index';

describe('createPageUrl', () => {
  it('converts a simple page name to a URL path', () => {
    expect(createPageUrl('Dashboard')).toBe('/Dashboard');
  });

  it('replaces spaces with hyphens', () => {
    expect(createPageUrl('Command Center')).toBe('/Command-Center');
  });

  it('replaces multiple spaces', () => {
    expect(createPageUrl('My Cool Page')).toBe('/My-Cool-Page');
  });

  it('handles a single word without spaces', () => {
    expect(createPageUrl('Settings')).toBe('/Settings');
  });

  it('handles an empty string', () => {
    expect(createPageUrl('')).toBe('/');
  });

  it('handles consecutive spaces', () => {
    expect(createPageUrl('a  b')).toBe('/a--b');
  });
});
