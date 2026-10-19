import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import type PORTFOLIO_CONFIG from './portfolioData';
import { useReducedMotion } from './useReducedMotion';
import {
  FiExternalLink as ExternalLink,
  FiGithub as Github,
  FiArrowUpRight as ArrowUpRight,
  FiLayers as Layers,
  FiCheckSquare as CheckSquare,
} from 'react-icons/fi';

type Project = typeof PORTFOLIO_CONFIG.projects[number];

interface StickyProjectStackProps {
  projects: Project[];
  onOpenProject: (projectId: number) => void;
}

interface DeckCardProps {
  project: Project;
  index: number;
  total: number;
  onOpenProject: (projectId: number) => void;
}

const DeckCard: React.FC<DeckCardProps> = ({ project, index, total, onOpenProject }) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  const isLast = index === total - 1;

  // Scroll mapping for card stacking physics - measured on the normal-flow track
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ['start start', 'end start'],
  });

  // Smooth 2.5D recession as subsequent cards stack on top
  const targetScale = isLast ? 1 : Math.max(0.93, 1 - (total - index - 1) * 0.022);
  const scale = useTransform(scrollYProgress, [0, 0.9], [1, targetScale]);
  const dimOpacity = useTransform(scrollYProgress, [0, 0.85], [0, isLast ? 0 : 0.18]);
  const brightness = useTransform(scrollYProgress, [0, 0.9], [1, isLast ? 1 : 0.9]);
  const translateY = useTransform(scrollYProgress, [0, 0.9], [0, isLast ? 0 : -8]);

  // Blueprint sticky top offset: compact on mobile, staggered on desktop
  const topOffset = `calc(4.5rem + ${index * 14}px)`;

  // Check if project is 3D/Creative to apply the dedicated violet accent
  const isCreative3D =
    project.type.toLowerCase().includes('3d') ||
    project.technologies.some((t) => t.toLowerCase().includes('three') || t.toLowerCase().includes('webgl'));
  const categoryAccent = isCreative3D ? '#7C3AED' : '#0055FF';
  const categoryBadgeBg = isCreative3D ? '#F3E8FF' : '#E0EBFF';

  return (
    <div
      ref={trackRef}
      className={`relative w-full ${isLast ? 'pb-4' : 'pb-20 sm:pb-28 lg:pb-36'}`}
      style={{ zIndex: index + 10 }}
    >
      <div
        className="sticky w-full"
        style={{ top: topOffset }}
      >
        <motion.article
          style={{
            scale: reducedMotion ? 1 : scale,
            y: reducedMotion ? 0 : translateY,
            filter: reducedMotion ? 'none' : `brightness(${brightness})`,
            transformOrigin: 'top center',
          }}
          className="relative w-full max-h-[calc(100vh-6rem)] overflow-y-auto lg:overflow-visible bg-white border-2 border-black shadow-[8px_8px_0px_#000000] p-4 sm:p-7 lg:p-8 transition-shadow"
        >
          {/* Shading overlay for stacked depth */}
          {!reducedMotion && (
            <motion.div
              style={{ opacity: dimOpacity }}
              className="absolute inset-0 bg-slate-900 pointer-events-none z-30"
              aria-hidden="true"
            />
          )}

          {/* Blueprint Framing Corner Marks with Depth Telemetry */}
          <div className="absolute top-2 left-2 font-mono text-[9px] text-black/35 select-none pointer-events-none">
            + [DRAFT_TL // Z:{index + 1}]
          </div>
          <div className="absolute top-2 right-2 font-mono text-[9px] text-black/35 select-none pointer-events-none">
            + [DEPTH_2.5D: {(0.8 + index * 0.05).toFixed(2)}x]
          </div>
          <div className="absolute bottom-2 left-2 font-mono text-[9px] text-black/35 select-none pointer-events-none">
            + [SYS_BL]
          </div>
          <div className="absolute bottom-2 right-2 font-mono text-[9px] text-black/35 select-none pointer-events-none">
            + [ELEVATION: Z+{(index + 1) * 12}px]
          </div>

          {/* Card Header Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2.5 border-b-2 border-black pb-3.5 mb-5 font-mono text-xs">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 bg-black text-white font-bold tracking-wider text-[11px]">
                [PROJET {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}]
              </span>
              <span
                className="px-2 py-0.5 font-bold border border-black/30 text-[11px]"
                style={{ backgroundColor: categoryBadgeBg, color: categoryAccent }}
              >
                // {project.type.toUpperCase()}
              </span>
            </div>

            <div className="flex items-center gap-2.5">
              <span className="text-[#64748B] font-bold text-[11px]">ANNÉE: {project.year}</span>
              <span className="flex items-center gap-1.5 font-bold text-black bg-[#F1F5F9] border border-black px-2 py-0.5 text-[10px] shadow-[2px_2px_0px_#000000]">
                <span
                  className="w-2 h-2 rounded-full border border-black"
                  style={{ backgroundColor: project.status === 'Terminé' ? '#22C55E' : '#F59E0B' }}
                  aria-hidden="true"
                />
                {project.status.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-[1.12fr_0.88fr] gap-5 lg:gap-8 items-center">
            {/* Media Stage */}
            <div className="relative">
              <div
                onClick={() => onOpenProject(project.id)}
                className="relative border-2 border-black bg-[#E2E8F0] shadow-[5px_5px_0px_#000000] overflow-hidden cursor-pointer group"
              >
                <div className="aspect-[16/10] w-full overflow-hidden bg-black/5 relative">
                  <img
                    src={project.image}
                    alt={`Aperçu interactif du projet ${project.title}`}
                    loading="lazy"
                    className="w-full h-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                  {/* Blueprint grid overlay on image */}
                  <div className="absolute inset-0 blueprint-grid opacity-25 pointer-events-none" />
                </div>

                {/* Hover Exploration Overlay */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center p-4">
                  <span className="px-4 py-2 bg-white text-black font-mono font-bold text-xs uppercase border-2 border-black shadow-[4px_4px_0px_#0055FF] flex items-center gap-2">
                    <Layers size={14} className="text-[#0055FF]" />
                    OUVRIR L'ÉTUDE COMPLÈTE ↗
                  </span>
                </div>
              </div>

              {/* Direct Access Toolbar */}
              <div className="flex flex-wrap items-center gap-2 mt-3 font-mono text-xs">
                {project.demo && (
                  <a
                    href={project.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0055FF] text-white hover:bg-black font-bold transition-all border-2 border-black shadow-[3px_3px_0px_#000000]"
                    aria-label={`Démonstration en ligne de ${project.title}`}
                  >
                    <ExternalLink size={13} />
                    DÉMO LIVE ↗
                  </a>
                )}
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border-2 border-black text-black hover:bg-black hover:text-white font-bold transition-all shadow-[3px_3px_0px_#000000]"
                    aria-label={`Dépôt de code GitHub pour ${project.title}`}
                  >
                    <Github size={13} />
                    CODE SOURCE ↗
                  </a>
                )}
              </div>
            </div>

            {/* Blueprint Specs & Narrative */}
            <div className="space-y-3.5">
              <div>
                <h3 className="text-xl sm:text-2xl md:text-3xl font-black font-display text-black uppercase tracking-tight leading-tight">
                  {project.title}
                </h3>
                <p className="mt-2 text-[#334155] font-body text-xs sm:text-sm leading-relaxed">
                  {project.description}
                </p>
              </div>

              {/* Architecture Highlights Panel */}
              {project.features && project.features.length > 0 && (
                <div className="bg-[#F8FAFC] border border-black/25 p-3 space-y-1.5 font-body text-xs text-[#334155]">
                  <span className="block font-mono text-[10px] font-bold text-black uppercase tracking-wider mb-0.5 flex items-center gap-1.5">
                    <CheckSquare size={12} className="text-[#0055FF]" />
                    POINTS CLÉS ARCHITECTURE :
                  </span>
                  {project.features.slice(0, 2).map((feat, fIndex) => (
                    <div key={fIndex} className="flex items-start gap-2">
                      <span className="font-mono font-bold text-[#0055FF] mt-0.5 text-[10px]">■</span>
                      <span className="leading-snug">{feat}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Technologies Chips */}
              <div>
                <span className="block text-[10px] font-mono text-[#64748B] uppercase font-bold mb-1.5">
                  STACK UTILISÉE :
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {project.technologies.map((tech, techIdx) => (
                    <span
                      key={techIdx}
                      className="px-2 py-0.5 text-[11px] font-mono font-bold bg-[#F1F5F9] text-black border border-black shadow-[2px_2px_0px_#000000]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Primary Action Button */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => onOpenProject(project.id)}
                  className="w-full sm:w-auto px-5 py-2.5 bg-white text-black hover:bg-black hover:text-white font-mono font-bold text-xs uppercase border-2 border-black shadow-[4px_4px_0px_#000000] flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <span>CONSULTER LE CAS D'ÉTUDE TECHNIQUE</span>
                  <ArrowUpRight size={15} />
                </button>
              </div>
            </div>
          </div>
        </motion.article>
      </div>
    </div>
  );
};

export const StickyProjectStack: React.FC<StickyProjectStackProps> = ({ projects, onOpenProject }) => {
  return (
    <div className="deck-stack-container relative w-full">
      {/* Visual Stacking Stage Header */}
      <div className="hidden lg:flex items-center justify-between border-2 border-black bg-white px-5 py-2.5 mb-8 font-mono text-xs shadow-[4px_4px_0px_#000000]">
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 bg-[#0055FF] border border-black animate-pulse" />
          <span className="font-bold text-black">DECK // DÉFILEMENT CINÉMATIQUE</span>
          <span className="text-[#64748B]">STACKING PERSPECTIVE ACTIVE</span>
        </div>
        <div className="text-[#0055FF] font-bold">
          [DÉFILEZ POUR EMPILER LES PLANS] ↓
        </div>
      </div>

      {/* Cards Deck */}
      <div className="relative">
        {projects.map((project, index) => (
          <DeckCard
            key={project.id}
            project={project}
            index={index}
            total={projects.length}
            onOpenProject={onOpenProject}
          />
        ))}
      </div>
    </div>
  );
};

export default StickyProjectStack;
