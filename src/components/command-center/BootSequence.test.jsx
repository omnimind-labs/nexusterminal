import { describe, it, expect, vi } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import BootSequence from './BootSequence';

describe('BootSequence', () => {
  it('renders the title', () => {
    render(<BootSequence onComplete={() => {}} />);
    expect(screen.getByText('eDEX')).toBeInTheDocument();
    expect(screen.getByText('COMMAND CENTER v3.0')).toBeInTheDocument();
  });

  it('calls onComplete after boot sequence finishes', () => {
    vi.useFakeTimers();
    const onComplete = vi.fn();
    render(<BootSequence onComplete={onComplete} />);

    // Boot completes at 2600ms, then onComplete fires at 2600+600=3200ms
    act(() => {
      vi.advanceTimersByTime(3300);
    });

    expect(onComplete).toHaveBeenCalledTimes(1);
    vi.useRealTimers();
  });

  it('renders boot lines after advancing timers', () => {
    vi.useFakeTimers();
    render(<BootSequence onComplete={() => {}} />);

    act(() => {
      vi.advanceTimersByTime(50);
    });

    expect(screen.getByText('INITIALIZING QUANTUM CORE...')).toBeInTheDocument();
    vi.useRealTimers();
  });

  it('shows later boot lines after their delay', () => {
    vi.useFakeTimers();
    render(<BootSequence onComplete={() => {}} />);

    act(() => {
      vi.advanceTimersByTime(1300);
    });

    expect(screen.getByText('GPU ACCELERATION: ENABLED')).toBeInTheDocument();
    vi.useRealTimers();
  });
});
