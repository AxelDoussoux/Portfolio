import React, { useEffect, useRef } from 'react';
import { animate, stagger } from 'animejs';

import { useReducedMotion } from './useReducedMotion';

interface SplitTextProps {
  text: string;
  play?: boolean;
  staggerDelay?: number;
  className?: string;
}

const SplitText: React.FC<SplitTextProps> = ({ text, play = true, staggerDelay = 30, className }) => {
  const reducedMotion = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root || !play) return;

    const chars = Array.from(root.querySelectorAll<HTMLElement>('[data-char]'));
    if (chars.length === 0) return;

    if (reducedMotion) {
      chars.forEach((char) => {
        char.style.opacity = '1';
        char.style.transform = 'none';
      });
      return;
    }

    const animation = animate(chars, {
      opacity: [0, 1],
      y: [48, 0],
      rotate: [4, 0],
      duration: 800,
      delay: stagger(staggerDelay),
      ease: 'outExpo',
    });

    return () => {
      animation.revert();
    };
  }, [text, play, staggerDelay, reducedMotion]);

  const words = text.trim().split(/\s+/);

  return (
    <span ref={ref} className={className} aria-hidden="true">
      {words.map((word, wordIndex) => (
        <span key={`${word}-${wordIndex}`} className="inline-block whitespace-nowrap">
          {Array.from(word).map((char, charIndex) => (
            <span
              key={`${char}-${charIndex}`}
              data-char
              className="inline-block"
              style={{ opacity: !play && !reducedMotion ? 0 : 1 }}
            >
              {char}
            </span>
          ))}
          {wordIndex < words.length - 1 && <span className="inline-block">&nbsp;</span>}
        </span>
      ))}
    </span>
  );
};

export default SplitText;
