import React, { useEffect, useRef } from 'react';
import { createTimeline, stagger } from 'animejs';

import { useReducedMotion } from './useReducedMotion';

interface IntroCurtainProps {
  play?: boolean;
  onCovered?: () => void;
  onComplete?: () => void;
  slats?: number;
}

const IntroCurtain: React.FC<IntroCurtainProps> = ({
  play = true,
  onCovered,
  onComplete,
  slats = 8,
}) => {
  const reducedMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const onCoveredRef = useRef(onCovered);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCoveredRef.current = onCovered;
    onCompleteRef.current = onComplete;
  });

  useEffect(() => {
    if (!play) return;
    const root = ref.current;
    if (!root) return;

    const bars = Array.from(root.querySelectorAll<HTMLElement>('[data-curtain-slat]'));
    if (bars.length === 0) return;

    if (reducedMotion) {
      onCoveredRef.current?.();
      onCompleteRef.current?.();
      return;
    }

    const timeline = createTimeline({ defaults: { ease: 'inOutQuart' } });

    timeline
      .add(bars, { y: ['-110%', '0%'], duration: 420, delay: stagger(26), ease: 'inQuart' })
      .call(() => onCoveredRef.current?.())
      .add(bars, { y: ['0%', '110%'], duration: 540, delay: stagger(34), ease: 'outQuart' })
      .call(() => onCompleteRef.current?.());

    return () => {
      timeline.revert();
    };
  }, [play, slats, reducedMotion]);

  return (
    <div
      ref={ref}
      className="fixed inset-0 z-[1300] overflow-hidden pointer-events-none"
      aria-hidden="true"
    >
      {Array.from({ length: slats }).map((_, index) => (
        <div
          key={index}
          data-curtain-slat
          className="absolute top-0 h-[101%] bg-[#0A0A0E] border-b-4 border-[#0055FF]"
          style={{
            left: `calc(${(index * 100) / slats}% - 1px)`,
            width: `calc(${100 / slats}% + 2px)`,
            transform: 'translateY(-110%)',
          }}
        />
      ))}
    </div>
  );
};

export default IntroCurtain;
