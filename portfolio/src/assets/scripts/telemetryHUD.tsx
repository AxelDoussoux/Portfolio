import React, { useEffect, useState } from 'react';
import { motion, useScroll, useSpring } from 'motion/react';
import { useReducedMotion } from './useReducedMotion';

export type SectionId = 'hero' | 'about' | 'portfolio' | 'experience' | 'skills' | 'contact';

interface TelemetryHUDProps {
  activeSection: string;
  onNavigate: (sectionId: SectionId) => void;
}

const SECTIONS: { id: SectionId; code: string; label: string; depth: string }[] = [
  { id: 'hero', code: 'SEC_01', label: 'ACCUEIL', depth: '0.30X' },
  { id: 'about', code: 'SEC_02', label: 'A_PROPOS', depth: '0.50X' },
  { id: 'portfolio', code: 'SEC_03', label: 'PROJETS', depth: '0.80X' },
  { id: 'experience', code: 'SEC_04', label: 'PARCOURS', depth: '0.70X' },
  { id: 'skills', code: 'SEC_05', label: 'STACK', depth: '0.75X' },
  { id: 'contact', code: 'SEC_06', label: 'CONTACT', depth: '0.90X' },
];

export const TelemetryHUD: React.FC<TelemetryHUDProps> = ({ activeSection, onNavigate }) => {
  const reducedMotion = useReducedMotion();
  const { scrollY, scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 180, damping: 25 });

  const [scrollPixels, setScrollPixels] = useState(0);
  const [scrollPercent, setScrollPercent] = useState(0);

  useEffect(() => {
    let frame = 0;
    const unsubY = scrollY.on('change', (v) => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        setScrollPixels(Math.round(v));
        frame = 0;
      });
    });

    const unsubProgress = scrollYProgress.on('change', (p) => {
      setScrollPercent(Math.round(p * 100));
    });

    return () => {
      unsubY();
      unsubProgress();
      if (frame) cancelAnimationFrame(frame);
    };
  }, [scrollY, scrollYProgress]);

  if (reducedMotion) return null;

  return (
    <aside
      aria-label="Télémétrie de navigation architecturale"
      className="hidden xl:flex fixed right-4 top-1/2 -translate-y-1/2 z-40 flex-col items-end pointer-events-auto select-none"
    >
      {/* HUD Outer Blueprint Shell */}
      <div className="bg-white/95 backdrop-blur-md border-2 border-black p-3 shadow-[5px_5px_0px_#000000] font-mono text-[10px] w-48">
        {/* Header Telemetry Coordinates */}
        <div className="flex items-center justify-between border-b border-black/15 pb-2 mb-2.5">
          <span className="text-[#0055FF] font-bold tracking-widest flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-[#0055FF] border border-black animate-pulse" />
            TELEMETRY // V26
          </span>
          <span className="text-black font-bold tabular-nums">
            {String(scrollPercent).padStart(2, '0')}%
          </span>
        </div>

        {/* Live Coordinate Stamp */}
        <div className="flex items-center justify-between text-[#64748B] text-[9px] mb-3 px-1 bg-[#F8FAFC] border border-black/10 py-1">
          <span>Y_POS:</span>
          <span className="text-black font-bold tabular-nums">
            {String(scrollPixels).padStart(5, '0')}PX
          </span>
        </div>

        {/* Vertical Ruler & Navigation Slices */}
        <div className="relative pl-3 space-y-1.5">
          {/* Vertical Ruler Line with Scrub Carriage */}
          <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-black/15">
            <motion.div
              style={{
                top: 0,
                bottom: 0,
                scaleY: smoothProgress,
                transformOrigin: 'top',
              }}
              className="w-full bg-[#0055FF]"
            />
          </div>

          {SECTIONS.map((sec, idx) => {
            const isActive = activeSection === sec.id;
            return (
              <button
                key={sec.id}
                type="button"
                onClick={() => onNavigate(sec.id)}
                className={`w-full text-left py-1 px-2 flex items-center justify-between border transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#0055FF] text-white font-bold border-black shadow-[2px_2px_0px_#000000] translate-x-[-2px]'
                    : 'bg-white text-[#475569] border-transparent hover:text-black hover:border-black/20 hover:bg-[#F1F5F9]'
                }`}
              >
                <span className="tracking-wider">
                  [{String(idx + 1).padStart(2, '0')}] {sec.label}
                </span>
                {isActive && (
                  <span className="text-[9px] tracking-tight bg-black text-white px-1 py-0.2">
                    ACTIVE
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* HUD Bottom Status */}
        {(() => {
          const currentSec = SECTIONS.find((s) => s.id === activeSection);
          return (
            <div className="mt-3 pt-2 border-t border-black/15 flex items-center justify-between text-[9px] text-[#64748B]">
              <span>DEPTH // {currentSec?.depth ?? '0.30X'}</span>
              <span className="text-[#0055FF] font-bold">2.5D ACTIVE</span>
            </div>
          );
        })()}
      </div>
    </aside>
  );
};

export default TelemetryHUD;
