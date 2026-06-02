import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const BOOT_LINES = [
  { text: 'INITIALIZING QUANTUM CORE...', delay: 0 },
  { text: 'LOADING KERNEL MODULES ████████████████ OK', delay: 200 },
  { text: 'MOUNTING ENCRYPTED FILESYSTEM...', delay: 400 },
  { text: 'ESTABLISHING SECURE TUNNEL ████████████ OK', delay: 600 },
  { text: 'CALIBRATING NEURAL INTERFACE...', delay: 800 },
  { text: 'SYSTEM DIAGNOSTICS ████████████████████ PASS', delay: 1000 },
  { text: 'NETWORK ADAPTER: ONLINE', delay: 1100 },
  { text: 'GPU ACCELERATION: ENABLED', delay: 1200 },
  { text: 'THREAT DETECTION: ACTIVE', delay: 1300 },
  { text: 'ALL SYSTEMS NOMINAL', delay: 1500 },
  { text: '', delay: 1600 },
  { text: '▓▓▓ COMMAND CENTER READY ▓▓▓', delay: 1800 },
];

export default function BootSequence({ onComplete }) {
  const [visibleLines, setVisibleLines] = useState([]);
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    BOOT_LINES.forEach((line, i) => {
      setTimeout(() => {
        setVisibleLines(prev => [...prev, line.text]);
      }, line.delay);
    });

    setTimeout(() => {
      setComplete(true);
      setTimeout(onComplete, 600);
    }, 2600);
  }, []);

  return (
    <AnimatePresence>
      {!complete && (
        <motion.div
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.6 }}
          className="fixed inset-0 z-50 bg-background flex items-center justify-center scanline-overlay"
        >
          <div className="max-w-lg w-full px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 text-center"
            >
              <h1 className="font-display text-2xl font-bold tracking-[0.3em] text-primary glow-text">
                eDEX
              </h1>
              <p className="font-mono text-[10px] text-muted-foreground tracking-wider mt-1">
                COMMAND CENTER v3.0
              </p>
            </motion.div>

            <div className="space-y-1">
              {visibleLines.map((text, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`font-mono text-[10px] ${
                    text.includes('OK') || text.includes('PASS') || text.includes('READY')
                      ? 'text-chart-3'
                      : text.includes('ONLINE') || text.includes('ENABLED') || text.includes('ACTIVE')
                        ? 'text-primary'
                        : 'text-muted-foreground'
                  }`}
                >
                  {text || '\u00A0'}
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 2.4, ease: 'easeInOut' }}
              className="h-0.5 bg-gradient-to-r from-primary via-accent to-primary mt-6 rounded-full"
              style={{ boxShadow: '0 0 10px hsl(185, 100%, 50%, 0.5)' }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}