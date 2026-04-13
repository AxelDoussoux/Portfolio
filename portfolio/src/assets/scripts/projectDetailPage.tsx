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
import type PORTFOLIO_CONFIG from './portfolioData';
import GalaxyBackground from './galaxyBackground';

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

const isGitHubPagesUrl = (url?: string): boolean => {
  return Boolean(url && /github\.io/i.test(url));
};

interface ProjectDetailPageProps {
  project: Project;
  onBack: () => void;
}

const ProjectDetailPage: React.FC<ProjectDetailPageProps> = ({ project, onBack }) => {
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
    if (!hasImageCarousel || showVideo) return;

    const autoSlide = window.setInterval(() => {
      setCurrentImageIndex((previousIndex) => (previousIndex + 1) % projectImages.length);
    }, 4500);

    return () => window.clearInterval(autoSlide);
  }, [hasImageCarousel, projectImages.length, showVideo, carouselResetKey]);

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

  return (
    <div className="min-h-screen text-[#2F2352] relative overflow-x-hidden">
      <GalaxyBackground />

      <main id="main-content" className="relative z-10 pt-28 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <button
              onClick={onBack}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/40 backdrop-blur-xl border border-white/60 text-[#2F2352] shadow-[0_12px_30px_rgba(71,56,107,0.12)] hover:bg-[#C9DCFF]/85 transition-all"
              aria-label="Retour au portfolio"
            >
              <ArrowLeft size={18} />
              Retour au portfolio
            </button>
          </div>

          <section className="rounded-[2rem] bg-white/30 backdrop-blur-xl border border-white/50 shadow-[0_24px_70px_rgba(71,56,107,0.14)] p-6 sm:p-8 lg:p-10">
            <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
              <div className="space-y-6">
                <div className="space-y-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-[#5A4690]">Projet détaillé</p>
                  <div className="flex flex-wrap items-center gap-3">
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.03] text-[#2F2352]">
                      {project.title}
                    </h1>
                    <span className="px-3 py-1 rounded-full bg-[#B2C9FF]/90 border border-[#BE99FF]/75 text-sm text-[#2F2352]">
                      {project.status || 'Terminé'}
                    </span>
                  </div>
                  <p className="text-lg sm:text-xl text-[#47386B] leading-relaxed max-w-3xl">
                    {project.description}
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <div className="px-4 py-2 rounded-2xl bg-white/55 border border-white/70 text-sm text-[#47386B]">
                    <span className="block text-xs uppercase tracking-[0.2em] text-[#5A4690]">Année</span>
                    <span className="font-semibold text-[#2F2352]">{project.year || '2025'}</span>
                  </div>
                  <div className="px-4 py-2 rounded-2xl bg-white/55 border border-white/70 text-sm text-[#47386B]">
                    <span className="block text-xs uppercase tracking-[0.2em] text-[#5A4690]">Durée</span>
                    <span className="font-semibold text-[#2F2352]">{project.duration || '2-3 mois'}</span>
                  </div>
                  <div className="px-4 py-2 rounded-2xl bg-white/55 border border-white/70 text-sm text-[#47386B]">
                    <span className="block text-xs uppercase tracking-[0.2em] text-[#5A4690]">Type</span>
                    <span className="font-semibold text-[#2F2352]">{project.type || 'Projet personnel'}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  {project.github && (
                    <a
                      href={project.github}
                      className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#2F2352] text-[#F2F7FF] hover:bg-[#35275B] transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Github size={18} />
                      Voir le code
                    </a>
                  )}
                  {hasLivePreview && project.demo && (
                    <a
                      href={project.demo}
                      className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#9D71E8] text-[#241A42] hover:bg-[#BE99FF] transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink size={18} />
                      Aperçu en direct
                    </a>
                  )}
                </div>

                <div className="rounded-[1.75rem] bg-white/45 border border-white/70 p-5 sm:p-6 shadow-[0_14px_30px_rgba(71,56,107,0.08)]">
                  <h2 className="text-2xl font-semibold text-[#2F2352] mb-4 flex items-center gap-2">
                    <Code size={22} className="text-[#9D71E8]" />
                    Résumé du projet
                  </h2>
                  <p className="text-[#47386B] leading-relaxed">
                    {project.challenges || 'Ce projet m\'a permis d\'approfondir mes compétences techniques et de relever plusieurs défis intéressants en matière de développement et d\'optimisation.'}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="overflow-hidden rounded-[1.9rem] border border-white/80 bg-[#C9DCFF]/75 shadow-[0_20px_40px_rgba(71,56,107,0.12)]">
                  <div className="relative aspect-video">
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
                            className="h-full w-full object-contain bg-[#C9DCFF]"
                            loop
                            muted
                            autoPlay
                          />
                        )}

                        <button
                          onClick={togglePlayPause}
                          type="button"
                          className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                          aria-label={isVideoPlaying ? 'Mettre la vidéo en pause' : 'Lancer la vidéo'}
                        >
                          {isVideoPlaying ? <Pause size={20} /> : <Play size={20} />}
                        </button>
                      </div>
                    ) : (
                      <img
                        src={projectImages[currentImageIndex]}
                        alt={project.title}
                        className="h-full w-full object-cover transition-transform duration-500"
                      />
                    )}

                    {project.video && (
                      <button
                        onClick={toggleVideo}
                        type="button"
                        className="absolute top-4 left-4 bg-[#9D71E8]/90 hover:bg-[#BE99FF] text-[#241A42] p-2 rounded-full transition-all duration-300"
                        aria-label={showVideo ? 'Afficher l\'image du projet' : 'Afficher la vidéo du projet'}
                      >
                        {showVideo ? <Eye size={20} /> : <Play size={20} />}
                      </button>
                    )}

                    {hasImageCarousel && !showVideo && (
                      <>
                        <button
                          type="button"
                          onClick={() => goToRelativeImage(-1)}
                          className="absolute left-3 top-1/2 -translate-y-1/2 z-10 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/70 hover:bg-white text-[#2F2352] border border-white/80 transition-colors"
                          aria-label={`Image précédente du projet ${project.title}`}
                        >
                          <ChevronLeft size={16} />
                        </button>

                        <button
                          type="button"
                          onClick={() => goToRelativeImage(1)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 z-10 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/70 hover:bg-white text-[#2F2352] border border-white/80 transition-colors"
                          aria-label={`Image suivante du projet ${project.title}`}
                        >
                          <ChevronRight size={16} />
                        </button>

                        <div className="absolute bottom-3 right-3 z-10 flex items-center gap-1.5">
                          {projectImages.map((_, index) => (
                            <button
                              key={`${project.id}-detail-dot-${index}`}
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
                </div>

              </div>
            </div>
          </section>

          <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1.1fr]">
            <section className="rounded-[1.75rem] bg-white/30 backdrop-blur-xl border border-white/50 shadow-[0_18px_45px_rgba(71,56,107,0.1)] p-6 sm:p-7">
              <h2 className="text-2xl font-semibold text-[#2F2352] mb-5 flex items-center gap-2">
                <Calendar size={22} className="text-[#9D71E8]" />
                Informations clés
              </h2>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="rounded-2xl bg-[#C9DCFF]/70 border border-[#BE99FF]/65 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-[#5A4690] mb-1">Technologies</p>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((technology, index) => (
                      <span key={`${project.id}-tech-${index}`} className="px-3 py-1 rounded-full bg-white/80 border border-white/90 text-sm text-[#2F2352]">
                        {technology}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl bg-[#B2C9FF]/60 border border-[#BE99FF]/65 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-[#5A4690] mb-1">Contexte</p>
                  <div className="space-y-2 text-sm text-[#47386B]">
                    <p><span className="font-semibold text-[#2F2352]">Année :</span> {project.year || '2025'}</p>
                    <p><span className="font-semibold text-[#2F2352]">Durée :</span> {project.duration || '2-3 mois'}</p>
                    <p><span className="font-semibold text-[#2F2352]">Type :</span> {project.type || 'Projet personnel'}</p>
                    <p><span className="font-semibold text-[#2F2352]">Statut :</span> {project.status || 'Terminé'}</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-[1.75rem] bg-white/30 backdrop-blur-xl border border-white/50 shadow-[0_18px_45px_rgba(71,56,107,0.1)] p-6 sm:p-7">
              <h2 className="text-2xl font-semibold text-[#2F2352] mb-5 flex items-center gap-2">
                <Code size={22} className="text-[#9D71E8]" />
                Fonctionnalités et apprentissages
              </h2>

              <ul className="space-y-3 text-[#47386B]">
                {(project.features || [
                  'Interface utilisateur intuitive',
                  'Performance optimisée',
                  'Design responsive',
                  "Intégration d'APIs",
                ]).map((feature, index) => (
                  <li key={`${project.id}-feature-${index}`} className="flex items-start gap-3">
                    <span className="mt-2 h-2 w-2 rounded-full bg-[#9D71E8] flex-shrink-0" aria-hidden="true" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6 rounded-2xl bg-white/55 border border-white/70 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-[#5A4690] mb-2">Défis relevés</p>
                <p className="text-[#47386B] leading-relaxed">
                  {project.challenges || "Ce projet m'a permis d'approfondir mes compétences techniques et de relever plusieurs défis intéressants en matière de développement et d'optimisation."}
                </p>
              </div>
            </section>
          </div>

          {hasLivePreview ? (
            <section className="mt-8 w-full rounded-[1.9rem] bg-white/30 backdrop-blur-xl border border-white/50 shadow-[0_18px_45px_rgba(71,56,107,0.12)] overflow-hidden">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#BE99FF]/40 px-5 sm:px-6 py-4">
                <div>
                  <p className="text-2xl font-semibold text-[#2F2352]">Aperçu en direct</p>
                </div>
                <span className="rounded-full bg-[#C9DCFF]/90 px-3 py-1 text-xs font-semibold text-[#2F2352]">
                  Live
                </span>
              </div>
              <div className="p-4 sm:p-6">
                <div className="relative h-[80vh] min-h-[720px] w-full overflow-hidden rounded-[1.4rem] border border-white/70 bg-white shadow-[0_14px_30px_rgba(71,56,107,0.08)]">
                <iframe
                  ref={iframeRef}
                  src={project.demo}
                  className="h-full w-full bg-white"
                  style={{ zoom: 0.7 }}
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