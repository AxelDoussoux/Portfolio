import React, { useState, useEffect } from 'react';
import { ChevronDown, Github, Mail, Linkedin, Code, Gamepad2, Box, Briefcase, Calendar, MapPin, CheckCircle, Camera, Instagram, Menu, X, Video } from 'lucide-react';
import PORTFOLIO_CONFIG from './portfolioData';
import GalaxyBackground from './galaxyBackground';
import ProjectCard from './projectCard';
import InstagramCarousel from './carouselInstagram';

// Composant principal
const Portfolio: React.FC = () => {
  const [activeSection, setActiveSection] = useState('hero');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'about', 'skills', 'portfolio', 'experience', 'contact'];
      const scrollPosition = window.scrollY + 100;
      
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
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
  
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
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
    { id: 'skills', label: 'Compétences' },
    { id: 'portfolio', label: 'Portfolio' },
    { id: 'experience', label: 'Expérience' },
    { id: 'contact', label: 'Contact' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white relative overflow-x-hidden">
      {/* Arrière-plan galaxie 3D */}
      <GalaxyBackground />
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-md border-b border-purple-500/30">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              {PORTFOLIO_CONFIG.name}
            </div>
            
            {/* Navigation Desktop */}
            <div className="hidden md:flex space-x-8">
              {navigationItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`transition-colors duration-300 hover:text-purple-300 ${
                    activeSection === item.id ? 'text-purple-400' : 'text-gray-300'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Bouton Menu Burger */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-2 rounded-lg bg-purple-600/20 hover:bg-purple-600/40 transition-colors"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Menu Mobile */}
        <div className={`md:hidden absolute top-full left-0 right-0 bg-black/95 backdrop-blur-md border-b border-purple-500/30 transition-all duration-300 ${
          isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}>
          <div className="max-w-6xl mx-auto px-6 py-4">
            <div className="flex flex-col space-y-4">
              {navigationItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`text-left py-3 px-4 rounded-lg transition-all duration-300 ${
                    activeSection === item.id 
                      ? 'text-purple-400 bg-purple-600/20' 
                      : 'text-gray-300 hover:text-white hover:bg-purple-600/10'
                  }`}
                >
                  {item.label}
                </button>
              ))}
              
              {/* Liens sociaux dans le menu mobile */}
              <div className="pt-4 mt-4 border-t border-purple-500/30">
                <div className="flex justify-center gap-4">
                  <a 
                    href={PORTFOLIO_CONFIG.github} 
                    className="p-3 bg-gray-800/50 hover:bg-gray-700/50 rounded-full transition-colors"
                    target="_blank" 
                    rel="noopener noreferrer"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Github size={20} />
                  </a>
                  <a 
                    href={PORTFOLIO_CONFIG.instagram} 
                    className="p-3 bg-gray-800/50 hover:bg-gray-700/50 rounded-full transition-colors"
                    target="_blank" 
                    rel="noopener noreferrer"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Instagram size={20} />
                  </a>
                  <a 
                    href={PORTFOLIO_CONFIG.linkedin} 
                    className="p-3 bg-gray-800/50 hover:bg-gray-700/50 rounded-full transition-colors"
                    target="_blank" 
                    rel="noopener noreferrer"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Linkedin size={20} />
                  </a>
                  <a 
                    href={`mailto:${PORTFOLIO_CONFIG.email}`} 
                    className="p-3 bg-gray-800/50 hover:bg-gray-700/50 rounded-full transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
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
          className="fixed inset-0 bg-black/50 z-40 md:hidden" 
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
      
      {/* Hero Section */}
      <section id="hero" className="min-h-screen flex items-center justify-center relative z-10">
        <div className="text-center max-w-4xl mx-auto px-6">
          <div className="mb-8">
            <div className="w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 bg-gray-900/20 backdrop-blur-sm rounded-full mx-auto p-1 mb-6 flex items-center justify-center relative">
              {/* Contour en fade avec gradient */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500/60 via-blue-500/60 to-purple-500/60 blur-sm"></div>
              <div className="absolute inset-1 rounded-full bg-gradient-to-r from-purple-500/40 via-blue-500/40 to-purple-500/40"></div>
              
              {/* Image */}
              <div className="relative w-full h-full ">
                <img src={PORTFOLIO_CONFIG.avatar} alt="Avatar" className="rounded-full w-full h-full object-cover relative z-10" />
              </div>
            </div>
            <h1 className="text-6xl md:text-8xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-blue-400 to-purple-600 bg-clip-text text-transparent">
              {PORTFOLIO_CONFIG.name}
            </h1>
            <h2 className="text-2xl md:text-3xl text-purple-300 mb-6">
              {PORTFOLIO_CONFIG.title}
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              {PORTFOLIO_CONFIG.bio}
            </p>
          </div>
          
          <div className="flex justify-center gap-6 mb-12">
            <a href={PORTFOLIO_CONFIG.github} className="p-4 bg-gray-800/50 hover:bg-gray-700/50 rounded-full transition-colors backdrop-blur-sm" target="_blank" rel="noopener noreferrer">
              <Github size={24} />
            </a>
            <a href={PORTFOLIO_CONFIG.instagram} className="p-4 bg-gray-800/50 hover:bg-gray-700/50 rounded-full transition-colors backdrop-blur-sm" target="_blank" rel="noopener noreferrer">
              <Instagram size={24} />
            </a>
            <a href={PORTFOLIO_CONFIG.linkedin} className="p-4 bg-gray-800/50 hover:bg-gray-700/50 rounded-full transition-colors backdrop-blur-sm" target="_blank" rel="noopener noreferrer">
              <Linkedin size={24} />
            </a>
            <a href={`mailto:${PORTFOLIO_CONFIG.email}`} className="p-4 bg-gray-800/50 hover:bg-gray-700/50 rounded-full transition-colors backdrop-blur-sm">
              <Mail size={24} />
            </a>
          </div>
          
          <button 
            onClick={() => scrollToSection('about')}
            className="animate-bounce p-3 bg-purple-600/30 hover:bg-purple-500/30 rounded-full transition-colors backdrop-blur-sm"
          >
            <ChevronDown size={24} />
          </button>
        </div>
      </section>
      
      {/* About Section */}
      <section id="about" className="py-20 relative z-10">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            À Propos de Moi
          </h2>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="bg-gray-900/50 backdrop-blur-sm border border-purple-500/30 rounded-xl p-8">
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                  <Gamepad2 className="text-purple-400" />
                  En bref
                </h3>
                <p className="text-gray-300 leading-relaxed mb-6">
                  Depuis plus de 2 ans, je développe des <strong>jeux vidéo</strong> et fais de la <strong>modélisation 3D</strong>. Ma passion pour le jeu vidéo m'a mené à maîtriser les outils les plus tendance de l'industrie.
                </p>
                <p className="text-gray-300 leading-relaxed mb-6">
                  Je suis actuellement en phase de terminer mon <strong className="text-white font-bold">BUT Métiers du Multimédia et de l'Internet</strong> option <strong>Développement Web et Dispositifs Interactifs</strong>, où j'ai pu approfondir mes compétences en développement, modélisation 3D et création de contenu.
                </p>
                <p className="text-gray-300 leading-relaxed">
                  Mon objectif à terme est de créer ou rejoindre un studio de développement de jeux vidéo, où je pourrai mettre à profit mes compétences et créer mes propres univers.
                </p>
                
                {/* Bouton CV Vidéo */}
                <div className="mt-6">
                  <a
                    href={PORTFOLIO_CONFIG.cvVideo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white rounded-xl transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <Video size={20} />
                    Voir mon CV Vidéo
                  </a>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="bg-gray-900/50 backdrop-blur-sm border border-purple-500/30 rounded-xl p-6">
                <div className="flex items-center gap-3">
                  <Code className="text-blue-400" />
                  <h4 className="text-xl font-semibold">Développement de Jeux Vidéo & Web</h4>
                </div>
              </div>
              
              <div className="bg-gray-900/50 backdrop-blur-sm border border-purple-500/30 rounded-xl p-6">
                <div className="flex items-center gap-3">
                  <Box className="text-green-400" />
                  <h4 className="text-xl font-semibold">3D & 2D Art</h4>
                </div>
              </div>
              
              <div className="bg-gray-900/50 backdrop-blur-sm border border-purple-500/30 rounded-xl p-6">
                <div className="flex items-center gap-3">
                  <Camera className="text-yellow-400" />
                  <h4 className="text-xl font-semibold">Création de contenu</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Skills Section */}
      <section id="skills" className="py-20 relative z-10">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Compétences
          </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {PORTFOLIO_CONFIG.skills.map((skill, index) => {
              const IconComponent = skill.icon;
              return (
                <div key={index} className="bg-gray-900/50 backdrop-blur-sm border border-purple-500/30 rounded-xl p-6 hover:border-purple-400/60 transition-all duration-300 group">
                  <div className="text-center">
                    <div className="flex justify-center mb-3">
                      <IconComponent size={48} className="text-purple-400 group-hover:text-purple-300 transition-colors" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{skill.name}</h3>
                    <p className="text-sm text-purple-300 mb-4">{skill.category}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      
      {/* Portfolio Section */}
      <section id="portfolio" className="py-20 relative z-15">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
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
      <section id="experience" className="py-20 relative z-10">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Expérience Professionnelle
          </h2>
          
          <div className="space-y-8">
            {PORTFOLIO_CONFIG.experiences.map((experience) => (
              <div key={experience.id} className="bg-gray-900/50 backdrop-blur-sm border border-purple-500/30 rounded-xl p-8 hover:border-purple-400/60 transition-all duration-300">
                <div className="grid md:grid-cols-3 gap-6">
                  {/* Info principale */}
                  <div className="md:col-span-2">
                    <div className="flex flex-wrap items-start gap-4 mb-1">
                      <div className="flex items-center gap-3">
                        <Briefcase className="text-purple-400" size={20} />
                        <h3 className="text-2xl font-bold text-white">{experience.role}</h3>
                      </div>
                      <div className="flex mt-2 items-top gap-3 text-purple-300">
                        <MapPin size={16} />
                        <span className="font-semibold">{experience.company}</span>
                        
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-4 text-gray-300">
                      <Calendar size={16} />
                      <span>{experience.period}</span>
                    </div>
                    
                    <p className="text-gray-300 mb-6 leading-relaxed">
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
                      <h4 className="text-lg font-semibold mb-3 text-purple-300">Compétences utilisées</h4>
                      <div className="flex flex-wrap gap-2">
                        {experience.technologies.map((tech, techIndex) => (
                          <span key={techIndex} className="px-3 py-1 bg-purple-600/20 border border-purple-500/30 text-purple-300 rounded-full text-sm">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Réalisations */}
                  <div className="md:col-span-1">
                    <h4 className="text-lg font-semibold mb-4 text-purple-300 flex items-center gap-2">
                      <CheckCircle size={18} />
                      Réalisations clés
                    </h4>
                    <ul className="space-y-3">
                      {experience.achievements.map((achievement, achIndex) => (
                        <li key={achIndex} className="flex items-start gap-2 text-gray-300">
                          <div className="w-2 h-2 bg-purple-400 mt-2 flex-shrink-0"></div>
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
      
      {/* Contact Section */}
      <section id="contact" className="py-20 relative z-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Contactez-moi
            </h2>
            <p className="text-xl text-gray-300 mb-12">
              Prêt à collaborer sur votre prochain projet ? Parlons-en !
            </p>
          </div>
          
          {/* Carousel Instagram */}
          <InstagramCarousel />
          
          {/* Boutons de contact */}
          <div className="flex flex-wrap justify-center gap-4 sm:gap-8 mb-12">
            <a 
              href={`mailto:${PORTFOLIO_CONFIG.email}`}
              className="flex items-center gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-purple-600 hover:bg-purple-500 rounded-xl transition-colors text-base sm:text-lg"
            >
              <Mail size={20} className="sm:hidden" />
              <Mail size={24} className="hidden sm:block" />
              Email
            </a>
            <a 
              href={PORTFOLIO_CONFIG.linkedin}
              className="flex items-center gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-blue-600 hover:bg-blue-500 rounded-xl transition-colors text-base sm:text-lg"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Linkedin size={20} className="sm:hidden" />
              <Linkedin size={24} className="hidden sm:block" />
              LinkedIn
            </a>
            <a 
              href={PORTFOLIO_CONFIG.cvVideo}
              className="flex items-center gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 rounded-xl transition-colors text-base sm:text-lg text-white font-semibold"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Video size={20} className="sm:hidden" />
              <Video size={24} className="hidden sm:block" />
              CV Vidéo
            </a>
            <a 
              href={PORTFOLIO_CONFIG.github}
              className="flex items-center gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-gray-800 hover:bg-gray-700 rounded-xl transition-colors text-base sm:text-lg"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github size={20} className="sm:hidden" />
              <Github size={24} className="hidden sm:block" />
              GitHub
            </a>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-8 text-center border-t border-purple-500/30 relative z-10">
        <p className="text-gray-400">
          © 2025 {PORTFOLIO_CONFIG.name}. Tous droits réservés. | Développé avec ❤️ par <a href={PORTFOLIO_CONFIG.github} className="text-purple-400 hover:underline" target="_blank" rel="noopener noreferrer">{PORTFOLIO_CONFIG.name}</a> avec React, Typescript, TailwindCSS et Three.JS
        </p>
      </footer>
    </div>
  );
};

export default Portfolio;