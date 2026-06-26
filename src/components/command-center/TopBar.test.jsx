import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import TopBar from './TopBar';

describe('TopBar', () => {
  const defaultProps = {
    isLocked: false,
    onToggleLock: vi.fn(),
    onOpenSettings: vi.fn(),
    onOpenShortcuts: vi.fn(),
  };

  it('renders the app title', () => {
    render(<TopBar {...defaultProps} />);
    expect(screen.getByText('eDEX COMMAND CENTER')).toBeInTheDocument();
  });

  it('renders the version string', () => {
    render(<TopBar {...defaultProps} />);
    expect(screen.getByText(/v3\.0\.0/)).toBeInTheDocument();
  });

  it('renders status indicators', () => {
    render(<TopBar {...defaultProps} />);
    expect(screen.getByText('SECURE')).toBeInTheDocument();
    expect(screen.getByText('CONNECTED')).toBeInTheDocument();
    expect(screen.getByText('NOMINAL')).toBeInTheDocument();
  });

  it('shows "Unlock" text when layout is not locked', () => {
    render(<TopBar {...defaultProps} isLocked={false} />);
    expect(screen.getByText('Unlock')).toBeInTheDocument();
  });

  it('shows "Locked" text when layout is locked', () => {
    render(<TopBar {...defaultProps} isLocked={true} />);
    expect(screen.getByText('Locked')).toBeInTheDocument();
  });

  it('calls onToggleLock when the lock button is clicked', () => {
    const onToggleLock = vi.fn();
    render(<TopBar {...defaultProps} onToggleLock={onToggleLock} />);
    fireEvent.click(screen.getByText('Unlock'));
    expect(onToggleLock).toHaveBeenCalledTimes(1);
  });

  it('calls onOpenSettings when the settings button is clicked', () => {
    const onOpenSettings = vi.fn();
    render(<TopBar {...defaultProps} onOpenSettings={onOpenSettings} />);
    fireEvent.click(screen.getByText('Settings'));
    expect(onOpenSettings).toHaveBeenCalledTimes(1);
  });

  it('calls onOpenShortcuts when the keys button is clicked', () => {
    const onOpenShortcuts = vi.fn();
    render(<TopBar {...defaultProps} onOpenShortcuts={onOpenShortcuts} />);
    fireEvent.click(screen.getByText('Keys'));
    expect(onOpenShortcuts).toHaveBeenCalledTimes(1);
  });

  it('displays the current time', () => {
    render(<TopBar {...defaultProps} />);
    // The time format is HH:MM:SS, so look for the pattern
    const timeElement = screen.getByText(/\d{2}:\d{2}:\d{2}/);
    expect(timeElement).toBeInTheDocument();
  });
});
