import React, { useEffect, useRef, useState } from 'react';
import { animate, stagger, steps } from 'animejs';

interface TypewriterTextProps {
  text: string;
  play?: boolean;
  speed?: number;
  className?: string;
}

const TypewriterText: React.FC<TypewriterTextProps> = ({
  text,
  play = true,
  speed = 45,
  className,
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.4 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el || !play || !inView) return;

    const chars = Array.from(el.querySelectorAll<HTMLElement>('[data-type-char]'));

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      chars.forEach((char) => {
        char.style.opacity = '1';
      });
      return;
    }

    const cursor = cursorRef.current;
    let cursorAnimation: ReturnType<typeof animate> | null = null;
    if (cursor) {
      cursorAnimation = animate(cursor, {
        opacity: [1, 0],
        duration: 530,
        loop: true,
        alternate: true,
        ease: steps(1),
      });
    }

    const animation = animate(chars, {
      opacity: [0, 1],
      duration: 1,
      delay: stagger(speed),
      ease: 'linear',
    });

    return () => {
      animation.cancel();
      cursorAnimation?.cancel();
    };
  }, [play, inView, speed]);

  return (
    <span ref={ref} className={className}>
      <span aria-hidden="true">
        {text.split('').map((char, index) => (
          <span key={index} data-type-char style={{ opacity: 0 }}>
            {char === ' ' ? '\u00A0' : char}
          </span>
        ))}
      </span>
      <span
        ref={cursorRef}
        aria-hidden="true"
        className="inline-block ml-1 w-[0.55em] h-[1em] align-[-0.15em] bg-[#0055FF]"
      />
      <span className="sr-only">{text}</span>
    </span>
  );
};

export default TypewriterText;
