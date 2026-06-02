import React, { useState } from 'react';
import { Activity, Terminal as TermIcon, Globe, FolderOpen, Cpu, Network, BarChart3, Layers } from 'lucide-react';
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

// Styled resize handle with cyber glow effect
function ResizeHandle({ direction = 'horizontal' }) {
  const isH = direction === 'horizontal';
  return (
    <PanelResizeHandle
      className={`group relative flex items-center justify-center z-10 transition-colors ${
        isH ? 'w-2 cursor-col-resize' : 'h-2 cursor-row-resize'
      }`}
    >
      {/* Glow track */}
      <div className={`
        rounded-full transition-all duration-200
        bg-primary/10 group-hover:bg-primary/50 group-active:bg-primary/80
        ${isH
          ? 'h-full w-px group-hover:w-[3px] group-active:w-[3px]'
          : 'w-full h-px group-hover:h-[3px] group-active:h-[3px]'
        }
      `}
        style={{ boxShadow: '0 0 8px hsl(185, 100%, 50%, 0)' }}
      />
      {/* Grip dots */}
      <div className={`
        absolute flex items-center justify-center gap-[3px]
        opacity-0 group-hover:opacity-100 transition-opacity duration-200
        ${isH ? 'flex-col' : 'flex-row'}
      `}>
        {[0, 1, 2].map(i => (
          <div key={i} className="w-1 h-1 rounded-full bg-primary/80" />
        ))}
      </div>
    </PanelResizeHandle>
  );
}

// Wrapper that ensures panels fill height correctly
function PanelContent({ children }) {
  return (
    <div style={{ height: '100%', width: '100%', overflow: 'hidden' }}>
      {children}
    </div>
  );
}

export default function CommandCenter() {
  const [booted, setBooted] = useState(false);

  return (
    <div className="h-screen w-screen overflow-hidden bg-background scanline-overlay flicker">
      {!booted && <BootSequence onComplete={() => setBooted(true)} />}

      {booted && (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <TopBar />

          <div style={{ flex: 1, minHeight: 0, padding: '6px' }}>
            <PanelGroup direction="horizontal" style={{ height: '100%' }}>

              {/* ══ LEFT: System Monitor ══ */}
              <Panel defaultSize={22} minSize={14} maxSize={40}>
                <PanelContent>
                  <CyberPanel title="System Monitor" icon={Cpu} className="h-full" delay={0.1}>
                    <SystemStats />
                  </CyberPanel>
                </PanelContent>
              </Panel>

              <ResizeHandle direction="horizontal" />

              {/* ══ CENTER COLUMN ══ */}
              <Panel defaultSize={50} minSize={25}>
                <PanelContent>
                  <PanelGroup direction="vertical" style={{ height: '100%' }}>

                    {/* Terminal */}
                    <Panel defaultSize={65} minSize={30}>
                      <PanelContent>
                        <CyberPanel title="Terminal" icon={TermIcon} className="h-full" delay={0.2}>
                          <Terminal />
                        </CyberPanel>
                      </PanelContent>
                    </Panel>

                    <ResizeHandle direction="vertical" />

                    {/* Processes + Live Metrics */}
                    <Panel defaultSize={35} minSize={15}>
                      <PanelContent>
                        <PanelGroup direction="horizontal" style={{ height: '100%' }}>

                          <Panel defaultSize={55} minSize={25}>
                            <PanelContent>
                              <CyberPanel title="Processes" icon={Layers} className="h-full" delay={0.6}>
                                <ProcessList />
                              </CyberPanel>
                            </PanelContent>
                          </Panel>

                          <ResizeHandle direction="horizontal" />

                          <Panel defaultSize={45} minSize={20}>
                            <PanelContent>
                              <CyberPanel title="Live Metrics" icon={BarChart3} className="h-full" delay={0.7}>
                                <QuickStats />
                              </CyberPanel>
                            </PanelContent>
                          </Panel>

                        </PanelGroup>
                      </PanelContent>
                    </Panel>

                  </PanelGroup>
                </PanelContent>
              </Panel>

              <ResizeHandle direction="horizontal" />

              {/* ══ RIGHT COLUMN ══ */}
              <Panel defaultSize={28} minSize={16} maxSize={45}>
                <PanelContent>
                  <PanelGroup direction="vertical" style={{ height: '100%' }}>

                    <Panel defaultSize={28} minSize={12}>
                      <PanelContent>
                        <CyberPanel title="Network Topology" icon={Globe} className="h-full" delay={0.3}>
                          <GlobeViz />
                        </CyberPanel>
                      </PanelContent>
                    </Panel>

                    <ResizeHandle direction="vertical" />

                    <Panel defaultSize={28} minSize={12}>
                      <PanelContent>
                        <CyberPanel title="Network Traffic" icon={Network} className="h-full" delay={0.4}>
                          <NetworkMonitor />
                        </CyberPanel>
                      </PanelContent>
                    </Panel>

                    <ResizeHandle direction="vertical" />

                    <Panel defaultSize={22} minSize={10}>
                      <PanelContent>
                        <CyberPanel title="File System" icon={FolderOpen} className="h-full" delay={0.5}>
                          <FileExplorer />
                        </CyberPanel>
                      </PanelContent>
                    </Panel>

                    <ResizeHandle direction="vertical" />

                    <Panel defaultSize={22} minSize={10}>
                      <PanelContent>
                        <CyberPanel title="Data Stream" icon={Activity} className="h-full" delay={0.8}>
                          <DataStream />
                        </CyberPanel>
                      </PanelContent>
                    </Panel>

                  </PanelGroup>
                </PanelContent>
              </Panel>

            </PanelGroup>
          </div>
        </div>
      )}
    </div>
  );
}