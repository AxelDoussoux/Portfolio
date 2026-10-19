import React, { useLayoutEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useMotionValueEvent, useScroll, useTransform, type MotionValue } from 'motion/react';
import {
  FiArrowUpRight as ArrowUpRight,
  FiExternalLink as ExternalLink,
  FiGithub as Github,
} from 'react-icons/fi';
import PORTFOLIO_CONFIG from './portfolioData';
import { useScrollytelling } from './useScrollytelling';

type Project = typeof PORTFOLIO_CONFIG.projects[number];

interface ProjectReelProps {
  projects: Project[];
  onOpenProject: (projectId: number) => void;
}

const isCreative = (project: Project) =>
  project.type.toLowerCase().includes('3d') ||
  project.technologies.some((tech) => /three|webgl/i.test(tech));

const pad = (value: number) => String(value).padStart(2, '0');

interface ProjectSlideProps {
  project: Project;
  index: number;
  total: number;
  onOpenProject: (projectId: number) => void;
  /** Horizontal offset of the reel, used for the inner image parallax. Absent in vertical flow. */
  reelX?: MotionValue<number>;
  onFocusSlide?: (element: HTMLElement) => void;
}

const ProjectSlide: React.FC<ProjectSlideProps> = ({ project, index, total, onOpenProject, reelX, onFocusSlide }) => {
  const accent = isCreative(project) ? '#7C3AED' : '#0055FF';
  const slideRef = useRef<HTMLElement>(null);
  const staticX = useMotionValue(0);
  // The screenshot drifts against the reel direction, capped so its edges never show.
  const imageX = useTransform(reelX ?? staticX, (value) => {
    const slide = slideRef.current;
    if (!reelX || !slide) return 0;
    const limit = slide.offsetWidth * 0.045;
    return Math.max(-limit, Math.min(limit, -(slide.offsetLeft + value) * 0.05));
  });

  return (
    <article
      ref={slideRef}
      onFocus={(event) => onFocusSlide?.(event.currentTarget)}
      aria-label={`Projet ${index + 1} sur ${total} : ${project.title}`}
      className="reel-slide relative shrink-0 w-full lg:w-[min(80vw,1180px)] lg:h-full bg-white border-2 border-black grid lg:grid-cols-[1.25fr_1fr]"
      style={{ boxShadow: `8px 8px 0px ${index % 2 === 0 ? '#000000' : accent}` }}
    >
      <button
        type="button"
        onClick={() => onOpenProject(project.id)}
        className="group relative overflow-hidden border-b-2 lg:border-b-0 lg:border-r-2 border-black bg-[#E2E8F0] aspect-[16/10] lg:aspect-auto cursor-pointer"
        aria-label={`Ouvrir le cas d'étude ${project.title}`}
      >
        <motion.img
          src={project.image}
          alt=""
          loading={index === 0 ? 'eager' : 'lazy'}
          style={{ x: imageX }}
          className="absolute inset-y-0 -left-[8%] w-[116%] h-full max-w-none object-cover object-top transition-[filter] duration-300 group-hover:brightness-90"
        />
        <span className="absolute left-0 top-0 px-3 py-1.5 bg-black text-white font-mono text-xs font-bold">
          {pad(index + 1)} / {pad(total)}
        </span>
        <span className="absolute right-3 bottom-3 inline-flex items-center gap-2 px-3 py-2 bg-white border-2 border-black font-mono text-xs font-bold shadow-[3px_3px_0px_#000000] translate-y-1 opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
          CAS D'ÉTUDE <ArrowUpRight size={14} aria-hidden="true" />
        </span>
      </button>

      <div className="flex flex-col gap-4 p-5 sm:p-7 lg:p-8 min-h-0 overflow-y-auto">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs font-bold">
          <span style={{ color: accent }}>{project.type}</span>
          <span className="text-[#64748B]">{project.year}</span>
          <span className="inline-flex items-center gap-1.5 text-[#475569]">
            <span
              className="w-2 h-2 border border-black"
              style={{ backgroundColor: project.status === 'Terminé' ? '#22C55E' : '#F59E0B' }}
              aria-hidden="true"
            />
            {project.status}
          </span>
        </div>

        <h3 className="text-[clamp(1.5rem,2.4vw,2.25rem)] [overflow-wrap:normal] font-black font-display text-black uppercase tracking-[-0.02em] leading-[0.98] [text-wrap:balance]">
          {project.title}
        </h3>

        <p className="text-[#334155] font-body text-sm lg:text-base leading-relaxed max-w-[52ch]">
          {project.description}
        </p>

        {project.features.length > 0 && (
          <ul className="space-y-1.5 font-body text-sm text-[#334155]">
            {project.features.slice(0, 3).map((feature) => (
              <li key={feature} className="flex items-start gap-2">
                <span className="mt-[0.45em] w-1.5 h-1.5 shrink-0" style={{ backgroundColor: accent }} aria-hidden="true" />
                <span className="leading-snug">{feature}</span>
              </li>
            ))}
          </ul>
        )}

        <ul className="flex flex-wrap gap-1.5" aria-label="Technologies">
          {project.technologies.map((tech) => (
            <li key={tech} className="px-2 py-0.5 text-[11px] font-mono font-bold bg-[#F1F5F9] text-black border border-black">
              {tech}
            </li>
          ))}
        </ul>

        <div className="mt-auto pt-2 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => onOpenProject(project.id)}
            className="brutal-btn px-4 py-2.5 bg-black text-white hover:bg-[#0055FF] border-2 border-black font-mono font-bold text-xs shadow-[3px_3px_0px_#0055FF] cursor-pointer"
          >
            CAS D'ÉTUDE <ArrowUpRight size={15} className="ml-1.5" aria-hidden="true" />
          </button>
          {project.demo && (
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="brutal-btn px-3.5 py-2.5 bg-white text-black hover:bg-black hover:text-white border-2 border-black font-mono font-bold text-xs shadow-[3px_3px_0px_#000000]"
              aria-label={`Démonstration en ligne de ${project.title}`}
            >
              <ExternalLink size={13} className="mr-1.5" aria-hidden="true" /> DÉMO
            </a>
          )}
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="brutal-btn px-3.5 py-2.5 bg-white text-black hover:bg-black hover:text-white border-2 border-black font-mono font-bold text-xs shadow-[3px_3px_0px_#000000]"
              aria-label={`Code source de ${project.title} sur GitHub`}
            >
              <Github size={13} className="mr-1.5" aria-hidden="true" /> CODE
            </a>
          )}
        </div>
      </div>
    </article>
  );
};

const ReelHeading: React.FC<{ total: number; active?: number; progress?: MotionValue<number> }> = ({ total, active, progress }) => {
  return (
    <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h2 className="text-[clamp(1.75rem,3.4vw,3rem)] font-black font-display uppercase tracking-[-0.02em] text-black leading-none">
          Projets sélectionnés
        </h2>
        <p className="mt-3 text-[#334155] font-body text-base max-w-[60ch] leading-relaxed">
          Chaque projet ouvre un cas d'étude : contraintes, choix d'architecture, démo et code source.
        </p>
      </div>
      {progress && active !== undefined && (
        <div className="flex items-center gap-4 font-mono text-sm font-bold" aria-hidden="true">
          <span className="tabular-nums text-black">
            <span className="text-[#0055FF]">{pad(active + 1)}</span> / {pad(total)}
          </span>
          <span className="relative block w-40 h-2 border border-black bg-white overflow-hidden">
            <motion.span style={{ scaleX: progress }} className="absolute inset-0 origin-left bg-[#0055FF]" />
          </span>
        </div>
      )}
    </div>
  );
};

const ReelOutro: React.FC = () => (
  <div className="shrink-0 lg:w-[min(34vw,420px)] lg:h-full flex flex-col justify-end gap-4 border-2 border-dashed border-black/40 p-6 sm:p-8">
    <p className="font-display font-extrabold uppercase text-2xl lg:text-3xl leading-[1.05] text-black [text-wrap:balance]">
      Le reste du code vit sur GitHub.
    </p>
    <a
      href={PORTFOLIO_CONFIG.github}
      target="_blank"
      rel="noopener noreferrer"
      className="brutal-btn self-start px-4 py-2.5 bg-white text-black hover:bg-black hover:text-white border-2 border-black font-mono font-bold text-xs shadow-[3px_3px_0px_#000000]"
    >
      <Github size={14} className="mr-1.5" aria-hidden="true" /> TOUS LES DÉPÔTS ↗
    </a>
  </div>
);

export const ProjectReel: React.FC<ProjectReelProps> = ({ projects, onOpenProject }) => {
  const pinned = useScrollytelling();
  const sectionRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);
  const [active, setActive] = useState(0);

  // Horizontal travel = how far the track overflows the viewport. The section is exactly that much taller
  // than the screen, so one pixel of vertical scroll moves the reel one pixel sideways.
  useLayoutEffect(() => {
    if (!pinned) return;
    const measure = () => {
      const track = trackRef.current;
      const viewport = viewportRef.current;
      if (!track || !viewport) return;
      setDistance(Math.max(0, track.scrollWidth - viewport.clientWidth));
    };
    measure();
    const observer = new ResizeObserver(measure);
    if (trackRef.current) observer.observe(trackRef.current);
    if (viewportRef.current) observer.observe(viewportRef.current);
    return () => observer.disconnect();
  }, [pinned, projects.length]);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] });
  const x = useTransform(scrollYProgress, (value) => -value * distance);

  useMotionValueEvent(scrollYProgress, 'change', (value) => {
    const next = Math.min(projects.length - 1, Math.round(value * (projects.length - 0.4)));
    setActive((current) => (current === next ? current : next));
  });

  // Keyboard users tab into an off-screen slide: scroll the page so the reel brings it into view.
  const focusSlide = (slide: HTMLElement) => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track || distance === 0) return;
    const gutter = parseFloat(getComputedStyle(track).paddingLeft) || 0;
    const offset = Math.min(distance, Math.max(0, slide.offsetLeft - gutter));
    const sectionTop = section.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: sectionTop + offset, behavior: 'auto' });
  };

  // One <section> element in both modes so useScroll keeps tracking it when the viewport crosses the breakpoint.
  return (
    <section
      id="portfolio"
      ref={sectionRef}
      className={pinned ? 'relative z-10' : 'relative z-10 py-20 sm:py-24'}
      style={pinned ? { height: `calc(100svh + ${distance}px)` } : undefined}
    >
      {pinned ? (
        <div ref={viewportRef} className="sticky top-0 h-svh overflow-hidden flex flex-col pt-[clamp(5.5rem,11vh,7rem)] pb-[clamp(1.5rem,4vh,3rem)] gap-[clamp(1.25rem,3vh,2.25rem)]">
          <ReelHeading total={projects.length} active={active} progress={scrollYProgress} />
          <motion.div
            ref={trackRef}
            style={{ x }}
            className="relative flex-1 min-h-0 flex gap-[clamp(1.5rem,3vw,3rem)] pl-[max(1.5rem,calc((100vw-80rem)/2+1.5rem))] pr-[8vw] pb-2"
          >
            {projects.map((project, index) => (
              <ProjectSlide
                key={project.id}
                project={project}
                index={index}
                total={projects.length}
                onOpenProject={onOpenProject}
                reelX={x}
                onFocusSlide={focusSlide}
              />
            ))}
            <ReelOutro />
          </motion.div>
        </div>
      ) : (
        <>
          <ReelHeading total={projects.length} />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-10 flex flex-col gap-10">
            {projects.map((project, index) => (
              <ProjectSlide
                key={project.id}
                project={project}
                index={index}
                total={projects.length}
                onOpenProject={onOpenProject}
              />
            ))}
            <ReelOutro />
          </div>
        </>
      )}
    </section>
  );
};

export default ProjectReel;
