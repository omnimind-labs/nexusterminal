import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import TabBar from './TabBar';

const mockTabs = [
  { id: 'tab-1', type: 'dashboard', label: 'Dashboard' },
  { id: 'tab-2', type: 'ai', label: 'WAVE-AI' },
  { id: 'tab-3', type: 'ssh', label: 'SSH' },
];

describe('TabBar', () => {
  it('renders all provided tabs', () => {
    render(
      <TabBar
        tabs={mockTabs}
        activeTab="tab-1"
        onTabChange={() => {}}
        onAddTab={() => {}}
        onCloseTab={() => {}}
      />
    );
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('WAVE-AI')).toBeInTheDocument();
    expect(screen.getByText('SSH')).toBeInTheDocument();
  });

  it('calls onTabChange when a tab is clicked', () => {
    const onTabChange = vi.fn();
    render(
      <TabBar
        tabs={mockTabs}
        activeTab="tab-1"
        onTabChange={onTabChange}
        onAddTab={() => {}}
        onCloseTab={() => {}}
      />
    );
    fireEvent.click(screen.getByText('WAVE-AI'));
    expect(onTabChange).toHaveBeenCalledWith('tab-2');
  });

  it('calls onAddTab when the add button is clicked', () => {
    const onAddTab = vi.fn();
    const { container } = render(
      <TabBar
        tabs={mockTabs}
        activeTab="tab-1"
        onTabChange={() => {}}
        onAddTab={onAddTab}
        onCloseTab={() => {}}
      />
    );
    // The add button is the last button with Plus icon
    const buttons = container.querySelectorAll('button');
    const addButton = buttons[buttons.length - 1];
    fireEvent.click(addButton);
    expect(onAddTab).toHaveBeenCalledTimes(1);
  });

  it('does not show close buttons when there is only one tab', () => {
    const singleTab = [{ id: 'tab-1', type: 'dashboard', label: 'Dashboard' }];
    const { container } = render(
      <TabBar
        tabs={singleTab}
        activeTab="tab-1"
        onTabChange={() => {}}
        onAddTab={() => {}}
        onCloseTab={() => {}}
      />
    );
    // Only the add tab button should be present (no close buttons)
    const buttons = container.querySelectorAll('button');
    expect(buttons.length).toBe(1); // just the add button
  });

  it('renders close buttons when there are multiple tabs', () => {
    const { container } = render(
      <TabBar
        tabs={mockTabs}
        activeTab="tab-1"
        onTabChange={() => {}}
        onAddTab={() => {}}
        onCloseTab={() => {}}
      />
    );
    // 3 close buttons + 1 add button = 4 buttons
    const buttons = container.querySelectorAll('button');
    expect(buttons.length).toBe(4);
  });
});
