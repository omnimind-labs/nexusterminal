import React, { useState, useEffect, useCallback } from 'react';
import { Activity, Terminal as TermIcon, Globe, FolderOpen, Cpu, Network, BarChart3, Layers, Sparkles, ServerIcon, FileCode } from 'lucide-react';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';

import CyberPanel from '../components/command-center/CyberPanel';
import SystemStats from '../components/command-center/SystemStats';
import Terminal from '../components/command-center/Terminal';
import NetworkMonitor from '../components/command-center/NetworkMonitor';
import ProcessList from '../components/command-center/ProcessList';
import FileExplorer from '../components/command-center/FileExplorer';
import DataStream from '../components/command-center/DataStream';
import TopBar from '../components/command-center/TopBar';
import GlobeViz from '../components/command-center/GlobeViz';
import QuickStats from '../components/command-center/QuickStats';
import BootSequence from '../components/command-center/BootSequence';
import AIAssistant from '../components/command-center/AIAssistant';
import SSHManager from '../components/command-center/SSHManager';
import FilePreview from '../components/command-center/FilePreview';
import WebBrowser from '../components/command-center/WebBrowser';
import TabBar from '../components/command-center/TabBar';

function ResizeHandle({ direction = 'horizontal' }) {
  const isH = direction === 'horizontal';
  return (
    <PanelResizeHandle className={`group relative flex items-center justify-center z-10 transition-colors ${isH ? 'w-2 cursor-col-resize' : 'h-2 cursor-row-resize'}`}>
      <div className={`rounded-full transition-all duration-200 bg-primary/10 group-hover:bg-primary/50 group-active:bg-primary/80 ${isH ? 'h-full w-px group-hover:w-[3px] group-active:w-[3px]' : 'w-full h-px group-hover:h-[3px] group-active:h-[3px]'}`} />
      <div className={`absolute flex items-center justify-center gap-[3px] opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${isH ? 'flex-col' : 'flex-row'}`}>
        {[0, 1, 2].map(i => <div key={i} className="w-1 h-1 rounded-full bg-primary/80" />)}
      </div>
    </PanelResizeHandle>
  );
}

function PC({ children }) {
  return <div style={{ height: '100%', width: '100%', overflow: 'hidden' }}>{children}</div>;
}

// ── TAB LAYOUTS ────────────────────────────────────────────
function DashboardLayout() {
  return (
    <PanelGroup direction="horizontal" style={{ height: '100%' }}>
      <Panel defaultSize={22} minSize={14} maxSize={40}>
        <PC><CyberPanel title="System Monitor" icon={Cpu} className="h-full" delay={0.1}><SystemStats /></CyberPanel></PC>
      </Panel>
      <ResizeHandle />
      <Panel defaultSize={50} minSize={25}>
        <PC>
          <PanelGroup direction="vertical" style={{ height: '100%' }}>
            <Panel defaultSize={65} minSize={30}>
              <PC><CyberPanel title="Terminal" icon={TermIcon} className="h-full" delay={0.2}><Terminal /></CyberPanel></PC>
            </Panel>
            <ResizeHandle direction="vertical" />
            <Panel defaultSize={35} minSize={15}>
              <PC>
                <PanelGroup direction="horizontal" style={{ height: '100%' }}>
                  <Panel defaultSize={55} minSize={25}>
                    <PC><CyberPanel title="Processes" icon={Layers} className="h-full" delay={0.6}><ProcessList /></CyberPanel></PC>
                  </Panel>
                  <ResizeHandle />
                  <Panel defaultSize={45} minSize={20}>
                    <PC><CyberPanel title="Live Metrics" icon={BarChart3} className="h-full" delay={0.7}><QuickStats /></CyberPanel></PC>
                  </Panel>
                </PanelGroup>
              </PC>
            </Panel>
          </PanelGroup>
        </PC>
      </Panel>
      <ResizeHandle />
      <Panel defaultSize={28} minSize={16} maxSize={45}>
        <PC>
          <PanelGroup direction="vertical" style={{ height: '100%' }}>
            <Panel defaultSize={28} minSize={12}>
              <PC><CyberPanel title="Network Topology" icon={Globe} className="h-full" delay={0.3}><GlobeViz /></CyberPanel></PC>
            </Panel>
            <ResizeHandle direction="vertical" />
            <Panel defaultSize={28} minSize={12}>
              <PC><CyberPanel title="Network Traffic" icon={Network} className="h-full" delay={0.4}><NetworkMonitor /></CyberPanel></PC>
            </Panel>
            <ResizeHandle direction="vertical" />
            <Panel defaultSize={22} minSize={10}>
              <PC><CyberPanel title="File System" icon={FolderOpen} className="h-full" delay={0.5}><FileExplorer /></CyberPanel></PC>
            </Panel>
            <ResizeHandle direction="vertical" />
            <Panel defaultSize={22} minSize={10}>
              <PC><CyberPanel title="Data Stream" icon={Activity} className="h-full" delay={0.8}><DataStream /></CyberPanel></PC>
            </Panel>
          </PanelGroup>
        </PC>
      </Panel>
    </PanelGroup>
  );
}

function AILayout() {
  return (
    <PanelGroup direction="horizontal" style={{ height: '100%' }}>
      <Panel defaultSize={22} minSize={14} maxSize={35}>
        <PC><CyberPanel title="System Monitor" icon={Cpu} className="h-full" delay={0.1}><SystemStats /></CyberPanel></PC>
      </Panel>
      <ResizeHandle />
      <Panel defaultSize={40} minSize={30}>
        <PC><CyberPanel title="Terminal" icon={TermIcon} className="h-full" delay={0.2}><Terminal /></CyberPanel></PC>
      </Panel>
      <ResizeHandle />
      <Panel defaultSize={38} minSize={25}>
        <PC>
          <PanelGroup direction="vertical" style={{ height: '100%' }}>
            <Panel defaultSize={65} minSize={30}>
              <PC><CyberPanel title="WAVE-AI Assistant" icon={Sparkles} className="h-full" delay={0.3}><AIAssistant /></CyberPanel></PC>
            </Panel>
            <ResizeHandle direction="vertical" />
            <Panel defaultSize={35} minSize={20}>
              <PC><CyberPanel title="Processes" icon={Layers} className="h-full" delay={0.4}><ProcessList /></CyberPanel></PC>
            </Panel>
          </PanelGroup>
        </PC>
      </Panel>
    </PanelGroup>
  );
}

function SSHLayout() {
  return (
    <PanelGroup direction="horizontal" style={{ height: '100%' }}>
      <Panel defaultSize={28} minSize={18} maxSize={40}>
        <PC>
          <PanelGroup direction="vertical" style={{ height: '100%' }}>
            <Panel defaultSize={55} minSize={30}>
              <PC><CyberPanel title="SSH Connections" icon={ServerIcon} className="h-full" delay={0.1}><SSHManager /></CyberPanel></PC>
            </Panel>
            <ResizeHandle direction="vertical" />
            <Panel defaultSize={45} minSize={25}>
              <PC><CyberPanel title="Network Topology" icon={Globe} className="h-full" delay={0.2}><GlobeViz /></CyberPanel></PC>
            </Panel>
          </PanelGroup>
        </PC>
      </Panel>
      <ResizeHandle />
      <Panel defaultSize={44} minSize={30}>
        <PC><CyberPanel title="Terminal" icon={TermIcon} className="h-full" delay={0.3}><Terminal /></CyberPanel></PC>
      </Panel>
      <ResizeHandle />
      <Panel defaultSize={28} minSize={18}>
        <PC>
          <PanelGroup direction="vertical" style={{ height: '100%' }}>
            <Panel defaultSize={50} minSize={25}>
              <PC><CyberPanel title="Network Traffic" icon={Network} className="h-full" delay={0.4}><NetworkMonitor /></CyberPanel></PC>
            </Panel>
            <ResizeHandle direction="vertical" />
            <Panel defaultSize={50} minSize={25}>
              <PC><CyberPanel title="System Monitor" icon={Cpu} className="h-full" delay={0.5}><SystemStats /></CyberPanel></PC>
            </Panel>
          </PanelGroup>
        </PC>
      </Panel>
    </PanelGroup>
  );
}

function PreviewLayout() {
  return (
    <PanelGroup direction="horizontal" style={{ height: '100%' }}>
      <Panel defaultSize={22} minSize={14} maxSize={35}>
        <PC>
          <PanelGroup direction="vertical" style={{ height: '100%' }}>
            <Panel defaultSize={55} minSize={30}>
              <PC><CyberPanel title="File System" icon={FolderOpen} className="h-full" delay={0.1}><FileExplorer /></CyberPanel></PC>
            </Panel>
            <ResizeHandle direction="vertical" />
            <Panel defaultSize={45} minSize={25}>
              <PC><CyberPanel title="System Monitor" icon={Cpu} className="h-full" delay={0.2}><SystemStats /></CyberPanel></PC>
            </Panel>
          </PanelGroup>
        </PC>
      </Panel>
      <ResizeHandle />
      <Panel defaultSize={40} minSize={28}>
        <PC><CyberPanel title="Terminal" icon={TermIcon} className="h-full" delay={0.3}><Terminal /></CyberPanel></PC>
      </Panel>
      <ResizeHandle />
      <Panel defaultSize={38} minSize={25}>
        <PC>
          <PanelGroup direction="vertical" style={{ height: '100%' }}>
            <Panel defaultSize={65} minSize={35}>
              <PC><CyberPanel title="File Preview" icon={FileCode} className="h-full" delay={0.4}><FilePreview /></CyberPanel></PC>
            </Panel>
            <ResizeHandle direction="vertical" />
            <Panel defaultSize={35} minSize={20}>
              <PC><CyberPanel title="WAVE-AI" icon={Sparkles} className="h-full" delay={0.5}><AIAssistant /></CyberPanel></PC>
            </Panel>
          </PanelGroup>
        </PC>
      </Panel>
    </PanelGroup>
  );
}

function BrowserLayout() {
  return (
    <PanelGroup direction="horizontal" style={{ height: '100%' }}>
      <Panel defaultSize={22} minSize={14} maxSize={35}>
        <PC>
          <PanelGroup direction="vertical" style={{ height: '100%' }}>
            <Panel defaultSize={50} minSize={25}>
              <PC><CyberPanel title="System Monitor" icon={Cpu} className="h-full" delay={0.1}><SystemStats /></CyberPanel></PC>
            </Panel>
            <ResizeHandle direction="vertical" />
            <Panel defaultSize={50} minSize={25}>
              <PC><CyberPanel title="Terminal" icon={TermIcon} className="h-full" delay={0.2}><Terminal /></CyberPanel></PC>
            </Panel>
          </PanelGroup>
        </PC>
      </Panel>
      <ResizeHandle />
      <Panel defaultSize={55} minSize={35}>
        <PC><CyberPanel title="Web Browser" icon={Globe} className="h-full" delay={0.3}><WebBrowser /></CyberPanel></PC>
      </Panel>
      <ResizeHandle />
      <Panel defaultSize={23} minSize={15}>
        <PC>
          <PanelGroup direction="vertical" style={{ height: '100%' }}>
            <Panel defaultSize={55} minSize={25}>
              <PC><CyberPanel title="WAVE-AI" icon={Sparkles} className="h-full" delay={0.4}><AIAssistant /></CyberPanel></PC>
            </Panel>
            <ResizeHandle direction="vertical" />
            <Panel defaultSize={45} minSize={20}>
              <PC><CyberPanel title="Network Traffic" icon={Network} className="h-full" delay={0.5}><NetworkMonitor /></CyberPanel></PC>
            </Panel>
          </PanelGroup>
        </PC>
      </Panel>
    </PanelGroup>
  );
}

const TAB_LAYOUTS = {
  dashboard: DashboardLayout,
  ai: AILayout,
  ssh: SSHLayout,
  preview: PreviewLayout,
  browser: BrowserLayout,
};

const DEFAULT_TABS = [
  { id: 'tab-1', label: 'Dashboard', type: 'dashboard' },
  { id: 'tab-2', label: 'WAVE-AI', type: 'ai' },
  { id: 'tab-3', label: 'SSH', type: 'ssh' },
  { id: 'tab-4', label: 'Preview', type: 'preview' },
  { id: 'tab-5', label: 'Browser', type: 'browser' },
];

const TAB_TYPE_CYCLE = ['dashboard', 'ai', 'ssh', 'preview', 'browser'];

export default function CommandCenter() {
  const [booted, setBooted] = useState(false);
  const [tabs, setTabs] = useState(DEFAULT_TABS);
  const [activeTab, setActiveTab] = useState('tab-1');

  const addTab = useCallback(() => {
    const id = `tab-${Date.now()}`;
    const type = TAB_TYPE_CYCLE[tabs.length % TAB_TYPE_CYCLE.length];
    const labels = { dashboard: 'Dashboard', ai: 'WAVE-AI', ssh: 'SSH', preview: 'Preview', browser: 'Browser' };
    setTabs(prev => [...prev, { id, label: labels[type], type }]);
    setActiveTab(id);
  }, [tabs]);

  const closeTab = useCallback((id) => {
    setTabs(prev => {
      const next = prev.filter(t => t.id !== id);
      if (activeTab === id && next.length > 0) {
        setActiveTab(next[next.length - 1].id);
      }
      return next;
    });
  }, [activeTab]);

  // Keyboard shortcut: Ctrl+T new tab, Ctrl+W close tab, Ctrl+1-5 switch
  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 't') { e.preventDefault(); addTab(); }
      if ((e.ctrlKey || e.metaKey) && e.key === 'w') { e.preventDefault(); if (tabs.length > 1) closeTab(activeTab); }
      if (e.ctrlKey) {
        const n = parseInt(e.key);
        if (n >= 1 && n <= tabs.length) { e.preventDefault(); setActiveTab(tabs[n - 1].id); }
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [tabs, activeTab, addTab, closeTab]);

  const activeTabData = tabs.find(t => t.id === activeTab);
  const Layout = activeTabData ? (TAB_LAYOUTS[activeTabData.type] || DashboardLayout) : DashboardLayout;

  return (
    <div className="h-screen w-screen overflow-hidden bg-background scanline-overlay flicker" style={{ display: 'flex', flexDirection: 'column' }}>
      {!booted && <BootSequence onComplete={() => setBooted(true)} />}

      {booted && (
        <>
          <TopBar />
          <TabBar
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            onAddTab={addTab}
            onCloseTab={closeTab}
          />
          <div style={{ flex: 1, minHeight: 0, padding: '6px' }}>
            <Layout key={activeTab} />
          </div>
        </>
      )}
    </div>
  );
}