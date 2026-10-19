import React, { useEffect, useRef } from 'react';
import { createTimeline, stagger } from 'animejs';

import { useReducedMotion } from './useReducedMotion';

interface IntroCurtainProps {
  play?: boolean;
  onCovered?: () => void;
  onComplete?: () => void;
  slats?: number;
}

const getDefaultSlats = () => (typeof window !== 'undefined' && window.innerWidth < 640 ? 6 : 8);

const IntroCurtain: React.FC<IntroCurtainProps> = ({
  play = true,
  onCovered,
  onComplete,
  slats = getDefaultSlats(),
}) => {
  const reducedMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const onCoveredRef = useRef(onCovered);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCoveredRef.current = onCovered;
    onCompleteRef.current = onComplete;
  });

  useEffect(() => {
    if (!play) return;
    const root = ref.current;
    if (!root) return;

    const bars = Array.from(root.querySelectorAll<HTMLElement>('[data-curtain-slat]'));
    if (bars.length === 0) return;

    if (reducedMotion) {
      onCoveredRef.current?.();
      onCompleteRef.current?.();
      return;
    }

    const timeline = createTimeline({ defaults: { ease: 'inOutQuart' } });

    timeline
      .add(bars, {
        y: ['-110%', '0%'],
        duration: 380,
        delay: stagger(24),
        ease: 'inQuart',
      })
      .call(() => onCoveredRef.current?.())
      // Punchy tactile latch while screen is 100% covered
      .add({ duration: 60 })
      .add(bars, {
        y: ['0%', '110%'],
        duration: 460,
        delay: stagger(26),
        ease: 'outQuart',
      })
      .call(() => onCompleteRef.current?.());

    return () => {
      timeline.revert();
    };
  }, [play, slats, reducedMotion]);

  return (
    <div
      ref={ref}
      className="fixed inset-0 z-[1300] overflow-hidden pointer-events-none"
      aria-hidden="true"
    >
      {Array.from({ length: slats }).map((_, index) => (
        <div
          key={index}
          data-curtain-slat
          className="absolute top-0 h-[101%] bg-[#0A0A0E] border-t-4 border-b-4 border-[#0055FF] border-r border-[#0055FF]/25 border-l border-black/40 shadow-[0_0_24px_rgba(0,85,255,0.25)] flex flex-col justify-between py-6 px-1.5 select-none overflow-hidden"
          style={{
            left: `calc(${(index * 100) / slats}% - 1px)`,
            width: `calc(${100 / slats}% + 2px)`,
            transform: 'translateY(-110%)',
          }}
        >
          {/* Architectural wireframe coordinates on each shutter slat */}
          <div className="flex items-center justify-between font-mono text-[9px] text-[#0055FF]/70 tracking-widest min-w-0">
            <span className="truncate">[0{index + 1}]</span>
            <span className="hidden sm:inline text-[#0055FF]/40">SYS_SYNC</span>
          </div>

          <div className="my-auto mx-auto w-[1px] h-28 bg-gradient-to-b from-transparent via-[#0055FF]/30 to-transparent" />

          <div className="flex items-center justify-between font-mono text-[9px] text-[#0055FF]/70 tracking-widest min-w-0">
            <span className="truncate">// 2026</span>
            <span className="hidden sm:inline text-[#0055FF]/40">LIVE</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default IntroCurtain;
