import { useEffect } from 'react';
import { animate } from 'animejs';

interface ShadowState {
  offset: number;
  r: number;
  g: number;
  b: number;
  a: number;
}

const BASE_SHADOW: ShadowState = { offset: 4, r: 0, g: 0, b: 0, a: 1 };
const HOVER_SHADOW: ShadowState = { offset: 6, r: 0, g: 85, b: 255, a: 1 };
const ACTIVE_SHADOW: ShadowState = { offset: 0, r: 0, g: 0, b: 0, a: 0 };

const shadowStates = new WeakMap<HTMLElement, ShadowState>();
const shadowAnimations = new WeakMap<HTMLElement, { cancel: () => void }>();

const renderShadow = (button: HTMLElement, state: ShadowState) => {
  button.style.boxShadow = `${state.offset}px ${state.offset}px 0px rgba(${Math.round(state.r)}, ${Math.round(state.g)}, ${Math.round(state.b)}, ${state.a})`;
};

const animateShadow = (
  button: HTMLElement,
  target: ShadowState,
  duration: number,
  ease: string,
) => {
  const state = shadowStates.get(button) ?? { ...BASE_SHADOW };
  shadowStates.set(button, state);

  shadowAnimations.get(button)?.cancel();
  const animation = animate(state, {
    offset: target.offset,
    r: target.r,
    g: target.g,
    b: target.b,
    a: target.a,
    duration,
    ease,
    onUpdate: () => renderShadow(button, state),
  });
  shadowAnimations.set(button, animation);
};

export function useBrutalButtons() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let pressed: HTMLElement | null = null;

    const findButton = (target: EventTarget | null): HTMLElement | null => {
      if (!(target instanceof Element)) return null;
      return target.closest<HTMLElement>('.brutal-btn');
    };

    const handlePointerOver = (event: PointerEvent) => {
      const button = findButton(event.target);
      if (!button) return;
      const related = event.relatedTarget;
      if (related instanceof Node && button.contains(related)) return;
      animate(button, { x: -2, y: -2, duration: 160, ease: 'outQuad' });
      animateShadow(button, HOVER_SHADOW, 160, 'outQuad');
    };

    const handlePointerOut = (event: PointerEvent) => {
      const button = findButton(event.target);
      if (!button) return;
      const related = event.relatedTarget;
      if (related instanceof Node && button.contains(related)) return;
      if (pressed === button) return;
      animate(button, { x: 0, y: 0, duration: 220, ease: 'outQuad' });
      animateShadow(button, BASE_SHADOW, 220, 'outQuad');
    };

    const handlePointerDown = (event: PointerEvent) => {
      const button = findButton(event.target);
      if (!button) return;
      pressed = button;
      animate(button, { x: 2, y: 2, duration: 90, ease: 'outQuad' });
      animateShadow(button, ACTIVE_SHADOW, 90, 'outQuad');
    };

    const handlePointerUp = (event: PointerEvent) => {
      const button = pressed ?? findButton(event.target);
      if (!button) return;
      pressed = null;
      const hovering = button.matches(':hover');
      animate(button, {
        x: hovering ? -2 : 0,
        y: hovering ? -2 : 0,
        duration: 260,
        ease: 'outBack(3)',
      });
      animateShadow(button, hovering ? HOVER_SHADOW : BASE_SHADOW, 260, 'outBack(3)');
    };

    document.addEventListener('pointerover', handlePointerOver);
    document.addEventListener('pointerout', handlePointerOut);
    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('pointerup', handlePointerUp);

    return () => {
      document.removeEventListener('pointerover', handlePointerOver);
      document.removeEventListener('pointerout', handlePointerOut);
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('pointerup', handlePointerUp);
    };
  }, []);
}
