import React, { useState } from 'react';
import { Activity, Terminal as TermIcon, Globe, FolderOpen, Cpu, Network, BarChart3, Layers } from 'lucide-react';
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

export default function CommandCenter() {
  const [booted, setBooted] = useState(false);

  return (
    <div className="h-screen w-screen overflow-hidden bg-background scanline-overlay flicker">
      {!booted && <BootSequence onComplete={() => setBooted(true)} />}

      {booted && (
        <div className="h-full flex flex-col">
          <TopBar />

          <div className="flex-1 min-h-0 grid grid-cols-12 grid-rows-6 gap-1.5 p-1.5">
            {/* Left column - System Stats */}
            <div className="col-span-3 row-span-4">
              <CyberPanel title="System Monitor" icon={Cpu} className="h-full" delay={0.1}>
                <SystemStats />
              </CyberPanel>
            </div>

            {/* Center - Terminal (main panel) */}
            <div className="col-span-6 row-span-4">
              <CyberPanel title="Terminal" icon={TermIcon} className="h-full" delay={0.2}>
                <Terminal />
              </CyberPanel>
            </div>

            {/* Right column - Network & Globe */}
            <div className="col-span-3 row-span-2">
              <CyberPanel title="Network Topology" icon={Globe} className="h-full" delay={0.3}>
                <GlobeViz />
              </CyberPanel>
            </div>

            <div className="col-span-3 row-span-2">
              <CyberPanel title="Network Traffic" icon={Network} className="h-full" delay={0.4}>
                <NetworkMonitor />
              </CyberPanel>
            </div>

            {/* Bottom row */}
            <div className="col-span-3 row-span-2">
              <CyberPanel title="File System" icon={FolderOpen} className="h-full" delay={0.5}>
                <FileExplorer />
              </CyberPanel>
            </div>

            <div className="col-span-4 row-span-2">
              <CyberPanel title="Processes" icon={Layers} className="h-full" delay={0.6}>
                <ProcessList />
              </CyberPanel>
            </div>

            <div className="col-span-2 row-span-2">
              <CyberPanel title="Live Metrics" icon={BarChart3} className="h-full" delay={0.7}>
                <QuickStats />
              </CyberPanel>
            </div>

            <div className="col-span-3 row-span-2 relative">
              <CyberPanel title="Data Stream" icon={Activity} className="h-full" delay={0.8}>
                <DataStream />
              </CyberPanel>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}