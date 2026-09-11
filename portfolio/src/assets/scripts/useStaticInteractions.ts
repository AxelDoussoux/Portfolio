import { useEffect, type RefObject } from 'react';
import { animate, stagger } from 'animejs';
import { useReducedMotion } from './useReducedMotion';

export function useStaticInteractions(root: RefObject<HTMLElement | null>) {
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const element = root.current;
    if (!element || reducedMotion || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    const active = new Map<HTMLElement, ReturnType<typeof animate>[]>();
    const findTarget = (event: Event) => event.target instanceof Element
      ? event.target.closest<HTMLElement>('[data-static-motion]') : null;
    const move = (target: HTMLElement, entering: boolean) => {
      active.get(target)?.forEach((animation) => animation.cancel());
      const kind = target.dataset.staticMotion;
      const animations = [animate(target, {
        '--micro-x': entering ? (kind === 'nudge' ? '3px' : '-2px') : '0px',
        '--micro-y': entering ? (kind === 'nudge' ? '0px' : '-2px') : '0px',
        duration: entering ? 210 : 360,
        ease: entering ? 'outCubic' : 'outBack(1.25)',
      })];
      const icons = target.querySelectorAll<HTMLElement>('[data-motion-icon]');
      if (icons.length) animations.push(animate(icons, {
        rotate: entering ? [0, -8, 8, 0] : 0,
        scale: entering ? [1, 1.16, 1] : 1,
        delay: stagger(35), duration: 420, ease: 'outCubic',
      }));
      const marks = target.querySelectorAll<HTMLElement>('[data-motion-mark]');
      if (marks.length) animations.push(animate(marks, {
        x: entering ? [0, 4, 0] : 0,
        opacity: entering ? [0.55, 1] : 0.55,
        delay: stagger(25), duration: 360, ease: 'outExpo',
      }));
      active.set(target, animations);
    };
    const enter = (event: PointerEvent) => {
      const target = findTarget(event);
      if (!target || (event.relatedTarget instanceof Node && target.contains(event.relatedTarget))) return;
      move(target, true);
    };
    const leave = (event: PointerEvent) => {
      const target = findTarget(event);
      if (!target || (event.relatedTarget instanceof Node && target.contains(event.relatedTarget))) return;
      move(target, false);
    };
    element.addEventListener('pointerover', enter);
    element.addEventListener('pointerout', leave);
    return () => {
      element.removeEventListener('pointerover', enter);
      element.removeEventListener('pointerout', leave);
      active.forEach((animations, target) => {
        animations.forEach((animation) => animation.cancel());
        target.style.removeProperty('--micro-x');
        target.style.removeProperty('--micro-y');
      });
    };
  }, [root, reducedMotion]);
}
