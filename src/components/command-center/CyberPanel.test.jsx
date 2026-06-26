import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import CyberPanel from './CyberPanel';
import { Cpu } from 'lucide-react';

describe('CyberPanel', () => {
  it('renders children', () => {
    render(
      <CyberPanel>
        <p>Hello</p>
      </CyberPanel>
    );
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('renders the title when provided', () => {
    render(<CyberPanel title="System Monitor">Content</CyberPanel>);
    expect(screen.getByText('System Monitor')).toBeInTheDocument();
  });

  it('does not render a title header when title is not provided', () => {
    const { container } = render(<CyberPanel>Content</CyberPanel>);
    const header = container.querySelector('.drag-handle');
    expect(header).toBeNull();
  });

  it('renders the icon when icon and title are provided', () => {
    const { container } = render(
      <CyberPanel title="CPU" icon={Cpu}>
        Content
      </CyberPanel>
    );
    // lucide-react renders an SVG element
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('shows drag handle when isDraggable is true', () => {
    const { container } = render(
      <CyberPanel title="Terminal" isDraggable>
        Content
      </CyberPanel>
    );
    const dragHandle = container.querySelector('.drag-handle');
    expect(dragHandle).toBeInTheDocument();
  });

  it('does not show drag handle class when isDraggable is false', () => {
    const { container } = render(
      <CyberPanel title="Terminal" isDraggable={false}>
        Content
      </CyberPanel>
    );
    const dragHandle = container.querySelector('.drag-handle');
    expect(dragHandle).toBeNull();
  });

  it('applies custom className', () => {
    const { container } = render(
      <CyberPanel className="h-full">Content</CyberPanel>
    );
    const panel = container.firstChild;
    expect(panel.className).toContain('h-full');
  });
});
