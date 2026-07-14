// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { CodexPetCompanionElement, defineCodexPetCompanion } from '../src/component.js';

class MockImage {
  naturalWidth = 1536;
  naturalHeight = 2288;
  onload?: () => void;
  onerror?: () => void;
  set src(_value: string) { queueMicrotask(() => this.onload?.()); }
}

beforeEach(() => {
  vi.stubGlobal('Image', MockImage);
  vi.stubGlobal('matchMedia', () => ({ matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() }));
  vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify({ id: 'kavana', displayName: 'Kavana', spritesheetPath: 'spritesheet.webp', spriteVersionNumber: 2 }))));
  defineCodexPetCompanion();
});
afterEach(() => { document.body.replaceChildren(); vi.unstubAllGlobals(); localStorage.clear(); });

describe('<codex-pet-companion>', () => {
  it('loads a v2 pet and exposes accessible controls', async () => {
    const pet = document.createElement('codex-pet-companion') as CodexPetCompanionElement;
    pet.setAttribute('mode', 'inline');
    const ready = new Promise((resolve) => pet.addEventListener('codex-pet-ready', resolve, { once: true }));
    document.body.append(pet);
    await ready;
    expect(pet.shadowRoot?.querySelector('.name')?.textContent).toBe('Kavana');
    expect(pet.shadowRoot?.querySelector('.pet')?.getAttribute('aria-label')).toContain('Kavana');
  });

  it('tuck and recall preserve a keyboard focus path', async () => {
    const pet = document.createElement('codex-pet-companion') as CodexPetCompanionElement;
    const ready = new Promise((resolve) => pet.addEventListener('codex-pet-ready', resolve, { once: true }));
    document.body.append(pet);
    await ready;
    pet.tuck('left');
    await Promise.resolve();
    expect(pet.shadowRoot?.querySelector<HTMLButtonElement>('.recall')?.hidden).toBe(false);
    pet.recall();
    expect(pet.shadowRoot?.querySelector<HTMLButtonElement>('.pet')).toBe(pet.shadowRoot?.activeElement);
  });

  it('exposes zoomies with a reduced-motion fallback', async () => {
    const pet = document.createElement('codex-pet-companion') as CodexPetCompanionElement;
    pet.config = { reducedMotion: true, behaviors: { roam: false } };
    const ready = new Promise((resolve) => pet.addEventListener('codex-pet-ready', resolve, { once: true }));
    document.body.append(pet);
    await ready;
    const events: string[] = [];
    pet.addEventListener('codex-pet-zoomies-start', () => events.push('start'));
    pet.addEventListener('codex-pet-zoomies-end', () => events.push('end'));
    await pet.zoomies();
    expect(events).toEqual(['start', 'end']);
    expect(pet.hasAttribute('data-page-roaming')).toBe(false);
  });
});
