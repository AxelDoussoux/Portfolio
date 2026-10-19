import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useScroll } from 'motion/react';
import PORTFOLIO_CONFIG from './portfolioData';
import WordScrollLighting from './wordScrollLighting';
import { useReducedMotion } from './useReducedMotion';
import { useScrollytelling } from './useScrollytelling';

type Entry =
  | { kind: 'formation'; key: string; start: string; item: typeof PORTFOLIO_CONFIG.education[number] }
  | { kind: 'experience'; key: string; start: string; item: typeof PORTFOLIO_CONFIG.experiences[number] };

const ENTRIES: Entry[] = [
  ...PORTFOLIO_CONFIG.education.map((item) => ({ kind: 'formation' as const, key: `edu-${item.id}`, start: item.start, item })),
  ...PORTFOLIO_CONFIG.experiences.map((item) => ({ kind: 'experience' as const, key: `exp-${item.id}`, start: item.start, item })),
].sort((a, b) => a.start.localeCompare(b.start));

const KIND_STYLE = {
  formation: { label: 'Formation', color: '#7C3AED' },
  experience: { label: 'Expérience', color: '#0055FF' },
} as const;

const TimelineEntry: React.FC<{ entry: Entry; index: number; active: boolean }> = ({ entry, index, active }) => {
  const { label, color } = KIND_STYLE[entry.kind];
  const isFormation = entry.kind === 'formation';
  const title = isFormation ? entry.item.degree : entry.item.role;
  const place = isFormation ? entry.item.school : entry.item.company;

  return (
    <li data-timeline-index={index} className="relative pl-10 sm:pl-14">
      <span
        aria-hidden="true"
        className="absolute left-0 top-1.5 w-[18px] h-[18px] border-2 border-black transition-[background-color,transform] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{ backgroundColor: active ? color : '#FFFFFF', transform: active ? 'rotate(45deg)' : 'none' }}
      />

      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs font-bold">
        <span style={{ color }}>{label}</span>
        <span className="text-[#475569]">{entry.item.period}</span>
      </div>

      <div className="mt-2 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-xl sm:text-2xl font-extrabold font-display uppercase text-black leading-tight [text-wrap:balance]">
            {title}
          </h3>
          <p className="mt-1 font-body font-medium text-[#0A0A0E]">{place}</p>
        </div>
        {!isFormation && entry.item.logo && (
          <img
            src={entry.item.logo}
            alt=""
            loading="lazy"
            className="w-12 h-12 shrink-0 object-contain bg-white border border-black p-1"
          />
        )}
      </div>

      {isFormation ? (
        <p className="mt-3 text-[#334155] font-body leading-relaxed max-w-[62ch]">
          Spécialisation <strong className="font-semibold text-black">{entry.item.specialty}</strong>. {entry.item.description}
        </p>
      ) : (
        <>
          <p className="mt-3 text-[#334155] font-body leading-relaxed max-w-[62ch]">{entry.item.description}</p>
          <ul className="mt-3 space-y-1.5 max-w-[62ch]">
            {entry.item.achievements.map((achievement) => (
              <li key={achievement} className="flex items-start gap-2 text-sm text-[#334155] font-body">
                <span className="mt-[0.5em] w-1.5 h-1.5 shrink-0" style={{ backgroundColor: color }} aria-hidden="true" />
                <span className="leading-relaxed">{achievement}</span>
              </li>
            ))}
          </ul>
          <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Environnement technique">
            {entry.item.technologies.map((tech) => (
              <li key={tech} className="px-2 py-0.5 bg-white border border-black/30 text-xs font-mono text-[#0A0A0E]">
                {tech}
              </li>
            ))}
          </ul>
        </>
      )}
    </li>
  );
};

export const JourneyTimeline: React.FC = () => {
  const reducedMotion = useReducedMotion();
  const scrolly = useScrollytelling();
  const listRef = useRef<HTMLOListElement>(null);
  const [active, setActive] = useState(0);

  const { scrollYProgress } = useScroll({ target: listRef, offset: ['start 55%', 'end 55%'] });

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const hit = entries.find((entry) => entry.isIntersecting);
        if (hit) setActive(Number((hit.target as HTMLElement).dataset.timelineIndex));
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    list.querySelectorAll('[data-timeline-index]').forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  const current = ENTRIES[active];
  const year = current.start.slice(0, 4);

  return (
    <section id="experience" className="relative z-10 py-24 lg:py-32">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 grid lg:grid-cols-[1fr_1.1fr] gap-12 lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <h2 className="text-[clamp(1.75rem,3.4vw,3rem)] font-black font-display uppercase tracking-[-0.02em] text-black leading-none">
            Parcours
          </h2>
          <div className="mt-6 text-lg text-[#334155] font-body leading-relaxed max-w-[48ch]">
            <WordScrollLighting
              text="Une formation multimédia, puis l'informatique pure. Entre les deux, des projets réels en entreprise : du motion design au jeu vidéo, jusqu'au fullstack."
              highlightWords={['multimédia', 'informatique', 'réels', 'fullstack']}
              highlightColor="#0055FF"
            />
          </div>

          {scrolly && (
            <div className="mt-12 hidden lg:block" aria-hidden="true">
              <div className="relative h-[clamp(4rem,7.5vw,6.5rem)] overflow-hidden font-display font-black text-[clamp(4rem,7.5vw,6.5rem)] leading-none tracking-[-0.03em] text-black tabular-nums">
                <AnimatePresence initial={false} mode="popLayout">
                  <motion.span
                    key={year}
                    initial={reducedMotion ? false : { y: '100%' }}
                    animate={{ y: '0%' }}
                    exit={{ y: '-100%' }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="block"
                  >
                    {year}
                  </motion.span>
                </AnimatePresence>
              </div>
              <p className="mt-3 font-mono text-xs font-bold" style={{ color: KIND_STYLE[current.kind].color }}>
                {KIND_STYLE[current.kind].label} · {active + 1} / {ENTRIES.length}
              </p>
            </div>
          )}
        </div>

        <div className="relative">
          <span aria-hidden="true" className="absolute left-[8px] top-2 bottom-2 w-[2px] bg-black/15" />
          {!reducedMotion && (
            <motion.span
              aria-hidden="true"
              style={{ scaleY: scrollYProgress }}
              className="absolute left-[8px] top-2 bottom-2 w-[2px] bg-[#0055FF] origin-top"
            />
          )}
          <ol ref={listRef} className="relative space-y-16 lg:space-y-24">
            {ENTRIES.map((entry, index) => (
              <TimelineEntry key={entry.key} entry={entry} index={index} active={reducedMotion || index <= active} />
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
};

export default JourneyTimeline;
