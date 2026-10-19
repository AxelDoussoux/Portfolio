import { FaDocker } from 'react-icons/fa';
import {  FiServer as Server,  FiList as List,  FiGithub} from 'react-icons/fi';
import { LiaAdobe } from 'react-icons/lia';
import { PiIslandLight } from 'react-icons/pi';
import type { IconType } from 'react-icons';
import { SiBlender, SiCloudflare, SiExpress, SiFigma, SiFirebase, SiFramer, SiGit, SiGithubactions, SiNextdotjs, SiNodedotjs, SiPostgresql, SiReact, SiRust, SiStrapi, SiSupabase, SiTailwindcss, SiThreedotjs, SiTypescript, SiUnity, SiVite, SiWordpress } from 'react-icons/si';

const SiCanva: IconType = (props) => (
  <svg stroke="currentColor" fill="currentColor" strokeWidth="0" role="img" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zM6.962 7.68c.754 0 1.337.549 1.405 1.2.069.583-.171 1.097-.822 1.406-.343.171-.48.172-.549.069-.034-.069 0-.137.069-.206.617-.514.617-.926.548-1.508-.034-.378-.308-.618-.583-.618-1.2 0-2.914 2.674-2.674 4.629.103.754.549 1.646 1.509 1.646.308 0 .65-.103.96-.24.5-.264.799-.47 1.097-.8-.073-.885.704-2.046 1.851-2.046.515 0 .926.205.96.583.068.514-.377.582-.514.582s-.378-.034-.378-.17c-.034-.138.309-.07.275-.378-.035-.206-.24-.274-.446-.274-.72 0-1.131.994-1.029 1.611.035.275.172.549.447.549.205 0 .514-.31.617-.755.068-.308.343-.514.583-.514.102 0 .17.034.205.171v.138c-.034.137-.137.548-.102.651 0 .069.034.171.17.171.092 0 .436-.18.777-.459.117-.59.253-1.298.253-1.357.034-.24.137-.48.617-.48.103 0 .171.034.205.171v.138l-.136.617c.445-.583 1.097-.994 1.508-.994.172 0 .309.102.309.274 0 .103 0 .274-.069.446-.137.377-.309.96-.412 1.474 0 .137.035.274.207.274.171 0 .685-.206 1.096-.754l.007-.004c-.002-.068-.007-.134-.007-.202 0-.411.035-.754.104-.994.068-.274.411-.514.617-.514.103 0 .205.069.205.171 0 .035 0 .103-.034.137-.137.446-.24.857-.24 1.269 0 .24.034.582.102.788 0 .034.035.069.07.069.068 0 .548-.445.89-1.028-.308-.206-.48-.549-.48-.96 0-.72.446-1.097.858-1.097.343 0 .617.24.617.72 0 .308-.103.65-.274.96h.102a.77.77 0 0 0 .584-.24.293.293 0 0 1 .134-.117c.335-.425.83-.74 1.41-.74.48 0 .924.205.959.582.068.515-.378.618-.515.618l-.002-.002c-.138 0-.377-.035-.377-.172 0-.137.309-.068.274-.376-.034-.206-.24-.275-.446-.275-.686 0-1.13.891-1.028 1.611.034.275.171.583.445.583.206 0 .515-.308.652-.754.068-.274.343-.514.583-.514.103 0 .17.034.205.171 0 .069 0 .206-.137.652-.17.308-.171.48-.137.617.034.274.171.48.309.583.034.034.068.102.068.102 0 .069-.034.138-.137.138-.034 0-.068 0-.103-.035-.514-.205-.72-.548-.789-.891-.205.24-.445.377-.72.377-.445 0-.89-.411-.96-.926a1.609 1.609 0 0 1 .075-.649c-.203.13-.422.203-.623.203h-.17c-.447.652-.927 1.098-1.27 1.303a.896.896 0 0 1-.377.104c-.068 0-.171-.035-.205-.104-.095-.152-.156-.392-.193-.667-.481.527-1.145.805-1.453.805-.343 0-.548-.206-.582-.55v-.376c.102-.754.377-1.2.377-1.337a.074.074 0 0 0-.069-.07c-.24 0-1.028.824-1.166 1.373l-.103.445c-.068.309-.377.515-.582.515-.103 0-.172-.035-.206-.172v-.137l.046-.233c-.435.31-.87.508-1.075.508-.308 0-.48-.172-.514-.412-.206.274-.445.412-.754.412-.352 0-.696-.24-.862-.593-.244.275-.523.553-.852.764-.48.309-1.028.549-1.68.549-.582 0-1.097-.309-1.371-.583-.412-.377-.651-.96-.686-1.509-.205-1.68.823-3.84 2.4-4.8.378-.205.755-.343 1.132-.343zm9.77 3.291c-.104 0-.172.172-.172.343 0 .274.137.583.309.755a1.74 1.74 0 0 0 .102-.583c0-.343-.137-.515-.24-.515z" />
  </svg>
);

// Configuration du portfolio

const PORTFOLIO_CONFIG = {
  name: "Axel DOUSSOUX",
  title: "Développeur Fullstack",
  github: "https://github.com/AxelDoussoux",
  linkedin: "https://www.linkedin.com/in/axeldoussoux/",
  email: "contact@axeldoussoux.fr",
  bio: "Etudiant en développement informatique, je conçois des applications performantes, évolutives et intuitives, avec une attention forte au design, à la qualité du code et à l'expérience utilisateur.",

  skills: [
    { name: "React", icon: SiReact, category: "Frontend" },
    { name: "TypeScript", icon: SiTypescript, category: "Frontend" },
    { name: "TailWindCSS", icon: SiTailwindcss, category: "Frontend" },
    { name: "Three.js", icon: SiThreedotjs, category: "Frontend" },
    { name: "Next.js", icon: SiNextdotjs, category: "Frontend" },
    { name: "Vite", icon: SiVite, category: "Frontend" },
    { name: "PostgreSQL", icon: SiPostgresql, category: "Backend & Données" },
    { name: "Strapi", icon: SiStrapi, category: "Backend & Données" },
    { name: "API REST", icon: Server, category: "Backend & Données" },
    { name: "Express", icon: SiExpress, category: "Backend & Données" },
    { name: "Supabase", icon: SiSupabase, category: "Backend & Données" },
    { name: "Cloudflare Workers", icon: SiCloudflare, category: "Backend & Données" },
    { name: "Firebase", icon: SiFirebase, category: "Backend & Données" },
    { name: "Git", icon: SiGit, category: "Outils" },
    { name: "GitHub", icon: FiGithub, category: "Outils" },
    { name: "Docker", icon: FaDocker, category: "Outils" },
    { name: "Jira / Notion", icon: List, category: "Outils" },
    { name: "Blender", icon: SiBlender, category: "Création 3D" },
    { name: "Unity", icon: SiUnity, category: "Création 3D" },
    { name: "Figma", icon: SiFigma, category: "Design" },
    { name: "Adobe Suite", icon: LiaAdobe, category: "Design" },
    { name: "WordPress", icon: SiWordpress, category: "Design" },
    { name: "Canva", icon: SiCanva, category: "Design" },
    { name: "Framer", icon: SiFramer, category: "Design" },
  ],

  learningSkills: [
    { name: "Rust", icon: SiRust, category: "En cours d'apprentissage" },
    { name: "Node.js", icon: SiNodedotjs, category: "En cours d'apprentissage" },
    { name: "GitHub Actions", icon: SiGithubactions, category: "En cours d'apprentissage" },
    { name: "TanStack Start", icon: PiIslandLight, category: "En cours d'apprentissage" },
  ],

  projects: [
    {
      id: 1,
      title: "Season Job",
      description: "Web app mobile de recrutement saisonnier : recherche géolocalisée, candidature en un clic, réponse employeur garantie sous 48 h, messagerie et contrat signé en ligne. Projet de Master mené en équipe de quatre.",
      image: "/images/seasonjob_1.png",
      images: ["/images/seasonjob_1.png", "/images/seasonjob_2.png"],
      video: "",
      technologies: ["TypeScript", "React", "TanStack Start", "TailwindCSS", "Supabase", "Cloudflare Workers", "Leaflet", "Playwright"],
      github: "",
      demo: "https://season-jobs.axeldoussoux.workers.dev",
      featured: true,
      year: "2026",
      duration: "5 semaines",
      type: "Web app mobile",
      status: "Terminé",
      features: [
        "Recherche multicritères sur 120 annonces, en liste ou sur carte Leaflet",
        "Candidature en un clic et garantie de réponse sous 48 h",
        "Messagerie directe et contrat signé électroniquement",
        "Interface mobile-first : navigation au pouce, PWA installable"
      ],
      challenges: "Le défi était de faire tenir un parcours complet, de la recherche d'annonce au contrat signé, sur un écran de téléphone, tout en migrant le backend de Firebase vers Supabase en cours de projet et en couvrant les parcours critiques par des tests Playwright."
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
      duration: "2 semaines",
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
      status: "En développement",
      features: [
        "Calcul des flux de production par ressource",
        "Gestion de plusieurs cibles et presets de plan",
        "Import / export de configuration complète",
        "Graphe de chaîne et indicateurs KPI"
      ],
      challenges: "Le principal défi a été de structurer un calculateur complexe tout en gardant une interface lisible, rapide à manipuler et suffisamment claire pour comparer plusieurs scénarios de production."
    },
    {
      id: 4,
      title: "Les Enfants Du Rhône",
      description: "Site vitrine de la webradio lyonnaise Les Enfants Du Rhône : lecteur radio en direct, programmation des émissions, podcasts et ateliers, le tout alimenté par un back-office Strapi.",
      image: "/images/enfantsduRhone_1.png",
      images: ["/images/enfantsduRhone_1.png", "/images/enfantsduRhone_2.png", "/images/enfantsduRhone_3.png"],
      video: "",
      technologies: ["React", "TypeScript", "TailwindCSS", "Strapi", "API REST"],
      github: "",
      demo: "https://les-enfants-du-rhone.fr",
      featured: true,
      year: "2026",
      duration: "3 mois",
      type: "Site vitrine - Webradio",
      status: "Terminé",
      features: [
        "Lecteur radio en direct intégré",
        "Programmation des émissions et fiches podcasts",
        "Back-office Strapi pour la gestion des contenus",
        "Outil type Linktree pour partager les podcasts"
      ],
      challenges: "Le défi principal était de couvrir un contenu éditorial riche (émissions, podcasts, ateliers) avec un lecteur radio fonctionnel en direct, le tout géré dynamiquement via un back-office Strapi, sans sacrifier la fluidité ni la clarté de l'interface."
    }
  ],



  education: [
    {
      id: 1,
      degree: "BUT Métiers du Multimédia et de l'Internet",
      school: "Université Clermont Auvergne",
      period: "2022 - 2025",
      start: "2022-09",
      specialty: "Développement Web & Dispositifs Interactifs",
      description: "Conception UX/UI, frameworks JavaScript, APIs RESTful et gestion de projets agiles.",
    },
    {
      id: 2,
      degree: "Master Informatique",
      school: "Université Lumière Lyon 2",
      period: "2025 - 2027",
      start: "2025-09",
      specialty: "Conception et Intégration Multimédia",
      description: "Développement web avancé, architecture logicielle, bases de données relationnelles et sécurité.",
    },
  ],

  experiences: [
    {
      id: 4,
      role: "Développeur Fullstack",
      company: "Les Enfants Du Rhône",
      logo: "/images/LEDR_logo.png",
      period: "Avril - Juillet 2026",
      start: "2026-04",
      description: "Stage de développement web : création d'un site vitrine en React, TypeScript et Tailwind CSS, mise en place d'un back-office Strapi et développement d'un outil type Linktree pour partager les podcasts.",
      technologies: ["React", "TypeScript", "TailwindCSS", "Strapi", "Git"],
      achievements: [
        "Développement d'un site vitrine en React, TypeScript et Tailwind CSS",
        "Mise en place d'un back-office avec Strapi",
        "Création d'un outil type Linktree pour partager les podcasts"
      ]
    },
    {
      id: 1,
      role: "Développeur Web Fullstack",
      company: "MusicBrainTraining Company",
      logo: "/images/MBTC_logo.png",
      period: "Mars - Mai 2025",
      start: "2025-03",
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
      start: "2025-05",
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
      start: "2024-01",
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
