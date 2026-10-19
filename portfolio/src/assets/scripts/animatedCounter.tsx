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
      { threshold: 0.1, rootMargin: '0px 0px -10px 0px' }
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
          scale: [1, 1.14, 1],
          duration: 360,
          ease: 'outBack(1.5)',
        });
      },
    });

    return () => {
      animation.revert();
      emphasis?.revert();
    };
  }, [play, inView, value, duration, prefix, suffix, reducedMotion]);

  const displayInitial = reducedMotion ? value : 0;

  return (
    <span
      ref={ref}
      className={`inline-block origin-center ${className ?? ''}`}
      aria-label={`${prefix}${value}${suffix}`}
    >
      {`${prefix}${displayInitial}${suffix}`}
    </span>
  );
};

export default AnimatedCounter;
