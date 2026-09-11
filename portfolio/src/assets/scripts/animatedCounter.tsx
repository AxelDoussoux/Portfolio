import React, { useEffect, useRef, useState } from 'react';
import { animate } from 'animejs';

import { useReducedMotion } from './useReducedMotion';

interface AnimatedCounterProps {
  value: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  play?: boolean;
  className?: string;
}

const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  prefix = '',
  suffix = '',
  duration = 1400,
  play = true,
  className,
}) => {
  const reducedMotion = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const element = ref.current;
    if (!element || !play || !inView) return;

    if (reducedMotion) {
      element.textContent = `${prefix}${value}${suffix}`;
      return;
    }

    const counter = { value: 0 };
    let emphasis: ReturnType<typeof animate> | null = null;
    const animation = animate(counter, {
      value,
      duration,
      ease: 'outExpo',
      onUpdate: () => {
        element.textContent = `${prefix}${Math.round(counter.value)}${suffix}`;
      },
      onComplete: () => {
        emphasis = animate(element, {
          scale: [1, 1.12, 1],
          color: ['#0055FF', '#0A0A0E', '#0055FF'],
          duration: 420,
          ease: 'outCubic',
        });
      },
    });

    return () => {
      animation.revert();
      emphasis?.revert();
    };
  }, [play, inView, value, duration, prefix, suffix, reducedMotion]);

  return (
    <span ref={ref} className={className} aria-label={`${prefix}${value}${suffix}`}>
      {`${prefix}${value}${suffix}`}
    </span>
  );
};

export default AnimatedCounter;
