import { useSyncExternalStore } from 'react';
import { useReducedMotion } from './useReducedMotion';

const desktopQuery = '(min-width: 1024px) and (min-height: 620px)';
const subscribe = (notify: () => void) => {
  const media = window.matchMedia(desktopQuery);
  media.addEventListener('change', notify);
  return () => media.removeEventListener('change', notify);
};

/**
 * Pinned, scroll-scrubbed chapters only run on roomy viewports with motion allowed.
 * Everywhere else the same content renders as a plain vertical flow.
 */
export function useScrollytelling() {
  const reducedMotion = useReducedMotion();
  const roomy = useSyncExternalStore(subscribe, () => window.matchMedia(desktopQuery).matches, () => false);
  return roomy && !reducedMotion;
}
