import React, { useEffect, useRef } from 'react';
import { animate, stagger } from 'animejs';
import { useReducedMotion } from './useReducedMotion';

/** Tactile blueprint background with slow GPU-composited ambient motion. */
const GalaxyBackground: React.FC = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const root = rootRef.current;
    if (!root || reducedMotion) return;
    const animation = animate(root.querySelectorAll<HTMLElement>('[data-ambient-glow]'), {
      x: (_target: unknown, index = 0) => index % 2 === 0 ? 34 : -30,
      y: (_target: unknown, index = 0) => index === 1 ? 28 : -24,
      scale: [1, 1.12],
      opacity: [0.07, 0.13],
      delay: stagger(600),
      duration: 16000,
      alternate: true,
      loop: true,
      ease: 'inOutSine',
    });
    return () => { animation.revert(); };
  }, [reducedMotion]);

  return (
    <div ref={rootRef} className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#F4F5F8]" aria-hidden="true">
      <div className="film-grain" />
      <div className="absolute inset-0 blueprint-grid opacity-80" />
      <div
        data-ambient-glow
        className="absolute -top-32 -left-32 w-96 h-96 opacity-10"
        style={{ background: 'radial-gradient(circle, #0055FF 0%, rgba(0,85,255,0) 70%)', filter: 'blur(80px)' }}
      />
      <div
        data-ambient-glow
        className="absolute top-1/3 -right-48 w-[32rem] h-[32rem] opacity-10"
        style={{ background: 'radial-gradient(circle, #00B4D8 0%, rgba(0,180,216,0) 70%)', filter: 'blur(90px)' }}
      />
      <div
        data-ambient-glow
        className="absolute -bottom-32 left-1/3 w-[30rem] h-[30rem] opacity-10"
        style={{ background: 'radial-gradient(circle, #3B82F6 0%, rgba(59,130,246,0) 70%)', filter: 'blur(90px)' }}
      />
      <div className="absolute top-0 bottom-0 left-6 sm:left-12 border-l border-black/[0.06]" />
      <div className="absolute top-0 bottom-0 right-6 sm:right-12 border-r border-black/[0.06]" />
      <div className="absolute top-4 left-4 font-mono text-[10px] text-black/35 select-none">+ [0,0]</div>
      <div className="absolute top-4 right-4 font-mono text-[10px] text-black/35 select-none">+ [X_MAX]</div>
      <div className="absolute bottom-4 left-4 font-mono text-[10px] text-black/35 select-none">+ [Y_MAX]</div>
      <div className="absolute bottom-4 right-4 font-mono text-[10px] text-black/35 select-none">SYS_GRID // 36PX</div>
    </div>
  );
};

export default GalaxyBackground;
