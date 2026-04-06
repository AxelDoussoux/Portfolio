import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Github, Mail, Linkedin, Code, Box, Briefcase, Calendar, MapPin, CheckCircle, Instagram, Menu, X, ArrowUp } from 'lucide-react';
import PORTFOLIO_CONFIG from './portfolioData';
import GalaxyBackground from './galaxyBackground';
import ProjectCard from './projectCard';

// Composant principal
const Portfolio: React.FC = () => {
  const [activeSection, setActiveSection] = useState('hero');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const navClickLockRef = useRef<{ sectionId: string; until: number } | null>(null);
  
  useEffect(() => {
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
  }, []);

  // Empêcher le scroll quand le menu mobile est ouvert
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

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
  }, []);
  
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

  const sectionTitleClass = 'text-3xl sm:text-4xl font-bold text-center mb-12 sm:mb-16 text-[#5A4630] tracking-tight';
  const glassCardClass = 'bg-[#FEFAE0]/92 backdrop-blur-md border border-[#E7C8A0]/70 rounded-2xl shadow-[0_16px_42px_rgba(90,70,48,0.18)]';
  const tagClass = 'px-3 py-1 bg-[#E9EDC9]/90 border border-[#CCD5AE]/90 text-[#5A4630] rounded-full text-sm';
  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen text-[#5A4630] relative overflow-x-hidden">
      {/* Arrière-plan galaxie 3D */}
      <GalaxyBackground />

      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-[#D4A373] focus:text-[#2f2418]"
      >
        Aller au contenu
      </a>

      {/* Barre de progression de lecture */}
      <div className="fixed left-0 top-0 right-0 z-[60] h-1 bg-[#FAEDCD]/80 backdrop-blur-sm" aria-hidden="true">
        <div
          className="h-full bg-gradient-to-r from-[#CCD5AE] via-[#E7C8A0] to-[#D4A373] transition-[width] duration-150 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>
      
      {/* Navigation */}
      <nav className="fixed left-3 right-3 top-4 z-50 rounded-2xl bg-[#FEFAE0]/88 backdrop-blur-md border border-[#E7C8A0]/75 shadow-[0_10px_35px_rgba(90,70,48,0.2)]" aria-label="Navigation principale">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="text-lg sm:text-2xl font-bold text-[#5A4630]">
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
                      ? 'text-[#5A4630] bg-[#FAEDCD]/90 border-[#E7C8A0]/80 shadow-[0_0_18px_rgba(212,163,115,0.25)]'
                      : 'text-[#6F5A43] border-transparent hover:text-[#5A4630] hover:bg-[#E9EDC9]/70'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Bouton Menu Burger */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-2 rounded-lg bg-[#FAEDCD]/90 hover:bg-[#E7C8A0] transition-colors text-[#5A4630]"
              aria-label="Toggle mobile menu"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-navigation"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Menu Mobile */}
        <div id="mobile-navigation" className={`md:hidden absolute top-full left-0 right-0 bg-[#FEFAE0]/96 backdrop-blur-md border-b border-[#E7C8A0]/75 rounded-b-2xl transition-all duration-300 ${
          isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}>
          <div className="max-w-6xl mx-auto px-6 py-4">
            <div className="flex flex-col space-y-4">
              {navigationItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  aria-current={activeSection === item.id ? 'page' : undefined}
                  className={`text-left py-3 px-4 rounded-lg transition-all duration-300 ${
                    activeSection === item.id 
                      ? 'text-[#5A4630] bg-[#FAEDCD]/90 border border-[#E7C8A0]/75' 
                      : 'text-[#6F5A43] hover:text-[#5A4630] hover:bg-[#E9EDC9]/75 border border-transparent'
                  }`}
                >
                  {item.label}
                </button>
              ))}
              
              {/* Liens sociaux dans le menu mobile */}
              <div className="pt-4 mt-4 border-t border-[#E7C8A0]/75">
                <div className="flex justify-center gap-4">
                  <a 
                    href={PORTFOLIO_CONFIG.github} 
                    className="p-3 bg-[#E9EDC9] hover:bg-[#CCD5AE] rounded-full transition-colors text-[#5A4630]"
                    target="_blank" 
                    rel="noopener noreferrer"
                    onClick={() => setIsMobileMenuOpen(false)}
                    aria-label="GitHub"
                  >
                    <Github size={20} />
                  </a>
                  <a 
                    href={PORTFOLIO_CONFIG.instagram} 
                    className="p-3 bg-[#E9EDC9] hover:bg-[#CCD5AE] rounded-full transition-colors text-[#5A4630]"
                    target="_blank" 
                    rel="noopener noreferrer"
                    onClick={() => setIsMobileMenuOpen(false)}
                    aria-label="Instagram"
                  >
                    <Instagram size={20} />
                  </a>
                  <a 
                    href={PORTFOLIO_CONFIG.linkedin} 
                    className="p-3 bg-[#E9EDC9] hover:bg-[#CCD5AE] rounded-full transition-colors text-[#5A4630]"
                    target="_blank" 
                    rel="noopener noreferrer"
                    onClick={() => setIsMobileMenuOpen(false)}
                    aria-label="LinkedIn"
                  >
                    <Linkedin size={20} />
                  </a>
                  <a 
                    href={`mailto:${PORTFOLIO_CONFIG.email}`} 
                    className="p-3 bg-[#E9EDC9] hover:bg-[#CCD5AE] rounded-full transition-colors text-[#5A4630]"
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
          className="fixed inset-0 bg-[#5A4630]/20 z-40 md:hidden" 
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      <main id="main-content" tabIndex={-1}>
      
      {/* Hero Section */}
      <section id="hero" className="min-h-screen flex items-center justify-center relative z-10 pt-28 pb-16 scroll-mt-28">
        <div className="text-center max-w-5xl mx-auto px-6">
          <div className="mb-6">
            <h1 className="text-5xl sm:text-6xl md:text-8xl font-bold mb-4 text-[#5A4630] tracking-tight">
              {PORTFOLIO_CONFIG.name}
            </h1>
            <h2 className="text-xl sm:text-2xl md:text-3xl text-[#6F5A43] mb-6">
              {PORTFOLIO_CONFIG.title}
            </h2>
            <p className="text-lg sm:text-xl text-[#6F5A43] max-w-3xl mx-auto leading-relaxed">
              {PORTFOLIO_CONFIG.bio}
            </p>
          </div>
          
          <div className="flex justify-center gap-4 sm:gap-6 mb-12 flex-wrap">
            <a href={PORTFOLIO_CONFIG.github} className="p-4 bg-[#E9EDC9]/95 border border-[#D4A373]/70 hover:border-[#D4A373] hover:-translate-y-1 rounded-full transition-all backdrop-blur-sm text-[#5A4630]" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <Github size={24} />
            </a>
            <a href={PORTFOLIO_CONFIG.instagram} className="p-4 bg-[#E9EDC9]/95 border border-[#D4A373]/70 hover:border-[#D4A373] hover:-translate-y-1 rounded-full transition-all backdrop-blur-sm text-[#5A4630]" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <Instagram size={24} />
            </a>
            <a href={PORTFOLIO_CONFIG.linkedin} className="p-4 bg-[#E9EDC9]/95 border border-[#D4A373]/70 hover:border-[#D4A373] hover:-translate-y-1 rounded-full transition-all backdrop-blur-sm text-[#5A4630]" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <Linkedin size={24} />
            </a>
            <a href={`mailto:${PORTFOLIO_CONFIG.email}`} className="p-4 bg-[#E9EDC9]/95 border border-[#D4A373]/70 hover:border-[#D4A373] hover:-translate-y-1 rounded-full transition-all backdrop-blur-sm text-[#5A4630]" aria-label="Email">
              <Mail size={24} />
            </a>
          </div>
          
          <button 
            onClick={() => scrollToSection('about')}
            className="animate-bounce p-3 bg-[#E7C8A0]/90 hover:bg-[#D4A373] rounded-full border border-[#D4A373]/70 transition-colors backdrop-blur-sm text-[#2f2418]"
            aria-label="Descendre vers la section À propos"
          >
            <ChevronDown size={24} />
          </button>
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
                <Code className="text-[#D4A373]" />
                En bref
              </h3>
              <p className="text-[#5A4630]/90 leading-relaxed mb-6">
                Depuis plus de 2 ans, je développe des <strong>applications web</strong> et des <strong>interfaces interactives</strong>. J'aime concevoir des produits utiles, performants et intuitifs, du design d'interface jusqu'à la logique métier.
              </p>
              <p className="text-[#5A4630]/90 leading-relaxed mb-6">
                Je suis actuellement en <strong className="text-[#5A4630] font-bold">Master en informatique</strong> à l'<strong>Université de Lyon 2</strong>, où j'approfondis mes compétences en architecture logicielle, développement web fullstack et optimisation des performances.
              </p>
              <p className="text-[#5A4630]/90 leading-relaxed mb-6">
                Ce diplôme fait suite à un <strong className="text-[#5A4630] font-bold">BUT Métiers du Multimédia et de l'Internet</strong> orienté <strong>Développement Web et dispositifs interactifs</strong>, où j'ai construit une base solide en front-end, back-end et expérience utilisateur.
              </p>
              <p className="text-[#5A4630]/90 leading-relaxed">
                Mon objectif est de concevoir des plateformes web complètes et évolutives, avec une attention forte à la qualité du code, à la maintenabilité et à l'expérience utilisateur.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className={`${glassCardClass} p-6`}>
                <div className="flex items-center gap-3">
                  <Code className="text-[#D4A373]" />
                  <h4 className="text-xl font-semibold">Développement Fullstack Web</h4>
                </div>
              </div>

              <div className={`${glassCardClass} p-6`}>
                <div className="flex items-center gap-3">
                  <Box className="text-[#CCD5AE]" />
                  <h4 className="text-xl font-semibold">APIs, données & architecture</h4>
                </div>
              </div>

              <div className={`${glassCardClass} p-6`}>
                <div className="flex items-center gap-3">
                  <Briefcase className="text-[#D4A373]" />
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
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {PORTFOLIO_CONFIG.projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
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
              <div key={experience.id} className={`${glassCardClass} relative p-8 hover:border-[#D4A373]/75 transition-all duration-300`}>
                <div className="grid md:grid-cols-3 gap-6">
                  {/* Info principale */}
                  <div className="md:col-span-2">
                    <div className="flex flex-wrap items-start gap-4 mb-1">
                      <div className="flex items-center gap-3">
                        <Briefcase className="text-[#D4A373]" size={20} />
                        <h3 className="text-2xl font-bold text-[#5A4630]">{experience.role}</h3>
                      </div>
                      <div className="flex mt-2 items-top gap-3 text-[#6F5A43]">
                        <MapPin size={16} />
                        <span className="font-semibold">{experience.company}</span>
                        
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-4 text-[#6F5A43]">
                      <Calendar size={16} />
                      <span>{experience.period}</span>
                    </div>
                    
                    <p className="text-[#5A4630]/90 mb-6 leading-relaxed">
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
                      <h4 className="text-lg font-semibold mb-3 text-[#6F5A43]">Compétences utilisées</h4>
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
                    <h4 className="text-lg font-semibold mb-4 text-[#6F5A43] flex items-center gap-2">
                      <CheckCircle size={18} />
                      Réalisations clés
                    </h4>
                    <ul className="space-y-3">
                      {experience.achievements.map((achievement, achIndex) => (
                        <li key={achIndex} className="flex items-start gap-2 text-[#5A4630]/90">
                          <div className="w-2 h-2 bg-[#D4A373] mt-2 flex-shrink-0"></div>
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
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {PORTFOLIO_CONFIG.skills.map((skill, index) => {
              const IconComponent = skill.icon;
              return (
                <div key={index} className={`${glassCardClass} p-6 hover:border-[#D4A373]/80 transition-all duration-300 group`}>
                  <div className="text-center">
                    <div className="flex justify-center mb-3">
                      <IconComponent size={48} className="text-[#D4A373] group-hover:text-[#5A4630] transition-colors" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{skill.name}</h3>
                    <p className="text-sm text-[#6F5A43] mb-4">{skill.category}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>      
      
      {/* Contact Section */}
      <section id="contact" data-section-transition className="py-20 relative z-10 section-transition scroll-mt-28">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-8 text-[#5A4630] tracking-tight">
              Contactez-moi
            </h2>
            <p className="text-xl text-[#6F5A43] mb-12">
              Prêt à collaborer sur votre prochain projet ? Parlons-en !
            </p>
          </div>
          
          {/* Boutons de contact */}
          <div className="flex flex-wrap justify-center gap-4 sm:gap-8 mb-12">
            <a 
              href={`mailto:${PORTFOLIO_CONFIG.email}`}
              className="flex items-center gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-[#D4A373] hover:bg-[#C99563] text-[#2f2418] rounded-xl transition-colors text-base sm:text-lg font-semibold"
              aria-label="Envoyer un email"
            >
              <Mail size={20} className="sm:hidden" />
              <Mail size={24} className="hidden sm:block" />
              Email
            </a>
            <a 
              href={PORTFOLIO_CONFIG.linkedin}
              className="flex items-center gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-[#E7C8A0] hover:bg-[#D4A373] text-[#4A3828] rounded-xl transition-colors text-base sm:text-lg"
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
              className="flex items-center gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-[#E9EDC9] hover:bg-[#CCD5AE] text-[#4A3828] rounded-xl transition-colors text-base sm:text-lg"
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
          className="fixed bottom-6 right-6 z-40 p-3 rounded-full bg-[#D4A373]/95 text-[#2f2418] shadow-lg shadow-[#D4A373]/35 hover:bg-[#E7C8A0] transition-colors"
          aria-label="Retour en haut"
        >
          <ArrowUp size={20} />
        </button>
      )}
      
      {/* Footer */}
      <footer className="py-8 text-center border-t border-[#E7C8A0]/80 relative z-10">
        <p className="text-[#6F5A43] px-4">
          © {currentYear} {PORTFOLIO_CONFIG.name}. Tous droits réservés. | Développé par <a href={PORTFOLIO_CONFIG.github} className="text-[#5A4630] hover:underline" target="_blank" rel="noopener noreferrer">{PORTFOLIO_CONFIG.name}</a> avec React, TypeScript, Tailwind CSS et Three.js
        </p>
      </footer>
      </main>
    </div>
  );
};

export default Portfolio;