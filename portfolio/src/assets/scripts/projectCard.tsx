import React, { useRef, useState } from "react";
import { createPortal } from "react-dom";
import type PORTFOLIO_CONFIG from "./portfolioData";
import {
  FiChevronLeft as ChevronLeft,
  FiChevronRight as ChevronRight,
  FiExternalLink as ExternalLink,
  FiEye as Eye,
  FiPause as Pause,
  FiPlay as Play,
  FiX as X,
  FiCalendar as Calendar,
  FiCode as Code2,
  FiUsers as Users,
  FiPlus as Plus,
  FiGithub as Github,
} from "react-icons/fi";

// Fonction pour convertir une URL YouTube en URL embed
const getYouTubeEmbedUrl = (url: string): string | null => {
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(regex);
  if (match && match[1]) {
    return `https://www.youtube.com/embed/${match[1]}?autoplay=1&mute=1&loop=1&playlist=${match[1]}`;
  }
  return null;
};

// Fonction pour vérifier si c'est une URL YouTube
const isYouTubeUrl = (url: string): boolean => {
  return url.includes('youtube.com') || url.includes('youtu.be');
};

// Composant Modal
const ProjectModal: React.FC<{ 
  project: typeof PORTFOLIO_CONFIG.projects[0]; 
  isOpen: boolean; 
  onClose: () => void; 
}> = ({ project, isOpen, onClose }) => {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [carouselResetKey, setCarouselResetKey] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const dialogTitleId = `project-modal-title-${project.id}`;
  const projectImages = project.images.length > 0 ? project.images : [project.image];
  const hasImageCarousel = projectImages.length > 1;
  
  const isYouTube = project.video && isYouTubeUrl(project.video);
  const youtubeEmbedUrl = isYouTube ? getYouTubeEmbedUrl(project.video!) : null;

  // Empêcher le scroll de la page quand la modal est ouverte
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup au démontage du composant
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  React.useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  React.useEffect(() => {
    if (!isOpen) return;
    setCurrentImageIndex(0);
    setCarouselResetKey(0);
  }, [isOpen, project.id]);

  React.useEffect(() => {
    if (!isOpen || !hasImageCarousel || showVideo) return;

    const autoSlide = window.setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % projectImages.length);
    }, 4000);

    return () => window.clearInterval(autoSlide);
  }, [isOpen, hasImageCarousel, projectImages.length, showVideo, carouselResetKey]);

  const goToImage = (index: number) => {
    const normalizedIndex = ((index % projectImages.length) + projectImages.length) % projectImages.length;
    setCurrentImageIndex(normalizedIndex);
    setCarouselResetKey((previousKey) => previousKey + 1);
  };

  const goToRelativeImage = (step: number) => {
    setCurrentImageIndex((prevIndex) => {
      const nextIndex = (prevIndex + step + projectImages.length) % projectImages.length;
      return nextIndex;
    });
    setCarouselResetKey((previousKey) => previousKey + 1);
  };

  // Gérer le clic sur le backdrop pour fermer la modal
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const toggleVideo = () => {
    if (project.video) {
      setShowVideo(!showVideo);
      if (!showVideo) {
        setIsVideoPlaying(true);
      }
    }
  };

  const togglePlayPause = () => {
    if (isYouTube && iframeRef.current) {
      if (isVideoPlaying) {
        iframeRef.current.src = youtubeEmbedUrl!.replace('autoplay=1', 'autoplay=0');
      } else {
        iframeRef.current.src = youtubeEmbedUrl!;
      }
      setIsVideoPlaying(!isVideoPlaying);
    } else if (videoRef.current) {
      if (isVideoPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsVideoPlaying(!isVideoPlaying);
    }
  };

  if (!isOpen) return null;

  const modalContent = (
    <div 
      className="fixed inset-0 bg-[#2F2352]/35 backdrop-blur-sm z-[1000] flex items-center justify-center p-4"
      onClick={handleBackdropClick}
      role="presentation"
    >
      <div 
        className="bg-white/78 backdrop-blur-xl rounded-2xl max-w-5xl w-full max-h-[85vh] overflow-y-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden border border-white/85 shadow-[0_20px_52px_rgba(71,56,107,0.12)]"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby={dialogTitleId}
      >
        {/* Header */}
        <div className="flex justify-between items-start p-6 border-b border-[#BE99FF]/80">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h2 id={dialogTitleId} className="text-2xl font-bold text-[#2F2352]">{project.title}</h2>
            </div>
            <p className="text-[#47386B]">{project.description}</p>
          </div>
          <button
            onClick={onClose}
            className="text-[#5A4690] hover:text-[#2F2352] transition-colors p-2 rounded-full hover:bg-[#C9DCFF]"
            aria-label="Fermer la modal"
          >
            <X size={24} />
          </button>
        </div>

        {/* Media Section */}
        <div className="p-6">
          <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-6 bg-[#C9DCFF]/75 border border-[#BE99FF]/75">
            {showVideo && project.video ? (
              <div className="relative w-full h-full">
                {isYouTube && youtubeEmbedUrl ? (
                  <iframe
                    ref={iframeRef}
                    src={youtubeEmbedUrl}
                    className="w-full h-full"
                    allow="autoplay; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    frameBorder="1"
                    title={project.title}
                  />
                ) : (
                  <video
                    ref={videoRef}
                    src={project.video}
                    className="w-full h-full object-contain bg-[#C9DCFF]"
                    loop
                    muted
                    autoPlay
                  />
                )}
                <button
                  onClick={togglePlayPause}
                  type="button"
                  className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors z-10"
                  aria-label={isVideoPlaying ? 'Mettre la video en pause' : 'Lancer la video'}
                >
                  {isVideoPlaying ? <Pause size={20} /> : <Play size={20} />}
                </button>
              </div>
            ) : (
              <img
                src={projectImages[currentImageIndex]}
                alt={project.title}
                className="w-full h-full object-cover bg-[#C9DCFF] transition-transform duration-500"
              />
            )}
            
            {project.video && (
              <button
                onClick={toggleVideo}
                type="button"
                className="absolute top-4 left-4 bg-[#9D71E8]/90 hover:bg-[#BE99FF] text-[#241A42] p-2 rounded-full transition-all duration-300"
                aria-label={showVideo ? 'Afficher l\'image du projet' : 'Afficher la video du projet'}
              >
                {showVideo ? <Eye size={20} /> : <Play size={20} />}
              </button>
            )}

            {hasImageCarousel && !showVideo && (
              <>
                <button
                  type="button"
                  onClick={() => goToRelativeImage(-1)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 z-10 inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/70 hover:bg-white text-[#2F2352] border border-white/80 transition-colors"
                  aria-label={`Image précédente du projet ${project.title}`}
                >
                  <ChevronLeft size={16} />
                </button>

                <button
                  type="button"
                  onClick={() => goToRelativeImage(1)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-10 inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/70 hover:bg-white text-[#2F2352] border border-white/80 transition-colors"
                  aria-label={`Image suivante du projet ${project.title}`}
                >
                  <ChevronRight size={16} />
                </button>

                <div className="absolute bottom-3 right-3 z-10 flex items-center gap-1.5">
                  {projectImages.map((_, index) => (
                    <button
                      key={`${project.id}-modal-dot-${index}`}
                      type="button"
                      onClick={() => goToImage(index)}
                      className={`h-2 rounded-full transition-all ${
                        currentImageIndex === index
                          ? 'w-5 bg-[#9D71E8]'
                          : 'w-2 bg-white/75 hover:bg-white'
                      }`}
                      aria-label={`Afficher l'image ${index + 1} du projet ${project.title}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Technologies & Skills */}
            <div>
              <h3 className="text-lg font-semibold text-[#2F2352] mb-3 flex items-center gap-2">
                <Code2 size={20} className="text-[#9D71E8]" />
                Technologies utilisées
              </h3>
              <div className="flex flex-wrap gap-2 mb-6">
                {project.technologies.map((tech, i) => (
                  <span key={i} className="px-3 py-1 bg-[#B2C9FF] border border-[#BE99FF] text-[#2F2352] text-sm rounded-full">
                    {tech}
                  </span>
                ))}
              </div>

              {/* Project Info */}
              <h3 className="text-lg font-semibold text-[#2F2352] mb-3 flex items-center gap-2">
                <Calendar size={20} className="text-[#9D71E8]" />
                Informations du projet
              </h3>
              <div className="space-y-2 text-[#47386B]">
                <p><span className="text-[#5A4690]">Année :</span> {project.year || "2025"}</p>
                <p><span className="text-[#5A4690]">Durée :</span> {project.duration || "2-3 mois"}</p>
                <p><span className="text-[#5A4690]">Type :</span> {project.type || "Projet personnel"}</p>
                <p><span className="text-[#5A4690]">Statut :</span> {project.status || "Terminé"}</p>
              </div>
              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 mt-8 pt-6">
                {project.github && (
                  <a
                    href={project.github}
                    className="inline-flex items-center justify-center w-11 h-11 bg-[#2F2352] hover:bg-[#35275B] text-[#F2F7FF] rounded-lg transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Voir le code source du projet ${project.title}`}
                  >
                    <Github size={20} />
                  </a>
                )}
                {project.demo && (
                  <a
                    href={project.demo}
                    className="inline-flex items-center justify-center w-11 h-11 bg-[#9D71E8] hover:bg-[#BE99FF] text-[#241A42] rounded-lg transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Ouvrir la démo du projet ${project.title}`}
                  >
                    <ExternalLink size={20} />
                  </a>
                )}
              </div>
            </div>

            {/* Features & Challenges */}
            <div>
              <h3 className="text-lg font-semibold text-[#2F2352] mb-3 flex items-center gap-2">
                <Users size={20} className="text-[#9D71E8]" />
                Fonctionnalités principales
              </h3>
              <ul className="space-y-2 text-[#47386B] mb-6">
                {(project.features || [
                  "Interface utilisateur intuitive",
                  "Performance optimisée",
                  "Design responsive",
                  "Intégration d'APIs"
                ]).map((feature, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-[#9D71E8] rounded-full"></div>
                    {feature}
                  </li>
                ))}
              </ul>

              <h3 className="text-lg font-semibold text-[#2F2352] mb-3">Défis relevés</h3>
              <p className="text-[#47386B] text-sm leading-relaxed">
                {project.challenges || "Ce projet m'a permis d'approfondir mes compétences techniques et de relever plusieurs défis intéressants en matière de développement et d'optimisation."}
              </p>
            </div>
          </div>

          
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

// Composant pour les projets avec media
const ProjectCard: React.FC<{ project: typeof PORTFOLIO_CONFIG.projects[0] }> = ({ project }) => {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  
  const isYouTube = project.video && isYouTubeUrl(project.video);
  const youtubeEmbedUrl = isYouTube ? getYouTubeEmbedUrl(project.video!) : null;
  
  const toggleVideo = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (project.video) {
      setShowVideo(!showVideo);
      if (!showVideo) {
        setIsVideoPlaying(true);
      }
    }
  };
  
  const togglePlayPause = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isYouTube && iframeRef.current) {
      if (isVideoPlaying) {
        iframeRef.current.src = youtubeEmbedUrl!.replace('autoplay=1', 'autoplay=0');
      } else {
        iframeRef.current.src = youtubeEmbedUrl!;
      }
      setIsVideoPlaying(!isVideoPlaying);
    } else if (videoRef.current) {
      if (isVideoPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsVideoPlaying(!isVideoPlaying);
    }
  };

  const handleCardClick = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <div 
        className="group relative h-full bg-white/74 backdrop-blur-lg border border-white/85 rounded-xl overflow-hidden shadow-[0_14px_36px_rgba(71,56,107,0.1)] hover:border-[#9D71E8]/80 transition-all duration-500 cursor-pointer flex flex-col"
        onClick={handleCardClick}
      >
        <div className="relative aspect-video overflow-hidden flex-shrink-0 bg-[#C9DCFF]/80">
          {showVideo && project.video ? (
            <div className="relative w-full h-full">
              {isYouTube && youtubeEmbedUrl ? (
                <iframe
                  ref={iframeRef}
                  src={youtubeEmbedUrl}
                  className="w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={project.title}
                />
              ) : (
                <video
                  ref={videoRef}
                  src={project.video}
                  className="w-full h-full object-contain bg-[#C9DCFF]"
                  loop
                  muted
                  autoPlay
                />
              )}
              <button
                onClick={togglePlayPause}
                type="button"
                className="absolute top-2 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors z-10"
                aria-label={isVideoPlaying ? 'Mettre la video en pause' : 'Lancer la video'}
              >
                {isVideoPlaying ? <Pause size={20} /> : <Play size={20} />}
              </button>
            </div>
          ) : (
            <img src={project.image} alt={project.title} className="w-full h-full object-cover bg-[#C9DCFF] group-hover:scale-105 transition-transform duration-500" />
          )}
          
          <div className="absolute inset-0 bg-gradient-to-t from-[#2F2352]/8 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {project.video && (
            <button
              onClick={toggleVideo}
              type="button"
              className="absolute top-4 left-4 bg-[#9D71E8]/90 hover:bg-[#BE99FF] text-[#241A42] p-2 rounded-full transition-all duration-300 opacity-100 md:opacity-0 md:group-hover:opacity-100"
              aria-label={showVideo ? 'Afficher l\'image du projet' : 'Afficher la video du projet'}
            >
              {showVideo ? <Eye size={20} /> : <Play size={20} />}
            </button>
          )}
          
          <div className="absolute bottom-4 right-4 bg-[#9D71E8]/90 text-[#241A42] p-2 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100" aria-hidden="true">
            <Plus size={16} />
          </div>
          
          <div className="absolute bottom-4 left-4 right-16 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
            <div className="flex gap-2 mb-2">
              {project.technologies.slice(0, 3).map((tech, i) => (
                <span key={i} className="px-2 py-1 bg-[#BE99FF]/95 text-xs rounded-full text-[#35275B] font-medium backdrop-blur-sm">
                  {tech}
                </span>
              ))}
              {project.technologies.length > 3 && (
                <span className="px-2 py-1 bg-[#BE99FF]/95 text-xs rounded-full text-[#35275B] font-medium backdrop-blur-sm">
                  +{project.technologies.length - 3} autres
                </span>
              )}
            </div>
          </div>
        </div>
        
        <div className="p-5 sm:p-6 flex flex-col flex-grow">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-bold text-[#2F2352] group-hover:text-[#5A4690] transition-colors flex-1">
              {project.title}
            </h3>

          </div>
          <p className="text-[#47386B] mb-4 leading-relaxed line-clamp-2 flex-grow">{project.description}</p>
          
          <div className="flex justify-between items-end mt-auto">
            <div className="flex gap-2.5">
              {project.github && (
                <a
                  href={project.github}
                  className="inline-flex items-center justify-center w-10 h-10 bg-[#2F2352] hover:bg-[#35275B] text-[#F2F7FF] rounded-lg transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  aria-label={`Voir le code source du projet ${project.title}`}
                >
                  <Github size={16} />
                </a>
              )}
              {project.demo && (
                <a
                  href={project.demo}
                  className="inline-flex items-center justify-center w-10 h-10 bg-[#9D71E8] hover:bg-[#BE99FF] text-[#241A42] rounded-lg transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  aria-label={`Ouvrir la démo du projet ${project.title}`}
                >
                  <ExternalLink size={16} />
                </a>
              )}
            </div>
            
            {/* Badge Année - aligné avec les boutons */}
            <div className="bg-[#B2C9FF] text-[#2F2352] rounded-full px-3 py-1 text-xs font-semibold border border-[#BE99FF]/90">
              {project.year}
            </div>
          </div>
        </div>
      </div>

      <ProjectModal 
        project={project} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
};

export default ProjectCard;
