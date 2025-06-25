
import { 
  Gamepad2, 
  Palette, 
  Code, 
  Coffee, 
  Zap, 
  Atom, 
  GitBranch, 
  Globe,
  Layers,
  Video,
  FileX,
  Music,
  Blocks,
  Brush,
  Waves,
  LayoutTemplate
} from 'lucide-react';

// Configuration du portfolio

const PORTFOLIO_CONFIG = {
  name: "Axel DOUSSOUX",
  title: "Développeur de Jeu Vidéo & Artist 3D",
  email: "contact@axeldoussoux.fr",
  github: "https://github.com/AxelDoussoux",
  linkedin: "https://www.linkedin.com/in/axeldoussoux/",
  bio: "Développeur passionné spécialisé dans la création de jeux vidéo et la modélisation 3D. Expert en Unity, Blender et technologies web modernes.",
  
  skills: [
    { name: "Unity", icon: Gamepad2, category: "Game Engine" },
    { name: "Blender", icon: Palette, category: "3D Modeling" },
    { name: "Aseprite", icon: Blocks, category: "2D Art" },
    { name: "Krita", icon: Brush, category: "2D Art" },
    { name: "C#", icon: Code, category: "Programming" },
    { name: "Java", icon: Coffee, category: "Programming" },
    { name: "Git", icon: GitBranch, category: "Version Control" },
    { name: "TypeScript", icon: Zap, category: "Web Dev" },
    { name: "React", icon: Atom, category: "Web Dev" },
    { name: "TailWindCSS", icon: Waves, category: "Web Dev" },
    { name: "Figma", icon: LayoutTemplate, category: "UI/UX Design" },
    { name: "Three.js", icon: Globe, category: "Web 3D" },
    { name: "Pixi.js", icon: FileX, category: "Web 2D" },
    { name: "Adobe Suite", icon: Layers, category: "Content Creator" },
    { name: "DaVinci Resolve", icon: Video, category: "Content Creator" },
    { name: "FL Studio", icon: Music, category: "Music Production" },

  ],
  
  projects: [
    {
      id: 1,
      title: "Dream Bounds",
      description: "Jeu de course futuriste développé avec Unity, featuring des effets de particules avancés et un système physique réaliste.",
      image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=600&fit=crop",
      video: "https://www.w3schools.com/html/mov_bbb.mp4",
      technologies: ["Unity", "C#", "Shader Graph", "Post-Processing"],
      github: "https://github.com/votre-username/cyberpunk-racing",
      demo: "https://votre-demo.com",
      featured: true
    },
    {
      id: 2,
      title: "Puzzle Platformer",
      description: "Jeu de plateforme avec mécaniques de puzzle innovantes, développé en équipe lors d'une game jam.",
      image: "https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=800&h=600&fit=crop",
      technologies: ["Unity", "C#", "Level Design", "UI/UX"],
      github: "https://github.com/votre-username/puzzle-platformer",
      demo: "https://votre-demo.com"
    },
    {
      id: 3,
      title: "Scène 3D sur Blender",
      description: "Scène 3D créée sur Blender, mettant en avant des techniques avancées de modélisation et d'éclairage.",
      image: "../images/blender_1.png",
      technologies: ["Blender"],
    },
    {
      id: 4,
      title: "Medieval Castle - 3D Environment",
      description: "Environnement 3D médiéval complet créé avec Blender, optimisé pour les moteurs de jeu avec textures PBR.",
      image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=600&fit=crop",
      technologies: ["Blender", "Substance Painter", "PBR Texturing"],
      github: "https://github.com/votre-username/medieval-castle",
      featured: true
    },
    {
      id: 5,
      title: "Porte 3D sur Blender",
      description: "Porte 3D créée sur Blender, mettant en avant des l'utilisation des shading et .",
      image: "../images/blender_2.png",
      video: "../videos/blender_2.mp4",
      technologies: ["Blender", "Shading"],
    },
    {
      id: 6,
      title: "Porte 3D sur Blender",
      description: "Porte 3D créée sur Blender, mettant en avant des l'utilisation des shading et .",
      image: "../images/blender_2.png",
      video: "../videos/blender_2.mp4",
      technologies: ["Blender", "Shading"],
    },
    {
      id: 7,
      title: "Porte 3D sur Blender",
      description: "Porte 3D créée sur Blender, mettant en avant des l'utilisation des shading et .",
      image: "../images/blender_2.png",
      video: "../videos/blender_2.mp4",
      technologies: ["Blender", "Shading"],
    }
  ],

  experiences: [
    {
      id: 1,
      role: "Assistant Développeur de Jeu Vidéo",
      company: "BD CRAFT",
      period: "Mai - Juillet 2025",
      description: "Aide au développement d'un jeux vidéo indie multijoueur utilisant Unity et C#.",
      technologies: ["Unity", "C#", "Blender"],
      achievements: [
        "Narration et dialogue pour les personnages",
        "Modélisation d'assets 3D et animations",
        "Création d'un monde procédural avec un system de grille et de tiles pour la génération de terrain"
      ]
    },
    {
      id: 2,
      role: "Développeur Web",
      company: "MusicBrainTraining Company",
      period: "Mars - Mai 2025",
      description: "Migration de l'architecture graphique du site en CSS vers une architecture Pixi.js, avec intégration de fonctionnalités interactives.",
      technologies: ["TypeScript", "React", "Pixi.js"],
      achievements: [
        "Migration de l'architecture graphique",
        "Optimisation des performances sur mobile et tablette",
        "Documentation complète du processus"
      ]
    },
    {
      id: 3,
      role: "Concepteur de support de communication",
      company: "MOBIVIE - Transdev Vichy",
      period: "Janvier - Mars 2024",
      description: "Concepteur de support de communication pour la promotion des services de transport public, incluant la création de visuels et de vidéos.",
      technologies: ["Suite Adobe", "DaVinci Resolve", "Captation photo et vidéo"],
      achievements: [
        "Conception d'affiches et flyers",
        "Publicité en Motion Design",
        "Production de publicité vidéo pour les réseaux sociaux"
      ]
    }
  ]
};

export default PORTFOLIO_CONFIG;