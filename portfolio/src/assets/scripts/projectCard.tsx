import React, { useRef, useState } from "react";
import { createPortal } from "react-dom";
import type PORTFOLIO_CONFIG from "./portfolioData";
import { ExternalLink, Eye, Pause, Play, Star, X, Calendar, Code2, Users, Plus, Github } from "lucide-react";

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
  const videoRef = useRef<HTMLVideoElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const dialogTitleId = `project-modal-title-${project.id}`;
  
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
      className="fixed inset-0 bg-[#5A4630]/35 backdrop-blur-sm z-[1000] flex items-center justify-center p-4"
      onClick={handleBackdropClick}
      role="presentation"
    >
      <div 
        className="bg-[#FEFAE0]/96 rounded-2xl max-w-5xl w-full max-h-[85vh] overflow-y-auto border border-[#E7C8A0]/75"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby={dialogTitleId}
      >
        {/* Header */}
        <div className="flex justify-between items-start p-6 border-b border-[#E7C8A0]/80">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h2 id={dialogTitleId} className="text-2xl font-bold text-[#5A4630]">{project.title}</h2>
              {project.featured && (
                <div className="bg-[#D4A373] text-[#2f2418] px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                  <Star size={12} />
                  Featured
                </div>
              )}
            </div>
            <p className="text-[#6F5A43]">{project.description}</p>
          </div>
          <button
            onClick={onClose}
            className="text-[#7A6148] hover:text-[#5A4630] transition-colors p-2 rounded-full hover:bg-[#FAEDCD]"
            aria-label="Fermer la modal"
          >
            <X size={24} />
          </button>
        </div>

        {/* Media Section */}
        <div className="p-6">
          <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-6 bg-[#FAEDCD]/75 border border-[#E7C8A0]/75">
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
                    className="w-full h-full object-contain bg-[#FAEDCD]"
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
              <img src={project.image} alt={project.title} className="w-full h-full object-cover bg-[#FAEDCD] group-hover:scale-105 transition-transform duration-500" />
            )}
            
            {project.video && (
              <button
                onClick={toggleVideo}
                type="button"
                className="absolute top-4 left-4 bg-[#D4A373]/90 hover:bg-[#E7C8A0] text-[#2f2418] p-2 rounded-full transition-all duration-300"
                aria-label={showVideo ? 'Afficher l\'image du projet' : 'Afficher la video du projet'}
              >
                {showVideo ? <Eye size={20} /> : <Play size={20} />}
              </button>
            )}
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Technologies & Skills */}
            <div>
              <h3 className="text-lg font-semibold text-[#5A4630] mb-3 flex items-center gap-2">
                <Code2 size={20} className="text-[#D4A373]" />
                Technologies utilisées
              </h3>
              <div className="flex flex-wrap gap-2 mb-6">
                {project.technologies.map((tech, i) => (
                  <span key={i} className="px-3 py-1 bg-[#E9EDC9] border border-[#CCD5AE] text-[#5A4630] text-sm rounded-full">
                    {tech}
                  </span>
                ))}
              </div>

              {/* Project Info */}
              <h3 className="text-lg font-semibold text-[#5A4630] mb-3 flex items-center gap-2">
                <Calendar size={20} className="text-[#D4A373]" />
                Informations du projet
              </h3>
              <div className="space-y-2 text-[#6F5A43]">
                <p><span className="text-[#7A6148]">Année :</span> {project.year || "2025"}</p>
                <p><span className="text-[#7A6148]">Durée :</span> {project.duration || "2-3 mois"}</p>
                <p><span className="text-[#7A6148]">Type :</span> {project.type || "Projet personnel"}</p>
                <p><span className="text-[#7A6148]">Statut :</span> {project.status || "Terminé"}</p>
              </div>
              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 mt-8 pt-6">
                {project.github && (
                  <a
                    href={project.github}
                    className="flex items-center gap-2 px-6 py-3 bg-[#5A4630] hover:bg-[#4A3828] text-[#FEFAE0] rounded-lg transition-colors flex-1 justify-center"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Github size={20} />
                    Voir le code
                  </a>
                )}
                {project.demo && (
                  <a
                    href={project.demo}
                    className="flex items-center gap-2 px-6 py-3 bg-[#D4A373] hover:bg-[#E7C8A0] text-[#2f2418] rounded-lg transition-colors flex-1 justify-center font-semibold"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink size={20} />
                    Voir la démo
                  </a>
                )}
              </div>
            </div>

            {/* Features & Challenges */}
            <div>
              <h3 className="text-lg font-semibold text-[#5A4630] mb-3 flex items-center gap-2">
                <Users size={20} className="text-[#D4A373]" />
                Fonctionnalités principales
              </h3>
              <ul className="space-y-2 text-[#6F5A43] mb-6">
                {(project.features || [
                  "Interface utilisateur intuitive",
                  "Performance optimisée",
                  "Design responsive",
                  "Intégration d'APIs"
                ]).map((feature, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-[#D4A373] rounded-full"></div>
                    {feature}
                  </li>
                ))}
              </ul>

              <h3 className="text-lg font-semibold text-[#5A4630] mb-3">Défis relevés</h3>
              <p className="text-[#6F5A43] text-sm leading-relaxed">
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
    // Ouvrir la modal seulement si le projet est Featured
    if (project.featured) {
      setIsModalOpen(true);
    }
  };

  return (
    <>
      <div 
        className={`group relative h-full bg-[#FEFAE0]/92 backdrop-blur-sm border border-[#E7C8A0]/80 rounded-xl overflow-hidden hover:border-[#D4A373] transition-all duration-500 ${project.featured ? 'cursor-pointer' : ''} flex flex-col`}
        onClick={handleCardClick}
      >
        <div className="relative aspect-video overflow-hidden flex-shrink-0 bg-[#FAEDCD]/80">
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
                  className="w-full h-full object-contain bg-[#FAEDCD]"
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
            <img src={project.image} alt={project.title} className="w-full h-full object-cover bg-[#FAEDCD] group-hover:scale-105 transition-transform duration-500" />
          )}
          
          <div className="absolute inset-0 bg-gradient-to-t from-[#5A4630]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {project.video && (
            <button
              onClick={toggleVideo}
              type="button"
              className="absolute top-4 left-4 bg-[#D4A373]/90 hover:bg-[#E7C8A0] text-[#2f2418] p-2 rounded-full transition-all duration-300 opacity-100 md:opacity-0 md:group-hover:opacity-100"
              aria-label={showVideo ? 'Afficher l\'image du projet' : 'Afficher la video du projet'}
            >
              {showVideo ? <Eye size={20} /> : <Play size={20} />}
            </button>
          )}
          
          {/* Icône Plus seulement pour les projets Featured */}
          {project.featured && (
            <div className="absolute bottom-4 right-4 bg-[#D4A373]/90 hover:bg-[#E7C8A0] text-[#2f2418] p-2 rounded-full transition-all duration-300 opacity-100 md:opacity-0 md:group-hover:opacity-100" aria-hidden="true">
              <Plus size={16} />
            </div>
          )}
          
          <div className={`absolute bottom-4 left-4 ${project.featured ? 'right-16' : 'right-4'} opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300`}>
            <div className="flex gap-2 mb-2">
              {project.technologies.slice(0, 3).map((tech, i) => (
                <span key={i} className="px-2 py-1 bg-[#E7C8A0]/95 text-xs rounded-full text-[#4A3828] font-medium backdrop-blur-sm">
                  {tech}
                </span>
              ))}
              {project.technologies.length > 3 && (
                <span className="px-2 py-1 bg-[#E7C8A0]/95 text-xs rounded-full text-[#4A3828] font-medium backdrop-blur-sm">
                  +{project.technologies.length - 3} autres
                </span>
              )}
            </div>
          </div>
          
          {/* Badge Featured */}
          {project.featured && (
            <div className="absolute top-4 right-4 bg-[#D4A373] text-[#2f2418] px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
              <Star size={12} />
              Featured
            </div>
          )}
        </div>
        
        <div className="p-5 sm:p-6 flex flex-col flex-grow">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-bold text-[#5A4630] group-hover:text-[#7A6148] transition-colors flex-1">
              {project.title}
            </h3>

          </div>
          <p className="text-[#6F5A43] mb-4 leading-relaxed line-clamp-2 flex-grow">{project.description}</p>
          
          <div className="flex justify-between items-end mt-auto">
            <div className="flex gap-3">
              {project.featured && (
                <button
                  type="button"
                  className="flex items-center gap-2 px-4 py-2 bg-[#5A4630] hover:bg-[#4A3828] text-[#FEFAE0] rounded-lg transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsModalOpen(true);
                  }}
                  aria-label={`Ouvrir le detail du projet ${project.title}`}
                >
                  <Plus size={16} />
                  Details
                </button>
              )}
              {project.github && (
                <a
                  href={project.github}
                  className="flex items-center gap-2 px-4 py-2 bg-[#5A4630] hover:bg-[#4A3828] text-[#FEFAE0] rounded-lg transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Github size={16} />
                  Code
                </a>
              )}
              {project.demo && (
                <a
                  href={project.demo}
                  className="flex items-center gap-2 px-4 py-2 bg-[#D4A373] hover:bg-[#E7C8A0] text-[#2f2418] rounded-lg transition-colors font-semibold"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ExternalLink size={16} />
                  Demo
                </a>
              )}
            </div>
            
            {/* Badge Année - aligné avec les boutons */}
            <div className="bg-[#E9EDC9] text-[#5A4630] rounded-full px-3 py-1 text-xs font-semibold border border-[#CCD5AE]/90">
              {project.year}
            </div>
          </div>
        </div>
      </div>

      {/* Modal seulement pour les projets Featured */}
      {project.featured && (
        <ProjectModal 
          project={project} 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
        />
      )}
    </>
  );
};

export default ProjectCard;