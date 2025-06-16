import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { ChevronDown, Github, ExternalLink, Mail, Linkedin, Play, Pause, Code, Gamepad2, Box, Zap, Star, Eye } from 'lucide-react';
import PORTFOLIO_CONFIG from './portfolioData';

// Composant pour l'arrière-plan 3D animé - Galaxie spirale améliorée
const GalaxyBackground: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animationRef = useRef<number>(0);

  useEffect(() => {
    if (!mountRef.current) return;

    // Configuration de la scène
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x000000, 10, 100); // Effet de brouillard pour la profondeur
    
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: true,
      powerPreference: "high-performance"
    });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    mountRef.current.appendChild(renderer.domElement);

    sceneRef.current = scene;
    rendererRef.current = renderer;

    // Création de la galaxie spirale
    const galaxyGeometry = new THREE.BufferGeometry();

    // Paramètres de la galaxie spirale améliorée
    const particlesCount = 50000;
    const positions = new Float32Array(particlesCount * 3);
    const colors = new Float32Array(particlesCount * 3);
    const scales = new Float32Array(particlesCount);
    const randomness = new Float32Array(particlesCount);    // Couleurs pour la galaxie (adaptées au thème du site)
    const colorCore = new THREE.Color('#ffffff'); // Centre blanc brillant
    const colorArm1 = new THREE.Color('#a855f7'); // purple-500
    const colorArm2 = new THREE.Color('#8b5cf6'); // purple-400
    const colorArm3 = new THREE.Color('#60a5fa'); // blue-400
    const colorOuter = new THREE.Color('#6366f1'); // indigo-500 (transition)
    const colorDust = new THREE.Color('#c084fc'); // purple-300 (poussière d'étoiles)

    // Paramètres de la spirale
    const arms = 3;
    const spin = 3;
    const randomnessPower = 3;
    const insideRadius = 1.5;
    const outsideRadius = 15;

    for (let i = 0; i < particlesCount; i++) {
      const i3 = i * 3;

      // Position en spirale logarithmique
      const radius = Math.random() * outsideRadius + insideRadius;
      const spinAngle = radius * spin;
      const branchAngle = (i % arms) / arms * Math.PI * 2;

      // Randomness plus prononcé pour les bras
      const randomX = Math.pow(Math.random(), randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * randomnessPower * radius * 0.1;
      const randomY = Math.pow(Math.random(), randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * randomnessPower * radius * 0.05;
      const randomZ = Math.pow(Math.random(), randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * randomnessPower * radius * 0.1;

      positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
      positions[i3 + 1] = randomY;
      positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;

      // Couleurs plus complexes et brillantes
      let mixedColor = new THREE.Color();
      const distanceFromCenter = radius / outsideRadius;
      
      // Couleur en fonction du bras et de la distance
      const armIndex = i % arms;
      if (armIndex === 0) {
        mixedColor = colorArm1.clone();
      } else if (armIndex === 1) {
        mixedColor = colorArm2.clone();
      } else if (armIndex === 2) {
        mixedColor = colorArm3.clone();
      } else {
        mixedColor = colorDust.clone();
      }

      // Mélange avec le centre et l'extérieur
      if (distanceFromCenter < 0.1) {
        mixedColor.lerp(colorCore, 1 - distanceFromCenter * 10);
      } else if (distanceFromCenter > 0.7) {
        mixedColor.lerp(colorOuter, (distanceFromCenter - 0.7) / 0.3);
      }      // Réduction de la luminosité pour améliorer la lisibilité
      mixedColor.multiplyScalar(0.6 + Math.random() * 0.3);

      colors[i3] = mixedColor.r;
      colors[i3 + 1] = mixedColor.g;
      colors[i3 + 2] = mixedColor.b;      // Échelle variable réduite pour créer de la diversité sans gêner la lisibilité
      scales[i] = Math.random() * 1.2 + 0.3;
      randomness[i] = Math.random();
    }

    galaxyGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    galaxyGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    galaxyGeometry.setAttribute('aScale', new THREE.BufferAttribute(scales, 1));
    galaxyGeometry.setAttribute('aRandomness', new THREE.BufferAttribute(randomness, 1));

    // Shader material amélioré avec effet de profondeur et brillance
    const vertexShader = `
      uniform float uTime;
      uniform float uSize;
      attribute float aScale;
      attribute float aRandomness;
      varying vec3 vColor;
      varying float vDistance;
      varying float vRandomness;

      void main() {
        vec4 modelPosition = modelMatrix * vec4(position, 1.0);
        
        // Rotation différentielle de la galaxie (plus réaliste)
        float angle = atan(modelPosition.x, modelPosition.z);
        float distanceToCenter = length(modelPosition.xz);
        float rotationSpeed = (1.0 / (distanceToCenter + 1.0)) * 0.3;
        float angleOffset = rotationSpeed * uTime;
        
        modelPosition.x = cos(angle + angleOffset) * distanceToCenter;
        modelPosition.z = sin(angle + angleOffset) * distanceToCenter;
        
        // Oscillation verticale subtile
        modelPosition.y += sin(uTime * 0.5 + aRandomness * 10.0) * 0.2;
        
        vec4 viewPosition = viewMatrix * modelPosition;
        vec4 projectedPosition = projectionMatrix * viewPosition;
        
        gl_Position = projectedPosition;
        
        // Taille basée sur la distance et l'échelle
        float sizeAttenuation = 1.0 / -viewPosition.z;
        gl_PointSize = uSize * aScale * sizeAttenuation * (0.5 + aRandomness * 0.5);
        
        vColor = color;
        vDistance = -viewPosition.z;
        vRandomness = aRandomness;
      }
    `;

    const fragmentShader = `
      varying vec3 vColor;
      varying float vDistance;
      varying float vRandomness;
      uniform float uTime;
      
      void main() {
        // Forme circulaire avec glow
        vec2 uv = gl_PointCoord - 0.5;
        float distance = length(uv);
          // Glow effect plus subtil pour la lisibilité
        float strength = 1.0 - distance;
        strength = pow(strength, 1.5);
        
        // Scintillement des étoiles plus discret
        float twinkle = sin(uTime * 2.0 + vRandomness * 15.0) * 0.05 + 0.8;
        
        // Effet de profondeur (flou)
        float depthFade = smoothstep(30.0, 15.0, vDistance);
        
        // Intensité finale plus douce
        float alpha = strength * twinkle * depthFade * 0.7;
        
        // Couleur finale moins brillante
        vec3 finalColor = vColor * (0.8 + strength * 0.2);
        
        gl_FragColor = vec4(finalColor, alpha);
      }
    `;    const galaxyMaterialShader = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uSize: { value: 35 * renderer.getPixelRatio() } // Taille réduite
      },
      vertexShader,
      fragmentShader,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      vertexColors: true
    });

    const galaxy = new THREE.Points(galaxyGeometry, galaxyMaterialShader);
    scene.add(galaxy);

    // Position de la caméra optimisée
    camera.position.set(12, 8, 12);
    camera.lookAt(0, 0, 0);

    // Animation améliorée
    const clock = new THREE.Clock();
    
    const animate = () => {
      const elapsedTime = clock.getElapsedTime();
      
      // Mise à jour du shader
      galaxyMaterialShader.uniforms.uTime.value = elapsedTime;
      
      // Rotation lente et fluide de la galaxie
      galaxy.rotation.y = elapsedTime * 0.05;
      galaxy.rotation.x = Math.sin(elapsedTime * 0.02) * 0.1;
      
      // Mouvement de caméra plus dynamique
      const radius = 10 + Math.sin(elapsedTime * 0.1) * 2;
      camera.position.x = Math.cos(elapsedTime * 0.05) * radius;
      camera.position.z = Math.sin(elapsedTime * 0.05) * radius;
      camera.position.y = 8 + Math.sin(elapsedTime * 0.03) * 3;
      camera.lookAt(0, 0, 0);
      
      renderer.render(scene, camera);
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Gestion du redimensionnement
    const handleResize = () => {
      if (!rendererRef.current) return;
      
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      rendererRef.current.setSize(window.innerWidth, window.innerHeight);
      rendererRef.current.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        // Mise à jour de la taille des particules (réduite)
      galaxyMaterialShader.uniforms.uSize.value = 35 * rendererRef.current.getPixelRatio();
    };

    window.addEventListener('resize', handleResize);

    // Nettoyage
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      galaxyGeometry.dispose();
      galaxyMaterialShader.dispose();
      renderer.dispose();
    };
  }, []);
  return (
    <div 
      ref={mountRef} 
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ background: 'radial-gradient(ellipse at center, #1e1b4b 0%, #111827 50%, #000000 100%)', opacity: 0.8 }}
    />
  );
};


// Composant pour les projets avec media
const ProjectCard: React.FC<{ project: typeof PORTFOLIO_CONFIG.projects[0] }> = ({ project }) => {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const toggleVideo = () => {
    if (project.video) {
      setShowVideo(!showVideo);
      if (!showVideo) {
        setIsVideoPlaying(true);
      }
    }
  };
  
  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isVideoPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsVideoPlaying(!isVideoPlaying);
    }
  };
  
  return (
    <div className={`group relative bg-gray-900/50 backdrop-blur-sm border border-purple-500/30 rounded-xl overflow-hidden hover:border-purple-400/60 transition-all duration-500 ${project.featured ? 'lg:col-span-2' : ''}`}>
      <div className="relative aspect-video overflow-hidden">
        {showVideo && project.video ? (
          <div className="relative">
            <video
              ref={videoRef}
              src={project.video}
              className="w-full h-full object-cover"
              loop
              muted
              autoPlay
            />
            <button
              onClick={togglePlayPause}
              className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
            >
              {isVideoPlaying ? <Pause size={20} /> : <Play size={20} />}
            </button>
          </div>
        ) : (
          <img src={project.image} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {project.video && (
          <button
            onClick={toggleVideo}
            className="absolute top-4 left-4 bg-purple-600/80 hover:bg-purple-500 text-white p-2 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100"
          >
            {showVideo ? <Eye size={20} /> : <Play size={20} />}
          </button>
        )}
        
        <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex gap-2 mb-2">
            {project.technologies.map((tech, i) => (
              <span key={i} className="px-2 py-1 bg-purple-600/80 text-xs rounded-full backdrop-blur-sm">
                {tech}
              </span>
            ))}
          </div>
        </div>
        
        {project.featured && (
          <div className="absolute top-4 right-4 bg-yellow-500 text-black px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
            <Star size={12} />
            Featured
          </div>
        )}
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2 text-white group-hover:text-purple-300 transition-colors">
          {project.title}
        </h3>
        <p className="text-gray-300 mb-4 leading-relaxed">{project.description}</p>
        
        <div className="flex gap-3">
          {project.github && (
            <a
              href={project.github}
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github size={16} />
              Code
            </a>
          )}
          {project.demo && (
            <a
              href={project.demo}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink size={16} />
              Demo
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

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
                  Passion Gaming & 3D
                </h3>
                <p className="text-gray-300 leading-relaxed mb-6">
                  Depuis plus de 2 ans, je développe des expériences interactives immersives. Ma passion pour les jeux vidéo et la modélisation 3D m'a mené à maîtriser les outils les plus avancés de l'industrie.
                </p>
                <p className="text-gray-300 leading-relaxed">
                  J'aime créer des mondes virtuels qui captivent et inspirent, en alliant technique et créativité pour donner vie à des concepts uniques.
                </p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="bg-gray-900/50 backdrop-blur-sm border border-purple-500/30 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Code className="text-blue-400" />
                  <h4 className="text-xl font-semibold">Développement</h4>
                </div>
                <p className="text-gray-300">Unity, C#, TypeScript</p>
              </div>
              
              <div className="bg-gray-900/50 backdrop-blur-sm border border-purple-500/30 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Box className="text-green-400" />
                  <h4 className="text-xl font-semibold">Modélisation 3D</h4>
                </div>
                <p className="text-gray-300">Blender, Unreal Engine</p>
              </div>
              
              <div className="bg-gray-900/50 backdrop-blur-sm border border-purple-500/30 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Zap className="text-yellow-400" />
                  <h4 className="text-xl font-semibold">Technologies Web</h4>
                </div>
                <p className="text-gray-300">React, Three.js, WebGL, Symfony</p>
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
            {PORTFOLIO_CONFIG.skills.map((skill, index) => (
              <div key={index} className="bg-gray-900/50 backdrop-blur-sm border border-purple-500/30 rounded-xl p-6 hover:border-purple-400/60 transition-all duration-300 group">
                <div className="text-center">
                  <div className="text-4xl mb-3">{skill.icon}</div>
                  <h3 className="text-lg font-semibold mb-2">{skill.name}</h3>
                  <p className="text-sm text-purple-300 mb-4">{skill.category}</p>
                </div>
              </div>
            ))}
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