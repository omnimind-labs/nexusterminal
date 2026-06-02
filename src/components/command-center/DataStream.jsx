import React, { useState, useEffect, useRef } from 'react';

const CHARS = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';

function StreamColumn({ speed, delay }) {
  const [chars, setChars] = useState([]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        setChars(prev => {
          const next = [...prev, CHARS[Math.floor(Math.random() * CHARS.length)]];
          return next.length > 20 ? next.slice(-20) : next;
        });
      }, speed);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timeout);
  }, [speed, delay]);

  return (
    <div className="flex flex-col items-center overflow-hidden h-full">
      {chars.map((char, i) => (
        <span
          key={i}
          className="font-mono text-[8px] leading-tight"
          style={{
            color: i === chars.length - 1
              ? 'hsl(185, 100%, 80%)'
              : `hsl(185, 100%, ${Math.max(10, 50 - (chars.length - 1 - i) * 4)}%)`,
          }}
        >
          {char}
        </span>
      ))}
    </div>
  );
}

export default function DataStream() {
  const columns = 16;

  return (
    <div className="h-full flex gap-[3px] overflow-hidden opacity-40 px-1">
      {Array.from({ length: columns }, (_, i) => (
        <StreamColumn
          key={i}
          speed={80 + Math.random() * 200}
          delay={Math.random() * 3000}
        />
      ))}
    </div>
  );
}