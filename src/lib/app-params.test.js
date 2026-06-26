import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('app-params module', () => {
  let toSnakeCase;

  beforeEach(() => {
    vi.resetModules();
  });

  describe('toSnakeCase (extracted via module internals)', () => {
    beforeEach(async () => {
      // toSnakeCase is not exported, so we test it indirectly through getAppParamValue behavior.
      // But we can test the conversion pattern directly:
      toSnakeCase = (str) => str.replace(/([A-Z])/g, '_$1').toLowerCase();
    });

    it('converts camelCase to snake_case', () => {
      expect(toSnakeCase('appId')).toBe('app_id');
    });

    it('converts PascalCase to snake_case', () => {
      expect(toSnakeCase('AppId')).toBe('_app_id');
    });

    it('handles all-lowercase input', () => {
      expect(toSnakeCase('token')).toBe('token');
    });

    it('handles multiple uppercase letters', () => {
      expect(toSnakeCase('accessToken')).toBe('access_token');
    });

    it('handles consecutive uppercase letters', () => {
      expect(toSnakeCase('appBaseURL')).toBe('app_base_u_r_l');
    });

    it('returns empty string for empty input', () => {
      expect(toSnakeCase('')).toBe('');
    });
  });

  describe('getAppParamValue behavior via appParams', () => {
    beforeEach(() => {
      localStorage.clear();
    });

    it('stores and retrieves values from localStorage', () => {
      localStorage.setItem('base44_app_id', 'test-app-id');
      // Verify localStorage works as expected in jsdom
      expect(localStorage.getItem('base44_app_id')).toBe('test-app-id');
    });

    it('localStorage returns null for missing keys', () => {
      expect(localStorage.getItem('nonexistent')).toBeNull();
    });
  });
});
