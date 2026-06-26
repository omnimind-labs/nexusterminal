import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ShortcutsOverlay from './ShortcutsOverlay';

describe('ShortcutsOverlay', () => {
  it('renders the title', () => {
    render(<ShortcutsOverlay onClose={() => {}} />);
    expect(screen.getByText('Keyboard Shortcuts')).toBeInTheDocument();
  });

  it('renders all shortcut group titles', () => {
    render(<ShortcutsOverlay onClose={() => {}} />);
    expect(screen.getByText('Navigation')).toBeInTheDocument();
    expect(screen.getByText('Layout')).toBeInTheDocument();
    expect(screen.getByText(/Widgets/)).toBeInTheDocument();
  });

  it('renders shortcut descriptions', () => {
    render(<ShortcutsOverlay onClose={() => {}} />);
    expect(screen.getByText('Open new tab')).toBeInTheDocument();
    expect(screen.getByText('Close current tab')).toBeInTheDocument();
    expect(screen.getByText('Toggle edit/lock mode')).toBeInTheDocument();
    expect(screen.getByText('Open settings')).toBeInTheDocument();
  });

  it('renders keyboard keys', () => {
    render(<ShortcutsOverlay onClose={() => {}} />);
    // Ctrl appears multiple times in shortcuts
    const ctrlKeys = screen.getAllByText('Ctrl');
    expect(ctrlKeys.length).toBeGreaterThan(0);
  });

  it('calls onClose when close button is clicked', () => {
    const onClose = vi.fn();
    const { container } = render(<ShortcutsOverlay onClose={onClose} />);
    // The close button is inside the header
    const closeButton = container.querySelector('button');
    fireEvent.click(closeButton);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not propagate clicks on the panel itself', () => {
    const onClose = vi.fn();
    render(<ShortcutsOverlay onClose={onClose} />);
    // Clicking inside the panel should not call onClose
    fireEvent.click(screen.getByText('Keyboard Shortcuts'));
    expect(onClose).not.toHaveBeenCalled();
  });

  it('renders widget toggle shortcuts', () => {
    render(<ShortcutsOverlay onClose={() => {}} />);
    expect(screen.getByText('Terminal')).toBeInTheDocument();
    expect(screen.getByText('System Monitor')).toBeInTheDocument();
    expect(screen.getByText('Network Traffic')).toBeInTheDocument();
    expect(screen.getByText('Processes')).toBeInTheDocument();
    expect(screen.getByText('WAVE-AI')).toBeInTheDocument();
    expect(screen.getByText('SSH Manager')).toBeInTheDocument();
  });

  it('renders dismiss instructions', () => {
    render(<ShortcutsOverlay onClose={() => {}} />);
    expect(screen.getByText(/to dismiss/)).toBeInTheDocument();
  });
});
