import { 
  FiPenTool as Palette,
  FiZap as Zap,
  FiCpu as Atom,
  FiGitBranch as GitBranch,
  FiGlobe as Globe,
  FiServer as Server,
  FiDatabase as Database,
  FiLayers as Layers,
  FiWind as Waves,
  FiLayout as LayoutTemplate
} from 'react-icons/fi';

// Configuration du portfolio

const PORTFOLIO_CONFIG = {
  name: "Axel DOUSSOUX",
  title: "Développeur Web Fullstack",
  email: "contact@axeldoussoux.fr",
  github: "https://github.com/AxelDoussoux",
  linkedin: "https://www.linkedin.com/in/axeldoussoux/",
  instagram: "https://www.instagram.com/axel_in_the_pict/",
  bio: "Développeur web fullstack, je conçois des applications performantes du front-end au back-end, avec une approche orientée produit, UX et qualité logicielle.",
  
  skills: [
    { name: "TypeScript", icon: Zap, category: "Développement Web" },
    { name: "React", icon: Atom, category: "Développement Web" },
    { name: "Supabase", icon: Database, category: "Base de données" },
    { name: "PostgreSQL", icon: Database, category: "Base de données" },
    { name: "API REST", icon: Globe, category: "Architecture" },
    { name: "TailWindCSS", icon: Waves, category: "Développement Web" },
    { name: "Git", icon: GitBranch, category: "Contrôle de Versions" },
    { name: "Wordpress", icon: Globe, category: "Création de Contenus" },
    { name: "Figma", icon: LayoutTemplate, category: "Design UI/UX" },
    { name: "Three.js", icon: Globe, category: "Web 3D" },
    { name: "Blender", icon: Palette, category: "Modélisation 3D" },
    { name: "Adobe Suite", icon: Layers, category: "Création de Contenus" },
  ],

  learningSkills: [
    { name: "C++", icon: Zap, category: "Langages système" },
    { name: "Rust", icon: GitBranch, category: "Programmation système" },
    { name: "Next.js", icon: Globe, category: "Framework fullstack" },
    { name: "Node.js", icon: Server, category: "Back-end" },
  ],
  
  projects: [
    {
      id: 1,
      title: "FlowSync",
      description: "Landing page de démonstration pour un faux SaaS orienté productivité, avec narration produit, preuve sociale et sections de conversion.",
      image: "/images/landing_1.png",
      images: ["/images/landing_1.png", "/images/landing_2.png"],
      video: "",
      technologies: ["TypeScript", "React", "TailwindCSS", "Vite"],
      github: "https://github.com/AxelDoussoux/Landing-project-1",
      demo: "https://axeldoussoux.github.io/Landing-project-1/",
      featured: true,
      year: "2026",
      duration: "Quelques jours",
      type: "Landing page SaaS",
      status: "Terminé",
      features: [
        "Collaboration en temps réel mise en avant",
        "Automatisation intelligente et rappels",
        "Dashboard décisionnel pour suivre l'avancement",
        "Mode focus et structure orientée conversion"
      ],
      challenges: "Le principal défi était de rendre la proposition de valeur évidente dès le premier écran, tout en gardant une hiérarchie visuelle claire, un rythme calme et une page orientée conversion."
    },
    {
      id: 2,
      title: "3D World Viewer",
      description: "Visualiseur web 3D permettant d'explorer des environnements interactifs directement dans le navigateur.",
      image: "/images/WorldViewer3D_1.png",
      images: ["/images/WorldViewer3D_1.png", "/images/WorldViewer3D_2.png"],
      video: "",
      technologies: ["Symfony", "JavaScript", "Three.js", "WebGL"],
      github: "https://github.com/AxelDoussoux/3D-World-Viewer",
      demo: "https://axeldoussoux.github.io/3D-World-Viewer/",
      featured: true,
      year: "2025",
      duration: "1 mois",
      type: "Projet web 3D",
      status: "Terminé",
      features: [
        "Rendu de scène 3D dans le navigateur",
        "Navigation caméra et interactions utilisateur",
        "Chargement d'assets optimisé",
        "Architecture orientée performance"
      ],
      challenges: "Le challenge principal a été d'obtenir un rendu fluide sur des machines hétérogènes, en optimisant les ressources et la gestion du pipeline graphique côté web."
    },
    {
      id: 3,
      title: "Satisfactory Calculator",
      description: "Outil de planification d'usine pour Satisfactory avec calculs de production, KPI, objectifs multiples et graphe de chaîne interactif.",
      image: "/images/SCalculator_1.png",
      images: ["/images/SCalculator_1.png", "/images/SCalculator_2.png"],
      video: "",
      technologies: ["TypeScript", "React", "TailwindCSS", "Vite"],
      github: "https://github.com/AxelDoussoux/SatisfactoryCalculator",
      demo: "https://axeldoussoux.github.io/SatisfactoryCalculator/",
      featured: true,
      year: "2026",
      type: "Outil de planification d'usine pour jeu vidéo",
      status: "Terminé",
      features: [
        "Calcul des flux de production par ressource",
        "Gestion de plusieurs cibles et presets de plan",
        "Import / export de configuration complète",
        "Graphe de chaîne et indicateurs KPI"
      ],
      challenges: "Le principal défi a été de structurer un calculateur complexe tout en gardant une interface lisible, rapide à manipuler et suffisamment claire pour comparer plusieurs scénarios de production."
    }
  ],

  instagramPosts: [
    {
      id: 1,
      embedUrl: "https://www.instagram.com/p/DDFbY24tAvz/embed/",
      link: "https://www.instagram.com/p/DDFbY24tAvz/"
    },
    {
      id: 2,
      embedUrl: "https://www.instagram.com/p/DCf1LgovgeC/embed/",
      link: "https://www.instagram.com/p/DCf1LgovgeC/"
    },
    {
      id: 3,
      embedUrl: "https://www.instagram.com/p/DA3TZ6UPefm/embed/",
      link: "https://www.instagram.com/p/DA3TZ6UPefm/"
    },
    {
      id: 4,
      embedUrl: "https://www.instagram.com/p/Ct145ebIogT/embed/",
      link: "https://www.instagram.com/p/Ct145ebIogT/"
    },
    {
      id: 5,
      embedUrl: "https://www.instagram.com/p/Ctu7kkmoPWX/embed/",
      link: "https://www.instagram.com/p/Ctu7kkmoPWX/"
    },
    {
      id: 6,
      embedUrl: "https://www.instagram.com/p/C1E997AtDca/embed/",
      link: "https://www.instagram.com/p/C1E997AtDca/"
    }
  ],

  experiences: [
    {
      id: 1,
      role: "Développeur Web Fullstack",
      company: "MusicBrainTraining Company",
      logo: "/images/MBTC_logo.png",
      period: "Mars - Mai 2025",
      description: "Refonte fullstack d'une plateforme web : modernisation du front-end, structuration de la logique métier et intégration d'interactions avancées.",
      technologies: ["TypeScript", "React", "Pixi.js", "API REST", "Git"],
      achievements: [
        "Migration vers une architecture front-end modulaire",
        "Amélioration des performances sur mobile et tablette",
        "Standardisation des bonnes pratiques de développement"
      ]
    },
    {
    id: 2,
      role: "Assistant Développeur de Jeux Vidéo",
      company: "BD CRAFT",
      logo: "/images/bdcraft_logo.png",
      period: "Mai - Juillet 2025",
      description: "Aide au développement d'un jeu vidéo indie multijoueur utilisant Unity et C#.",
      technologies: ["Unity", "C#", "Blender", "Git", "Game Design Document", ],
      achievements: [
        "Narration et dialogue pour les personnages",
        "Modélisation d'assets 3D et animations",
        "Création d'un monde procédural avec un système de grille et de tiles pour la génération de terrain"
      ]
    },
    {
      id: 3,
      role: "Concepteur de supports de communication",
      company: "MOBIVIE - Transdev Vichy",
      logo: "/images/mobivie_logo.png",
      period: "Janvier - Mars 2024",
      description: "Concepteur de support de communication pour la promotion des services de transport public de la communauté de commune de Vichy, incluant la création de visuels et de vidéos.",
      technologies: ["Suite Adobe", "DaVinci Resolve", "Captation photo et vidéo"],
      achievements: [
        "Conception d'affiches et flyers",
        "Publicité en Motion Design",
        "Production de publicité vidéo pour les réseaux sociaux"
      ]
    }
  ],

};

export default PORTFOLIO_CONFIG;