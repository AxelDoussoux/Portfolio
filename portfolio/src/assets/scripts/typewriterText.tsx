import React, { useEffect, useRef, useState } from 'react';
import { animate, createTimeline, steps } from 'animejs';
import { useReducedMotion } from './useReducedMotion';

interface TypewriterTextProps {
  text: string;
  play?: boolean;
  speed?: number;
  className?: string;
}

const TypewriterText: React.FC<TypewriterTextProps> = ({ text, play = true, speed = 45, className }) => {
  const reducedMotion = useReducedMotion();
  const rootRef = useRef<HTMLSpanElement>(null);
  const outputRef = useRef<HTMLSpanElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);
  const renderedTextRef = useRef('');
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const element = rootRef.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      setInView(true);
      observer.disconnect();
    }, { threshold: 0.35 });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const output = outputRef.current;
    const cursor = cursorRef.current;
    if (!output) return;
    if (reducedMotion) {
      output.textContent = text;
      renderedTextRef.current = text;
      return;
    }
    if (!play || !inView) return;

    const previousChars = Array.from(renderedTextRef.current);
    const nextChars = Array.from(text);
    const state = { count: previousChars.length };
    const render = (chars: string[]) => {
      const count = Math.max(0, Math.min(chars.length, Math.round(state.count)));
      const value = chars.slice(0, count).join('');
      output.textContent = value;
      renderedTextRef.current = value;
    };
    const cursorAnimation = cursor ? animate(cursor, {
      opacity: [1, 0.18], scaleY: [1, 0.72], duration: 420,
      alternate: true, loop: true, ease: steps(1),
    }) : null;
    const timeline = createTimeline();
    if (previousChars.length > 0 && renderedTextRef.current !== text) {
      timeline
        .add(state, {
          count: 0,
          duration: Math.max(160, previousChars.length * Math.min(speed * 0.45, 22)),
          ease: steps(previousChars.length),
          onUpdate: () => render(previousChars),
        })
        .add(cursor ?? output, { opacity: [1, 0.25, 1], duration: 80, ease: steps(2) });
    }
    timeline.add(state, {
      count: nextChars.length,
      duration: Math.max(240, nextChars.length * speed),
      delay: previousChars.length ? 25 : 120,
      ease: steps(Math.max(1, nextChars.length)),
      onUpdate: () => render(nextChars),
      onComplete: () => {
        output.textContent = text;
        renderedTextRef.current = text;
      },
    });
    return () => {
      timeline.pause();
      cursorAnimation?.revert();
    };
  }, [text, play, inView, speed, reducedMotion]);

  return (
    <span ref={rootRef} className={`typewriter ${className ?? ''}`}>
      <span className="typewriter-sizer" aria-hidden="true">{text}</span>
      <span className="typewriter-output" aria-hidden="true">
        <span ref={outputRef}>{reducedMotion ? text : ''}</span>
        <span ref={cursorRef} className="type-cursor" />
      </span>
      <span className="sr-only">{text}</span>
    </span>
  );
};

export default TypewriterText;
