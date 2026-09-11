import React, { useEffect, useRef, useState } from 'react';
import { animate } from 'animejs';

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

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      element.textContent = `${prefix}${value}${suffix}`;
      return;
    }

    const counter = { value: 0 };
    const animation = animate(counter, {
      value,
      duration,
      ease: 'outExpo',
      onUpdate: () => {
        element.textContent = `${prefix}${Math.round(counter.value)}${suffix}`;
      },
    });

    return () => {
      animation.cancel();
    };
  }, [play, inView, value, duration, prefix, suffix]);

  return (
    <span ref={ref} className={className} aria-label={`${prefix}${value}${suffix}`}>
      {`${prefix}${value}${suffix}`}
    </span>
  );
};

export default AnimatedCounter;
