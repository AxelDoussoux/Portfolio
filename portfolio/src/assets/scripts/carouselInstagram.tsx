import { useEffect, useRef, useState } from "react";
import PORTFOLIO_CONFIG from "./portfolioData";
import { ChevronLeft, ChevronRight, Instagram } from "lucide-react";

// Composant Carousel Instagram avec embeds
const InstagramCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [postsPerView, setPostsPerView] = useState(3);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const wheelLockRef = useRef(false);

  // Détection de la taille d'écran
  useEffect(() => {
    const updatePostsPerView = () => {
      if (window.innerWidth < 640) { // smartphone
        setPostsPerView(1);
      } else if (window.innerWidth < 1024) { // tablette
        setPostsPerView(2);
      } else { // desktop
        setPostsPerView(3);
      }
    };

    updatePostsPerView();
    window.addEventListener('resize', updatePostsPerView);
    return () => window.removeEventListener('resize', updatePostsPerView);
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const handlePreferenceChange = () => {
      setIsReducedMotion(mediaQuery.matches);
      if (mediaQuery.matches) {
        setIsAutoPlaying(false);
      }
    };

    handlePreferenceChange();
    mediaQuery.addEventListener('change', handlePreferenceChange);

    return () => mediaQuery.removeEventListener('change', handlePreferenceChange);
  }, []);

  // Auto-play du carousel
  useEffect(() => {
    if (!isAutoPlaying || isReducedMotion) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex + postsPerView >= PORTFOLIO_CONFIG.instagramPosts.length ? 0 : prevIndex + 1
      );
    }, 5000); // 5 secondes pour laisser le temps de voir les embeds

    return () => clearInterval(interval);
  }, [isAutoPlaying, postsPerView, isReducedMotion]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex + postsPerView >= PORTFOLIO_CONFIG.instagramPosts.length ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? Math.max(0, PORTFOLIO_CONFIG.instagramPosts.length - postsPerView) : prevIndex - 1
    );
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    const dominantDelta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    if (Math.abs(dominantDelta) < 10) return;

    e.preventDefault();
    setIsAutoPlaying(false);

    if (wheelLockRef.current) return;
    wheelLockRef.current = true;

    if (dominantDelta > 0) {
      nextSlide();
    } else {
      prevSlide();
    }

    window.setTimeout(() => {
      wheelLockRef.current = false;
    }, 220);
  };

  const handleCarouselMouseEnter = () => {
    setIsAutoPlaying(false);
  };

  const handleCarouselMouseLeave = () => {
    setIsAutoPlaying(!isReducedMotion);
  };

  const handleCarouselKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      setIsAutoPlaying(false);
      nextSlide();
    }

    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      setIsAutoPlaying(false);
      prevSlide();
    }
  };

  const currentPage = Math.floor(currentIndex / postsPerView) + 1;
  const totalPages = Math.ceil(PORTFOLIO_CONFIG.instagramPosts.length / postsPerView);

  return (
    <div className="bg-slate-900/45 backdrop-blur-sm border border-cyan-300/20 rounded-2xl p-4 sm:p-8 mb-12 shadow-[0_12px_35px_rgba(8,47,73,0.28)]" role="region" aria-label="Carousel Instagram">
      <div className="flex items-center justify-center gap-3 mb-6 sm:mb-8">
        <Instagram className="text-cyan-300" size={32} />
        <h3 className="text-xl sm:text-2xl font-bold text-cyan-100 text-center tracking-tight">
          Mes dernières créations
        </h3>
      </div>

      <p className="sr-only" aria-live="polite">Page {currentPage} sur {totalPages}</p>
      
      <div 
        className="relative overflow-hidden"
        onMouseEnter={handleCarouselMouseEnter}
        onMouseLeave={handleCarouselMouseLeave}
        onWheel={handleWheel}
        onWheelCapture={handleWheel}
        onKeyDown={handleCarouselKeyDown}
        tabIndex={0}
        aria-label="Utilisez la molette ou les fleches gauche et droite pour naviguer dans le carousel"
      >
        <div 
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * (100 / postsPerView)}%)` }}
        >
          {PORTFOLIO_CONFIG.instagramPosts.map((post) => (
            <div 
              key={post.id} 
              className={`flex-shrink-0 px-1 sm:px-2 ${
                postsPerView === 1 ? 'w-full' : 
                postsPerView === 2 ? 'w-1/2' : 'w-1/3'
              }`}
              onWheel={handleWheel}
              onWheelCapture={handleWheel}
            >
              <div className="bg-slate-800/60 rounded-xl overflow-hidden border border-cyan-300/20 hover:border-cyan-300/40 transition-all duration-300">
                <div className="aspect-square relative">
                  <iframe
                    src={`${post.embedUrl}?autoplay=0&muted=1`}
                    className="w-full h-full border-0"
                    frameBorder="0"
                    scrolling="no"
                    allow="encrypted-media"
                    title={`Instagram post ${post.id}`}
                    sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
                  />
                  <div
                    className="absolute inset-0 z-10"
                    onWheel={handleWheel}
                    onWheelCapture={handleWheel}
                    aria-hidden="true"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Boutons de navigation */}
        <button
          onClick={prevSlide}
          type="button"
          className="absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 bg-slate-950/75 hover:bg-slate-900 text-white p-2 sm:p-3 rounded-full transition-colors z-10 shadow-lg"
          aria-label="Voir les posts precedents"
        >
          <ChevronLeft size={16} className="sm:hidden" />
          <ChevronLeft size={20} className="hidden sm:block" />
        </button>
        
        <button
          onClick={nextSlide}
          type="button"
          className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 bg-slate-950/75 hover:bg-slate-900 text-white p-2 sm:p-3 rounded-full transition-colors z-10 shadow-lg"
          aria-label="Voir les posts suivants"
        >
          <ChevronRight size={16} className="sm:hidden" />
          <ChevronRight size={20} className="hidden sm:block" />
        </button>
      </div>
      
      {/* Indicateurs de pagination */}
      <div className="flex justify-center gap-2 mt-4 sm:mt-6">
        {Array.from({ length: Math.ceil(PORTFOLIO_CONFIG.instagramPosts.length / postsPerView) }).map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            type="button"
            className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
              Math.floor(currentIndex / postsPerView) === index 
                ? 'bg-cyan-300 scale-110' 
                : 'bg-slate-600 hover:bg-slate-500'
            }`}
            aria-label={`Aller au groupe de posts ${index + 1}`}
          />
        ))}
      </div>
      
      {/* Lien vers Instagram */}
      <div className="text-center mt-6 sm:mt-8">
        <a
          href={PORTFOLIO_CONFIG.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-400 hover:to-sky-400 rounded-xl transition-all duration-300 text-slate-950 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 text-sm sm:text-base"
        >
          <Instagram size={20} className="sm:hidden" />
          <Instagram size={24} className="hidden sm:block" />
          Suivez-moi sur Instagram
        </a>
      </div>
    </div>
  );
};

export default InstagramCarousel;