

// Configuration du portfolio


const PORTFOLIO_CONFIG = {
  name: "Axel DOUSSOUX",
  title: "Game Developer & 3D Artist",
  email: "votre.email@example.com",
  github: "https://github.com/AxelDoussoux",
  linkedin: "https://www.linkedin.com/in/axeldoussoux/",
  bio: "Développeur passionné spécialisé dans la création de jeux vidéo et la modélisation 3D. Expert en Unity, Blender et technologies web modernes.",
  
  skills: [
    { name: "Unity 3D", icon: "🎮", category: "Game Engine" },
    { name: "Blender", icon: "🎨", category: "3D Modeling" },
    { name: "C#", icon: "💻", category: "Programming" },
    { name: "Java", icon: "☕", category: "Programming" },
    { name: "TypeScript", icon: "🚀", category: "Programming" },
    { name: "React", icon: "⚛️", category: "Web Dev" },
    { name: "Git", icon: "🐙", category: "Version Control" },
    { name: "Three.js", icon: "🌐", category: "Web 3D" }

  ],
  
  projects: [
    {
      id: 1,
      title: "Cyberpunk Racing Game",
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
      title: "Medieval Castle - 3D Environment",
      description: "Environnement 3D médiéval complet créé avec Blender, optimisé pour les moteurs de jeu avec textures PBR.",
      image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=600&fit=crop",
      technologies: ["Blender", "Substance Painter", "PBR Texturing"],
      github: "https://github.com/votre-username/medieval-castle",
      featured: true
    },
    {
      id: 3,
      title: "Puzzle Platformer",
      description: "Jeu de plateforme avec mécaniques de puzzle innovantes, développé en équipe lors d'une game jam.",
      image: "https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=800&h=600&fit=crop",
      technologies: ["Unity", "C#", "Level Design", "UI/UX"],
      github: "https://github.com/votre-username/puzzle-platformer",
      demo: "https://votre-demo.com"
    },
    {
      id: 4,
      title: "Procedural Terrain Generator",
      description: "Outil de génération procédurale de terrains avec interface web interactive utilisant Three.js.",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
      technologies: ["Three.js", "React", "WebGL", "Noise Functions"],
      github: "https://github.com/votre-username/terrain-generator",
      demo: "https://votre-demo.com"
    }
  ]
};

export default PORTFOLIO_CONFIG;