import { useRef, useState } from "react";
import type PORTFOLIO_CONFIG from "./portfolioData";
import { ExternalLink, Eye, Github, Pause, Play, Star } from "lucide-react";

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

// Composant pour les projets avec media
const ProjectCard: React.FC<{ project: typeof PORTFOLIO_CONFIG.projects[0] }> = ({ project }) => {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  
  const isYouTube = project.video && isYouTubeUrl(project.video);
  const youtubeEmbedUrl = isYouTube ? getYouTubeEmbedUrl(project.video!) : null;
  
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
      // Pour YouTube, on ne peut pas contrôler directement le play/pause via l'API embed basique
      // On peut récharger l'iframe pour "redémarrer" la vidéo
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
  
  return (
    <div className={`group relative bg-gray-900/50 backdrop-blur-sm border border-purple-500/30 rounded-xl overflow-hidden hover:border-purple-400/60 transition-all duration-500 ${project.featured ? 'lg:col-span-2' : ''}`}>
      <div className="relative aspect-video overflow-hidden">
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
                className="w-full h-full object-cover"
                loop
                muted
                autoPlay
              />
            )}
            <button
              onClick={togglePlayPause}
              className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors z-10"
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
      
      <div className="p-6 relative bottom-0">
        <h3 className="text-xl font-bold mb-2 text-white group-hover:text-purple-300 transition-colors ">
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

export default ProjectCard;