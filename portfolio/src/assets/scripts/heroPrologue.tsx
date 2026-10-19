import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, type MotionValue } from 'motion/react';
import { animate, stagger, steps } from 'animejs';
import {
  FiArrowDown as ArrowDown,
  FiFileText as FileText,
  FiGithub as Github,
  FiLinkedin as Linkedin,
} from 'react-icons/fi';
import PORTFOLIO_CONFIG from './portfolioData';
import SplitText from './splitText';
import TypewriterText from './typewriterText';
import { useReducedMotion } from './useReducedMotion';
import { useScrollytelling } from './useScrollytelling';

const HERO_ROLES = [
  '// CONCEPTION LOGICIELLE',
  '// INTERFACES HAUTE PERFORMANCE',
  '// ARCHITECTURES SCALABLES',
];

const MARQUEE_TECHNOLOGIES = Array.from(new Set(PORTFOLIO_CONFIG.skills.map((skill) => skill.name)));

const STATEMENT =
  'Je conçois des produits web complets, du modèle de données jusqu’à la dernière micro-interaction.';
const STATEMENT_ACCENTS = new Set(['complets,', 'données', 'micro-interaction.']);

const STATEMENT_FACTS = [
  { label: 'Formation', value: 'Master Informatique · Lyon 2' },
  { label: 'Terrain', value: '4 expériences en entreprise' },
  { label: 'Statut', value: 'Disponible · Lyon & remote' },
];

interface HeroPrologueProps {
  introDone: boolean;
  onNavigate: (sectionId: 'portfolio') => void;
}

interface StatementWordProps {
  word: string;
  progress: MotionValue<number>;
  range: [number, number];
}

const StatementWord: React.FC<StatementWordProps> = ({ word, progress, range }) => {
  const opacity = useTransform(progress, range, [0.18, 1]);
  return (
    <motion.span
      style={{ opacity }}
      className={STATEMENT_ACCENTS.has(word) ? 'text-[#FFE500]' : undefined}
    >
      {word}{' '}
    </motion.span>
  );
};

/** Cobalt manifesto panel. Scrubbed word by word when pinned, fully lit otherwise. */
const Statement: React.FC<{ progress?: MotionValue<number> }> = ({ progress }) => {
  const words = STATEMENT.split(' ');
  return (
    <div className="relative h-full w-full bg-[#0055FF] text-white overflow-hidden">
      <div className="absolute inset-0 statement-grid pointer-events-none" aria-hidden="true" />
      <div className="relative h-full max-w-6xl mx-auto px-4 sm:px-6 py-20 lg:py-0 flex flex-col justify-center gap-[clamp(2rem,6vh,4rem)]">
        <p className="font-display font-extrabold uppercase text-[clamp(1.75rem,3.9vw,3.6rem)] leading-[1.04] tracking-[-0.02em] max-w-[22ch] [text-wrap:balance]">
          {progress
            ? words.map((word, index) => {
                const start = 0.36 + (index / words.length) * 0.4;
                return (
                  <StatementWord
                    key={`${word}-${index}`}
                    word={word}
                    progress={progress}
                    range={[start, start + 0.05]}
                  />
                );
              })
            : words.map((word, index) => (
                <span key={`${word}-${index}`} className={STATEMENT_ACCENTS.has(word) ? 'text-[#FFE500]' : undefined}>
                  {word}{' '}
                </span>
              ))}
        </p>
        <dl className="grid sm:grid-cols-3 border-t-2 border-white/80">
          {STATEMENT_FACTS.map((fact) => (
            <div key={fact.label} className="pt-4 pb-1 sm:pr-6 border-b border-white/25 sm:border-b-0">
              <dt className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/85">{fact.label}</dt>
              <dd className="mt-1 font-body font-medium text-base lg:text-lg">{fact.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
};

export const HeroPrologue: React.FC<HeroPrologueProps> = ({ introDone, onNavigate }) => {
  const reducedMotion = useReducedMotion();
  const pinned = useScrollytelling();
  const trackRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const glitchRef = useRef<ReturnType<typeof animate> | null>(null);
  const [roleIndex, setRoleIndex] = useState(0);

  const { scrollYProgress } = useScroll({ target: trackRef, offset: ['start start', 'end end'] });

  // Act 1: the identity block recedes. Act 2: the cobalt manifesto wipes up and lights word by word.
  const introScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.9]);
  const introY = useTransform(scrollYProgress, [0, 0.3], [0, -90]);
  const introOpacity = useTransform(scrollYProgress, [0.04, 0.24], [1, 0]);
  const panelReveal = useTransform(scrollYProgress, [0.1, 0.38], [100, 0]);
  const panelClip = useTransform(panelReveal, (value) => `inset(${value}% 0 0 0)`);

  useEffect(() => {
    if (!introDone || reducedMotion) return;
    const rotation = window.setInterval(() => {
      setRoleIndex((index) => (index + 1) % HERO_ROLES.length);
    }, 3300);
    return () => window.clearInterval(rotation);
  }, [introDone, reducedMotion]);

  useEffect(() => () => { glitchRef.current?.revert(); }, []);

  const handleTitleGlitch = () => {
    const title = titleRef.current;
    if (!title || !introDone || reducedMotion) return;
    const chars = title.querySelectorAll<HTMLElement>('[data-char]');
    if (chars.length === 0) return;
    glitchRef.current?.revert();
    glitchRef.current = animate(chars, {
      translateX: [0, -4, 4, -2, 1, 0],
      duration: 340,
      delay: stagger(16),
      ease: steps(5),
    });
  };

  const identity = (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 w-full">
      <div data-hero-anim className="mb-[clamp(0.75rem,2vh,1.5rem)] flex flex-wrap items-center gap-2.5">
        <div className="inline-flex max-w-full items-center gap-2 font-mono text-xs text-black bg-white border-2 border-black px-3.5 py-1.5 shadow-[4px_4px_0px_#000000] font-bold">
          <span className="w-2.5 h-2.5 bg-[#22C55E] border border-black animate-pulse shrink-0" aria-hidden="true" />
          <span className="min-w-0">DISPONIBLE // MISSIONS & ALTERNANCE (LYON & REMOTE)</span>
        </div>
        <div className="inline-flex items-center font-mono text-xs text-[#0047D6] bg-[#E0EBFF] border-2 border-[#0055FF] px-3 py-1.5 shadow-[3px_3px_0px_#000000] font-bold">
          FULLSTACK & WEB 3D
        </div>
      </div>

      <h1
        ref={titleRef}
        onMouseEnter={handleTitleGlitch}
        aria-label={PORTFOLIO_CONFIG.name}
        className="hero-glitch mb-[clamp(0.75rem,2vh,1.5rem)] text-[clamp(1.75rem,min(8.4vw,11.5vh),6rem)] font-black font-display tracking-[-0.02em] text-black uppercase leading-[0.95]"
      >
        <SplitText text={PORTFOLIO_CONFIG.name} play={introDone} />
      </h1>

      <div data-hero-anim className="mb-[clamp(0.75rem,2vh,1.5rem)] flex flex-wrap items-center gap-3">
        <span className="font-mono text-base sm:text-xl font-bold text-white bg-[#0055FF] px-3.5 py-1.5 border-2 border-black shadow-[4px_4px_0px_#000000]">
          {PORTFOLIO_CONFIG.title}
        </span>
        <TypewriterText
          text={HERO_ROLES[roleIndex]}
          play={introDone}
          speed={28}
          className="font-mono text-xs sm:text-sm text-[#475569] font-semibold"
        />
      </div>

      <p data-hero-anim className="text-base sm:text-lg text-[#334155] font-body max-w-[62ch] leading-relaxed mb-[clamp(1.25rem,3vh,2.5rem)]">
        {PORTFOLIO_CONFIG.bio}
      </p>

      <div data-hero-anim className="flex flex-wrap items-center gap-3 sm:gap-4">
        <button
          type="button"
          onClick={() => onNavigate('portfolio')}
          className="brutal-btn px-6 py-3.5 bg-[#0055FF] text-white hover:bg-black hover:text-white border-2 border-black text-xs sm:text-sm font-mono font-bold tracking-wider shadow-[4px_4px_0px_#000000] cursor-pointer"
        >
          VOIR LES PROJETS
          <ArrowDown size={16} className="ml-2" aria-hidden="true" />
        </button>
        <a
          href="/cv.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="brutal-btn px-6 py-3.5 bg-white text-black hover:bg-black hover:text-white border-2 border-black text-xs sm:text-sm font-bold tracking-wider shadow-[4px_4px_0px_#000000]"
          aria-label="Consulter le CV numérique en PDF"
        >
          <FileText size={18} className="mr-2" aria-hidden="true" />
          CV_PDF
        </a>
        <div className="flex items-center gap-2">
          <a
            href={PORTFOLIO_CONFIG.github}
            target="_blank"
            rel="noopener noreferrer"
            className="brutal-btn p-3.5 bg-white text-black hover:bg-black hover:text-white border-2 border-black shadow-[3px_3px_0px_#000000]"
            aria-label="Profil GitHub"
          >
            <Github size={18} />
          </a>
          <a
            href={PORTFOLIO_CONFIG.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="brutal-btn p-3.5 bg-white text-black hover:bg-[#0055FF] hover:text-white border-2 border-black shadow-[3px_3px_0px_#000000]"
            aria-label="Profil LinkedIn"
          >
            <Linkedin size={18} />
          </a>
        </div>
      </div>
    </div>
  );

  const marquee = (
    <div className="w-full border-y border-black bg-white py-3 overflow-hidden select-none" aria-hidden="true">
      <div className="animate-marquee font-mono text-xs sm:text-sm tracking-widest text-[#475569] uppercase">
        {[0, 1].map((loop) =>
          MARQUEE_TECHNOLOGIES.map((tech, index) => (
            <span key={`marquee-${loop}-${tech}`} className="flex items-center shrink-0">
              <span className="mx-4 text-[#0055FF]">✦</span>
              <span className={index % 2 === 0 ? 'text-black font-bold' : ''}>{tech}</span>
            </span>
          ))
        )}
      </div>
    </div>
  );

  // One <section> element in both modes so useScroll keeps tracking it when the viewport crosses the breakpoint.
  return (
    <section id="hero" ref={trackRef} className={pinned ? 'relative z-10 h-[260svh]' : 'relative z-10'}>
      {pinned ? (
        <div className="sticky top-0 h-svh overflow-hidden">
          <motion.div
            style={{ scale: introScale, y: introY, opacity: introOpacity, transformOrigin: 'left center' }}
            className="absolute inset-0 flex flex-col justify-center gap-[clamp(1.5rem,4vh,3rem)] pt-[clamp(4.5rem,9vh,5.5rem)]"
          >
            {identity}
            <div className="flex flex-col items-center gap-2 font-mono text-[11px] font-bold tracking-[0.22em] text-[#475569] uppercase" aria-hidden="true">
              Défilez
              <span className="relative w-6 h-10 border-2 border-black bg-white shadow-[3px_3px_0px_#000000] flex justify-center p-1">
                <span className="w-1.5 h-2.5 bg-[#0055FF] border border-black animate-scroll-pill" />
              </span>
            </div>
            {marquee}
          </motion.div>

          <motion.div style={{ clipPath: panelClip }} className="absolute inset-0 pt-16">
            <Statement progress={scrollYProgress} />
          </motion.div>
        </div>
      ) : (
        <>
          <div className="min-h-svh flex flex-col justify-center gap-[clamp(1.5rem,4vh,3rem)] pt-[clamp(5rem,11vh,6.5rem)] pb-6">
            {identity}
            {marquee}
          </div>
          <Statement />
        </>
      )}
    </section>
  );
};

export default HeroPrologue;
