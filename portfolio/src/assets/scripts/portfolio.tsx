import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { animate, createTimeline, stagger, steps } from 'animejs';
import {
  FiCalendar as Calendar,
  FiMapPin as MapPin,
  FiMenu as Menu,
  FiX as X,
  FiArrowUp as ArrowUp,
  FiFileText as FileText,
  FiGithub as Github,
  FiLinkedin as Linkedin,
  FiMail as Mail,
  FiCopy as Copy,
  FiCheck as Check,
  FiTerminal as Terminal,
} from 'react-icons/fi';
import PORTFOLIO_CONFIG from './portfolioData';
import Background from './background';
import StickyProjectStack from './stickyProjectStack';
import SkillsHub from './skillsHub';
import WordScrollLighting from './wordScrollLighting';
import ProjectCard from './projectCard';
import ProjectDetailPage from './projectDetailPage';
import SplitText from './splitText';
import AnimatedCounter from './animatedCounter';
import IntroCurtain from './introCurtain';
import TypewriterText from './typewriterText';
import { useReducedMotion } from './useReducedMotion';
import { useRevealMotion } from './useRevealMotion';
import { useStaticInteractions } from './useStaticInteractions';

const getProjectIdFromHash = () => {
  if (typeof window === 'undefined') return null;

  const hash = window.location.hash;
  const match = hash.match(/^#project-(\d+)$/);
  if (!match) return null;

  const projectId = Number(match[1]);
  return PORTFOLIO_CONFIG.projects.some((project) => project.id === projectId) ? projectId : null;
};

const SECTION_IDS = ['hero', 'about', 'portfolio', 'experience', 'skills', 'contact'] as const;
type SectionId = typeof SECTION_IDS[number];

const getAnchorTop = (sectionId: SectionId) => {
  if (sectionId === 'hero') return 0;
  const section = document.getElementById(sectionId);
  if (!section) return null;
  const headerHeight = document.querySelector('header')?.getBoundingClientRect().height ?? 72;
  const maximumScroll = document.documentElement.scrollHeight - window.innerHeight;
  return Math.min(
    maximumScroll,
    Math.max(0, section.getBoundingClientRect().top + window.scrollY - headerHeight - 16),
  );
};

const MARQUEE_TECHNOLOGIES = Array.from(
  new Set(PORTFOLIO_CONFIG.skills.map((skill) => skill.name))
);

const HERO_ROLES = [
  '// CONCEPTION LOGICIELLE',
  '// INTERFACES HAUTE PERFORMANCE',
  '// ARCHITECTURES SCALABLES',
];

const BOOT_LOG = [
  'INITIALIZING_CORE_SYS',
  'LOADING_ASSETS',
  'COMPILING_COMPONENTS',
  'MAKING_COFFEE',
  'MOUNTING_INTERFACE',
  'SYSTEM_READY',
];

const isPrefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const hasSeenIntroInSession = () => {
  if (typeof window === 'undefined') return false;
  try {
    return sessionStorage.getItem('portfolio_intro_seen') === '1';
  } catch {
    return false;
  }
};

const markIntroSeenInSession = () => {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.setItem('portfolio_intro_seen', '1');
  } catch {
    // Ignore storage issues in sandbox
  }
};

const Portfolio: React.FC = () => {
  const reducedMotion = useReducedMotion();
  const mainRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const copyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const glitchRef = useRef<ReturnType<typeof animate> | null>(null);
  const readyTimerRef = useRef<number | null>(null);
  const exitIntroTimerRef = useRef<number | null>(null);
  const [copyError, setCopyError] = useState(false);
  const [activeSection, setActiveSection] = useState<SectionId>('hero');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [showIntro, setShowIntro] = useState(
    () => getProjectIdFromHash() === null && !isPrefersReducedMotion() && !hasSeenIntroInSession()
  );
  const [bootReady, setBootReady] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(() => getProjectIdFromHash());
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [curtainActive, setCurtainActive] = useState(false);
  const [introDone, setIntroDone] = useState(
    () => getProjectIdFromHash() !== null || isPrefersReducedMotion() || hasSeenIntroInSession()
  );
  const [roleIndex, setRoleIndex] = useState(0);
  const navScrollRef = useRef<{ sectionId: SectionId; targetY: number } | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const navIndicatorRef = useRef<HTMLSpanElement>(null);
  const heroTitleRef = useRef<HTMLHeadingElement>(null);

  // 2.5D Scroll Parallax for Hero Elements (DEPTH 2 to DEPTH 4)
  const { scrollY } = useScroll();
  const heroTitleScale = useTransform(scrollY, [0, 600], [1, 0.9]);
  const heroTitleY = useTransform(scrollY, [0, 600], [0, 130]);
  const heroTitleOpacity = useTransform(scrollY, [0, 500], [1, 0.25]);

  const heroBadgesY = useTransform(scrollY, [0, 600], [0, 190]);
  const heroBadgesOpacity = useTransform(scrollY, [0, 450], [1, 0.2]);

  const heroBioY = useTransform(scrollY, [0, 600], [0, 85]);
  const heroBioOpacity = useTransform(scrollY, [0, 520], [1, 0.35]);

  useRevealMotion(mainRef, introDone && selectedProjectId === null);
  useStaticInteractions(mainRef);

  const [firstName, ...lastNameParts] = PORTFOLIO_CONFIG.name.trim().split(/\s+/);
  const lastName = lastNameParts.join(' ');
  const hasLastName = lastName.length > 0;
  const selectedProject =
    selectedProjectId !== null
      ? PORTFOLIO_CONFIG.projects.find((project) => project.id === selectedProjectId) ?? null
      : null;

  useEffect(() => {
    if (selectedProjectId !== null) return;

    const handleScroll = () => {
      const headerHeight = document.querySelector('header')?.getBoundingClientRect().height ?? 72;
      const scrollPosition = window.scrollY + headerHeight + Math.min(window.innerHeight * 0.24, 220);

      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0;
      setScrollProgress(progress);
      setShowBackToTop(window.scrollY > 600);

      let currentSection: SectionId = SECTION_IDS[0];
      for (const section of SECTION_IDS) {
        const element = document.getElementById(section);
        if (element) {
          if (scrollPosition >= element.offsetTop) {
            currentSection = section;
          }
        }
      }

      const navigation = navScrollRef.current;
      if (navigation) {
        if (Math.abs(window.scrollY - navigation.targetY) > 3) {
          setActiveSection(navigation.sectionId);
          return;
        }
        navScrollRef.current = null;
      }

      setActiveSection(currentSection);
    };

    let frame = 0;
    const requestUpdate = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        handleScroll();
      });
    };
    const cancelNavigation = () => { navScrollRef.current = null; };
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('wheel', cancelNavigation, { passive: true });
    window.addEventListener('touchstart', cancelNavigation, { passive: true });
    handleScroll();
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('scroll', requestUpdate);
      window.removeEventListener('wheel', cancelNavigation);
      window.removeEventListener('touchstart', cancelNavigation);
    };
  }, [selectedProjectId]);

  useEffect(() => {
    const clearLegacySectionHash = () => {
      const legacyHash = window.location.hash.slice(1);
      if (SECTION_IDS.includes(legacyHash as SectionId)) {
        window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}`);
      }
    };

    const syncSelectedProject = () => {
      clearLegacySectionHash();
      const nextId = getProjectIdFromHash();
      setSelectedProjectId(nextId);
      if (nextId !== null) {
        setShowIntro(false);
        setIntroDone(true);
        setIsMobileMenuOpen(false);
      }
    };

    syncSelectedProject();
    window.addEventListener('hashchange', syncSelectedProject);
    window.addEventListener('popstate', syncSelectedProject);

    return () => {
      window.removeEventListener('hashchange', syncSelectedProject);
      window.removeEventListener('popstate', syncSelectedProject);
    };
  }, []);

  const clearIntroTimers = useCallback(() => {
    if (readyTimerRef.current !== null) {
      window.clearTimeout(readyTimerRef.current);
      readyTimerRef.current = null;
    }
    if (exitIntroTimerRef.current !== null) {
      window.clearTimeout(exitIntroTimerRef.current);
      exitIntroTimerRef.current = null;
    }
  }, []);

  const skipIntro = useCallback(() => {
    if (!showIntro && !curtainActive) return;

    markIntroSeenInSession();
    clearIntroTimers();

    if (reducedMotion || curtainActive) {
      setShowIntro(false);
      setIntroDone(true);
      setCurtainActive(false);
      return;
    }

    setCurtainActive(true);
  }, [showIntro, curtainActive, reducedMotion, clearIntroTimers]);

  useEffect(() => {
    if (selectedProjectId !== null || (!showIntro && !curtainActive) || reducedMotion) return;

    if (showIntro && !curtainActive) {
      readyTimerRef.current = window.setTimeout(() => {
        setBootReady(true);
      }, 850);

      exitIntroTimerRef.current = window.setTimeout(() => {
        setCurtainActive(true);
      }, 1250);
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' || event.key === ' ' || event.key === 'Enter') {
        event.preventDefault();
        skipIntro();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearIntroTimers();
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedProjectId, showIntro, curtainActive, reducedMotion, skipIntro, clearIntroTimers]);

  const handleCurtainCovered = useCallback(() => {
    markIntroSeenInSession();
    setShowIntro(false);
    setIntroDone(true);
  }, []);

  const handleCurtainComplete = useCallback(() => {
    markIntroSeenInSession();
    setCurtainActive(false);
  }, []);

  useEffect(() => {
    if (selectedProjectId !== null) {
      document.body.style.overflow = '';
    } else if (isMobileMenuOpen || showIntro) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen, selectedProjectId, showIntro]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMobileMenuOpen(false);
        if (isMobileMenuOpen) menuButtonRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 1024px)');
    const closeOnDesktop = () => { if (desktop.matches) setIsMobileMenuOpen(false); };
    desktop.addEventListener('change', closeOnDesktop);
    return () => desktop.removeEventListener('change', closeOnDesktop);
  }, []);

  useEffect(() => {
    const menu = menuRef.current;
    if (!isMobileMenuOpen || !menu) return;
    if (reducedMotion) return;
    const timeline = createTimeline()
      .add(menu, { opacity: [0, 1], y: [-12, 0], duration: 250, ease: 'outCubic' })
      .add(menu.querySelectorAll('button, a'), {
        opacity: [0, 1], x: [-14, 0], delay: stagger(35), duration: 320, ease: 'outExpo',
      }, 60);
    return () => { timeline.revert(); };
  }, [isMobileMenuOpen, reducedMotion]);

  useEffect(() => () => {
    if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
    glitchRef.current?.revert();
  }, []);

  useEffect(() => {
    if (selectedProjectId !== null) return;

    let indicatorAnimation: ReturnType<typeof animate> | undefined;
    const updateIndicator = () => {
      const nav = navRef.current;
      const indicator = navIndicatorRef.current;
      if (!nav || !indicator) return;

      const button = nav.querySelector<HTMLElement>(`[data-nav-item="${activeSection}"]`);
      if (!button) return;

      indicatorAnimation?.cancel();
      indicatorAnimation = animate(indicator, {
        x: button.offsetLeft,
        width: button.offsetWidth,
        duration: reducedMotion ? 0 : 380,
        ease: 'outExpo',
      });
    };

    const frameId = window.requestAnimationFrame(updateIndicator);
    window.addEventListener('resize', updateIndicator);

    return () => {
      indicatorAnimation?.cancel();
      window.cancelAnimationFrame(frameId);
      window.removeEventListener('resize', updateIndicator);
    };
  }, [activeSection, selectedProjectId, reducedMotion]);

  useEffect(() => {
    if (!introDone || reducedMotion || selectedProjectId !== null) return;

    const rotation = window.setInterval(() => {
      setRoleIndex((index) => (index + 1) % HERO_ROLES.length);
    }, 3300);

    return () => window.clearInterval(rotation);
  }, [introDone, reducedMotion, selectedProjectId]);

  const handleTitleGlitch = () => {
    const title = heroTitleRef.current;
    if (!title || !introDone) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

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

  const openProjectPage = (projectId: number) => {
    setIsMobileMenuOpen(false);
    setShowIntro(false);
    setCurtainActive(false);
    window.history.pushState({ projectId }, '', `#project-${projectId}`);
    setSelectedProjectId(projectId);
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  };

  const closeProjectPage = () => {
    if (window.history.state?.projectId) {
      window.history.back();
      return;
    }

    window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}`);
    setSelectedProjectId(null);
  };

  const scrollToSection = (sectionId: SectionId) => {
    const targetY = getAnchorTop(sectionId);
    if (targetY === null) return;
    navScrollRef.current = { sectionId, targetY };
    setActiveSection(sectionId);
    window.scrollTo({ top: targetY, behavior: reducedMotion ? 'auto' : 'smooth' });
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleCopyEmail = async () => {
    if (!PORTFOLIO_CONFIG.email) return;
    try {
      await navigator.clipboard.writeText(PORTFOLIO_CONFIG.email);
      setCopiedEmail(true);
      setCopyError(false);
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
      copyTimerRef.current = setTimeout(() => setCopiedEmail(false), 2000);
    } catch {
      setCopyError(true);
    }
  };

  const navigationItems: { id: SectionId; label: string }[] = [
    { id: 'hero', label: 'ACCUEIL' },
    { id: 'about', label: 'A_PROPOS' },
    { id: 'portfolio', label: 'PROJETS' },
    { id: 'experience', label: 'PARCOURS' },
    { id: 'skills', label: 'STACK' },
    { id: 'contact', label: 'CONTACT' },
  ];

  const currentYear = new Date().getFullYear();

  if (selectedProject) {
    return <ProjectDetailPage key={selectedProject.id} project={selectedProject} onBack={closeProjectPage} />;
  }

  return (
    <div ref={mainRef} className="portfolio-page min-h-screen text-[#0A0A0E] relative overflow-x-clip bg-[#F4F5F8]">
      {/* Intro Boot Screen */}
      {showIntro && (
        <div
          onClick={skipIntro}
          className="fixed inset-0 z-[1200] px-6 overflow-hidden pointer-events-auto bg-[#F4F5F8] flex items-center justify-center cursor-pointer"
          role="dialog"
          aria-modal="true"
          aria-label="Séquence d'initialisation du système"
        >
          <div className="absolute inset-0 blueprint-grid opacity-75 pointer-events-none" />

          <div
            onClick={(event) => event.stopPropagation()}
            className="relative w-full max-w-2xl border-2 border-black bg-white shadow-[10px_10px_0px_#000000] cursor-default"
          >
            <div className="flex items-center justify-between gap-4 border-b-2 border-black bg-[#0A0A0E] px-4 py-2">
              <span className="font-mono text-[10px] tracking-[0.3em] text-[#0055FF]">SYS_BOOT // AXEL_DOUSSOUX</span>
              <button
                type="button"
                onClick={skipIntro}
                className="font-mono text-[10px] tracking-[0.2em] text-[#F4F5F8] hover:text-[#0055FF] transition-colors cursor-pointer"
                aria-label="Passer l'animation de démarrage"
              >
                [PASSER / ÉCHAP →]
              </button>
            </div>

            <div className="px-6 py-10 sm:px-12 sm:py-14 text-center">
              <div className="font-display font-black uppercase tracking-tight text-black text-2xl sm:text-5xl md:text-6xl leading-[0.95]">
                <span className="block">{firstName}</span>
                {hasLastName && <span className="block text-[#0055FF]">{lastName}</span>}
              </div>
              <div className="mt-6 mx-auto max-w-xs space-y-1.5 text-left font-mono text-[10px] tracking-[0.2em] text-[#64748B]">
                {BOOT_LOG.map((line, index) => {
                  const isReady = line === 'SYSTEM_READY';
                  return (
                    <div
                      key={line}
                      className={`boot-line flex items-center justify-between gap-3${isReady ? ' text-[#7C3AED] font-bold' : ''}`}
                      style={{ animationDelay: `${40 + index * 110}ms` }}
                    >
                      <span className="min-w-0 truncate">› {line}</span>
                      {!isReady ? (
                        <span className="shrink-0 font-bold text-[#0055FF]">OK</span>
                      ) : (
                        <span className="shrink-0 font-bold text-[#22C55E]">● READY</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-between gap-4 border-t-2 border-black px-4 py-2">
              <span className="font-mono text-[10px] tracking-[0.2em] text-[#64748B]">
                {bootReady ? '[SYSTEM_READY // 100%]' : '[LOADING_ASSETS]'}
              </span>
              <span className="flex items-center gap-2">
                <span className="font-mono text-[10px] tracking-[0.2em] text-[#7C3AED]">
                  {bootReady ? '[MOUNTED]' : '[BUILD]'}
                </span>
                <span className="h-2 w-20 border border-black bg-[#E2E8F0] overflow-hidden">
                  <span className="boot-progress block h-full w-full bg-gradient-to-r from-[#0055FF] to-[#7C3AED]" />
                </span>
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Brutalist Curtain Transition */}
      {curtainActive && (
        <IntroCurtain
          play={curtainActive}
          onCovered={handleCurtainCovered}
          onComplete={handleCurtainComplete}
        />
      )}

      {/* Background Tactile Paper Grain & Blueprint Grid */}
      <Background />

      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:px-4 focus:py-2 focus:bg-[#0055FF] focus:text-white focus:font-mono focus:font-bold focus:border focus:border-black"
      >
        Aller au contenu
      </a>

      {/* Scroll Progress Bar with Accent */}
      <div className="fixed left-0 top-0 right-0 z-[60] h-1 bg-[#E2E8F0] border-b border-black/15" aria-hidden="true">
        <div
          className="h-full bg-[#0055FF] transition-[width] duration-100 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Main Top Wireframe Header */}
      <header inert={showIntro} className="fixed left-0 right-0 top-1 z-50 bg-[#F4F5F8] border-b border-black py-3 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo & Live Status */}
          <div className="flex items-center gap-4">
            <button
              type="button"
              aria-label="Retour à l’accueil"
              data-static-motion="nudge"
              onClick={() => scrollToSection('hero')}
              className="font-display font-extrabold text-lg sm:text-xl tracking-tight text-black flex items-center gap-2 cursor-pointer"
            >
              <span>{PORTFOLIO_CONFIG.name}</span>
              <span className="text-[#0055FF] font-mono text-xs">// DEV</span>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav
            ref={navRef}
            className="hidden lg:flex items-center gap-1 relative"
            aria-label="Navigation principale"
          >
            <span
              ref={navIndicatorRef}
              aria-hidden="true"
              className="absolute left-0 top-0 h-full bg-[#0055FF] border border-black shadow-[2px_2px_0px_#000000] pointer-events-none"
              style={{ width: 0, transform: 'translateX(0px)' }}
            />
            {navigationItems.map((item, index) => (
              <button
                key={item.id}
                type="button"
                data-nav-item={item.id}
                data-static-motion="lift"
                onClick={() => scrollToSection(item.id)}
                aria-current={activeSection === item.id ? 'page' : undefined}
                className={`relative z-10 px-3 py-1 font-mono text-xs tracking-wider uppercase transition-colors ${
                  activeSection === item.id
                    ? 'text-white font-bold border border-transparent'
                    : 'text-[#475569] hover:text-black hover:bg-[#E2E8F0] border border-transparent'
                }`}
              >
                [0{index + 1} {item.label}]
              </button>
            ))}
          </nav>

          {/* Burger Menu Button for Mobile */}
          <button
            ref={menuButtonRef}
            onClick={toggleMobileMenu}
            data-static-motion="lift"
            className="lg:hidden p-2 bg-white border border-black text-black shadow-[2px_2px_0px_#000000]"
            aria-label={isMobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-navigation"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div
            ref={menuRef}
            id="mobile-navigation"
            role="navigation"
            aria-label="Navigation mobile"
            className="lg:hidden absolute top-full left-0 right-0 bg-white border-b border-black shadow-[0_12px_0_#000000] p-4 flex flex-col space-y-2 max-h-[calc(100dvh-5rem)] overflow-y-auto"
          >
            {navigationItems.map((item, index) => (
              <button
                key={item.id}
                type="button"
                onClick={() => scrollToSection(item.id)}
                className={`w-full text-left px-4 py-3 font-mono text-xs uppercase border transition-colors ${
                  activeSection === item.id
                    ? 'bg-[#0055FF] text-white font-bold border-black shadow-[3px_3px_0px_#000000]'
                    : 'bg-[#F8FAFC] text-[#475569] border-black/20 hover:text-black'
                }`}
              >
                [0{index + 1}] // {item.label}
              </button>
            ))}

            <div className="flex gap-2 pt-3 border-t border-black/15">
              <a
                href={PORTFOLIO_CONFIG.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2 text-center font-mono text-xs bg-white border border-black text-black hover:bg-black hover:text-white"
              >
                GITHUB
              </a>
              <a
                href={PORTFOLIO_CONFIG.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2 text-center font-mono text-xs bg-white border border-black text-black hover:bg-black hover:text-white"
              >
                LINKEDIN
              </a>
            </div>
          </div>
        )}
      </header>

      {/* Overlay to close mobile menu */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      <main id="main-content" tabIndex={-1} inert={isMobileMenuOpen || showIntro}>
        {/* Hero Section */}
        <section id="hero" className="min-h-svh flex flex-col justify-center relative z-10 pt-[clamp(4rem,9vh,5.5rem)] pb-[clamp(1rem,2.5vh,2.5rem)]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 w-full">
            {/* Direct Status Badge */}
            <motion.div
              style={{
                y: reducedMotion ? 0 : heroBadgesY,
                opacity: reducedMotion ? 1 : heroBadgesOpacity,
              }}
              data-hero-anim
              className="mb-[clamp(0.75rem,2vh,1.5rem)] flex flex-wrap items-center gap-2.5"
            >
              <div data-static-motion="lift" className="inline-flex max-w-full items-center gap-2 font-mono text-xs text-black bg-white border-2 border-black px-3.5 py-1.5 shadow-[4px_4px_0px_#000000] font-bold">
                <span className="w-2.5 h-2.5 bg-[#22C55E] border border-black animate-pulse shrink-0" aria-hidden="true" />
                <span className="min-w-0">DISPONIBLE // MISSIONS & ALTERNANCE (LYON & REMOTE)</span>
              </div>
              <div data-static-motion="lift" className="inline-flex items-center gap-1.5 font-mono text-xs text-[#0055FF] bg-[#E0EBFF] border-2 border-[#0055FF] px-3 py-1.5 shadow-[3px_3px_0px_#000000] font-bold">
                <span>FULLSTACK & WEB 3D</span>
              </div>
              <div className="hidden sm:inline-flex items-center gap-1 font-mono text-[10px] text-[#64748B] bg-white border border-black/30 px-2 py-1 select-none">
                <span>[DEPTH_03 // HERO_STAGE]</span>
              </div>
            </motion.div>

            {/* Monumental Headline with 2.5D spatial recession */}
            <motion.div
              style={{
                scale: reducedMotion ? 1 : heroTitleScale,
                y: reducedMotion ? 0 : heroTitleY,
                opacity: reducedMotion ? 1 : heroTitleOpacity,
                transformOrigin: 'left center',
              }}
              className="relative mb-[clamp(0.75rem,2vh,1.5rem)]"
            >
              <h1
                ref={heroTitleRef}
                onMouseEnter={handleTitleGlitch}
                aria-label={PORTFOLIO_CONFIG.name}
                className="hero-glitch text-[clamp(1.75rem,min(8.4vw,11.5vh),7rem)] font-black font-display tracking-tight text-black uppercase leading-[0.95]"
              >
                <SplitText text={PORTFOLIO_CONFIG.name} play={introDone} />
              </h1>
            </motion.div>

            {/* Subtitle with Neo-Brutalist highlight */}
            <motion.div
              style={{
                y: reducedMotion ? 0 : heroBioY,
                opacity: reducedMotion ? 1 : heroBioOpacity,
              }}
              data-hero-anim
              className="mb-[clamp(0.75rem,2vh,1.5rem)] flex flex-wrap items-center gap-3"
            >
              <span className="font-mono text-base sm:text-xl font-bold text-white bg-[#0055FF] px-3.5 py-1.5 border-2 border-black shadow-[4px_4px_0px_#000000]">
                {PORTFOLIO_CONFIG.title}
              </span>
              <TypewriterText
                text={HERO_ROLES[roleIndex]}
                play={introDone}
                speed={28}
                className="font-mono text-xs sm:text-sm text-[#475569] font-semibold"
              />
            </motion.div>

            {/* Bio statement */}
            <motion.p
              style={{
                y: reducedMotion ? 0 : heroBioY,
                opacity: reducedMotion ? 1 : heroBioOpacity,
              }}
              data-hero-anim
              className="text-base sm:text-lg text-[#334155] font-body max-w-3xl leading-relaxed mb-[clamp(1.25rem,3vh,2.5rem)]"
            >
              {PORTFOLIO_CONFIG.bio}
            </motion.p>

            {/* Hero Action Buttons */}
            <div data-hero-anim className="flex flex-wrap items-center gap-3 sm:gap-4 mb-[clamp(1.5rem,3vh,2.5rem)]">
              <a
                href="/cv.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="brutal-btn px-6 py-3.5 bg-[#0055FF] text-white hover:bg-black hover:text-white border-2 border-black text-xs sm:text-sm font-bold tracking-wider shadow-[4px_4px_0px_#000000]"
                aria-label="Consulter le CV numérique en PDF"
              >
                <FileText size={18} className="mr-2" />
                TÉLÉCHARGER CV_PDF ↓
              </a>

              <button
                type="button"
                onClick={() => scrollToSection('portfolio')}
                className="brutal-btn px-6 py-3.5 bg-white text-black hover:bg-black hover:text-white border-2 border-black text-xs sm:text-sm font-mono font-bold tracking-wider shadow-[4px_4px_0px_#000000] transition-colors cursor-pointer"
                aria-label="Découvrir les projets sélectionnés"
              >
                VOIR LES PROJETS ↓
              </button>

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

          {/* Kinetic Scroll Indicator */}
          <div data-hero-anim className="mt-[clamp(0.75rem,2vh,2.5rem)] flex flex-col items-center justify-center">
            <button
              type="button"
              onClick={() => scrollToSection('about')}
              data-static-motion="lift"
              className="group flex flex-col items-center gap-2 cursor-pointer focus:outline-none transition-transform"
              aria-label="Défiler vers la section À propos"
            >
              <span className="font-mono text-[11px] font-bold tracking-[0.22em] text-[#475569] group-hover:text-black uppercase transition-colors flex items-center gap-1.5">
                <span className="text-[#0055FF]">›</span>
                DÉFILER VERS LES PROJETS
                <span className="text-[#0055FF]">↓</span>
              </span>
              <div className="relative w-6 h-10 border-2 border-black bg-white shadow-[3px_3px_0px_#000000] group-hover:shadow-[4px_4px_0px_#0055FF] transition-all flex justify-center p-1">
                <div className="w-1.5 h-2.5 bg-[#0055FF] border border-black animate-scroll-pill" />
              </div>
            </button>
          </div>

          {/* Kinetic Marquee Ticker */}
          <div className="mt-[clamp(1rem,3vh,4rem)] w-full border-y border-black bg-white py-3 overflow-hidden select-none shadow-sm">
            <div className="animate-marquee font-mono text-xs sm:text-sm tracking-widest text-[#475569] uppercase">
              {[0, 1].map((loop) =>
                MARQUEE_TECHNOLOGIES.map((tech, index) => (
                  <span key={`marquee-${loop}-${tech}`} aria-hidden={loop === 1 ? true : undefined} className="flex items-center shrink-0">
                    <span className="mx-4 text-[#0055FF]">✦</span>
                    <span className={index % 2 === 0 ? 'text-black font-bold' : ''}>{tech}</span>
                  </span>
                ))
              )}
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" data-section-transition className="py-24 relative z-10 section-transition">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            {/* Section Index Header */}
            <div data-motion-heading className="flex flex-wrap items-center justify-between gap-3 mb-8">
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 bg-black text-white font-mono text-xs font-bold border border-black shadow-[2px_2px_0px_#000000]">
                  SEC_02 // MANIFESTO
                </span>
                <h2 className="text-[clamp(1rem,4.8vw,3rem)] font-black font-display uppercase tracking-tight text-black">
                  À PROPOS DE MOI
                </h2>
              </div>
              <span className="font-mono text-[11px] text-[#64748B] font-bold border border-black/20 bg-white px-2.5 py-1 shadow-[2px_2px_0px_#000000]">
                DEPTH: [0.50X]
              </span>
            </div>

            <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-6">
              {/* Main Bio Panel */}
              <div data-anim className="bg-white border border-black p-6 sm:p-8 shadow-[6px_6px_0px_#000000]">
                <div className="flex items-center justify-between border-b border-black/15 pb-3 mb-6 font-mono text-xs">
                  <span className="text-[#0055FF] font-bold flex items-center gap-2">
                    <Terminal size={16} />
                    SYS_BIO // MANIFESTO
                  </span>
                  <span className="text-[#64748B]">V2026.1</span>
                </div>

                <div className="space-y-4 text-[#334155] font-body text-base leading-relaxed">
                  <WordScrollLighting
                    text="Depuis plus de 2 ans, je conçois et développe des applications web fullstack et des interfaces interactives. Mon approche privilégie la rigueur technique, l'optimisation des performances et la clarté de l'expérience utilisateur."
                    highlightWords={['applications', 'web', 'fullstack', 'interfaces', 'interactives', 'rigueur', 'performances', 'clarté']}
                    highlightColor="#0055FF"
                  />
                  <WordScrollLighting
                    text="Actuellement étudiant en Master Informatique à l'Université Lyon 2, j'approfondis l'ingénierie logicielle, les architectures de données distribuées et les standards modernes du web."
                    highlightWords={['Master', 'Informatique', 'Université', 'Lyon', '2', 'ingénierie', 'logicielle', 'architectures']}
                    highlightColor="#0055FF"
                  />
                  <WordScrollLighting
                    text="Ce cursus fait suite à un BUT Métiers du Multimédia et de l'Internet orienté Développement Web & Dispositifs Interactifs, où j'ai forgé une expertise transverse alliant logique backend robuste et ergonomie front-end pointue."
                    highlightWords={['BUT', 'Métiers', 'Multimédia', 'Internet', 'Développement', 'Web', 'Dispositifs', 'Interactifs']}
                    highlightColor="#0055FF"
                  />
                  <WordScrollLighting
                    text="Mon ambition : concevoir des plateformes pérennes, performantes et intuitives, avec un souci absolu de la qualité du code et de la satisfaction utilisateur."
                    highlightWords={['pérennes', 'performantes', 'intuitives', 'qualité', 'code']}
                    highlightColor="#0055FF"
                  />
                </div>
              </div>

              {/* Side Specs Grid */}
              <div className="space-y-4">
                <div data-anim data-static-motion="lift" className="bg-white border border-black p-5 shadow-[4px_4px_0px_#000000]">
                  <span className="block text-[13px] font-mono text-[#0055FF] font-bold uppercase tracking-wider mb-1">
                    [// PARCOURS ACADÉMIQUE]<br/><br/>
                  </span>
                  <h3 className="font-display font-bold text-black text-lg mb-1">Master Informatique</h3>
                  <p className="text-xs font-mono text-[#64748B]">Université Lumière Lyon 2 • 2025 - 2027</p>
                  <p className="text-xs text-[#475569] mt-2 leading-relaxed">
                    Spécialisation <b>Conception et Integration Multimédia</b><br/>
                    Développement web avancé, architecture logicielle, bases de données relationnelles et sécurité.
                  </p>
                  <br/>
                  <h3 className="font-display font-bold text-black text-lg mb-1">BUT Métier du Multimédia et de l'Internet</h3>
                  <p className="text-xs font-mono text-[#64748B]">Université Clermont Auvergne • 2022 - 2025</p>
                  <p className="text-xs text-[#475569] mt-2 leading-relaxed">
                    Spécialisation <b>Développement Web & Dispositif Intéractif</b><br />
                    Conception UX/UI, frameworks JavaScript, APIs RESTful et gestion de projets agiles.
                  </p>
                </div>

                <div data-anim data-static-motion="nudge" className="bg-[#E0EBFF] border border-[#0055FF] p-4 text-xs font-mono text-black flex items-center justify-between shadow-[2px_2px_0px_#000000]">
                  <span className="font-bold">EXPÉRIENCE CUMULÉE</span>
                  <span className="text-[#0055FF] font-bold text-sm">
                    <AnimatedCounter value={2} suffix="+ ANS" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Portfolio Section */}
        <section id="portfolio" data-section-transition className="py-24 relative z-10 section-transition">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div data-motion-heading className="flex flex-wrap items-baseline justify-between gap-4 mb-8 border-b-2 border-black pb-5">
              <div className="flex flex-wrap items-center gap-3">
                <span className="px-2.5 py-1 bg-[#0055FF] text-white font-mono text-xs font-bold border border-black shadow-[2px_2px_0px_#000000]">
                  SHOWCASE // DECK_STACKING
                </span>
                <h2 className="text-[clamp(1.5rem,4.5vw,3rem)] font-black font-display uppercase tracking-tight text-black">
                  PROJETS SÉLECTIONNÉS
                </h2>
              </div>
              <div className="flex items-center gap-3 font-mono text-xs">
                <span className="font-bold text-[#64748B]">
                  INDEX: [
                  <AnimatedCounter key="index-total-counter" value={PORTFOLIO_CONFIG.projects.length} />
                  {' '}PROJETS]
                </span>
                <span className="font-bold text-[#0055FF] bg-[#E0EBFF] px-2 py-0.5 border border-[#0055FF]">
                  DEPTH: 0.80X
                </span>
              </div>
            </div>

            <p data-anim className="mb-12 text-[#334155] font-body text-base max-w-3xl leading-relaxed">
              Chaque réalisation technique propose un cas d'étude détaillé, les contraintes d'architecture résolues et un accès direct aux dépôts GitHub ainsi qu'aux démonstrations en production.
            </p>

            {/* Immersive Sticky Stacking Showcase */}
            <StickyProjectStack
              projects={PORTFOLIO_CONFIG.projects.filter((p) => p.featured)}
              onOpenProject={openProjectPage}
            />

            {/* Secondary archive if non-featured projects exist */}
            {PORTFOLIO_CONFIG.projects.filter((p) => !p.featured).length > 0 && (
              <div className="mt-20 pt-12 border-t-2 border-black">
                <h3 className="font-display font-bold text-xl uppercase tracking-tight text-black mb-6">
                  ARCHIVES & AUTRES RÉALISATIONS
                </h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {PORTFOLIO_CONFIG.projects
                    .filter((p) => !p.featured)
                    .map((project, index) => (
                      <ProjectCard
                        key={project.id}
                        project={project}
                        index={index}
                        onOpenProject={openProjectPage}
                      />
                    ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Experience Section */}
        <section id="experience" data-section-transition className="py-24 relative z-10 section-transition">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div data-motion-heading className="flex flex-wrap items-center justify-between gap-3 mb-10 border-b border-black/15 pb-5">
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 bg-black text-white font-mono text-xs font-bold border border-black shadow-[2px_2px_0px_#000000]">
                  SEC_04 // TIMELINE
                </span>
                <h2 className="text-[clamp(1rem,4.8vw,3rem)] font-black font-display uppercase tracking-tight text-black">
                  PARCOURS PROFESSIONNEL
                </h2>
              </div>
              <span className="font-mono text-[11px] text-[#64748B] font-bold border border-black/20 bg-white px-2.5 py-1 shadow-[2px_2px_0px_#000000]">
                DEPTH: [0.70X]
              </span>
            </div>

            <div className="space-y-6">
              {PORTFOLIO_CONFIG.experiences.map((experience, expIndex) => (
                <article
                  key={experience.id}
                  data-anim
                  data-static-motion="lift"
                  className="bg-white border-2 border-black shadow-[6px_6px_0px_#000000] hover:shadow-[8px_8px_0px_#000000] hover:translate-x-[-2px] hover:translate-y-[-2px] p-6 sm:p-8 transition-all"
                >
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 space-y-4">
                      {/* Header info */}
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <span className="font-mono text-xs font-bold text-[#0055FF]">
                              LOG_0{expIndex + 1} //
                            </span>
                            <h3 className="text-xl sm:text-2xl font-bold font-display uppercase text-black">
                              {experience.role}
                            </h3>
                          </div>

                          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-[#64748B]">
                            <span className="flex items-center gap-1.5 text-black font-bold">
                              <MapPin size={14} className="text-[#0055FF]" />
                              {experience.company}
                            </span>
                            <span className="flex items-center gap-1.5 text-[#64748B]">
                              <Calendar size={14} />
                              {experience.period}
                            </span>
                          </div>
                        </div>

                        {experience.logo && (
                          <img
                            src={experience.logo}
                            alt={`${experience.company} logo`}
                            loading="lazy"
                            className="w-12 h-12 flex-shrink-0 object-contain bg-white border border-black p-1"
                          />
                        )}
                      </div>

                      <p className="text-[#475569] font-body text-sm leading-relaxed">
                        {experience.description}
                      </p>

                      {/* Technologies used */}
                      <div>
                        <span className="block text-[10px] font-mono text-[#64748B] uppercase font-bold mb-2">
                          ENVIRONNEMENT TECHNIQUE :
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {experience.technologies.map((tech, techIndex) => (
                            <span
                              key={techIndex}
                              className="px-2 py-0.5 bg-[#F1F5F9] border border-black/20 text-xs font-mono text-[#0A0A0E] font-medium"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Achievements */}
                    <div className="md:col-span-1 border-t md:border-t-0 md:border-l border-black/15 pt-4 md:pt-0 md:pl-6">
                      <span className="block text-xs font-mono font-bold text-black uppercase tracking-wider mb-3">
                        RÉALISATIONS CLÉS :
                      </span>
                      <ul className="space-y-2">
                        {experience.achievements.map((achievement, achIndex) => (
                          <li key={achIndex} className="flex items-start gap-2 text-xs text-[#475569] font-body">
                            <span className="font-mono font-bold mt-0.5 text-[#0055FF]">
                              ■
                            </span>
                            <span className="leading-relaxed">{achievement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section id="skills" data-section-transition className="py-24 relative z-10 section-transition">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div data-motion-heading className="flex flex-wrap items-baseline justify-between gap-4 mb-8 border-b-2 border-black pb-5">
              <div className="flex flex-wrap items-center gap-3">
                <span className="px-2.5 py-1 bg-[#0055FF] text-white font-mono text-xs font-bold border border-black shadow-[2px_2px_0px_#000000]">
                  COMPÉTENCES // STACK
                </span>
                <h2 className="text-[clamp(1.5rem,4.5vw,3rem)] font-black font-display uppercase tracking-tight text-black">
                  STACK TECHNIQUE
                </h2>
              </div>
              <div className="flex items-center gap-3 font-mono text-xs">
                <span className="text-[#64748B] font-bold">
                  MAÎTRISE: [FULLSTACK & 3D]
                </span>
                <span className="font-bold text-[#0055FF] bg-[#E0EBFF] px-2 py-0.5 border border-[#0055FF]">
                  DEPTH: 0.75X
                </span>
              </div>
            </div>

            <p data-anim className="mb-10 text-[#334155] font-body text-base max-w-3xl leading-relaxed">
              Sélectionnez une catégorie pour filtrer les technologies éprouvées en production ainsi que les domaines de veille technologique active.
            </p>

            <SkillsHub />
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" data-section-transition className="py-24 relative z-10 section-transition">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div data-anim data-static-motion="lift" className="bg-white border-2 border-black shadow-[8px_8px_0px_#000000] p-6 sm:p-10">
              {/* Terminal Title Bar */}
              <div className="terminal-heading flex flex-wrap items-center justify-between gap-3 border-b-2 border-black pb-4 mb-8 font-mono text-[10px] sm:text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-[#EF4444] border border-black" />
                  <span className="w-3 h-3 bg-[#F59E0B] border border-black" />
                  <span className="w-3 h-3 bg-[#10B981] border border-black" />
                  <span className="min-w-0 text-black ml-2 font-bold">TERMINAL_CONTACT // INITIALISE_LINK</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#64748B] font-bold">[DEPTH: 0.90X]</span>
                  <span className="text-[#0055FF] font-bold">[CHANNEL: SECURE // DIRECT_LINK]</span>
                </div>
              </div>

              <div data-anim className="text-center max-w-2xl mx-auto mb-10">
                <h2 className="text-[clamp(1.5rem,4.5vw,3rem)] font-black font-display uppercase tracking-tight text-black mb-4">
                  PRÊT À COLLABORER ?
                </h2>
                <p className="text-sm sm:text-base text-[#334155] font-body leading-relaxed">
                  Que ce soit pour un projet de développement web, une mission technique ou une opportunité professionnelle, échangeons ensemble !
                </p>
              </div>

              {/* Direct email quick-copy card */}
              {PORTFOLIO_CONFIG.email && (
                <div data-anim className="contact-email mb-8 p-4 bg-[#F8FAFC] border-2 border-black flex flex-wrap items-center justify-between gap-4 shadow-[4px_4px_0px_#000000]">
                  <div className="flex items-center gap-3">
                    <Mail data-motion-icon size={20} className="text-[#0055FF]" />
                    <div>
                      <span className="block text-[10px] font-mono text-[#64748B] uppercase font-bold">ADRESSE COURRIEL DIRECTE</span>
                      <TypewriterText
                        text={PORTFOLIO_CONFIG.email}
                        className="font-mono text-sm sm:text-base font-bold text-black"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleCopyEmail}
                    className="brutal-btn px-4 py-2 bg-[#0055FF] text-white hover:bg-black hover:text-white border-2 border-black text-xs font-mono shadow-[2px_2px_0px_#000000] cursor-pointer"
                  >
                    <span className="sr-only" role="status">{copiedEmail ? "Adresse e-mail copiée" : ""}</span>
                    {copiedEmail ? (
                      <>
                        <Check size={14} className="mr-1.5" />
                        [COPIÉ !]
                      </>
                    ) : (
                      <>
                        <Copy size={14} className="mr-1.5" />
                        [COPIER]
                      </>
                    )}
                  </button>
                </div>
              )}

              {copyError && <p role="status" className="mb-4 font-mono text-xs text-[#475569]">Copie indisponible. Vous pouvez sélectionner l’adresse ci-dessus.</p>}

              {/* External CTA Links */}
              <div data-anim className="grid sm:grid-cols-2 gap-4">
                <a
                  href={PORTFOLIO_CONFIG.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="brutal-btn p-4 bg-white text-black hover:bg-[#0055FF] hover:text-white border-2 border-black text-xs sm:text-sm font-mono font-bold tracking-wider shadow-[4px_4px_0px_#000000] transition-colors"
                >
                  <Linkedin size={20} className="mr-2.5" />
                  REJOINDRE SUR LINKEDIN ↗
                </a>

                <a
                  href={PORTFOLIO_CONFIG.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="brutal-btn p-4 bg-white text-black hover:bg-black hover:text-white border-2 border-black text-xs sm:text-sm font-mono font-bold tracking-wider shadow-[4px_4px_0px_#000000] transition-colors"
                >
                  <Github size={20} className="mr-2.5" />
                  EXPLORER LE GITHUB ↗
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Back to top fixed button - anchored strictly to bottom right */}
        {showBackToTop && (
          <button
            type="button"
            onClick={() => scrollToSection('hero')}
            style={{
              position: 'fixed',
              bottom: '1.5rem',
              right: '1.5rem',
              left: 'auto',
              top: 'auto',
              zIndex: 70,
            }}
            className="brutal-btn px-3.5 py-2.5 bg-[#0055FF] text-white border-2 border-black shadow-[3px_3px_0px_#000000] hover:bg-black hover:text-white transition-colors font-mono font-bold text-xs cursor-pointer flex items-center gap-1.5"
            aria-label="Retour en haut"
          >
            <ArrowUp size={16} className="inline mr-1" />
            [TOP]
          </button>
        )}

        {/* Footer */}
        <footer data-anim className="py-8 border-t-2 border-black bg-[#F4F5F8] text-center font-mono text-xs text-[#64748B] relative z-10">
          <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              © {currentYear} {PORTFOLIO_CONFIG.name}. TOUS DROITS RÉSERVÉS.
            </div>
            <div className="text-[11px] text-[#64748B]">
              CONÇU AVEC RIGUEUR. DÉVELOPPÉ AVEC PASSION.
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Portfolio;
