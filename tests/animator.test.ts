// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { SpriteAnimator } from '../src/animator.js';

afterEach(() => vi.useRealTimers());

describe('SpriteAnimator', () => {
  it('paints transparent CSS sprite frames and advances', () => {
    vi.useFakeTimers();
    const element = document.createElement('span');
    const animator = new SpriteAnimator(element, { atlasUrl: '/pet.webp', scale: 0.5, state: 'idle' });
    expect(element.style.backgroundImage).toContain('/pet.webp');
    expect(element.style.width).toBe('96px');
    vi.advanceTimersByTime(300);
    expect(element.style.backgroundPosition).not.toBe('0px 0px');
    animator.destroy();
  });

  it('does not schedule animation in reduced motion', () => {
    vi.useFakeTimers();
    const element = document.createElement('span');
    const animator = new SpriteAnimator(element, { atlasUrl: '/pet.webp', reducedMotion: true });
    const frame = element.style.backgroundPosition;
    vi.advanceTimersByTime(2000);
    expect(element.style.backgroundPosition).toBe(frame);
    animator.destroy();
  });
});
