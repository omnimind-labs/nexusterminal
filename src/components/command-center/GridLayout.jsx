import React, { useMemo } from 'react';
import RGL, { WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

import CyberPanel from './CyberPanel';
import SystemStats from './SystemStats';
import Terminal from './Terminal';
import NetworkMonitor from './NetworkMonitor';
import ProcessList from './ProcessList';
import FileExplorer from './FileExplorer';
import DataStream from './DataStream';
import GlobeViz from './GlobeViz';
import QuickStats from './QuickStats';
import AIAssistant from './AIAssistant';
import SSHManager from './SSHManager';
import FilePreview from './FilePreview';
import WebBrowser from './WebBrowser';
import FileExplorerWindow from './FileExplorerWindow';

import {
  Cpu, Terminal as TermIcon, Network, Layers, FolderOpen,
  Activity, Globe, BarChart3, Sparkles, ServerIcon, FileCode, FolderSearch
} from 'lucide-react';

const ReactGridLayout = WidthProvider(RGL);

const WIDGET_CONFIG = {
  terminal:     { title: 'Terminal',         icon: TermIcon,    Component: Terminal },
  system:       { title: 'System Monitor',   icon: Cpu,         Component: SystemStats },
  network:      { title: 'Network Traffic',  icon: Network,     Component: NetworkMonitor },
  processes:    { title: 'Processes',        icon: Layers,      Component: ProcessList },
  files:        { title: 'File System',      icon: FolderOpen,  Component: FileExplorer },
  datastream:   { title: 'Data Stream',      icon: Activity,    Component: DataStream },
  globe:        { title: 'Network Topology', icon: Globe,       Component: GlobeViz },
  quickstats:   { title: 'Live Metrics',     icon: BarChart3,   Component: QuickStats },
  ai:           { title: 'WAVE-AI',          icon: Sparkles,    Component: AIAssistant },
  ssh:          { title: 'SSH Connections',  icon: ServerIcon,  Component: SSHManager },
  filepreview:  { title: 'File Preview',     icon: FileCode,    Component: FilePreview },
  browser:      { title: 'Web Browser',      icon: Globe,       Component: WebBrowser },
  fileexplorer: { title: 'File Explorer',    icon: FolderSearch,Component: FileExplorerWindow },
};

export default function GridLayout({ layout, onLayoutChange, isLocked }) {
  const layoutItems = useMemo(() => layout.map(item => ({
    ...item,
    static: isLocked,
  })), [layout, isLocked]);

  return (
    <div style={{ height: '100%', overflowY: 'auto' }}>
      <style>{`
        .react-grid-item.react-grid-placeholder {
          background: hsl(185 100% 50% / 0.08) !important;
          border: 1px dashed hsl(185 100% 50% / 0.4) !important;
          border-radius: 2px !important;
        }
        .react-resizable-handle {
          opacity: 0;
          transition: opacity 0.2s;
        }
        .react-grid-item:hover .react-resizable-handle {
          opacity: 1;
        }
        .react-resizable-handle::after {
          border-color: hsl(185 100% 50% / 0.6) !important;
        }
        .react-grid-item.react-draggable-dragging {
          opacity: 0.85;
          box-shadow: 0 0 24px hsl(185 100% 50% / 0.3);
          z-index: 100;
        }
      `}</style>
      <ReactGridLayout
        layout={layoutItems}
        cols={24}
        rowHeight={30}
        margin={[6, 6]}
        containerPadding={[0, 0]}
        onLayoutChange={onLayoutChange}
        draggableHandle=".drag-handle"
        isDraggable={!isLocked}
        isResizable={!isLocked}
        resizeHandles={['se', 'sw', 'ne', 'nw']}
        compactType={null}
        preventCollision={false}
      >
        {layout.map(item => {
          const cfg = WIDGET_CONFIG[item.i];
          if (!cfg) return null;
          const { title, icon, Component } = cfg;
          return (
            <div key={item.i} style={{ height: '100%' }}>
              <CyberPanel
                title={title}
                icon={icon}
                className="h-full"
                isDraggable={!isLocked}
              >
                <Component />
              </CyberPanel>
            </div>
          );
        })}
      </ReactGridLayout>
    </div>
  );
}