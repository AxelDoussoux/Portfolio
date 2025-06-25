import { useRef, useEffect } from "react";
import * as THREE from 'three';


// Composant pour l'arrière-plan 3D animé - Galaxie spirale améliorée


const GalaxyBackground: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animationRef = useRef<number>(0);

  useEffect(() => {
    if (!mountRef.current) return;

    // Configuration de la scène
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x000000, 10, 100); // Effet de brouillard pour la profondeur
    
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: true,
      powerPreference: "high-performance"
    });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    mountRef.current.appendChild(renderer.domElement);

    sceneRef.current = scene;
    rendererRef.current = renderer;

    // Création de la galaxie spirale
    const galaxyGeometry = new THREE.BufferGeometry();

    // Paramètres de la galaxie spirale améliorée
    const particlesCount = 50000;
    const positions = new Float32Array(particlesCount * 3);
    const colors = new Float32Array(particlesCount * 3);
    const scales = new Float32Array(particlesCount);
    const randomness = new Float32Array(particlesCount);    // Couleurs pour la galaxie (adaptées au thème du site)
    const colorCore = new THREE.Color('#ffffff'); // Centre blanc brillant
    const colorArm1 = new THREE.Color('#a855f7'); // purple-500
    const colorArm2 = new THREE.Color('#8b5cf6'); // purple-400
    const colorArm3 = new THREE.Color('#60a5fa'); // blue-400
    const colorOuter = new THREE.Color('#6366f1'); // indigo-500 (transition)
    const colorDust = new THREE.Color('#c084fc'); // purple-300 (poussière d'étoiles)

    // Paramètres de la spirale
    const arms = 3;
    const spin = 3;
    const randomnessPower = 3;
    const insideRadius = 1.5;
    const outsideRadius = 15;

    for (let i = 0; i < particlesCount; i++) {
      const i3 = i * 3;

      // Position en spirale logarithmique
      const radius = Math.random() * outsideRadius + insideRadius;
      const spinAngle = radius * spin;
      const branchAngle = (i % arms) / arms * Math.PI * 2;

      // Randomness plus prononcé pour les bras
      const randomX = Math.pow(Math.random(), randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * randomnessPower * radius * 0.1;
      const randomY = Math.pow(Math.random(), randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * randomnessPower * radius * 0.05;
      const randomZ = Math.pow(Math.random(), randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * randomnessPower * radius * 0.1;

      positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
      positions[i3 + 1] = randomY;
      positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;

      // Couleurs plus complexes et brillantes
      let mixedColor = new THREE.Color();
      const distanceFromCenter = radius / outsideRadius;
      
      // Couleur en fonction du bras et de la distance
      const armIndex = i % arms;
      if (armIndex === 0) {
        mixedColor = colorArm1.clone();
      } else if (armIndex === 1) {
        mixedColor = colorArm2.clone();
      } else if (armIndex === 2) {
        mixedColor = colorArm3.clone();
      } else {
        mixedColor = colorDust.clone();
      }

      // Mélange avec le centre et l'extérieur
      if (distanceFromCenter < 0.1) {
        mixedColor.lerp(colorCore, 1 - distanceFromCenter * 10);
      } else if (distanceFromCenter > 0.7) {
        mixedColor.lerp(colorOuter, (distanceFromCenter - 0.7) / 0.3);
      }      // Réduction de la luminosité pour améliorer la lisibilité
      mixedColor.multiplyScalar(0.6 + Math.random() * 0.3);

      colors[i3] = mixedColor.r;
      colors[i3 + 1] = mixedColor.g;
      colors[i3 + 2] = mixedColor.b;      // Échelle variable réduite pour créer de la diversité sans gêner la lisibilité
      scales[i] = Math.random() * 1.2 + 0.3;
      randomness[i] = Math.random();
    }

    galaxyGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    galaxyGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    galaxyGeometry.setAttribute('aScale', new THREE.BufferAttribute(scales, 1));
    galaxyGeometry.setAttribute('aRandomness', new THREE.BufferAttribute(randomness, 1));

    // Shader material amélioré avec effet de profondeur et brillance
    const vertexShader = `
      uniform float uTime;
      uniform float uSize;
      attribute float aScale;
      attribute float aRandomness;
      varying vec3 vColor;
      varying float vDistance;
      varying float vRandomness;

      void main() {
        vec4 modelPosition = modelMatrix * vec4(position, 1.0);
        
        // Rotation différentielle de la galaxie (plus réaliste)
        float angle = atan(modelPosition.x, modelPosition.z);
        float distanceToCenter = length(modelPosition.xz);
        float rotationSpeed = (1.0 / (distanceToCenter + 1.0)) * 0.3;
        float angleOffset = rotationSpeed * uTime;
        
        modelPosition.x = cos(angle + angleOffset) * distanceToCenter;
        modelPosition.z = sin(angle + angleOffset) * distanceToCenter;
        
        // Oscillation verticale subtile
        modelPosition.y += sin(uTime * 0.5 + aRandomness * 10.0) * 0.2;
        
        vec4 viewPosition = viewMatrix * modelPosition;
        vec4 projectedPosition = projectionMatrix * viewPosition;
        
        gl_Position = projectedPosition;
        
        // Taille basée sur la distance et l'échelle
        float sizeAttenuation = 1.0 / -viewPosition.z;
        gl_PointSize = uSize * aScale * sizeAttenuation * (0.5 + aRandomness * 0.5);
        
        vColor = color;
        vDistance = -viewPosition.z;
        vRandomness = aRandomness;
      }
    `;

    const fragmentShader = `
      varying vec3 vColor;
      varying float vDistance;
      varying float vRandomness;
      uniform float uTime;
      
      void main() {
        // Forme circulaire avec glow
        vec2 uv = gl_PointCoord - 0.5;
        float distance = length(uv);
          // Glow effect plus subtil pour la lisibilité
        float strength = 1.0 - distance;
        strength = pow(strength, 1.5);
        
        // Scintillement des étoiles plus discret
        float twinkle = sin(uTime * 2.0 + vRandomness * 15.0) * 0.05 + 0.8;
        
        // Effet de profondeur (flou)
        float depthFade = smoothstep(30.0, 15.0, vDistance);
        
        // Intensité finale plus douce
        float alpha = strength * twinkle * depthFade * 2.0;
        
        // Couleur finale moins brillante
        vec3 finalColor = vColor * (0.8 + strength * 0.2);
        
        gl_FragColor = vec4(finalColor, alpha);
      }
    `;    const galaxyMaterialShader = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uSize: { value: 35 * renderer.getPixelRatio() } // Taille réduite
      },
      vertexShader,
      fragmentShader,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      vertexColors: true
    });

    const galaxy = new THREE.Points(galaxyGeometry, galaxyMaterialShader);
    scene.add(galaxy);

    // Position de la caméra optimisée
    camera.position.set(12, 8, 12);
    camera.lookAt(0, 0, 0);

    // Animation améliorée
    const clock = new THREE.Clock();
    
    const animate = () => {
      const elapsedTime = clock.getElapsedTime();
      
      // Mise à jour du shader
      galaxyMaterialShader.uniforms.uTime.value = elapsedTime;
      
      // Rotation lente et fluide de la galaxie
      galaxy.rotation.y = elapsedTime * 0.05;
      galaxy.rotation.x = Math.sin(elapsedTime * 0.02) * 0.1;
      
      // Mouvement de caméra plus dynamique
      const radius = 10 + Math.sin(elapsedTime * 0.1) * 2;
      camera.position.x = Math.cos(elapsedTime * 0.05) * radius;
      camera.position.z = Math.sin(elapsedTime * 0.05) * radius;
      camera.position.y = 8 + Math.sin(elapsedTime * 0.03) * 3;
      camera.lookAt(0, 0, 0);
      
      renderer.render(scene, camera);
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Gestion du redimensionnement
    const handleResize = () => {
      if (!rendererRef.current) return;
      
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      rendererRef.current.setSize(window.innerWidth, window.innerHeight);
      rendererRef.current.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        // Mise à jour de la taille des particules (réduite)
      galaxyMaterialShader.uniforms.uSize.value = 35 * rendererRef.current.getPixelRatio();
    };

    window.addEventListener('resize', handleResize);

    // Nettoyage
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      galaxyGeometry.dispose();
      galaxyMaterialShader.dispose();
      renderer.dispose();
    };
  }, []);
  return (
    <div 
      ref={mountRef} 
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ background: 'radial-gradient(ellipse at center, #1e1b4b 0%, #111827 50%, #000000 100%)', opacity: 0.8 }}
    />
  );
};

export default GalaxyBackground;