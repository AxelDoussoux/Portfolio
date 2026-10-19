import React, { useRef } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'motion/react';
import { useReducedMotion } from './useReducedMotion';

interface WordScrollLightingProps {
  text: string;
  className?: string;
  highlightWords?: string[];
  highlightColor?: string;
}

interface SingleWordProps {
  word: string;
  progress: MotionValue<number>;
  range: [number, number];
  isHighlight: boolean;
  highlightColor?: string;
}

const SingleWord: React.FC<SingleWordProps> = ({
  word,
  progress,
  range,
  isHighlight,
  highlightColor = '#0055FF',
}) => {
  const opacity = useTransform(progress, range, [0.22, 1]);
  const y = useTransform(progress, range, [3, 0]);

  return (
    <span className="relative inline-block mr-[0.3em] last:mr-0 select-text">
      <motion.span
        style={{
          opacity,
          y,
          color: isHighlight ? highlightColor : '#0A0A0E',
          fontWeight: isHighlight ? 800 : 500,
        }}
        className="inline-block transition-colors"
      >
        {word}
      </motion.span>
    </span>
  );
};

export const WordScrollLighting: React.FC<WordScrollLightingProps> = ({
  text,
  className = '',
  highlightWords = [],
  highlightColor = '#0055FF',
}) => {
  const containerRef = useRef<HTMLParagraphElement>(null);
  const reducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 85%', 'end 55%'],
  });

  const words = text.split(' ');

  if (reducedMotion) {
    return (
      <p className={className}>
        {words.map((word, i) => {
          const cleanWord = word.replace(/[^a-zA-Z0-9éèêëàâîïôûùç-]/g, '').toLowerCase();
          const isHighlight = highlightWords.some(
            (hw) => hw.toLowerCase() === cleanWord
          );
          return (
            <span
              key={i}
              className={`mr-[0.3em] ${
                isHighlight ? 'font-bold' : ''
              }`}
              style={{ color: isHighlight ? highlightColor : 'inherit' }}
            >
              {word}
            </span>
          );
        })}
      </p>
    );
  }

  return (
    <p ref={containerRef} className={`${className} leading-relaxed flex flex-wrap`}>
      {words.map((word, i) => {
        const start = i / words.length;
        const end = start + 1 / words.length;
        const cleanWord = word.replace(/[^a-zA-Z0-9éèêëàâîïôûùç-]/g, '').toLowerCase();
        const isHighlight = highlightWords.some(
          (hw) => hw.toLowerCase() === cleanWord
        );

        return (
          <SingleWord
            key={i}
            word={word}
            progress={scrollYProgress}
            range={[start, end]}
            isHighlight={isHighlight}
            highlightColor={highlightColor}
          />
        );
      })}
    </p>
  );
};

export default WordScrollLighting;
