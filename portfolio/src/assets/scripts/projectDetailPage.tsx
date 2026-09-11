import React, { useEffect, useRef, useState } from 'react';
import {
  FiArrowLeft as ArrowLeft,
  FiCalendar as Calendar,
  FiCode as Code,
  FiExternalLink as ExternalLink,
  FiEye as Eye,
  FiGithub as Github,
  FiPause as Pause,
  FiPlay as Play,
  FiChevronLeft as ChevronLeft,
  FiChevronRight as ChevronRight,
} from 'react-icons/fi';
import { animate } from 'animejs';
import { useReducedMotion } from './useReducedMotion';
import { useRevealMotion } from './useRevealMotion';
import { useStaticInteractions } from './useStaticInteractions';
import type PORTFOLIO_CONFIG from './portfolioData';
import GalaxyBackground from './galaxyBackground';

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

const isGitHubPagesUrl = (url?: string): boolean => {
  return Boolean(url && /github\.io/i.test(url));
};

interface ProjectDetailPageProps {
  project: Project;
  onBack: () => void;
}

const ProjectDetailPage: React.FC<ProjectDetailPageProps> = ({ project, onBack }) => {
  const reducedMotion = useReducedMotion();
  const pageRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);
  const [carouselPaused, setCarouselPaused] = useState(false);
  const [carouselInteracting, setCarouselInteracting] = useState(false);
  const [pageVisible, setPageVisible] = useState(() => !document.hidden);
  useRevealMotion(pageRef);
  useStaticInteractions(pageRef);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [carouselResetKey, setCarouselResetKey] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const projectImages = project.images.length > 0 ? project.images : [project.image];
  const hasImageCarousel = projectImages.length > 1;
  const isYouTube = Boolean(project.video && isYouTubeUrl(project.video));
  const youtubeEmbedUrl = isYouTube && project.video ? getYouTubeEmbedUrl(project.video) : null;
  const hasLivePreview = isGitHubPagesUrl(project.demo);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [project.id]);

  useEffect(() => {
    setCurrentImageIndex(0);
    setShowVideo(false);
    setIsVideoPlaying(false);
    setCarouselResetKey(0);
  }, [project.id]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onBack();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onBack]);

  useEffect(() => {
    if (!hasImageCarousel || showVideo || reducedMotion || carouselPaused || carouselInteracting || !pageVisible) return;

    const progress = progressRef.current ? animate(progressRef.current, {
      scaleX: [0, 1], duration: 4500, ease: 'linear',
    }) : null;
    const autoSlide = window.setInterval(() => {
      setCurrentImageIndex((previousIndex) => (previousIndex + 1) % projectImages.length);
    }, 4500);

    return () => { window.clearInterval(autoSlide); progress?.revert(); };
  }, [hasImageCarousel, projectImages.length, showVideo, carouselResetKey, currentImageIndex, reducedMotion, carouselPaused, carouselInteracting, pageVisible]);

  useEffect(() => {
    const handleVisibility = () => setPageVisible(!document.hidden);
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  useEffect(() => {
    if (!imageRef.current || showVideo || reducedMotion) return;
    const animation = animate(imageRef.current, {
      opacity: [0, 1], scale: [1.035, 1], duration: 480, ease: 'outCubic',
    });
    return () => { animation.revert(); };
  }, [currentImageIndex, showVideo, reducedMotion]);

  const goToImage = (index: number) => {
    const normalizedIndex = ((index % projectImages.length) + projectImages.length) % projectImages.length;
    setCurrentImageIndex(normalizedIndex);
    setCarouselResetKey((previousKey) => previousKey + 1);
  };

  const goToRelativeImage = (step: number) => {
    setCurrentImageIndex((previousIndex) => {
      const nextIndex = (previousIndex + step + projectImages.length) % projectImages.length;
      return nextIndex;
    });
    setCarouselResetKey((previousKey) => previousKey + 1);
  };

  const toggleVideo = () => {
    if (!project.video) return;

    setShowVideo((previousValue) => !previousValue);
    if (!showVideo) {
      setIsVideoPlaying(true);
    }
  };

  const togglePlayPause = () => {
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
    <div ref={pageRef} className="project-page min-h-screen text-[#0A0A0E] relative overflow-x-hidden bg-[#F4F5F8]">
      <GalaxyBackground />

      <main id="main-content" className="relative z-10 pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Top navigation bar */}
          <div data-anim className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-black/15 pb-5">
            <button
              onClick={onBack}
              className="brutal-btn px-5 py-2.5 bg-white text-black hover:bg-[#0055FF] hover:text-white border border-black text-xs tracking-wider shadow-[3px_3px_0px_#000000]"
              aria-label="Retour au portfolio"
            >
              <ArrowLeft size={16} className="mr-2" />
              [ RETOUR_PORTFOLIO ]
            </button>

            {/* Breadcrumb / System path */}
            <div className="project-breadcrumb font-mono text-[10px] sm:text-xs text-[#64748B] flex flex-wrap items-center gap-2 min-w-0">
              <span>ROOT</span>
              <span className="text-[#0055FF]">/</span>
              <span>WORKS</span>
              <span className="text-[#0055FF]">/</span>
              <span className="text-black font-bold">PRJ_{formattedId}_{project.title.replace(/\s+/g, '_').toUpperCase()}</span>
            </div>
          </div>

          {/* Main Hero Section of Project */}
          <section className="bg-white border border-black shadow-[6px_6px_0px_#000000] p-6 sm:p-8 lg:p-10 mb-8">
            <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
              {/* Left Column: Details */}
              <div data-anim className="space-y-6">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="px-2.5 py-1 bg-[#E0EBFF] border border-[#0055FF] text-[#0055FF] text-xs font-mono font-bold tracking-wider">
                      [STATUS: {project.status?.toUpperCase() || 'TERMINE'}]
                    </span>
                    <span className="text-xs font-mono text-[#64748B]">
                      SYS_ID: #00{project.id}
                    </span>
                  </div>

                  <h1 className="text-[clamp(1.75rem,5vw,3rem)] font-extrabold font-display uppercase tracking-tight text-black leading-none">
                    {project.title}
                  </h1>

                  <p className="text-base sm:text-lg text-[#475569] font-body leading-relaxed">
                    {project.description}
                  </p>
                </div>

                {/* Specification Grid */}
                <div className="grid grid-cols-1 min-[400px]:grid-cols-3 gap-3">
                  <div data-static-motion="lift" className="p-3 bg-[#F8FAFC] border border-black/20">
                    <span className="block text-[10px] font-mono uppercase tracking-wider text-[#64748B]">Année</span>
                    <span className="font-mono font-bold text-black text-sm">{project.year || '2026'}</span>
                  </div>
                  <div data-static-motion="lift" className="p-3 bg-[#F8FAFC] border border-black/20">
                    <span className="block text-[10px] font-mono uppercase tracking-wider text-[#64748B]">Durée</span>
                    <span className="font-mono font-bold text-black text-sm">{project.duration || '2-3 mois'}</span>
                  </div>
                  <div data-static-motion="lift" className="p-3 bg-[#F8FAFC] border border-black/20">
                    <span className="block text-[10px] font-mono uppercase tracking-wider text-[#64748B]">Type</span>
                    <span className="font-mono font-bold text-black text-sm truncate block" title={project.type}>{project.type || 'Projet'}</span>
                  </div>
                </div>

                {/* Primary CTA Buttons */}
                <div className="flex flex-wrap gap-4 pt-2">
                  {project.github && (
                    <a
                      href={project.github}
                      className="brutal-btn px-5 py-3 bg-white text-black hover:bg-black hover:text-white border border-black text-xs tracking-wider shadow-[4px_4px_0px_#000000]"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Github size={18} className="mr-2" />
                      VOIR LE CODE REPO →
                    </a>
                  )}
                  {project.demo && (
                    <a
                      href={project.demo}
                      className="brutal-btn px-5 py-3 bg-[#0055FF] text-white hover:bg-black hover:text-white border border-black text-xs tracking-wider shadow-[4px_4px_0px_#000000]"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink size={18} className="mr-2" />
                      DEMO EN DIRECT ↗
                    </a>
                  )}
                </div>

                {/* Challenges Block */}
                <div data-static-motion="nudge" className="p-5 bg-[#F1F5F9] border-l-4 border-l-[#0055FF] border border-black/15">
                  <h2 className="text-sm font-mono font-bold text-black uppercase tracking-wider mb-2 flex items-center gap-2">
                    <Code data-motion-icon size={16} className="text-[#0055FF]" />
                    [DEFIS_TECHNIQUES & RESOLUTION]
                  </h2>
                  <p className="text-sm text-[#475569] leading-relaxed font-body">
                    {project.challenges || "Conception modulaire et optimisation poussée pour garantir fluidité, performance et évolutivité."}
                  </p>
                </div>
              </div>

              {/* Right Column: Visual Frame */}
              <div
                data-anim
                className="space-y-3"
                role="region"
                aria-label={`Galerie du projet ${project.title}`}
                onMouseEnter={() => setCarouselInteracting(true)}
                onMouseLeave={() => setCarouselInteracting(false)}
                onFocusCapture={(event) => {
                  if (!(event.target instanceof Element) || !event.target.closest('[data-carousel-playback]')) setCarouselPaused(true);
                }}
              >
                <div className="border border-black bg-black shadow-[4px_4px_0px_#000000]">
                  {/* Visual Header */}
                  <div className="flex flex-wrap gap-2 items-center justify-between px-3 py-1.5 bg-[#EEF2F7] border-b border-black text-[11px] font-mono text-[#64748B]">
                    <span>VIEWPORT // {showVideo ? 'VIDEO_STREAM' : `FRAME_${currentImageIndex + 1}_OF_${projectImages.length}`}</span>
                    <span className="text-[#0055FF] font-bold">● ACTIVE</span>
                  </div>

                  <div className="relative aspect-video bg-[#0A0A0E] overflow-hidden">
                    {showVideo && project.video ? (
                      <div className="relative h-full w-full">
                        {isYouTube && youtubeEmbedUrl ? (
                          <iframe
                            ref={iframeRef}
                            src={youtubeEmbedUrl}
                            className="h-full w-full"
                            allow="autoplay; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            title={project.title}
                          />
                        ) : (
                          <video
                            ref={videoRef}
                            src={project.video}
                            className="h-full w-full object-contain bg-black"
                            loop
                            muted
                            autoPlay
                          />
                        )}

                        <button
                          onClick={togglePlayPause}
                          type="button"
                          className="absolute top-3 right-3 bg-black text-white border border-black p-2 transition-colors hover:bg-[#0055FF]"
                          aria-label={isVideoPlaying ? 'Mettre la vidéo en pause' : 'Lancer la vidéo'}
                        >
                          {isVideoPlaying ? <Pause size={18} /> : <Play size={18} />}
                        </button>
                      </div>
                    ) : (
                      <img
                        ref={imageRef}
                        key={currentImageIndex}
                        src={projectImages[currentImageIndex]}
                        alt={`${project.title} — aperçu ${currentImageIndex + 1} sur ${projectImages.length}`}
                        className="h-full w-full object-contain"
                      />
                    )}

                    {project.video && (
                      <button
                        onClick={toggleVideo}
                        type="button"
                        className="absolute top-3 left-3 bg-black text-white border border-black px-2.5 py-1 font-mono text-xs flex items-center gap-1.5 hover:bg-[#0055FF] transition-colors"
                        aria-label={showVideo ? "Afficher l'image du projet" : 'Afficher la vidéo du projet'}
                      >
                        {showVideo ? <Eye size={14} /> : <Play size={14} />}
                        <span>{showVideo ? 'IMG' : 'VIDEO'}</span>
                      </button>
                    )}

                    {hasImageCarousel && !showVideo && (
                      <>
                        <button
                          type="button"
                          onClick={() => goToRelativeImage(-1)}
                          data-static-motion="lift"
                          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-9 h-9 flex items-center justify-center bg-black/80 hover:bg-[#0055FF] text-white border border-white/50 hover:border-[#0055FF] transition-colors"
                          aria-label={`Image précédente`}
                        >
                          <ChevronLeft size={18} />
                        </button>

                        <button
                          type="button"
                          onClick={() => goToRelativeImage(1)}
                          data-static-motion="lift"
                          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-9 h-9 flex items-center justify-center bg-black/80 hover:bg-[#0055FF] text-white border border-white/50 hover:border-[#0055FF] transition-colors"
                          aria-label={`Image suivante`}
                        >
                          <ChevronRight size={18} />
                        </button>
                      </>
                    )}
                  </div>
                  {hasImageCarousel && !showVideo && !reducedMotion && (
                    <div className="h-1 bg-[#E2E8F0]" aria-hidden="true">
                      <span ref={progressRef} className="block h-full bg-[#0055FF] origin-left scale-x-0" />
                    </div>
                  )}
                </div>

                {/* Carousel thumbnail pills */}
                {hasImageCarousel && !showVideo && (
                  <div className="flex flex-wrap items-center justify-end gap-2 font-mono text-xs">
                    {!reducedMotion && (
                      <button type="button" onClick={() => setCarouselPaused((paused) => !paused)}
                        data-carousel-playback
                        data-static-motion="nudge"
                        className="mr-auto px-2.5 py-1 border border-black bg-white text-black flex items-center gap-1.5"
                        aria-label={carouselPaused ? 'Activer le défilement automatique' : 'Mettre le défilement en pause'}>
                        {carouselPaused ? <Play size={12} /> : <Pause size={12} />}
                        {carouselPaused ? 'LECTURE' : 'PAUSE'}
                      </button>
                    )}
                    {projectImages.map((_, index) => (
                      <button
                        key={`${project.id}-detail-dot-${index}`}
                        type="button"
                        onClick={() => goToImage(index)}
                        data-static-motion="lift"
                        aria-label={`Afficher l’image ${index + 1}`}
                        aria-current={currentImageIndex === index ? 'true' : undefined}
                        className={`px-2.5 py-1 border transition-colors ${
                          currentImageIndex === index
                            ? 'bg-[#0055FF] text-white border-black font-bold shadow-[2px_2px_0px_#000000]'
                            : 'bg-white text-[#475569] border-black/30 hover:border-black'
                        }`}
                      >
                        [0{index + 1}]
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Secondary Grid: Technologies & Features */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Technologies Used */}
            <section data-anim data-static-motion="lift" className="bg-white border border-black p-6 shadow-[4px_4px_0px_#000000]">
              <h2 className="text-sm sm:text-lg font-mono font-bold text-black uppercase tracking-wider mb-4 flex items-center gap-2 border-b border-black/15 pb-3">
                <Calendar size={18} className="text-[#0055FF]" />
                [01 // STACK_TECHNIQUE]
              </h2>
              <div className="flex flex-wrap gap-2 mb-4">
                {project.technologies.map((tech, index) => (
                  <span
                    key={`${project.id}-tech-${index}`}
                    data-anim-chip
                    data-static-motion="nudge"
                    className="px-3 py-1 bg-[#F1F5F9] border border-black/20 text-xs font-mono text-[#0A0A0E] font-medium"
                  >
                    {tech}
                  </span>
                ))}
              </div>
              <p className="text-xs font-mono text-[#64748B]">
                Architecture sélectionnée pour optimiser la réactivité et la scalabilité logicielle.
              </p>
            </section>

            {/* Features */}
            <section data-anim data-static-motion="lift" className="bg-white border border-black p-6 shadow-[4px_4px_0px_#000000]">
              <h2 className="text-sm sm:text-lg font-mono font-bold text-black uppercase tracking-wider mb-4 flex items-center gap-2 border-b border-black/15 pb-3">
                <Code size={18} className="text-[#0055FF]" />
                [02 // FONCTIONNALITÉS]
              </h2>
              <ul className="space-y-2.5">
                {(project.features || [
                  'Interface utilisateur intuitive',
                  'Performance optimisée',
                  'Design responsive',
                  "Intégration d'APIs",
                ]).map((feature, index) => (
                  <li data-anim data-static-motion="nudge" key={`${project.id}-feature-${index}`} className="flex items-start gap-2.5 text-sm text-[#475569] font-body">
                    <span data-motion-mark className="text-[#0055FF] font-mono font-bold text-xs mt-0.5">■</span>
                    <span className="leading-relaxed">{feature}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          {/* Live Preview Section if Available */}
          {hasLivePreview ? (
            <section data-anim className="mt-8 bg-white border border-black shadow-[6px_6px_0px_#000000] overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black px-5 py-3 bg-[#EEF2F7]">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-[#FF3366] border border-black" />
                  <div className="w-3 h-3 bg-[#FFE500] border border-black" />
                  <div className="w-3 h-3 bg-[#0055FF] border border-black" />
                  <span className="font-mono text-xs text-black ml-2 font-bold break-all">
                    BROWSER_VIEW // {project.demo}
                  </span>
                </div>
                <span className="px-2 py-0.5 bg-[#0055FF] text-white font-mono text-xs font-bold border border-black">
                  LIVE_PAGES
                </span>
              </div>
              <div className="p-4 sm:p-6 bg-[#F4F5F8]">
                <div className="relative h-[80vh] min-h-[640px] w-full overflow-hidden border border-black shadow-[4px_4px_0px_#000000]">
                  <iframe
                    src={project.demo}
                    className="h-full w-full bg-white"
                    style={{ zoom: 0.8 }}
                    title={`Aperçu en direct du projet ${project.title}`}
                    loading="lazy"
                  />
                </div>
              </div>
            </section>
          ) : null}
        </div>
      </main>
    </div>
  );
};

export default ProjectDetailPage;
