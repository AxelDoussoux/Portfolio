import React, { useRef, useState } from 'react';
import type PORTFOLIO_CONFIG from './portfolioData';
import {
  FiExternalLink as ExternalLink,
  FiEye as Eye,
  FiGithub as Github,
  FiPause as Pause,
  FiPlay as Play,
  FiPlus as Plus,
} from 'react-icons/fi';

type Project = typeof PORTFOLIO_CONFIG.projects[number];

const getYouTubeEmbedUrl = (url: string): string | null => {
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(regex);
  if (match && match[1]) {
    return `https://www.youtube.com/embed/${match[1]}?autoplay=1&mute=1&loop=1&playlist=${match[1]}`;
  }
  return null;
};

const isYouTubeUrl = (url: string): boolean => {
  return url.includes('youtube.com') || url.includes('youtu.be');
};

interface ProjectCardProps {
  project: Project;
  onOpenProject: (projectId: number) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onOpenProject }) => {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const isYouTube = Boolean(project.video && isYouTubeUrl(project.video));
  const youtubeEmbedUrl = isYouTube && project.video ? getYouTubeEmbedUrl(project.video) : null;

  const handleOpenProject = () => {
    onOpenProject(project.id);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleOpenProject();
    }
  };

  const toggleVideo = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (project.video) {
      setShowVideo(!showVideo);
      if (!showVideo) {
        setIsVideoPlaying(true);
      }
    }
  };

  const togglePlayPause = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (isYouTube && iframeRef.current && youtubeEmbedUrl) {
      if (isVideoPlaying) {
        iframeRef.current.src = youtubeEmbedUrl.replace('autoplay=1', 'autoplay=0');
      } else {
        iframeRef.current.src = youtubeEmbedUrl;
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

  return (
    <article
      className="group relative h-full bg-white/74 backdrop-blur-lg border border-white/85 rounded-xl overflow-hidden shadow-[0_14px_36px_rgba(71,56,107,0.1)] hover:border-[#9D71E8]/80 transition-all duration-500 cursor-pointer flex flex-col"
      onClick={handleOpenProject}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`Ouvrir la page détaillée du projet ${project.title}`}
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
            {project.technologies.slice(0, 3).map((technology, index) => (
              <span key={`${project.id}-tech-${index}`} className="px-2 py-1 bg-[#BE99FF]/95 text-xs rounded-full text-[#35275B] font-medium backdrop-blur-sm">
                {technology}
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
        <div className="flex justify-between items-start mb-2 gap-3">
          <h3 className="text-xl font-bold text-[#2F2352] group-hover:text-[#5A4690] transition-colors flex-1">
            {project.title}
          </h3>
          <span className="bg-[#B2C9FF] text-[#2F2352] rounded-full px-3 py-1 text-xs font-semibold border border-[#BE99FF]/90 whitespace-nowrap">
            {project.year}
          </span>
        </div>

        <p className="text-[#47386B] mb-4 leading-relaxed line-clamp-2 flex-grow">{project.description}</p>

        <div className="flex items-end justify-between gap-3 mt-auto">
          <div className="flex gap-2.5">
            {project.github && (
              <a
                href={project.github}
                className="inline-flex items-center justify-center w-10 h-10 bg-[#2F2352] hover:bg-[#35275B] text-[#F2F7FF] rounded-lg transition-colors"
                target="_blank"
                rel="noopener noreferrer"
                onClick={(event) => event.stopPropagation()}
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
                onClick={(event) => event.stopPropagation()}
                aria-label={`Ouvrir l'aperçu en direct du projet ${project.title}`}
              >
                <ExternalLink size={16} />
              </a>
            )}
          </div>

          <span className="hidden sm:inline-flex items-center rounded-full bg-white/75 px-3 py-1 text-xs font-semibold text-[#47386B] border border-white/85">
            Ouvrir la page
          </span>
        </div>
      </div>
    </article>
  );
};

export default ProjectCard;