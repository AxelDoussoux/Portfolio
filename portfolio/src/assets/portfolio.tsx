import React, { useState, useEffect } from 'react';
import { ChevronDown, Github, Mail, Linkedin, Code, Gamepad2, Box, Zap } from 'lucide-react';
import PORTFOLIO_CONFIG from './portfolioData';
import GalaxyBackground from './galaxyBackground'; // Import du composant pour l'arrière-plan 3D animé
import ProjectCard from './projectCard'; // Import du composant pour les cartes de projet

// Composant principal
const Portfolio: React.FC = () => {
  const [activeSection, setActiveSection] = useState('hero');
  
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'about', 'skills', 'portfolio', 'contact'];
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
  
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };
    return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white relative overflow-x-hidden">
      {/* Arrière-plan galaxie 3D */}
      <GalaxyBackground />
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-md border-b border-purple-500/30">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              {PORTFOLIO_CONFIG.name}
            </div>
            
            <div className="hidden md:flex space-x-8">
              {['hero', 'about', 'skills', 'portfolio', 'contact'].map((section) => (
                <button
                  key={section}
                  onClick={() => scrollToSection(section)}
                  className={`capitalize transition-colors ${
                    activeSection === section ? 'text-purple-400' : 'text-gray-300 hover:text-white'
                  }`}
                >
                  {section === 'hero' ? 'Accueil' : section === 'about' ? 'À propos' : section === 'skills' ? 'Compétences' : section === 'portfolio' ? 'Portfolio' : 'Contact'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>
      
      {/* Hero Section */}
      <section id="hero" className="min-h-screen flex items-center justify-center relative z-10">
        <div className="text-center max-w-4xl mx-auto px-6">
          <div className="mb-8">
            <div className="w-32 h-32 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mx-auto mb-6 flex items-center justify-center text-6xl">
              🎮
            </div>
            <h1 className="text-6xl md:text-8xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-blue-400 to-purple-600 bg-clip-text text-transparent animate-pulse">
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
                  Depuis plus de 2 ans, je développe des expériences interactives immersives. Ma passion pour les jeux vidéo et la modélisation 3D m'a mené à maîtriser les outils les plus avancés de l'industrie.
                </p>
                <p className="text-gray-300 leading-relaxed">
                  J'aime créer des univers qui captivent et inspirent, en alliant technique et créativité pour donner vie à des concepts uniques.
                </p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="bg-gray-900/50 backdrop-blur-sm border border-purple-500/30 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Code className="text-blue-400" />
                  <h4 className="text-xl font-semibold">Développement & Web</h4>
                </div>
                <p className="text-gray-300">Unity, C#, TypeScript, React, Three.js, Pixi.js</p>
              </div>
              
              <div className="bg-gray-900/50 backdrop-blur-sm border border-purple-500/30 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Box className="text-green-400" />
                  <h4 className="text-xl font-semibold">3D & 2D Art</h4>
                </div>
                <p className="text-gray-300">Blender, Unreal Engine, Krita</p>
              </div>
              
              <div className="bg-gray-900/50 backdrop-blur-sm border border-purple-500/30 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Zap className="text-yellow-400" />
                  <h4 className="text-xl font-semibold">Création de contenu</h4>
                </div>
                <p className="text-gray-300">Adobe Suite, DaVinci Resolve, Photo & Vidéo</p>
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
      <section id="portfolio" className="py-20 relative z-10">
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
      
      {/* Contact Section */}
      <section id="contact" className="py-20 relative z-10">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Contactez-moi
          </h2>
          <p className="text-xl text-gray-300 mb-12">
            Prêt à collaborer sur votre prochain projet ? Parlons-en !
          </p>
          
          <div className="flex justify-center gap-8 mb-12">
            <a 
              href={`mailto:${PORTFOLIO_CONFIG.email}`}
              className="flex items-center gap-3 px-8 py-4 bg-purple-600 hover:bg-purple-500 rounded-xl transition-colors text-lg"
            >
              <Mail size={24} />
              Email
            </a>
            <a 
              href={PORTFOLIO_CONFIG.linkedin}
              className="flex items-center gap-3 px-8 py-4 bg-blue-600 hover:bg-blue-500 rounded-xl transition-colors text-lg"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Linkedin size={24} />
              LinkedIn
            </a>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-8 text-center border-t border-purple-500/30 relative z-10">
        <p className="text-gray-400">
          © 2025 {PORTFOLIO_CONFIG.name}. Tous droits réservés. | Développé avec ❤️ par <a href={PORTFOLIO_CONFIG.github} className="text-purple-400 hover:underline" target="_blank" rel="noopener noreferrer">{PORTFOLIO_CONFIG.name}</a>
        </p>
      </footer>
    </div>
  );
};

export default Portfolio;