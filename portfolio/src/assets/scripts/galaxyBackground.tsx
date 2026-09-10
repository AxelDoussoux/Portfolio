import React from 'react';

/**
 * NeoBrutalistBackground
 * High-performance tactile background using procedural SVG film grain, 
 * light architectural blueprint wireframe grid, and technical coordinates.
 */
const GalaxyBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#F4F5F8]" aria-hidden="true">
      {/* 1. Procedural Film Grain Overlay (Paper texture) */}
      <div className="film-grain" />

      {/* 2. Blueprint Architectural Grid */}
      <div className="absolute inset-0 blueprint-grid opacity-80" />

      {/* 3. Subtle Ambient Blue Glow Accents */}
      <div 
        className="absolute -top-32 -left-32 w-96 h-96 opacity-10 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, #0055FF 0%, rgba(0,85,255,0) 70%)',
          filter: 'blur(80px)',
        }}
      />
      <div 
        className="absolute top-1/3 -right-48 w-[32rem] h-[32rem] opacity-10 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, #00B4D8 0%, rgba(0,180,216,0) 70%)',
          filter: 'blur(90px)',
        }}
      />
      <div 
        className="absolute -bottom-32 left-1/3 w-[30rem] h-[30rem] opacity-10 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, #3B82F6 0%, rgba(59,130,246,0) 70%)',
          filter: 'blur(90px)',
        }}
      />

      {/* 4. Structural Wireframe Guide Lines */}
      <div className="absolute top-0 bottom-0 left-6 sm:left-12 border-l border-black/[0.06] pointer-events-none" />
      <div className="absolute top-0 bottom-0 right-6 sm:right-12 border-r border-black/[0.06] pointer-events-none" />

      {/* 5. Architectural Alignment Crosshairs (+) */}
      <div className="absolute top-4 left-4 font-mono text-[10px] text-black/35 select-none">
        + [0,0]
      </div>
      <div className="absolute top-4 right-4 font-mono text-[10px] text-black/35 select-none">
        + [X_MAX]
      </div>
      <div className="absolute bottom-4 left-4 font-mono text-[10px] text-black/35 select-none">
        + [Y_MAX]
      </div>
      <div className="absolute bottom-4 right-4 font-mono text-[10px] text-black/35 select-none">
        SYS_GRID // 36PX
      </div>
    </div>
  );
};

export default GalaxyBackground;
