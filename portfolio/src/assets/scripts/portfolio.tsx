import React, { useState, useEffect, useRef } from 'react';
import {
  FiChevronDown as ChevronDown,
  FiMail as Mail,
  FiCode as Code,
  FiBox as Box,
  FiBriefcase as Briefcase,
  FiCalendar as Calendar,
  FiMapPin as MapPin,
  FiCheckCircle as CheckCircle,
  FiMenu as Menu,
  FiX as X,
  FiArrowUp as ArrowUp,
  FiZap as Zap,
  FiGithub as Github,
  FiInstagram as Instagram,
  FiLinkedin as Linkedin,
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

// Composant principal
const Portfolio: React.FC = () => {
  const [activeSection, setActiveSection] = useState('hero');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [introPhase, setIntroPhase] = useState<'center' | 'expand' | 'move' | 'exit'>('center');
  const [showIntro, setShowIntro] = useState(() => getProjectIdFromHash() === null);
  const [introTarget, setIntroTarget] = useState({ x: 0, y: 0 });
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(() => getProjectIdFromHash());
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
      setShowBackToTop(window.scrollY > 650);

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
    }, 1000);

    const moveToLogo = window.setTimeout(() => {
      setIntroPhase('move');
    }, 2300);

    const exitIntro = window.setTimeout(() => {
      setIntroPhase('exit');
    }, 3600);

    const hideIntro = window.setTimeout(() => {
      setShowIntro(false);
    }, 4300);

    return () => {
      window.clearTimeout(expandName);
      window.clearTimeout(moveToLogo);
      window.clearTimeout(exitIntro);
      window.clearTimeout(hideIntro);
    };
  }, [selectedProjectId]);

  // Empêcher le scroll quand le menu mobile ou l'intro sont ouverts
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
      { threshold: 0.2, rootMargin: '0px 0px -8% 0px' }
    );

    sections.forEach((section, index) => {
      section.style.transitionDelay = `${Math.min(index * 80, 320)}ms`;
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, [selectedProjectId]);

  useEffect(() => {
    if (selectedProjectId === null) {
      return;
    }

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
        until: performance.now() + 900,
      };
      setActiveSection(sectionId);
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false); // Fermer le menu après navigation
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const navigationItems = [
    { id: 'hero', label: 'Accueil' },
    { id: 'about', label: 'À propos' },
    { id: 'portfolio', label: 'Portfolio' },
    { id: 'experience', label: 'Expérience' },
    { id: 'skills', label: 'Compétences' },
    { id: 'contact', label: 'Contact' }
  ];

  const sectionTitleClass = 'text-3xl sm:text-4xl font-bold text-center mb-12 sm:mb-16 text-[#2F2352] tracking-tight';
  const glassCardClass = 'bg-white/30 backdrop-blur-xl border border-white/45 rounded-2xl shadow-[0_18px_45px_rgba(71,56,107,0.16)]';
  const skillsGlassCardClass = 'bg-white/30 backdrop-blur-xl border border-white/45 rounded-2xl shadow-[0_18px_45px_rgba(71,56,107,0.16)]';
  const tagClass = 'px-3 py-1 bg-[#B2C9FF]/90 border border-[#BE99FF]/90 text-[#2F2352] rounded-full text-sm';
  const currentYear = new Date().getFullYear();

  if (selectedProject) {
    return <ProjectDetailPage project={selectedProject} onBack={closeProjectPage} />;
  }

  return (
    <div className="min-h-screen text-[#2F2352] relative overflow-x-hidden">
      {showIntro && (
        <div
          className={`fixed inset-0 z-[1200] px-6 overflow-hidden pointer-events-none transition-opacity duration-500 ${
            introPhase === 'exit' ? 'opacity-0' : 'opacity-100'
          }`}
          style={{ background: 'radial-gradient(ellipse at center, #f2f7ff 0%, #c9dcff 52%, #b2c9ff 100%)' }}
          aria-hidden="true"
        >
          <div
            className="fixed left-1/2 top-1/2"
            style={{
              transform:
                introPhase === 'move' || introPhase === 'exit'
                  ? `translate(calc(-50% + ${introTarget.x}px), calc(-50% + ${introTarget.y}px))`
                  : 'translate(-50%, -50%)',
              transformOrigin: 'center center',
              transition: 'transform 980ms cubic-bezier(0.22, 1, 0.36, 1)',
            }}
          >
            <div
              className={`flex items-center whitespace-nowrap text-lg sm:text-2xl font-bold transition-transform duration-[980ms] ease-out ${
                introPhase === 'move' || introPhase === 'exit' ? 'scale-100' : 'scale-[2.35] sm:scale-[4.6] md:scale-[6]'
              }`}
            >
              <span className="text-[#2F2352]">{firstName}</span>
              {hasLastName && (
                <span
                  className={`overflow-hidden text-[#47386B] transition-all duration-1000 ease-in-out ${
                    introPhase === 'center' ? 'max-w-0 opacity-0 ml-0' : 'max-w-[90vw] sm:max-w-[1000px] opacity-100 ml-3'
                  }`}
                >
                  {lastName}
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Arrière-plan galaxie 3D */}
      <GalaxyBackground />

      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-[#9D71E8] focus:text-[#241A42]"
      >
        Aller au contenu
      </a>

      {/* Barre de progression de lecture */}
      <div className="fixed left-0 top-0 right-0 z-[60] h-1 bg-[#C9DCFF]/80 backdrop-blur-sm" aria-hidden="true">
        <div
          className="h-full bg-gradient-to-r from-[#C9DCFF] via-[#BE99FF] to-[#9D71E8] transition-[width] duration-150 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>
      
      {/* Navigation */}
      <nav className="fixed left-3 right-3 top-4 z-50 rounded-2xl bg-white/30 backdrop-blur-xl border border-white/45 shadow-[0_10px_35px_rgba(71,56,107,0.2)]" aria-label="Navigation principale">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div
              ref={navLogoRef}
              className={`text-lg sm:text-2xl font-bold text-[#2F2352] transition-opacity duration-500 ${
                showIntro && introPhase !== 'move' && introPhase !== 'exit' ? 'opacity-0' : 'opacity-100'
              }`}
            >
              {PORTFOLIO_CONFIG.name}
            </div>
            
            {/* Navigation Desktop */}
            <div className="hidden md:flex items-center gap-3">
              {navigationItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  aria-current={activeSection === item.id ? 'page' : undefined}
                  className={`px-4 py-2 rounded-full border text-sm transition-all duration-300 ${
                    activeSection === item.id
                      ? 'text-[#2F2352] bg-[#C9DCFF]/90 border-[#BE99FF]/80 shadow-[0_0_18px_rgba(157,113,232,0.25)]'
                      : 'text-[#47386B] border-transparent hover:text-[#2F2352] hover:bg-[#B2C9FF]/70'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Bouton Menu Burger */}
            <button
              onClick={toggleMobileMenu}
              className={`md:hidden p-2.5 rounded-xl border transition-all duration-300 text-[#2F2352] ${
                isMobileMenuOpen
                  ? 'bg-[#B8B8FF]/80 border-[#9381FF]/65 shadow-[0_0_0_3px_rgba(147,129,255,0.18)]'
                  : 'bg-[#C9DCFF]/92 border-[#B8B8FF]/60 hover:bg-[#B8B8FF]/75'
              }`}
              aria-label="Toggle mobile menu"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-navigation"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Menu Mobile */}
        <div id="mobile-navigation" className={`md:hidden absolute top-[calc(100%+0.55rem)] left-2 right-2 bg-[#F8F7FF]/96 backdrop-blur-2xl border border-[#B8B8FF]/55 rounded-2xl shadow-[0_24px_65px_rgba(51,41,95,0.22)] max-h-[72vh] overflow-y-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden origin-top transition-all duration-300 ${
          isMobileMenuOpen ? 'opacity-100 visible translate-y-0 scale-100' : 'opacity-0 invisible -translate-y-2 scale-95 pointer-events-none'
        }`}>
          <div className="max-w-6xl mx-auto px-4 py-4">
            <div className="flex flex-col space-y-2">
              {navigationItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  aria-current={activeSection === item.id ? 'page' : undefined}
                  className={`text-left py-3.5 px-4 rounded-xl border transition-all duration-300 ${
                    activeSection === item.id 
                      ? 'text-[#2F2352] bg-[#B8B8FF]/58 border-[#9381FF]/55 shadow-[0_6px_20px_rgba(147,129,255,0.2)]' 
                      : 'text-[#47386B] bg-white/55 border-white/50 hover:text-[#2F2352] hover:bg-[#FFEEDD]/92 hover:border-[#B8B8FF]/55'
                  }`}
                >
                  {item.label}
                </button>
              ))}
              
              {/* Liens sociaux dans le menu mobile */}
              <div className="pt-4 mt-4 border-t border-[#B8B8FF]/70">
                <div className="flex justify-center gap-4">
                  <a 
                    href={PORTFOLIO_CONFIG.github} 
                    className="p-3 rounded-full bg-[#B8B8FF]/58 hover:bg-[#9381FF]/42 border border-[#9381FF]/35 transition-colors text-[#2F2352]"
                    target="_blank" 
                    rel="noopener noreferrer"
                    onClick={() => setIsMobileMenuOpen(false)}
                    aria-label="GitHub"
                  >
                    <Github size={20} />
                  </a>
                  <a 
                    href={PORTFOLIO_CONFIG.instagram} 
                    className="p-3 rounded-full bg-[#B8B8FF]/58 hover:bg-[#9381FF]/42 border border-[#9381FF]/35 transition-colors text-[#2F2352]"
                    target="_blank" 
                    rel="noopener noreferrer"
                    onClick={() => setIsMobileMenuOpen(false)}
                    aria-label="Instagram"
                  >
                    <Instagram size={20} />
                  </a>
                  <a 
                    href={PORTFOLIO_CONFIG.linkedin} 
                    className="p-3 rounded-full bg-[#B8B8FF]/58 hover:bg-[#9381FF]/42 border border-[#9381FF]/35 transition-colors text-[#2F2352]"
                    target="_blank" 
                    rel="noopener noreferrer"
                    onClick={() => setIsMobileMenuOpen(false)}
                    aria-label="LinkedIn"
                  >
                    <Linkedin size={20} />
                  </a>
                  <a 
                    href={`mailto:${PORTFOLIO_CONFIG.email}`} 
                    className="p-3 rounded-full bg-[#B8B8FF]/58 hover:bg-[#9381FF]/42 border border-[#9381FF]/35 transition-colors text-[#2F2352]"
                    onClick={() => setIsMobileMenuOpen(false)}
                    aria-label="Email"
                  >
                    <Mail size={20} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Overlay pour fermer le menu en cliquant à l'extérieur */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-[#2F2352]/45 backdrop-blur-[2px] z-40 md:hidden" 
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      <main id="main-content" tabIndex={-1}>
      
      {/* Hero Section */}
      <section id="hero" className="min-h-screen flex items-center justify-center relative z-10 pt-28 pb-16 scroll-mt-28">
        <div className="max-w-5xl mx-auto px-2 w-full">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-[1.05] tracking-tight text-[#2F2352]">
              Une idée ? Je la transforme en expérience web complète 
            </h1>
            <p className="text-lg sm:text-xl text-[#47386B] max-w-3xl mx-auto leading-relaxed mb-8 sm:mb-10">
              Du front-end à la logique métier, je conçois des applications performantes, évolutives et intuitives, avec une attention forte au design, à la qualité du code et à l'expérience utilisateur.
            </p>

            <div className="flex justify-center gap-4 sm:gap-6 flex-wrap">
              <a href={PORTFOLIO_CONFIG.github} className="p-4 rounded-full bg-white/35 border border-white/60 text-[#2F2352] shadow-[0_10px_30px_rgba(71,56,107,0.12)] hover:bg-[#C9DCFF]/85 hover:border-[#9D71E8]/70 hover:-translate-y-1 transition-all" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                <Github size={24} />
              </a>
              <a href={PORTFOLIO_CONFIG.instagram} className="p-4 rounded-full bg-white/35 border border-white/60 text-[#2F2352] shadow-[0_10px_30px_rgba(71,56,107,0.12)] hover:bg-[#C9DCFF]/85 hover:border-[#9D71E8]/70 hover:-translate-y-1 transition-all" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <Instagram size={24} />
              </a>
              <a href={PORTFOLIO_CONFIG.linkedin} className="p-4 rounded-full bg-white/35 border border-white/60 text-[#2F2352] shadow-[0_10px_30px_rgba(71,56,107,0.12)] hover:bg-[#C9DCFF]/85 hover:border-[#9D71E8]/70 hover:-translate-y-1 transition-all" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <Linkedin size={24} />
              </a>
              <a href={`mailto:${PORTFOLIO_CONFIG.email}`} className="p-4 rounded-full bg-white/35 border border-white/60 text-[#2F2352] shadow-[0_10px_30px_rgba(71,56,107,0.12)] hover:bg-[#C9DCFF]/85 hover:border-[#9D71E8]/70 hover:-translate-y-1 transition-all" aria-label="Email">
                <Mail size={24} />
              </a>
            </div>
          </div>

          <div className="mt-10 flex justify-center">
            <button 
              onClick={() => scrollToSection('about')}
              className="animate-bounce p-3 bg-white/35 hover:bg-[#BE99FF]/85 rounded-full border border-white/60 transition-colors backdrop-blur-sm text-[#241A42]"
              aria-label="Descendre vers la section À propos"
            >
              <ChevronDown size={24} />
            </button>
          </div>
        </div>
      </section>
      
      {/* About Section */}
      <section id="about" data-section-transition className="py-20 relative z-10 section-transition scroll-mt-28">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className={sectionTitleClass}>
            À Propos de Moi
          </h2>
          
          <div className="space-y-6 md:space-y-8">
            <div className={`${glassCardClass} p-8`}>
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                <Code className="text-[#9D71E8]" />
                En bref
              </h3>
              <p className="text-[#2F2352]/90 leading-relaxed mb-6">
                Depuis plus de 2 ans, je développe des <strong>applications web</strong> et des <strong>interfaces interactives</strong>. J'aime concevoir des produits utiles, performants et intuitifs, du design d'interface jusqu'à la logique métier.
              </p>
              <p className="text-[#2F2352]/90 leading-relaxed mb-6">
                Je suis actuellement en <strong className="text-[#2F2352] font-bold">Master en informatique</strong> à l'<strong>Université de Lyon 2</strong>, où j'approfondis mes compétences en architecture logicielle, développement web fullstack et optimisation des performances.
              </p>
              <p className="text-[#2F2352]/90 leading-relaxed mb-6">
                Ce diplôme fait suite à un <strong className="text-[#2F2352] font-bold">BUT Métiers du Multimédia et de l'Internet</strong> orienté <strong>Développement Web et dispositifs interactifs</strong>, où j'ai construit une base solide en front-end, back-end et expérience utilisateur.
              </p>
              <p className="text-[#2F2352]/90 leading-relaxed">
                Mon objectif est de concevoir des plateformes web complètes et évolutives, avec une attention forte à la qualité du code, à la maintenabilité et à l'expérience utilisateur.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className={`${glassCardClass} p-6`}>
                <div className="flex items-center gap-3">
                  <Code className="text-[#9D71E8]" />
                  <h4 className="text-xl font-semibold">Développement Fullstack Web</h4>
                </div>
              </div>

              <div className={`${glassCardClass} p-6`}>
                <div className="flex items-center gap-3">
                  <Box className="text-[#BE99FF]" />
                  <h4 className="text-xl font-semibold">APIs, données & architecture</h4>
                </div>
              </div>

              <div className={`${glassCardClass} p-6`}>
                <div className="flex items-center gap-3">
                  <Briefcase className="text-[#9D71E8]" />
                  <h4 className="text-xl font-semibold">UX, performance & déploiement</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section id="portfolio" data-section-transition className="py-20 relative z-10 section-transition scroll-mt-28">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className={sectionTitleClass}>
            Portfolio
          </h2>
          <p className="-mt-6 mb-10 text-center text-[#47386B] max-w-3xl mx-auto leading-relaxed">
            Chaque carte ouvre une page dédiée avec davantage de contexte, les fonctionnalités clés et un aperçu en direct quand le projet est déployé sur GitHub Pages.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {PORTFOLIO_CONFIG.projects.map((project) => (
              <ProjectCard key={project.id} project={project} onOpenProject={openProjectPage} />
            ))}
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" data-section-transition className="py-20 relative z-10 section-transition scroll-mt-28">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className={sectionTitleClass}>
            Expérience Professionnelle
          </h2>
          
          <div className="space-y-8">
            {PORTFOLIO_CONFIG.experiences.map((experience) => (
              <div key={experience.id} className={`${glassCardClass} relative p-8 hover:border-[#9D71E8]/75 transition-all duration-300`}>
                <div className="grid md:grid-cols-3 gap-6">
                  {/* Info principale */}
                  <div className="md:col-span-2">
                    <div className="flex flex-wrap items-start gap-4 mb-1">
                      <div className="flex items-center gap-3">
                        <Briefcase className="text-[#9D71E8]" size={20} />
                        <h3 className="text-2xl font-bold text-[#2F2352]">{experience.role}</h3>
                      </div>
                      <div className="flex mt-2 items-top gap-3 text-[#47386B]">
                        <MapPin size={16} />
                        <span className="font-semibold">{experience.company}</span>
                        
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-4 text-[#47386B]">
                      <Calendar size={16} />
                      <span>{experience.period}</span>
                    </div>
                    
                    <p className="text-[#2F2352]/90 mb-6 leading-relaxed">
                      {experience.description}
                    </p>

                    {/* Logo de l'entreprise */}
                    {experience.logo && (
                    <div className="absolute top-20 md:top-3 right-4 w-16 h-16 md:w-20 md:h-20 p-1 flex items-center justify-center">
                      <img 
                        src={experience.logo} 
                        alt={`${experience.company} logo`}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    )}
                    
                    {/* Technologies */}
                    <div className="mb-6">
                      <h4 className="text-lg font-semibold mb-3 text-[#47386B]">Compétences utilisées</h4>
                      <div className="flex flex-wrap gap-2">
                        {experience.technologies.map((tech, techIndex) => (
                          <span key={techIndex} className={tagClass}>
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Réalisations */}
                  <div className="md:col-span-1">
                    <h4 className="text-lg font-semibold mb-4 text-[#47386B] flex items-center gap-2">
                      <CheckCircle size={18} />
                      Réalisations clés
                    </h4>
                    <ul className="space-y-3">
                      {experience.achievements.map((achievement, achIndex) => (
                        <li key={achIndex} className="flex items-start gap-2 text-[#2F2352]/90">
                          <div className="w-2 h-2 bg-[#9D71E8] mt-2 flex-shrink-0"></div>
                          <span className="text-sm leading-relaxed">{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      
      
      {/* Skills Section */}
      <section id="skills" data-section-transition className="py-20 relative z-10 section-transition scroll-mt-28">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className={sectionTitleClass}>
            Compétences
          </h2>
          <div className="space-y-8">
            <div className={`${skillsGlassCardClass} p-6 sm:p-8`}>
              <h3 className="text-2xl font-semibold text-[#2F2352] mb-6 flex items-center gap-3">
                <CheckCircle size={22} className="text-[#9D71E8]" />
                Ce que je maîtrise
              </h3>
              <div className="flex flex-wrap justify-center gap-4">
                {PORTFOLIO_CONFIG.skills.map((skill, index) => {
                  const IconComponent = skill.icon;
                  return (
                    <div key={index} className="w-full sm:w-[calc((100%-1rem)/2)] lg:w-[calc((100%-3rem)/4)] p-5 rounded-xl bg-[#C9DCFF]/80 border border-[#BE99FF]/70 hover:border-[#9D71E8]/80 transition-all duration-300 group">
                      <div className="text-center">
                        <div className="flex justify-center mb-3">
                          <IconComponent size={42} className="text-[#9D71E8] group-hover:text-[#2F2352] transition-colors" />
                        </div>
                        <h4 className="text-base font-semibold mb-1">{skill.name}</h4>
                        <p className="text-xs text-[#47386B]">{skill.category}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className={`${skillsGlassCardClass} p-6 sm:p-8`}>
              <h3 className="text-2xl font-semibold text-[#2F2352] mb-6 flex items-center gap-3">
                <Zap size={22} className="text-[#9D71E8]" />
                Ce que j'apprends
              </h3>
              <div className="flex flex-wrap justify-center gap-4">
                {PORTFOLIO_CONFIG.learningSkills.map((skill, index) => {
                  const IconComponent = skill.icon;
                  return (
                    <div key={index} className="w-full sm:w-[calc((100%-1rem)/2)] lg:w-[calc((100%-3rem)/4)] p-5 rounded-xl bg-[#B2C9FF]/70 border border-[#BE99FF]/80 hover:border-[#9D71E8]/80 transition-all duration-300 group">
                      <div className="text-center">
                        <div className="flex justify-center mb-3">
                          <IconComponent size={40} className="text-[#5A4690] group-hover:text-[#2F2352] transition-colors" />
                        </div>
                        <h4 className="text-base font-semibold mb-1">{skill.name}</h4>
                        <p className="text-xs text-[#47386B]">{skill.category}</p>
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
      <section id="contact" data-section-transition className="py-20 relative z-10 section-transition scroll-mt-28">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-8 text-[#2F2352] tracking-tight">
              Contactez-moi
            </h2>
            <p className="text-xl text-[#47386B] mb-12">
              Prêt à collaborer sur votre prochain projet ? Parlons-en !
            </p>
          </div>
          
          {/* Boutons de contact */}
          <div className="flex flex-wrap justify-center gap-4 sm:gap-8 mb-12">
            <a 
              href={`mailto:${PORTFOLIO_CONFIG.email}`}
              className="flex items-center gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-[#9D71E8] hover:bg-[#8A65CF] text-[#241A42] rounded-xl transition-colors text-base sm:text-lg font-semibold"
              aria-label="Envoyer un email"
            >
              <Mail size={20} className="sm:hidden" />
              <Mail size={24} className="hidden sm:block" />
              Email
            </a>
            <a 
              href={PORTFOLIO_CONFIG.linkedin}
              className="flex items-center gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-[#BE99FF] hover:bg-[#9D71E8] text-[#35275B] rounded-xl transition-colors text-base sm:text-lg"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Ouvrir LinkedIn"
            >
              <Linkedin size={20} className="sm:hidden" />
              <Linkedin size={24} className="hidden sm:block" />
              LinkedIn
            </a>
            <a 
              href={PORTFOLIO_CONFIG.github}
              className="flex items-center gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-[#B2C9FF] hover:bg-[#BE99FF] text-[#35275B] rounded-xl transition-colors text-base sm:text-lg"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Ouvrir GitHub"
            >
              <Github size={20} className="sm:hidden" />
              <Github size={24} className="hidden sm:block" />
              GitHub
            </a>
          </div>
        </div>
      </section>

      {showBackToTop && (
        <button
          onClick={() => scrollToSection('hero')}
          className="fixed bottom-6 right-6 z-40 p-3 rounded-full bg-[#9D71E8]/95 text-[#241A42] shadow-lg shadow-[#9D71E8]/35 hover:bg-[#BE99FF] transition-colors"
          aria-label="Retour en haut"
        >
          <ArrowUp size={20} />
        </button>
      )}
      
      {/* Footer */}
      <footer className="py-8 text-center border-t border-[#BE99FF]/80 relative z-10">
        <p className="text-[#47386B] px-4">
          © {currentYear} {PORTFOLIO_CONFIG.name}. Tous droits réservés. | Développé par <a href={PORTFOLIO_CONFIG.github} className="text-[#2F2352] hover:underline" target="_blank" rel="noopener noreferrer">{PORTFOLIO_CONFIG.name}</a> avec React, TypeScript, Tailwind CSS et Three.js
        </p>
      </footer>
      </main>
    </div>
  );
};

export default Portfolio;
