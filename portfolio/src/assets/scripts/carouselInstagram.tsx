import { useEffect, useState } from "react";
import PORTFOLIO_CONFIG from "./portfolioData";
import { ChevronLeft, ChevronRight, Instagram } from "lucide-react";


// Composant Carousel Instagram avec embeds
const InstagramCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const postsPerView = 3; // Nombre de posts visibles à la fois

  // Auto-play du carousel
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex + postsPerView >= PORTFOLIO_CONFIG.instagramPosts.length ? 0 : prevIndex + 1
      );
    }, 5000); // 5 secondes pour laisser le temps de voir les embeds

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

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

  return (
    <div className="bg-gray-900/30 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-8 mb-12">
      <div className="flex items-center justify-center gap-3 mb-8">
        <Instagram className="text-pink-400" size={32} />
        <h3 className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
          Mes dernières créations
        </h3>
      </div>
      
      <div 
        className="relative overflow-hidden"
        onMouseEnter={() => setIsAutoPlaying(false)}
        onMouseLeave={() => setIsAutoPlaying(true)}
      >
        <div 
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * (100 / postsPerView)}%)` }}
        >
          {PORTFOLIO_CONFIG.instagramPosts.map((post) => (
            <div key={post.id} className="w-1/3 flex-shrink-0 px-2">
              <div className="bg-gray-800/50 rounded-xl overflow-hidden border border-purple-500/20 hover:border-purple-400/40 transition-all duration-300">
                <div className="aspect-square">
                  <iframe
                    src={post.embedUrl}
                    className="w-full h-full border-0"
                    frameBorder="0"
                    scrolling="no"
                    allowTransparency={true}
                    title={`Instagram post ${post.id}`}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Boutons de navigation */}
        <button
          onClick={prevSlide}
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/70 hover:bg-black/90 text-white p-3 rounded-full transition-colors z-10 shadow-lg"
        >
          <ChevronLeft size={20} />
        </button>
        
        <button
          onClick={nextSlide}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/70 hover:bg-black/90 text-white p-3 rounded-full transition-colors z-10 shadow-lg"
        >
          <ChevronRight size={20} />
        </button>
      </div>
      
      {/* Indicateurs de pagination */}
      <div className="flex justify-center gap-2 mt-6">
        {Array.from({ length: Math.ceil(PORTFOLIO_CONFIG.instagramPosts.length / postsPerView) }).map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              Math.floor(currentIndex / postsPerView) === index 
                ? 'bg-purple-400 scale-110' 
                : 'bg-gray-600 hover:bg-gray-500'
            }`}
          />
        ))}
      </div>
      
      {/* Lien vers Instagram */}
      <div className="text-center mt-8">
        <a
          href={PORTFOLIO_CONFIG.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 rounded-xl transition-all duration-300 text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <Instagram size={24} />
          Suivez-moi sur Instagram
        </a>
      </div>
    </div>
  );
};

export default InstagramCarousel;