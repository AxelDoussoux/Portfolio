import React, { useState, useEffect, useRef } from 'react';
import {
  FiChevronDown as ChevronDown,
  FiCode as Code,
  FiCalendar as Calendar,
  FiMapPin as MapPin,
  FiMenu as Menu,
  FiX as X,
  FiArrowUp as ArrowUp,
  FiFileText as FileText,
  FiZap as Zap,
  FiGithub as Github,
  FiLinkedin as Linkedin,
  FiMail as Mail,
  FiCopy as Copy,
  FiCheck as Check,
  FiActivity as Activity,
  FiTerminal as Terminal,
} from 'react-icons/fi';
import PORTFOLIO_CONFIG from './portfolioData';
import GalaxyBackground from './galaxyBackground';
import ProjectCard from './projectCard';
import ProjectDetailPage from './projectDetailPage';

const getProjectIdFromHash = () => {
  if (typeof window === 'undefined') return null;

  const hash = window.location.hash;
  const match = hash.match(/^#project-(\d+)$/);
  if (!match) return null;

  const projectId = Number(match[1]);
  return Number.isFinite(projectId) ? projectId : null;
};

const Portfolio: React.FC = () => {
  const [activeSection, setActiveSection] = useState('hero');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [introPhase, setIntroPhase] = useState<'center' | 'expand' | 'move' | 'exit'>('center');
  const [showIntro, setShowIntro] = useState(() => getProjectIdFromHash() === null);
  const [introTarget, setIntroTarget] = useState({ x: 0, y: 0 });
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(() => getProjectIdFromHash());
  const [copiedEmail, setCopiedEmail] = useState(false);
  const navClickLockRef = useRef<{ sectionId: string; until: number } | null>(null);
  const navLogoRef = useRef<HTMLDivElement>(null);

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
      const sections = ['hero', 'about', 'portfolio', 'experience', 'skills', 'contact'];
      const rootStyle = window.getComputedStyle(document.documentElement);
      const scrollPaddingTop = Number.parseFloat(rootStyle.scrollPaddingTop || '0');
      const baseOffset = Number.isFinite(scrollPaddingTop) ? scrollPaddingTop + 16 : 120;
      const viewportOffset = Math.min(window.innerHeight * 0.35, 320);
      const activationOffset = Math.max(baseOffset, viewportOffset);
      const scrollPosition = window.scrollY + activationOffset;

      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0;
      setScrollProgress(progress);
      setShowBackToTop(window.scrollY > 600);

      let currentSection = sections[0];
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          if (scrollPosition >= element.offsetTop) {
            currentSection = section;
          }
        }
      }

      const lock = navClickLockRef.current;
      if (lock) {
        if (performance.now() < lock.until) {
          setActiveSection(lock.sectionId);
          return;
        }
        navClickLockRef.current = null;
      }

      setActiveSection(currentSection);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [selectedProjectId]);

  useEffect(() => {
    const syncSelectedProject = () => {
      setSelectedProjectId(getProjectIdFromHash());
    };

    window.addEventListener('hashchange', syncSelectedProject);
    window.addEventListener('popstate', syncSelectedProject);

    return () => {
      window.removeEventListener('hashchange', syncSelectedProject);
      window.removeEventListener('popstate', syncSelectedProject);
    };
  }, []);

  useEffect(() => {
    if (!showIntro || selectedProjectId !== null) return;

    const updateTarget = () => {
      const navLogo = navLogoRef.current;
      if (!navLogo) return;

      const navRect = navLogo.getBoundingClientRect();
      const x = navRect.left + navRect.width / 2 - window.innerWidth / 2;
      const y = navRect.top + navRect.height / 2 - window.innerHeight / 2;

      setIntroTarget({ x, y });
    };

    const frameId = window.requestAnimationFrame(updateTarget);
    window.addEventListener('resize', updateTarget);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener('resize', updateTarget);
    };
  }, [showIntro, selectedProjectId]);

  useEffect(() => {
    if (selectedProjectId !== null) {
      setIntroPhase('exit');
      setShowIntro(false);
      return;
    }

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reducedMotion) {
      setIntroPhase('exit');
      const hideIntro = window.setTimeout(() => {
        setShowIntro(false);
      }, 200);

      return () => {
        window.clearTimeout(hideIntro);
      };
    }

    const expandName = window.setTimeout(() => {
      setIntroPhase('expand');
    }, 900);

    const moveToLogo = window.setTimeout(() => {
      setIntroPhase('move');
    }, 2200);

    const exitIntro = window.setTimeout(() => {
      setIntroPhase('exit');
    }, 3400);

    const hideIntro = window.setTimeout(() => {
      setShowIntro(false);
    }, 4000);

    return () => {
      window.clearTimeout(expandName);
      window.clearTimeout(moveToLogo);
      window.clearTimeout(exitIntro);
      window.clearTimeout(hideIntro);
    };
  }, [selectedProjectId]);

  useEffect(() => {
    if (selectedProjectId !== null) {
      document.body.style.overflow = 'unset';
    } else if (isMobileMenuOpen || showIntro) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen, selectedProjectId, showIntro]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  useEffect(() => {
    if (selectedProjectId !== null) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) return;

    const sections = Array.from(document.querySelectorAll<HTMLElement>('[data-section-transition]'));
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('section-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -5% 0px' }
    );

    sections.forEach((section, index) => {
      section.style.transitionDelay = `${Math.min(index * 60, 240)}ms`;
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, [selectedProjectId]);

  useEffect(() => {
    if (selectedProjectId === null) return;
    setIsMobileMenuOpen(false);
  }, [selectedProjectId]);

  const openProjectPage = (projectId: number) => {
    setIsMobileMenuOpen(false);
    setShowIntro(false);
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

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      navClickLockRef.current = {
        sectionId,
        until: performance.now() + 800,
      };
      setActiveSection(sectionId);
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleCopyEmail = () => {
    if (!PORTFOLIO_CONFIG.email) return;
    navigator.clipboard.writeText(PORTFOLIO_CONFIG.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const navigationItems = [
    { id: 'hero', label: 'ACCUEIL' },
    { id: 'about', label: 'A_PROPOS' },
    { id: 'portfolio', label: 'PROJETS' },
    { id: 'experience', label: 'PARCOURS' },
    { id: 'skills', label: 'STACK' },
    { id: 'contact', label: 'CONTACT' },
  ];

  const currentYear = new Date().getFullYear();

  if (selectedProject) {
    return <ProjectDetailPage project={selectedProject} onBack={closeProjectPage} />;
  }

  return (
    <div className="min-h-screen text-[#0A0A0E] relative overflow-x-hidden bg-[#F4F5F8]">
      {/* Intro Animation Overlay */}
      {showIntro && (
        <div
          className={`fixed inset-0 z-[1200] px-6 overflow-hidden pointer-events-none transition-opacity duration-500 bg-[#F4F5F8] flex items-center justify-center ${
            introPhase === 'exit' ? 'opacity-0' : 'opacity-100'
          }`}
          aria-hidden="true"
        >
          <div className="absolute inset-0 blueprint-grid opacity-75" />

          <div
            className="fixed left-1/2 top-1/2"
            style={{
              transform:
                introPhase === 'move' || introPhase === 'exit'
                  ? `translate(calc(-50% + ${introTarget.x}px), calc(-50% + ${introTarget.y}px))`
                  : 'translate(-50%, -50%)',
              transformOrigin: 'center center',
              transition: 'transform 980ms cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            <div
              className={`flex flex-col items-center justify-center font-display font-black uppercase tracking-tight text-black transition-transform duration-[980ms] ease-out ${
                introPhase === 'move' || introPhase === 'exit'
                  ? 'scale-100'
                  : 'scale-[1.8] sm:scale-[3] md:scale-[4]'
              }`}
            >
              <div className="flex items-center whitespace-nowrap">
                <span className="text-black">{firstName}</span>
                {hasLastName && (
                  <span
                    className={`overflow-hidden text-[#0055FF] transition-all duration-1000 ease-in-out ${
                      introPhase === 'center'
                        ? 'max-w-0 opacity-0 ml-0'
                        : 'max-w-[90vw] sm:max-w-[1000px] opacity-100 ml-2 sm:ml-4'
                    }`}
                  >
                    {lastName}
                  </span>
                )}
              </div>
              {introPhase !== 'move' && introPhase !== 'exit' && (
                <span className="font-mono text-[10px] tracking-[0.3em] text-[#64748B] mt-2">
                  [INITIALIZING_CORE_SYS...]
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Background Tactile Paper Grain & Blueprint Grid */}
      <GalaxyBackground />

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
      <header className="fixed left-0 right-0 top-1 z-50 bg-[#F4F5F8]/95 border-b border-black py-3 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo & Live Status */}
          <div className="flex items-center gap-4">
            <div
              ref={navLogoRef}
              onClick={() => scrollToSection('hero')}
              className={`font-display font-extrabold text-lg sm:text-xl tracking-tight text-black flex items-center gap-2 cursor-pointer transition-opacity duration-500 ${
                showIntro && introPhase !== 'move' && introPhase !== 'exit' ? 'opacity-0' : 'opacity-100'
              }`}
            >
              <span>{PORTFOLIO_CONFIG.name}</span>
              <span className="text-[#0055FF] font-mono text-xs">// DEV</span>
            </div>

            <div className="hidden lg:flex items-center gap-1.5 px-2 py-0.5 bg-[#E0EBFF] border border-[#0055FF] text-[11px] font-mono text-[#0055FF] font-bold">
              <span className="w-2 h-2 bg-[#0055FF] inline-block animate-pulse" />
              <span>DISPONIBLE MISSIONS</span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Navigation principale">
            {navigationItems.map((item, index) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                aria-current={activeSection === item.id ? 'page' : undefined}
                className={`px-3 py-1 font-mono text-xs tracking-wider uppercase transition-all ${
                  activeSection === item.id
                    ? 'bg-[#0055FF] text-white font-bold border border-black shadow-[2px_2px_0px_#000000]'
                    : 'text-[#475569] hover:text-black hover:bg-[#E2E8F0] border border-transparent'
                }`}
              >
                [0{index + 1} {item.label}]
              </button>
            ))}
          </nav>

          {/* Burger Menu Button for Mobile */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 bg-white border border-black text-black shadow-[2px_2px_0px_#000000]"
            aria-label="Toggle mobile menu"
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-navigation"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div
            id="mobile-navigation"
            className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-black shadow-[0_12px_0_#000000] p-4 flex flex-col space-y-2"
          >
            {navigationItems.map((item, index) => (
              <button
                key={item.id}
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
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      <main id="main-content" tabIndex={-1}>
        {/* Hero Section */}
        <section id="hero" className="min-h-screen flex flex-col justify-center relative z-10 pt-32 pb-16 scroll-mt-24">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 w-full">
            {/* Terminal Coordinate Badge */}
            <div className="mb-5 inline-flex items-center gap-2 font-mono text-xs text-[#0055FF] bg-white border border-black px-3 py-1.5 shadow-[3px_3px_0px_#000000] font-bold">
              <Activity size={14} className="text-[#0055FF]" />
              <span>GEO: LYON_FR (45.7640° N, 4.8357° E) // SYS_VER: 2026.04</span>
            </div>

            {/* Monumental Headline */}
            <div className="relative mb-6">
              <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black font-display tracking-tight text-black uppercase leading-[0.95]">
                {PORTFOLIO_CONFIG.name}
              </h1>
            </div>

            {/* Subtitle with Neo-Brutalist highlight */}
            <div className="mb-6 flex flex-wrap items-center gap-3">
              <span className="font-mono text-base sm:text-xl font-bold text-white bg-[#0055FF] px-3 py-1 border border-black shadow-[3px_3px_0px_#000000]">
                {PORTFOLIO_CONFIG.title}
              </span>
              <span className="font-mono text-xs sm:text-sm text-[#475569] font-semibold">
                // CONCEPTION LOGICIELLE & INTERFACES HAUTE PERFORMANCE
              </span>
            </div>

            {/* Bio statement */}
            <p className="text-base sm:text-lg text-[#475569] font-body max-w-3xl leading-relaxed mb-8 sm:mb-10">
              {PORTFOLIO_CONFIG.bio}
            </p>

            {/* Asymmetric Technical Spec Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-w-3xl mb-10 font-mono text-xs">
              <div className="p-3 bg-white border border-black shadow-[2px_2px_0px_#000000]">
                <span className="block text-[10px] text-[#64748B] uppercase">SPÉCIALISATION</span>
                <span className="font-bold text-black">WEB FULLSTACK</span>
              </div>
              <div className="p-3 bg-white border border-black shadow-[2px_2px_0px_#000000]">
                <span className="block text-[10px] text-[#64748B] uppercase">EXPÉRIENCE</span>
                <span className="font-bold text-[#0055FF]">2+ ANS PRO</span>
              </div>
              <div className="p-3 bg-white border border-black shadow-[2px_2px_0px_#000000]">
                <span className="block text-[10px] text-[#64748B] uppercase">FORMATION</span>
                <span className="font-bold text-black">MASTER INFO</span>
              </div>
              <div className="p-3 bg-white border border-black shadow-[2px_2px_0px_#000000]">
                <span className="block text-[10px] text-[#64748B] uppercase">DISPONIBILITÉ</span>
                <span className="font-bold text-[#0055FF]">OUVERT MISSIONS</span>
              </div>
            </div>

            {/* Hero Action Buttons */}
            <div className="flex flex-wrap items-center gap-4">
              <a
                href="/cv.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="brutal-btn px-6 py-3.5 bg-[#0055FF] text-white hover:bg-black hover:text-white border border-black text-xs sm:text-sm font-bold tracking-wider shadow-[4px_4px_0px_#000000]"
                aria-label="Consulter le CV numérique en PDF"
              >
                <FileText size={18} className="mr-2" />
                TÉLÉCHARGER CV_PDF ↓
              </a>

              <a
                href={PORTFOLIO_CONFIG.github}
                target="_blank"
                rel="noopener noreferrer"
                className="brutal-btn px-5 py-3.5 bg-white text-black hover:bg-black hover:text-white border border-black text-xs sm:text-sm font-bold tracking-wider shadow-[4px_4px_0px_#000000]"
                aria-label="GitHub"
              >
                <Github size={18} className="mr-2" />
                GITHUB ↗
              </a>

              <a
                href={PORTFOLIO_CONFIG.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="brutal-btn px-5 py-3.5 bg-[#E0EBFF] text-[#0055FF] hover:bg-[#0055FF] hover:text-white border border-[#0055FF] text-xs sm:text-sm font-bold tracking-wider shadow-[4px_4px_0px_#000000]"
                aria-label="LinkedIn"
              >
                <Linkedin size={18} className="mr-2" />
                LINKEDIN ↗
              </a>
            </div>
          </div>

          {/* Scroll down hint */}
          <div className="mt-14 flex justify-center">
            <button
              onClick={() => scrollToSection('about')}
              className="p-3 bg-white border border-black hover:border-[#0055FF] text-[#0055FF] shadow-[2px_2px_0px_#000000] transition-colors"
              aria-label="Descendre vers la section À propos"
            >
              <ChevronDown size={20} className="animate-bounce text-[#0055FF]" />
            </button>
          </div>

          {/* Kinetic Marquee Ticker */}
          <div className="mt-16 w-full border-y border-black bg-white py-3 overflow-hidden select-none shadow-sm">
            <div className="animate-marquee font-mono text-xs sm:text-sm tracking-widest text-[#475569] uppercase">
              <span className="mx-4 text-[#0055FF]">✦</span>
              <span className="text-black font-bold">REACT 19</span>
              <span className="mx-4 text-[#0055FF]">✦</span>
              <span>TYPESCRIPT</span>
              <span className="mx-4 text-[#0055FF]">✦</span>
              <span className="text-black font-bold">NEXT.JS & VITE</span>
              <span className="mx-4 text-[#0055FF]">✦</span>
              <span>TAILWIND CSS</span>
              <span className="mx-4 text-[#0055FF]">✦</span>
              <span className="text-black font-bold">SUPABASE & POSTGRESQL</span>
              <span className="mx-4 text-[#0055FF]">✦</span>
              <span>STRAPI CMS</span>
              <span className="mx-4 text-[#0055FF]">✦</span>
              <span className="text-black font-bold">THREE.JS WEBGL</span>
              <span className="mx-4 text-[#0055FF]">✦</span>
              <span>DOCKER & CI/CD</span>
              <span className="mx-4 text-[#0055FF]">✦</span>
              <span className="text-black font-bold">REACT 19</span>
              <span className="mx-4 text-[#0055FF]">✦</span>
              <span>TYPESCRIPT</span>
              <span className="mx-4 text-[#0055FF]">✦</span>
              <span className="text-black font-bold">NEXT.JS & VITE</span>
              <span className="mx-4 text-[#0055FF]">✦</span>
              <span>TAILWIND CSS</span>
              <span className="mx-4 text-[#0055FF]">✦</span>
              <span className="text-black font-bold">SUPABASE & POSTGRESQL</span>
              <span className="mx-4 text-[#0055FF]">✦</span>
              <span>STRAPI CMS</span>
              <span className="mx-4 text-[#0055FF]">✦</span>
              <span className="text-black font-bold">THREE.JS WEBGL</span>
              <span className="mx-4 text-[#0055FF]">✦</span>
              <span>DOCKER & CI/CD</span>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" data-section-transition className="py-24 relative z-10 section-transition scroll-mt-24">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            {/* Section Index Header */}
            <div className="flex items-center gap-3 mb-8">
              <span className="font-mono text-sm font-bold text-white bg-[#0055FF] px-2 py-0.5 border border-black shadow-[2px_2px_0px_#000000]">
                [01]
              </span>
              <h2 className="text-3xl sm:text-5xl font-black font-display uppercase tracking-tight text-black">
                À PROPOS DE MOI
              </h2>
            </div>

            <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-6">
              {/* Main Bio Panel */}
              <div className="bg-white border border-black p-6 sm:p-8 shadow-[6px_6px_0px_#000000]">
                <div className="flex items-center justify-between border-b border-black/15 pb-3 mb-6 font-mono text-xs">
                  <span className="text-[#0055FF] font-bold flex items-center gap-2">
                    <Terminal size={16} />
                    SYS_BIO // MANIFESTO
                  </span>
                  <span className="text-[#64748B]">V2026.1</span>
                </div>

                <div className="space-y-4 text-[#334155] font-body text-base leading-relaxed">
                  <p>
                    Depuis plus de 2 ans, je conçois et développe des <strong className="text-black font-bold">applications web fullstack</strong> et des <strong className="text-[#0055FF] font-bold">interfaces interactives</strong>. Mon approche privilégie la rigueur technique, l'optimisation des performances et la clarté de l'expérience utilisateur.
                  </p>
                  <p>
                    Actuellement étudiant en <strong className="text-black font-bold">Master Informatique</strong> à l'<strong>Université Lyon 2</strong>, j'approfondis l'ingénierie logicielle, les architectures de données distribuées et les standards modernes du web.
                  </p>
                  <p>
                    Ce cursus fait suite à un <strong className="text-black font-bold">BUT Métiers du Multimédia et de l'Internet</strong> orienté <strong>Développement Web & Dispositifs Interactifs</strong>, où j'ai forgé une expertise transverse alliant logique backend robuste et ergonomie front-end pointue.
                  </p>
                  <p>
                    Mon ambition : concevoir des plateformes pérennes, performantes et intuitives, avec un souci absolu de la qualité du code et de la satisfaction utilisateur.
                  </p>
                </div>
              </div>

              {/* Side Specs Grid */}
              <div className="space-y-4">
                <div className="bg-white border border-black p-5 shadow-[4px_4px_0px_#000000]">
                  <span className="block text-[11px] font-mono text-[#0055FF] font-bold uppercase tracking-wider mb-1">
                    [01 // PARCOURS ACADÉMIQUE]
                  </span>
                  <h3 className="font-display font-bold text-black text-lg mb-1">Master Informatique</h3>
                  <p className="text-xs font-mono text-[#64748B]">Université Lyon 2 • 2024 - 2026</p>
                  <p className="text-xs text-[#475569] mt-2 leading-relaxed">
                    Spécialisation architecture logicielle, bases de données relationnelles & NoSQL, sécurité et développement web avancé.
                  </p>
                </div>

                <div className="bg-white border border-black p-5 shadow-[4px_4px_0px_#000000]">
                  <span className="block text-[11px] font-mono text-[#0055FF] font-bold uppercase tracking-wider mb-1">
                    [02 // BUT MMI]
                  </span>
                  <h3 className="font-display font-bold text-black text-lg mb-1">Développement Web & Interactif</h3>
                  <p className="text-xs font-mono text-[#64748B]">IUT • 2021 - 2024</p>
                  <p className="text-xs text-[#475569] mt-2 leading-relaxed">
                    Conception UX/UI, frameworks JavaScript, APIs RESTful et gestion de projets agiles.
                  </p>
                </div>

                <div className="bg-[#E0EBFF] border border-[#0055FF] p-4 text-xs font-mono text-black flex items-center justify-between shadow-[2px_2px_0px_#000000]">
                  <span className="font-bold">EXPÉRIENCE CUMULÉE</span>
                  <span className="text-[#0055FF] font-bold text-sm">2+ ANS</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Portfolio Section */}
        <section id="portfolio" data-section-transition className="py-24 relative z-10 section-transition scroll-mt-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex flex-wrap items-baseline justify-between gap-4 mb-10 border-b border-black/15 pb-5">
              <div className="flex items-center gap-3">
                <span className="font-mono text-sm font-bold text-white bg-[#0055FF] px-2 py-0.5 border border-black shadow-[2px_2px_0px_#000000]">
                  [02]
                </span>
                <h2 className="text-3xl sm:text-5xl font-black font-display uppercase tracking-tight text-black">
                  PROJETS SÉLECTIONNÉS
                </h2>
              </div>
              <span className="font-mono text-xs text-[#64748B] font-bold">
                INDEX_TOTAL: [{PORTFOLIO_CONFIG.projects.length} PROJETS DOCUMENTÉS]
              </span>
            </div>

            <p className="mb-10 text-[#475569] font-body text-base max-w-3xl leading-relaxed">
              Chaque réalisation technique propose un cas d'étude détaillé, les contraintes d'architecture résolues et un accès direct aux dépôts GitHub ainsi qu'aux aperçus en production.
            </p>

            <div className="flex flex-wrap justify-center gap-6">
              {PORTFOLIO_CONFIG.projects.map((project) => (
                <ProjectCard key={project.id} project={project} onOpenProject={openProjectPage} />
              ))}
            </div>
          </div>
        </section>

        {/* Experience Section */}
        <section id="experience" data-section-transition className="py-24 relative z-10 section-transition scroll-mt-24">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="flex items-center gap-3 mb-10 border-b border-black/15 pb-5">
              <span className="font-mono text-sm font-bold text-white bg-[#0055FF] px-2 py-0.5 border border-black shadow-[2px_2px_0px_#000000]">
                [03]
              </span>
              <h2 className="text-3xl sm:text-5xl font-black font-display uppercase tracking-tight text-black">
                PARCOURS PROFESSIONNEL
              </h2>
            </div>

            <div className="space-y-6">
              {PORTFOLIO_CONFIG.experiences.map((experience, expIndex) => (
                <article
                  key={experience.id}
                  className="bg-white border border-black shadow-[6px_6px_0px_#000000] p-6 sm:p-8 transition-all duration-150"
                >
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 space-y-4">
                      {/* Header info */}
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
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
                            <span className="text-[#0055FF] font-mono font-bold mt-0.5">■</span>
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
        <section id="skills" data-section-transition className="py-24 relative z-10 section-transition scroll-mt-24">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="flex items-center gap-3 mb-10 border-b border-black/15 pb-5">
              <span className="font-mono text-sm font-bold text-white bg-[#0055FF] px-2 py-0.5 border border-black shadow-[2px_2px_0px_#000000]">
                [04]
              </span>
              <h2 className="text-3xl sm:text-5xl font-black font-display uppercase tracking-tight text-black">
                STACK TECHNIQUE
              </h2>
            </div>

            <div className="space-y-8">
              {/* Primary Skills Box */}
              <div className="bg-white border border-black p-6 sm:p-8 shadow-[6px_6px_0px_#000000]">
                <h3 className="text-lg font-mono font-bold text-black uppercase tracking-wider mb-6 flex items-center gap-2 border-b border-black/15 pb-3">
                  <Code size={18} className="text-[#0055FF]" />
                  [STACK_PRINCIPALE // PRODUCTION_READY]
                </h3>

                <div className="space-y-6">
                  {Object.entries(
                    PORTFOLIO_CONFIG.skills.reduce<Record<string, (typeof PORTFOLIO_CONFIG.skills)[number][]>>(
                      (groups, skill) => {
                        (groups[skill.category] ??= []).push(skill);
                        return groups;
                      },
                      {}
                    )
                  ).map(([category, skills]) => (
                    <div key={category}>
                      <span className="block text-[11px] font-mono font-bold text-[#64748B] uppercase tracking-wider mb-3">
                        // {category}
                      </span>
                      <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-2.5">
                        {skills.map((skill, skillIndex) => {
                          const IconComponent = skill.icon;
                          return (
                            <div
                              key={`${category}-${skillIndex}`}
                              className="flex items-center gap-3 px-3.5 py-2.5 bg-[#F8FAFC] border border-black/20 hover:border-black hover:bg-[#0055FF] hover:text-white transition-colors group cursor-default shadow-sm"
                            >
                              <IconComponent size={18} className="text-[#0055FF] group-hover:text-white transition-colors" />
                              <span className="text-xs font-mono font-bold uppercase">{skill.name}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Learning / Exploration Box */}
              <div className="bg-white border border-black p-6 sm:p-8 shadow-[6px_6px_0px_#000000]">
                <h3 className="text-lg font-mono font-bold text-black uppercase tracking-wider mb-6 flex items-center gap-2 border-b border-black/15 pb-3">
                  <Zap size={18} className="text-[#0055FF]" />
                  [VEILLE_ACTIVE & EN APPRENTISSAGE]
                </h3>

                <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-3">
                  {PORTFOLIO_CONFIG.learningSkills.map((skill, index) => {
                    const IconComponent = skill.icon;
                    return (
                      <div
                        key={index}
                        className="flex items-center gap-3 px-4 py-3 bg-[#F8FAFC] border border-[#0055FF]/40 hover:border-[#0055FF] hover:bg-[#0055FF] hover:text-white transition-colors group cursor-default"
                      >
                        <IconComponent size={20} className="text-[#0055FF] group-hover:text-white transition-colors" />
                        <div>
                          <span className="block text-xs font-mono font-bold uppercase">{skill.name}</span>
                          <span className="text-[10px] font-mono text-[#64748B] group-hover:text-white">EN COURS</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" data-section-transition className="py-24 relative z-10 section-transition scroll-mt-24">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="bg-white border-2 border-black shadow-[8px_8px_0px_#0055FF] p-6 sm:p-10">
              {/* Terminal Title Bar */}
              <div className="flex items-center justify-between border-b border-black pb-4 mb-8 font-mono text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-[#FF3366] border border-black" />
                  <span className="w-3 h-3 bg-[#FFE500] border border-black" />
                  <span className="w-3 h-3 bg-[#0055FF] border border-black" />
                  <span className="text-black ml-2 font-bold">TERMINAL_CONTACT // INITIALISE_LINK</span>
                </div>
                <span className="text-[#0055FF] font-bold">[CHANNEL: SECURE]</span>
              </div>

              <div className="text-center max-w-2xl mx-auto mb-10">
                <h2 className="text-3xl sm:text-5xl font-black font-display uppercase tracking-tight text-black mb-4">
                  PRÊT À COLLABORER ?
                </h2>
                <p className="text-sm sm:text-base text-[#475569] font-body leading-relaxed">
                  Que ce soit pour un projet de développement web, une mission technique ou une opportunité professionnelle, échangeons ensemble !
                </p>
              </div>

              {/* Direct email quick-copy card */}
              {PORTFOLIO_CONFIG.email && (
                <div className="mb-8 p-4 bg-[#F8FAFC] border border-black flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <Mail size={20} className="text-[#0055FF]" />
                    <div>
                      <span className="block text-[10px] font-mono text-[#64748B] uppercase font-bold">ADRESSE COURRIEL DIRECTE</span>
                      <span className="font-mono text-sm sm:text-base font-bold text-black">{PORTFOLIO_CONFIG.email}</span>
                    </div>
                  </div>

                  <button
                    onClick={handleCopyEmail}
                    className="brutal-btn px-4 py-2 bg-[#0055FF] text-white hover:bg-black hover:text-white border border-black text-xs font-mono shadow-[2px_2px_0px_#000000]"
                  >
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

              {/* External CTA Links */}
              <div className="grid sm:grid-cols-2 gap-4">
                <a
                  href={PORTFOLIO_CONFIG.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="brutal-btn p-4 bg-white text-black hover:bg-[#0055FF] hover:text-white border border-black text-xs sm:text-sm font-mono font-bold tracking-wider shadow-[4px_4px_0px_#000000]"
                >
                  <Linkedin size={20} className="mr-2.5" />
                  REJOINDRE SUR LINKEDIN ↗
                </a>

                <a
                  href={PORTFOLIO_CONFIG.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="brutal-btn p-4 bg-[#0055FF] text-white hover:bg-black hover:text-white border border-black text-xs sm:text-sm font-mono font-bold tracking-wider shadow-[4px_4px_0px_#000000]"
                >
                  <Github size={20} className="mr-2.5" />
                  EXPLORER LE GITHUB ↗
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Back to top fixed button */}
        {showBackToTop && (
          <button
            onClick={() => scrollToSection('hero')}
            className="fixed bottom-6 right-6 z-40 px-3.5 py-2.5 bg-[#0055FF] text-white border border-black shadow-[3px_3px_0px_#000000] hover:bg-black hover:text-white transition-all font-mono font-bold text-xs"
            aria-label="Retour en haut"
          >
            <ArrowUp size={16} className="inline mr-1" />
            [TOP]
          </button>
        )}

        {/* Footer */}
        <footer className="py-8 border-t border-black bg-[#F4F5F8] text-center font-mono text-xs text-[#64748B] relative z-10">
          <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              © {currentYear} {PORTFOLIO_CONFIG.name}. TOUS DROITS RÉSERVÉS.
            </div>
            <div className="text-[11px] text-[#64748B]">
              BUILD // REACT 19 + TYPESCRIPT + LIGHT NEO-BRUTALISM + TAILWIND V4
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Portfolio;
