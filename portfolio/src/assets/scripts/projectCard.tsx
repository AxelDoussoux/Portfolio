import React, { useEffect, useRef, useState } from 'react';
import { animate, stagger } from 'animejs';
import { useReducedMotion } from './useReducedMotion';
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
  const reducedMotion = useReducedMotion();
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const cardRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card || reducedMotion || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    let animation: ReturnType<typeof animate> | undefined;
    let detailAnimations: ReturnType<typeof animate>[] = [];
    let frame = 0;
    const move = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        animation?.cancel();
        animation = animate(card, {
          '--tilt-x': `${-y * 5}deg`, '--tilt-y': `${x * 5}deg`,
          duration: 240, ease: 'outQuad',
        });
      });
    };
    const reset = () => {
      cancelAnimationFrame(frame);
      animation?.cancel();
      animation = animate(card, {
        '--tilt-x': '0deg', '--tilt-y': '0deg', duration: 380, ease: 'outCubic',
      });
    };
    const animateDetails = (entering: boolean) => {
      detailAnimations.forEach((item) => item.cancel());
      const image = card.querySelector<HTMLElement>('[data-card-image]');
      const title = card.querySelector<HTMLElement>('[data-card-title]');
      const tags = card.querySelectorAll<HTMLElement>('[data-card-tag]');
      const arrow = card.querySelector<HTMLElement>('[data-card-arrow]');
      detailAnimations = [];
      if (image) detailAnimations.push(animate(image, {
        scale: entering ? 1.045 : 1,
        duration: entering ? 520 : 420,
        ease: 'outCubic',
      }));
      if (title) detailAnimations.push(animate(title, {
        x: entering ? 4 : 0,
        duration: 330,
        ease: 'outExpo',
      }));
      if (tags.length) detailAnimations.push(animate(tags, {
        y: entering ? -2 : 0,
        delay: stagger(24),
        duration: 280,
        ease: 'outCubic',
      }));
      if (arrow) detailAnimations.push(animate(arrow, {
        x: entering ? 4 : 0,
        y: entering ? -4 : 0,
        rotate: entering ? 5 : 0,
        duration: 360,
        ease: 'outBack(1.4)',
      }));
    };
    const enter = () => animateDetails(true);
    const leave = () => {
      reset();
      animateDetails(false);
    };
    card.addEventListener('pointermove', move);
    card.addEventListener('pointerenter', enter);
    card.addEventListener('pointerleave', leave);
    card.addEventListener('pointercancel', leave);
    return () => {
      cancelAnimationFrame(frame);
      animation?.cancel();
      detailAnimations.forEach((item) => item.cancel());
      card.removeEventListener('pointermove', move);
      card.removeEventListener('pointerenter', enter);
      card.removeEventListener('pointerleave', leave);
      card.removeEventListener('pointercancel', leave);
      card.style.removeProperty('--tilt-x');
      card.style.removeProperty('--tilt-y');
    };
  }, [reducedMotion]);

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
      data-motion-order={index % 3}
      className="project-card group relative w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.334rem)] bg-white border border-black shadow-[4px_4px_0px_#000000] hover:shadow-[6px_6px_0px_#0055FF] transition-shadow duration-150 flex flex-col"
    >
      {/* Top wireframe header bar */}
      <div className="flex flex-wrap gap-x-2 gap-y-1 min-h-14 items-center justify-between px-4 py-2 border-b border-black bg-[#EEF2F7] text-xs font-mono">
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
            data-card-image
            loading="lazy"
            decoding="async"
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover"
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
          <h3 data-card-title className="text-lg sm:text-xl font-bold font-display text-black group-hover:text-[#0055FF] transition-colors leading-tight flex items-center justify-between">
            <span>{project.title}</span>
            <ArrowUpRight data-card-arrow size={20} className="text-[#64748B] group-hover:text-[#0055FF]" />
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
              data-card-tag
              className="px-2 py-0.5 bg-[#F1F5F9] border border-black/20 text-[#0A0A0E] text-xs font-mono font-medium"
            >
              {tech}
            </span>
          ))}
          {project.technologies.length > 4 && (
            <span data-card-tag className="px-1.5 py-0.5 bg-[#E0EBFF] border border-[#0055FF] text-[#0055FF] text-xs font-mono font-bold">
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
