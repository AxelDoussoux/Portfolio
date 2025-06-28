import { 
  Gamepad2, 
  Palette, 
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
  LayoutTemplate,
  HashIcon
} from 'lucide-react';

// Configuration du portfolio

const PORTFOLIO_CONFIG = {
  name: "Axel DOUSSOUX",
  title: "Développeur de Jeu Vidéo & Artist 3D",
  avatar: "/images/pp.png",
  email: "contact@axeldoussoux.fr",
  github: "https://github.com/AxelDoussoux",
  linkedin: "https://www.linkedin.com/in/axeldoussoux/",
  instagram: "https://www.instagram.com/axel_in_the_pict/",
  bio: "Développeur passionné spécialisé dans la création de jeux vidéo et la modélisation 3D. Expert en Unity, Blender et technologies web modernes.",
  
  skills: [
    { name: "Unity", icon: Gamepad2, category: "Moteur de Jeu" },
    { name: "Blender", icon: Palette, category: "Modélisation 3D" },
    { name: "Aseprite", icon: Blocks, category: "Art 2D" },
    { name: "Krita", icon: Brush, category: "Art 2D" },
    { name: "C#", icon: HashIcon, category: "Programmation" },
    { name: "Java", icon: Coffee, category: "Programmation" },
    { name: "Git", icon: GitBranch, category: "Contrôle de Version" },
    { name: "TypeScript", icon: Zap, category: "Développement Web" },
    { name: "React", icon: Atom, category: "Développement Web" },
    { name: "TailWindCSS", icon: Waves, category: "Développement Web" },
    { name: "Figma", icon: LayoutTemplate, category: "Design UI/UX" },
    { name: "Three.js", icon: Globe, category: "Web 3D" },
    { name: "Pixi.js", icon: FileX, category: "Web 2D" },
    { name: "Adobe Suite", icon: Layers, category: "Création de Contenu" },
    { name: "DaVinci Resolve", icon: Video, category: "Création de Contenu" },
    { name: "FL Studio", icon: Music, category: "Production Musicale" },
  ],
  
  projects: [
    {
    id: 1,
    title: "Dream Bounds",
    description: "Jeu de plateforme 3D réalisé sur Unity avec composante multijoueur en ligne grace à Netcode. Ce porjet a été réalisé avec 2 autres personnes dans le cadre d'une SAE (Projet Universitaire) du 5ème semestre de mon BUT Métier du Multimédia et de l'Internet.",
    image: "/images/Unity_1.png",
    video: "https://www.youtube.com/watch?v=VhiG8OI3nHk", // Exemple YouTube
    technologies: ["Unity", "C#", "Blender", "FL Studio", "Netcode", "Shader Graph", "UI Toolkit"],
    github: "https://github.com/username/platformer-game",
    demo: "https://platformer-game-demo.com",
    featured: true,
    year: 2025,
    duration: "5 mois",
    type: "Projet universitaire / SAE",
    status: "Terminé",
    features: [
      "Multijoueur en ligne avec relations Client-Serveur Netcode",
      "3 niveaux de jeu avec environnements variés",
      "Modélisation 3D et animations personnalisées sur Blender",
      "Musique dynamique composée avec FL Studio",
      "Optimisation graphiques et shader-graph personnalisés",
      "Interface utilisateur intuitive avec UI-Toolkit"
    ],
    challenges: "La gestion de la synchronisation des états entre les clients et le serveur a été un défi majeur. J'ai dû implémenter des systèmes de réplication d'état et de gestion des collisions pour assurer une expérience fluide. De plus, l'optimisation des performances graphiques pour maintenir un framerate stable sur différents appareils a nécessité une attention particulière."
  },
  {
    id: 2,
    title: "Modélisation 3D",
    description: "Scène 3D réalisée sur Blender, mettant en avant mes compétences en modélisation, texturing et animation.",
    image: "/images/ecommerce-app.jpg",
    technologies: ["React", "TypeScript", "Node.js", "MongoDB"],
    github: "https://github.com/username/ecommerce-app",
    demo: "https://ecommerce-demo.com",
    featured: false,
    year: 2025,
    duration: "3 mois",
    type: "Projet personnel",
    status: "En cours",
    features: [
      "Authentification sécurisée JWT",
      "Catalogue produits avec filtres avancés",
      "Panier d'achat persistant",
      "Système de paiement Stripe intégré",
      "Panel d'administration complet",
      "API REST complète documentée"
    ],
    challenges: "L'intégration sécurisée du système de paiement et la gestion des états complexes côté client ont été les principaux défis. J'ai utilisé Redux Toolkit pour une gestion d'état prévisible et implémenté des middlewares de sécurité robustes pour protéger les données sensibles."
  },
  {
    id: 3,
    title: "Visualisateur 3D Interactif",
    description: "Un outil de visualisation 3D utilisant Three.js pour explorer des modèles complexes avec des interactions en temps réel.",
    image: "/images/3d-visualizer.jpg",
    video: "/videos/3d-visualizer-demo.mp4",
    technologies: ["Three.js", "JavaScript", "WebGL", "GLSL"],
    github: "https://github.com/username/3d-visualizer",
    demo: "https://3d-visualizer-demo.com",
    featured: false,
    year: 2025,
    duration: "5 mois",
    type: "Projet professionnel",
    status: "Terminé",
    features: [
      "Chargement de modèles 3D multiples formats (GLB, OBJ, FBX)",
      "Système d'éclairage dynamique avec shadows",
      "Contrôles de caméra intuitifs (orbit, fly, FPS)",
      "Post-processing effects (bloom, SSAO)",
      "Interface de debug et paramètres en temps réel",
      "Export de captures haute résolution"
    ],
    challenges: "L'optimisation des performances pour les modèles haute poly et l'implémentation de shaders GLSL personnalisés ont été particulièrement challengeants. J'ai développé un système de LOD (Level of Detail) automatique et optimisé le pipeline de rendu pour supporter des scènes complexes à 60 FPS."
  },
  {
    id: 4,
    title: "API REST Microservices",
    description: "Architecture microservices pour une application de gestion avec authentification, base de données et déploiement Docker.",
    image: "/images/microservices-api.jpg",
    technologies: ["Node.js", "Express", "PostgreSQL", "Docker", "AWS"],
    github: "https://github.com/username/microservices-api",
    featured: true,
    year: 2025,
    duration: "6 mois",
    type: "Projet professionnel",
    status: "En production",
    features: [
      "Architecture microservices découplée",
      "Authentification JWT avec refresh tokens",
      "Base de données PostgreSQL avec migrations",
      "Documentation API automatique avec Swagger",
      "Tests unitaires et d'intégration complets",
      "Déploiement automatisé CI/CD"
    ],
    challenges: "La conception d'une architecture microservices scalable et la gestion de la communication inter-services ont été complexes. J'ai implémenté un système de message queues avec Redis et mis en place un monitoring complet avec logs centralisés pour faciliter le debugging en production."
  },
  {
    id: 5,
    title: "Application Mobile React Native",
    description: "App mobile cross-platform pour la gestion de tâches avec synchronisation cloud et notifications push.",
    image: "/images/mobile-app.jpg",
    technologies: ["React Native", "TypeScript", "Firebase", "Expo"],
    github: "https://github.com/username/mobile-task-app",
    demo: "https://expo.dev/@username/task-app",
    featured: true,
    year: 2025,
    duration: "3 mois",
    type: "Projet personnel",
    status: "Terminé",
    features: [
      "Interface native iOS et Android",
      "Synchronisation temps réel avec Firebase",
      "Notifications push personnalisées",
      "Mode hors-ligne avec sync automatique",
      "Thème sombre/clair adaptatif",
      "Widgets et raccourcis système"
    ],
    challenges: "La gestion de la synchronisation offline/online et l'optimisation des performances sur différents devices ont été les principaux défis. J'ai implémenté un système de cache intelligent et optimisé les rendus pour maintenir une UX fluide même avec de grandes listes de tâches."
  },
  {
    id: 6,
    title: "Outil d'Animation 3D",
    description: "Plugin Blender pour automatiser certaines tâches d'animation et améliorer le workflow des animateurs.",
    image: "/images/blender-plugin.jpg",
    video: "https://youtu.be/example123", // Exemple YouTube court
    technologies: ["Python", "Blender API", "PyQt", "Git"],
    github: "https://github.com/username/blender-animation-tools",
    featured: false,
    year: 2025,
    duration: "2 mois",
    type: "Open Source",
    status: "Terminé",
    features: [
      "Interface utilisateur intuitive intégrée à Blender",
      "Automatisation de tâches répétitives d'animation",
      "Export batch vers différents formats",
      "Système de presets sauvegardables",
      "Compatible Blender 3.0+",
      "Documentation complète utilisateur"
    ],
    challenges: "L'apprentissage approfondi de l'API Blender et la création d'une interface utilisateur cohérente avec l'UI native de Blender ont demandé beaucoup de recherche. J'ai dû gérer la compatibilité entre différentes versions de Blender et optimiser les scripts pour les grosses scènes."
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
  ]

};

export default PORTFOLIO_CONFIG;