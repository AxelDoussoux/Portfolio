import { useEffect } from 'react';
import { animate } from 'animejs';
import { useReducedMotion } from './useReducedMotion';

export function useBrutalButtons() {
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;
    const animations = new Map<HTMLElement, ReturnType<typeof animate>>();
    const touched = new Set<HTMLElement>();
    let pressed: HTMLElement | null = null;
    document.documentElement.dataset.buttonMotion = 'on';

    const find = (target: EventTarget | null) => target instanceof Element
      ? target.closest<HTMLElement>('.brutal-btn, [data-anim-chip]') : null;
    const move = (element: HTMLElement, offset: number, down = false) => {
      animations.get(element)?.cancel();
      touched.add(element);
      animations.set(element, animate(element, {
        '--press-x': `${offset}px`, '--press-y': `${offset}px`,
        duration: down ? 90 : 240, ease: down ? 'outQuad' : 'outBack(1.4)',
      }));
    };
    const over = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return;
      const element = find(event.target);
      if (!element || (event.relatedTarget instanceof Node && element.contains(event.relatedTarget))) return;
      move(element, -2);
    };
    const out = (event: PointerEvent) => {
      const element = find(event.target);
      if (!element || (event.relatedTarget instanceof Node && element.contains(event.relatedTarget))) return;
      if (element !== pressed) move(element, 0);
    };
    const down = (event: PointerEvent) => {
      const element = find(event.target);
      if (!element?.matches('.brutal-btn') || event.button !== 0) return;
      pressed = element;
      move(element, 2, true);
    };
    const release = (event?: Event) => {
      if (!pressed) return;
      move(pressed, event instanceof PointerEvent && event.type === 'pointerup' && event.pointerType === 'mouse' && pressed.matches(':hover') ? -2 : 0);
      pressed = null;
    };
    const focus = (event: FocusEvent) => {
      const element = find(event.target);
      if (element && element !== pressed) move(element, event.type === 'focusin' ? -2 : 0);
    };
    document.addEventListener('pointerover', over);
    document.addEventListener('pointerout', out);
    document.addEventListener('pointerdown', down);
    window.addEventListener('pointerup', release);
    window.addEventListener('pointercancel', release);
    window.addEventListener('blur', release);
    document.addEventListener('focusin', focus);
    document.addEventListener('focusout', focus);
    return () => {
      document.removeEventListener('pointerover', over);
      document.removeEventListener('pointerout', out);
      document.removeEventListener('pointerdown', down);
      window.removeEventListener('pointerup', release);
      window.removeEventListener('pointercancel', release);
      window.removeEventListener('blur', release);
      document.removeEventListener('focusin', focus);
      document.removeEventListener('focusout', focus);
      animations.forEach((animation) => animation.cancel());
      touched.forEach((element) => {
        element.style.removeProperty('--press-x');
        element.style.removeProperty('--press-y');
      });
      delete document.documentElement.dataset.buttonMotion;
    };
  }, [reducedMotion]);
}
