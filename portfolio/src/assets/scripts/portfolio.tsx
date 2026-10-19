import React, { useState, useEffect, useRef, useCallback } from 'react';
import { animate, createTimeline, stagger } from 'animejs';
import {
  FiMenu as Menu,
  FiX as X,
  FiArrowUp as ArrowUp,
  FiFileText as FileText,
  FiGithub as Github,
  FiLinkedin as Linkedin,
  FiCopy as Copy,
  FiCheck as Check,
} from 'react-icons/fi';
import PORTFOLIO_CONFIG from './portfolioData';
import Background from './background';
import HeroPrologue from './heroPrologue';
import ProjectReel from './projectReel';
import JourneyTimeline from './journeyTimeline';
import SkillsHub from './skillsHub';
import ProjectCard from './projectCard';
import ProjectDetailPage from './projectDetailPage';
import IntroCurtain from './introCurtain';
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

const SECTION_IDS = ['hero', 'portfolio', 'experience', 'skills', 'contact'] as const;
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
  const navScrollRef = useRef<{ sectionId: SectionId; targetY: number } | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const navIndicatorRef = useRef<HTMLSpanElement>(null);

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
            {navigationItems.map((item) => (
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
                {item.label}
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
            {navigationItems.map((item) => (
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
                {item.label}
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
        <HeroPrologue introDone={introDone} onNavigate={scrollToSection} />

        <ProjectReel
          projects={PORTFOLIO_CONFIG.projects.filter((p) => p.featured)}
          onOpenProject={openProjectPage}
        />

        {PORTFOLIO_CONFIG.projects.filter((p) => !p.featured).length > 0 && (
          <section className="relative z-10 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
              <h3 className="font-display font-bold text-xl uppercase tracking-tight text-black mb-6">
                Autres réalisations
              </h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {PORTFOLIO_CONFIG.projects
                  .filter((p) => !p.featured)
                  .map((project, index) => (
                    <ProjectCard key={project.id} project={project} index={index} onOpenProject={openProjectPage} />
                  ))}
              </div>
            </div>
          </section>
        )}

        <JourneyTimeline />

        {/* Skills Section */}
        <section id="skills" className="py-24 lg:py-32 relative z-10 border-t-2 border-black">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div data-motion-heading className="flex flex-col gap-5 mb-12">
              <h2 className="text-[clamp(1.75rem,3.4vw,3rem)] font-black font-display uppercase tracking-[-0.02em] text-black leading-none">
                Stack technique
              </h2>
              <p className="text-[#334155] font-body text-base lg:text-lg max-w-[60ch] leading-relaxed">
                Les outils que j'utilise en production, filtrables par domaine, et ceux que j'apprends en ce moment.
              </p>
            </div>

            <SkillsHub />
          </div>
        </section>

        {/* Contact finale: the ink chapter that closes the journey */}
        <section id="contact" className="relative z-10 bg-[#0A0A0E] text-white overflow-hidden">
          <div className="absolute inset-0 statement-grid opacity-60 pointer-events-none" aria-hidden="true" />
          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 min-h-svh flex flex-col justify-center gap-[clamp(2.5rem,7vh,5rem)] pt-28 pb-16">
            <h2 data-anim className="font-display font-black uppercase text-[clamp(2.25rem,9vw,6rem)] leading-[0.95] tracking-[-0.02em] [text-wrap:balance]">
              Écrivons<br />
              <span className="text-[#5C8DFF]">la suite.</span>
            </h2>

            <p data-anim className="font-body text-lg text-white/85 max-w-[52ch] leading-relaxed">
              Une mission, une alternance, un projet web à concevoir : parlons-en.
            </p>

            {PORTFOLIO_CONFIG.email && (
              <div data-anim className="contact-email flex flex-wrap items-center gap-4">
                <a
                  href={`mailto:${PORTFOLIO_CONFIG.email}`}
                  className="font-mono font-bold text-[clamp(1.1rem,3vw,2rem)] text-white underline decoration-[#0055FF] decoration-4 underline-offset-8 hover:text-[#5C8DFF] transition-colors break-all"
                >
                  {PORTFOLIO_CONFIG.email}
                </a>
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="brutal-btn px-4 py-2.5 bg-[#0055FF] text-white hover:bg-white hover:text-black border-2 border-white text-xs font-mono font-bold shadow-[3px_3px_0px_#FFFFFF] cursor-pointer"
                >
                  <span className="sr-only" role="status">{copiedEmail ? "Adresse e-mail copiée" : ""}</span>
                  {copiedEmail ? (
                    <>
                      <Check size={14} className="mr-1.5" aria-hidden="true" />
                      COPIÉ
                    </>
                  ) : (
                    <>
                      <Copy size={14} className="mr-1.5" aria-hidden="true" />
                      COPIER
                    </>
                  )}
                </button>
              </div>
            )}

            {copyError && <p role="status" className="-mt-8 font-mono text-xs text-white/80">Copie indisponible. Vous pouvez sélectionner l’adresse ci-dessus.</p>}

            <div data-anim className="flex flex-wrap gap-3">
              <a
                href={PORTFOLIO_CONFIG.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="brutal-btn px-5 py-3.5 bg-white text-black hover:bg-[#0055FF] hover:text-white border-2 border-white text-xs sm:text-sm font-mono font-bold tracking-wider shadow-[4px_4px_0px_#0055FF]"
              >
                <Linkedin size={18} className="mr-2" aria-hidden="true" />
                LINKEDIN ↗
              </a>
              <a
                href={PORTFOLIO_CONFIG.github}
                target="_blank"
                rel="noopener noreferrer"
                className="brutal-btn px-5 py-3.5 bg-transparent text-white hover:bg-white hover:text-black border-2 border-white text-xs sm:text-sm font-mono font-bold tracking-wider"
              >
                <Github size={18} className="mr-2" aria-hidden="true" />
                GITHUB ↗
              </a>
              <a
                href="/cv.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="brutal-btn px-5 py-3.5 bg-transparent text-white hover:bg-white hover:text-black border-2 border-white text-xs sm:text-sm font-mono font-bold tracking-wider"
              >
                <FileText size={18} className="mr-2" aria-hidden="true" />
                CV_PDF
              </a>
            </div>
          </div>

          <footer className="relative border-t border-white/20 font-mono text-xs text-white/70">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span>© {currentYear} {PORTFOLIO_CONFIG.name}</span>
              <span>Lyon · Conçu et développé à la main</span>
            </div>
          </footer>
        </section>

        {/* Back to top fixed button */}
        {showBackToTop && (
          <button
            type="button"
            onClick={() => scrollToSection('hero')}
            className="brutal-btn fixed bottom-6 right-6 z-[70] px-3.5 py-2.5 bg-[#0055FF] text-white border-2 border-black shadow-[3px_3px_0px_#000000] hover:bg-black hover:text-white transition-colors font-mono font-bold text-xs cursor-pointer"
            aria-label="Retour en haut"
          >
            <ArrowUp size={16} className="mr-1" aria-hidden="true" />
            TOP
          </button>
        )}
      </main>
    </div>
  );
};

export default Portfolio;
