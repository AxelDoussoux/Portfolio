import React, { useEffect, useRef, useState } from 'react';
import { animate } from 'animejs';
import type PORTFOLIO_CONFIG from './portfolioData';
import {
  FiExternalLink as ExternalLink,
  FiEye as Eye,
  FiGithub as Github,
  FiPause as Pause,
  FiPlay as Play,
  FiArrowUpRight as ArrowUpRight,
} from 'react-icons/fi';

type Project = typeof PORTFOLIO_CONFIG.projects[number];

const getYouTubeEmbedUrl = (url: string): string | null => {
  // eslint-disable-next-line no-useless-escape
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
  index?: number;
  onOpenProject: (projectId: number) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, index = 0, onOpenProject }) => {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const cardRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      card.style.opacity = '1';
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          observer.disconnect();
          animate(card, {
            opacity: [0, 1],
            y: [26, 0],
            duration: 620,
            delay: index * 90,
            ease: 'outExpo',
          });
        });
      },
      { threshold: 0.15 },
    );

    observer.observe(card);
    return () => observer.disconnect();
  }, [index]);

  const handleCardMouseMove = (event: React.MouseEvent<HTMLElement>) => {
    const card = cardRef.current;
    if (!card) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const rect = card.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;
    animate(card, {
      rotateX: -py * 7,
      rotateY: px * 7,
      perspective: 900,
      duration: 400,
      ease: 'outQuad',
    });
  };

  const handleCardMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    animate(card, {
      rotateX: 0,
      rotateY: 0,
      duration: 500,
      ease: 'outQuad',
    });
  };

  const isYouTube = Boolean(project.video && isYouTubeUrl(project.video));
  const youtubeEmbedUrl = isYouTube && project.video ? getYouTubeEmbedUrl(project.video) : null;

  const handleOpenProject = () => {
    onOpenProject(project.id);
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

  const formattedId = String(project.id).padStart(2, '0');

  return (
    <article
      ref={cardRef}
      data-card-anim
      onMouseMove={handleCardMouseMove}
      onMouseLeave={handleCardMouseLeave}
      className="group relative h-full w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.334rem)] bg-white border border-black shadow-[4px_4px_0px_#000000] hover:shadow-[6px_6px_0px_#0055FF] transition-shadow duration-150 flex flex-col"
    >
      {/* Top wireframe header bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-black bg-[#EEF2F7] text-xs font-mono">
        <span className="text-[#0055FF] font-bold">
          PRJ_{formattedId} // {project.year}
        </span>
        <span className="text-[#64748B] uppercase tracking-wider text-[10px] font-bold">
          {project.type}
        </span>
      </div>

      <a
        href={`#project-${project.id}`}
        onClick={(event) => {
          event.preventDefault();
          handleOpenProject();
        }}
        className="absolute inset-0 z-10"
        aria-label={`Ouvrir la page détaillée du projet ${project.title}`}
      />

      {/* Media display */}
      <div className="relative aspect-video overflow-hidden flex-shrink-0 bg-[#E2E8F0] border-b border-black">
        {showVideo && project.video ? (
          <div className="relative w-full h-full">
            {isYouTube && youtubeEmbedUrl ? (
              <iframe
                ref={iframeRef}
                src={youtubeEmbedUrl}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={project.title}
              />
            ) : (
              <video
                ref={videoRef}
                src={project.video}
                className="w-full h-full object-contain bg-black"
                loop
                muted
                autoPlay
              />
            )}
            <button
              onClick={togglePlayPause}
              type="button"
              className="absolute top-2 right-2 bg-black text-white border border-black p-1.5 transition-colors z-20 hover:bg-[#0055FF]"
              aria-label={isVideoPlaying ? 'Mettre la vidéo en pause' : 'Lancer la vidéo'}
            >
              {isVideoPlaying ? <Pause size={18} /> : <Play size={18} />}
            </button>
          </div>
        ) : (
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
          />
        )}

        {/* Video button toggle */}
        {project.video && (
          <button
            onClick={toggleVideo}
            type="button"
            className="absolute top-3 left-3 bg-black text-white border border-black px-2 py-1 font-mono text-xs z-20 flex items-center gap-1.5 hover:bg-[#0055FF] transition-colors"
            aria-label={showVideo ? "Afficher l'image du projet" : 'Afficher la vidéo du projet'}
          >
            {showVideo ? <Eye size={14} /> : <Play size={14} />}
            <span>{showVideo ? 'IMG' : 'VIDEO'}</span>
          </button>
        )}

        {/* Corner accent mark */}
        <div className="absolute top-0 right-0 w-3 h-3 border-b border-l border-black/40 pointer-events-none" />
      </div>

      {/* Content */}
      <div className="p-5 sm:p-6 flex flex-col flex-grow bg-white">
        {/* Title */}
        <div className="mb-3">
          <h3 className="text-xl font-bold font-display text-black group-hover:text-[#0055FF] transition-colors leading-tight flex items-center justify-between">
            <span>{project.title}</span>
            <ArrowUpRight size={20} className="text-[#64748B] group-hover:text-[#0055FF] group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </h3>
        </div>

        {/* Description */}
        <p className="text-[#475569] font-body text-sm mb-5 leading-relaxed line-clamp-2 flex-grow">
          {project.description}
        </p>

        {/* Technologies - Monospace tags */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {project.technologies.slice(0, 4).map((tech, index) => (
            <span
              key={`${project.id}-tech-${index}`}
              className="px-2 py-0.5 bg-[#F1F5F9] border border-black/20 text-[#0A0A0E] text-xs font-mono font-medium"
            >
              {tech}
            </span>
          ))}
          {project.technologies.length > 4 && (
            <span className="px-1.5 py-0.5 bg-[#E0EBFF] border border-[#0055FF] text-[#0055FF] text-xs font-mono font-bold">
              +{project.technologies.length - 4}
            </span>
          )}
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between gap-3 pt-4 border-t border-black/10 mt-auto relative z-20">
          <div className="flex gap-2">
            {project.github && (
              <a
                href={project.github}
                className="inline-flex items-center justify-center w-8 h-8 bg-white hover:bg-black text-black hover:text-white border border-black transition-colors"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Voir le code source du projet ${project.title}`}
              >
                <Github size={15} />
              </a>
            )}
            {project.demo && (
              <a
                href={project.demo}
                className="inline-flex items-center justify-center w-8 h-8 bg-[#0055FF] hover:bg-black text-white border border-black transition-colors"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Ouvrir l'aperçu en direct du projet ${project.title}`}
              >
                <ExternalLink size={15} />
              </a>
            )}
          </div>

          <span className="font-mono text-xs font-bold text-black group-hover:text-[#0055FF] flex items-center gap-1 transition-colors">
            DETAILS // →
          </span>
        </div>
      </div>
    </article>
  );
};

export default ProjectCard;
