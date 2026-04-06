import { useRef, useEffect } from "react";
import * as THREE from 'three';


// Composant pour l'arrière-plan 3D animé - Galaxie spirale améliorée


const GalaxyBackground: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>(0);

  useEffect(() => {
    if (!mountRef.current) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const deviceMemory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;
    const hardwareConcurrency = navigator.hardwareConcurrency ?? 8;
    const isMobile = window.innerWidth < 768;
    const lowEndDevice = hardwareConcurrency <= 4 || deviceMemory <= 4;
    const pixelRatioCap = prefersReducedMotion ? 1 : (isMobile || lowEndDevice ? 1.2 : 1.6);
    const particlesCount = prefersReducedMotion ? 8000 : (isMobile ? 14000 : (lowEndDevice ? 18000 : 32000));
    const targetFPS = prefersReducedMotion ? 12 : (isMobile || lowEndDevice ? 30 : 45);
    let isPageVisible = document.visibilityState === 'visible';
    let lastFrameTime = 0;

    // Configuration de la scène
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0xf4ead4, 10, 92); // Brouillard chaud et clair pour une ambiance cosy
    
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: !(isMobile || lowEndDevice),
      powerPreference: "high-performance"
    });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, pixelRatioCap));
    renderer.setClearColor(0x000000, 0);
    mountRef.current.appendChild(renderer.domElement);

    // Création de la galaxie spirale
    const galaxyGeometry = new THREE.BufferGeometry();

    // Paramètres de la galaxie spirale adaptatifs
    const positions = new Float32Array(particlesCount * 3);
    const colors = new Float32Array(particlesCount * 3);
    const scales = new Float32Array(particlesCount);
    const randomness = new Float32Array(particlesCount);

    // Couleurs pour la galaxie
    const colorCore = new THREE.Color('#fefae0'); // ivoire
    const colorArm1 = new THREE.Color('#e7c8a0'); // beige chaud
    const colorArm2 = new THREE.Color('#d4a373'); // doré caramel
    const colorArm3 = new THREE.Color('#ccd5ae'); // sauge douce
    const colorOuter = new THREE.Color('#a0734e'); // bord plus profond
    const colorDust = new THREE.Color('#faedcd'); // poussière claire
    const mixedColor = new THREE.Color();

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
      const distanceFromCenter = radius / outsideRadius;
      
      // Couleur en fonction du bras et de la distance
      const armIndex = i % arms;
      if (armIndex === 0) {
        mixedColor.copy(colorArm1);
      } else if (armIndex === 1) {
        mixedColor.copy(colorArm2);
      } else if (armIndex === 2) {
        mixedColor.copy(colorArm3);
      } else {
        mixedColor.copy(colorDust);
      }

      // Mélange avec le centre et l'extérieur
      if (distanceFromCenter < 0.1) {
        mixedColor.lerp(colorCore, 1 - distanceFromCenter * 10);
      } else if (distanceFromCenter > 0.7) {
        mixedColor.lerp(colorOuter, (distanceFromCenter - 0.7) / 0.3);
      }

      // Réduction de la luminosité pour améliorer la lisibilité
      mixedColor.multiplyScalar(0.48 + Math.random() * 0.2);

      colors[i3] = mixedColor.r;
      colors[i3 + 1] = mixedColor.g;
      colors[i3 + 2] = mixedColor.b;

      // Échelle variable réduite pour créer de la diversité sans gêner la lisibilité
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
        float alpha = strength * twinkle * depthFade * 1.15;
        
        // Couleur finale moins brillante
        vec3 finalColor = vColor * (0.68 + strength * 0.18);
        
        gl_FragColor = vec4(finalColor, alpha);
      }
    `;

    const galaxyMaterialShader = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uSize: { value: 28 * renderer.getPixelRatio() } // Taille réduite
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

    // Animation améliorée avec limite FPS
    const clock = new THREE.Clock();
    
    const animate = (time: number) => {
      if (!isPageVisible) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      const frameInterval = 1000 / targetFPS;
      if (time - lastFrameTime < frameInterval) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      lastFrameTime = time;
      const elapsedTime = clock.getElapsedTime();
      
      // Mise à jour du shader
      galaxyMaterialShader.uniforms.uTime.value = elapsedTime;
      
      // Rotation lente et fluide de la galaxie
      galaxy.rotation.y = elapsedTime * 0.05;
      galaxy.rotation.x = Math.sin(elapsedTime * 0.02) * 0.1;
      
      // Mouvement de caméra plus dynamique
      const radius = 10 + Math.sin(elapsedTime * 0.08) * 1.4;
      camera.position.x = Math.cos(elapsedTime * 0.05) * radius;
      camera.position.z = Math.sin(elapsedTime * 0.05) * radius;
      camera.position.y = 8 + Math.sin(elapsedTime * 0.03) * 2;
      camera.lookAt(0, 0, 0);
      
      renderer.render(scene, camera);
      animationRef.current = requestAnimationFrame(animate);
    };

    const handleVisibilityChange = () => {
      isPageVisible = document.visibilityState === 'visible';
      if (isPageVisible) {
        lastFrameTime = performance.now();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    if (prefersReducedMotion) {
      renderer.render(scene, camera);
    } else {
      animationRef.current = requestAnimationFrame(animate);
    }

    // Gestion du redimensionnement
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, pixelRatioCap));

      // Mise à jour de la taille des particules
      galaxyMaterialShader.uniforms.uSize.value = 28 * renderer.getPixelRatio();

      if (prefersReducedMotion) {
        renderer.render(scene, camera);
      }
    };

    window.addEventListener('resize', handleResize);

    // Nettoyage
    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
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
      style={{ background: 'radial-gradient(ellipse at center, #fefae0 0%, #faedcd 52%, #e9edc9 100%)', opacity: 0.9 }}
    />
  );
};

export default GalaxyBackground;