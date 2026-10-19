import React, { useEffect, useRef, useState } from 'react';
import { animate, stagger, utils } from 'animejs';

import { useReducedMotion } from './useReducedMotion';

interface SplitTextProps {
  text: string;
  play?: boolean;
  staggerDelay?: number;
  className?: string;
}

const SplitText: React.FC<SplitTextProps> = ({ text, play = true, staggerDelay = 26, className }) => {
  const reducedMotion = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const root = ref.current;
    if (!root || !play || reducedMotion) return;

    const chars = Array.from(root.querySelectorAll<HTMLElement>('[data-char]'));
    if (chars.length === 0) return;

    // Explicitly lock initial poses across all characters to prevent stagger snapping
    utils.set(chars, {
      opacity: 0,
      y: 48,
      rotate: 4,
    });

    const animation = animate(chars, {
      opacity: [0, 1],
      y: [48, 0],
      rotate: [4, 0],
      duration: 750,
      delay: stagger(staggerDelay),
      ease: 'outExpo',
      onComplete: () => {
        setHasAnimated(true);
      },
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
              style={
                reducedMotion || hasAnimated
                  ? { opacity: 1, transform: 'none' }
                  : { opacity: 0, transform: 'translateY(48px) rotate(4deg)' }
              }
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
