import React, { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { animate, stagger } from 'animejs';
import { useReducedMotion } from './useReducedMotion';

/**
 * Tactile blueprint background with visible multi-layer 2.5D scroll parallax,
 * drafting crosshairs, dynamic coordinate telemetry, and GPU-composited ambient glows.
 */
const Background: React.FC = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  // Scroll parallax drivers for distinct 2.5D depth layers
  const { scrollY } = useScroll();

  // DEPTH 0: Far Blueprint Grid (-0.12x parallax)
  const gridTranslateY = useTransform(scrollY, [0, 3000], [0, -360]);

  // DEPTH 1: Mid Architectural CAD Crosshairs & Guide Lines (-0.22x parallax)
  const cadTranslateY = useTransform(scrollY, [0, 3000], [0, -660]);

  // DEPTH 2: Technical Stamps & Floating Coordinate Markers (-0.38x parallax)
  const stampsTranslateY = useTransform(scrollY, [0, 3000], [0, -1140]);

  // Ambient Glow Translation
  const glowTranslateY = useTransform(scrollY, [0, 3000], [0, -180]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || reducedMotion) return;
    const animation = animate(root.querySelectorAll<HTMLElement>('[data-ambient-glow]'), {
      x: (_target: unknown, index = 0) => (index % 2 === 0 ? 28 : -24),
      y: (_target: unknown, index = 0) => (index === 1 ? 24 : -20),
      scale: [1, 1.08],
      opacity: [0.06, 0.1],
      delay: stagger(800),
      duration: 18000,
      alternate: true,
      loop: true,
      ease: 'inOutSine',
    });
    return () => {
      animation.revert();
    };
  }, [reducedMotion]);

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#F4F5F8]"
      aria-hidden="true"
    >
      <div className="film-grain" />

      {/* Parallax Blueprint Wireframe Grid - DEPTH 0 */}
      <motion.div
        style={{
          y: reducedMotion ? 0 : gridTranslateY,
        }}
        className="absolute -top-[50vh] -bottom-[50vh] left-0 right-0 blueprint-grid opacity-85"
      />

      {/* Atmospheric Ambient Glows */}
      <motion.div
        style={{ y: reducedMotion ? 0 : glowTranslateY }}
        className="contents"
      >
        <div
          data-ambient-glow
          className="absolute -top-32 -left-32 w-[34rem] h-[34rem] opacity-[0.08]"
          style={{
            background: 'radial-gradient(circle, #0055FF 0%, rgba(0,85,255,0) 70%)',
            filter: 'blur(90px)',
          }}
        />
        <div
          data-ambient-glow
          className="absolute top-1/3 -right-40 w-[36rem] h-[36rem] opacity-[0.06]"
          style={{
            background: 'radial-gradient(circle, #7C3AED 0%, rgba(124,58,237,0) 70%)',
            filter: 'blur(100px)',
          }}
        />
        <div
          data-ambient-glow
          className="absolute top-2/3 -left-32 w-[30rem] h-[30rem] opacity-[0.07]"
          style={{
            background: 'radial-gradient(circle, #0055FF 0%, rgba(0,85,255,0) 70%)',
            filter: 'blur(95px)',
          }}
        />
        <div
          data-ambient-glow
          className="absolute -bottom-32 right-1/4 w-[32rem] h-[32rem] opacity-[0.06]"
          style={{
            background: 'radial-gradient(circle, #7C3AED 0%, rgba(124,58,237,0) 70%)',
            filter: 'blur(95px)',
          }}
        />
      </motion.div>

      {/* Architectural Margins Framing */}
      <div className="absolute top-0 bottom-0 left-6 sm:left-12 border-l border-black/[0.08]" />
      <div className="absolute top-0 bottom-0 right-6 sm:right-12 border-r border-black/[0.08]" />

      {/* DEPTH 1: Architectural CAD Crosshairs & Guide Elements */}
      <motion.div
        style={{ y: reducedMotion ? 0 : cadTranslateY }}
        className="absolute inset-0 pointer-events-none"
      >
        <div className="absolute top-[25%] right-6 sm:right-14 flex items-center gap-1.5 font-mono text-[9px] text-[#0055FF]/30 font-bold select-none">
          <span className="text-xs text-black/30 font-bold">+</span>
          <span>[CAD_GRID: 36PX_SCALE]</span>
        </div>
        <div className="absolute top-[65%] right-6 sm:right-14 flex items-center gap-1.5 font-mono text-[9px] text-[#7C3AED]/30 font-bold select-none">
          <span className="text-xs text-black/30 font-bold">+</span>
          <span>[ELEVATION: Z+120M]</span>
        </div>
      </motion.div>

      {/* DEPTH 2: Technical Stamp on right margin */}
      <motion.div
        style={{ y: reducedMotion ? 0 : stampsTranslateY }}
        className="absolute inset-0 pointer-events-none"
      >
        <div className="absolute top-[8%] right-6 sm:right-14 font-mono text-[9px] text-black/20 font-bold select-none tracking-widest">
          SYS_CAD // 2.5D_PROJECTION
        </div>
        <div className="absolute top-[85%] right-6 sm:right-14 font-mono text-[9px] text-black/20 font-bold select-none tracking-widest">
          ORIGIN_REF: [0, 0, Z0]
        </div>
      </motion.div>
    </div>
  );
};

export default Background;
