import { useEffect, type RefObject } from 'react';
import { animate, createScope, createTimeline, stagger, utils } from 'animejs';
import { useReducedMotion } from './useReducedMotion';

/** Reveal each block individually, including inside long mobile sections. */
export function useRevealMotion(root: RefObject<HTMLElement | null>, enabled = true) {
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!root.current || !enabled || reducedMotion) return;
    const scope = createScope({ root }).add((self) => {
      if (!self) return;
      const hero = root.current!.querySelectorAll<HTMLElement>('[data-hero-anim]');
      if (hero.length) createTimeline().add(hero, {
        opacity: [0, 1], y: [18, 0], duration: 650,
        delay: stagger(85), ease: 'outExpo',
      });

      const items = root.current!.querySelectorAll<HTMLElement>(
        '[data-anim], [data-anim-chip], [data-card-anim], [data-motion-heading]',
      );
      // Content is visible by default. Only a running observer can hide it.
      utils.set(items, { opacity: 0, '--reveal-y': '20px' });
      const pending = new Set(items);
      self.add('reveal', (element: HTMLElement, delay: number) => {
        if (!pending.delete(element)) return;
        animate(element, { opacity: [0, 1], '--reveal-y': ['20px', '0px'], duration: 620, delay, ease: 'outExpo' });
        if (element.hasAttribute('data-motion-heading')) {
          animate(element, {
            '--rule-progress': [0, 1], duration: 850, delay: delay + 120, ease: 'outExpo',
          });
          const badge = element.querySelector('span');
          if (badge) animate(badge, {
            rotate: [-9, 0], scale: [0.85, 1], duration: 550, delay, ease: 'outBack',
          });
        }
      });
      const observer = new IntersectionObserver((entries) => {
        entries.filter((entry) => entry.isIntersecting).forEach((entry, index) => {
          observer.unobserve(entry.target);
          self.methods.reveal(entry.target, Math.min(index * 45, 180));
        });
      }, { threshold: 0, rootMargin: '0px 0px -24px 0px' });
      items.forEach((item) => observer.observe(item));
      const revealFocused = (event: FocusEvent) => {
        if (!(event.target instanceof Element)) return;
        for (const item of items) {
          if (item.contains(event.target)) {
            observer.unobserve(item);
            self.methods.reveal(item, 0);
          }
        }
      };
      const element = root.current!;
      element.addEventListener('focusin', revealFocused);
      return () => {
        observer.disconnect();
        element.removeEventListener('focusin', revealFocused);
      };
    });
    return () => scope.revert();
  }, [root, enabled, reducedMotion]);
}
