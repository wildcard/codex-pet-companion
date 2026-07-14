import { CELL_HEIGHT, CELL_WIDTH, DEFAULT_SEQUENCES } from './atlas.js';
import type { CompanionController, CompanionState, PlayOptions, SpriteFrame } from './types.js';

export interface AnimatorOptions {
  atlasUrl: string;
  scale?: number;
  state?: CompanionState;
  reducedMotion?: boolean;
  sequences?: Partial<Record<CompanionState, SpriteFrame[]>>;
  onStateChange?: (state: CompanionState) => void;
}

export class SpriteAnimator implements CompanionController {
  #element: HTMLElement;
  #sequences: Record<CompanionState, SpriteFrame[]>;
  #state: CompanionState;
  #baseState: CompanionState;
  #frameIndex = 0;
  #timer: ReturnType<typeof setTimeout> | undefined;
  #paused = false;
  #reducedMotion: boolean;
  #loop = true;
  #cycles = Infinity;
  #completedCycles = 0;
  #returnTo: CompanionState | undefined;
  #onStateChange?: (state: CompanionState) => void;

  constructor(element: HTMLElement, options: AnimatorOptions) {
    this.#element = element;
    this.#sequences = { ...DEFAULT_SEQUENCES, ...options.sequences };
    this.#state = options.state ?? 'idle';
    this.#baseState = this.#state;
    this.#reducedMotion = options.reducedMotion ?? false;
    this.#onStateChange = options.onStateChange;
    this.#element.style.backgroundImage = `url("${options.atlasUrl.replaceAll('"', '%22')}")`;
    this.setScale(options.scale ?? 0.5);
    this.#paint();
    if (!this.#reducedMotion) this.#schedule();
  }

  get state(): CompanionState { return this.#state; }

  setScale(scale: number): void {
    const safeScale = Number.isFinite(scale) ? Math.min(4, Math.max(0.1, scale)) : 0.5;
    this.#element.style.width = `${CELL_WIDTH * safeScale}px`;
    this.#element.style.height = `${CELL_HEIGHT * safeScale}px`;
    this.#element.style.backgroundSize = `${CELL_WIDTH * 8 * safeScale}px auto`;
    this.#element.dataset.scale = String(safeScale);
  }

  setReducedMotion(reduced: boolean): void {
    this.#reducedMotion = reduced;
    if (reduced) this.pause(); else this.resume();
  }

  setState(state: CompanionState): void {
    this.#baseState = state;
    this.#start(state, { loop: true });
  }

  play(state: CompanionState, options: PlayOptions = {}): void {
    this.#start(state, options);
  }

  pause(): void { this.#paused = true; this.#clearTimer(); }
  resume(): void { this.#paused = false; if (!this.#reducedMotion) this.#schedule(); }
  destroy(): void { this.#clearTimer(); this.#paused = true; }

  #start(state: CompanionState, options: PlayOptions): void {
    this.#clearTimer();
    this.#state = state;
    this.#frameIndex = 0;
    this.#loop = options.loop ?? true;
    this.#cycles = options.cycles ?? (this.#loop ? Infinity : 1);
    this.#completedCycles = 0;
    this.#returnTo = options.returnTo;
    this.#paint();
    this.#onStateChange?.(state);
    if (!this.#reducedMotion && !this.#paused) this.#schedule();
  }

  #paint(): void {
    const frames = this.#sequences[this.#state] ?? this.#sequences.idle;
    const frame = frames[this.#frameIndex] ?? frames[0];
    const scale = Number(this.#element.dataset.scale || 0.5);
    this.#element.style.backgroundPosition = `${-frame.column * CELL_WIDTH * scale}px ${-frame.row * CELL_HEIGHT * scale}px`;
  }

  #schedule(): void {
    if (this.#paused || this.#reducedMotion) return;
    const frames = this.#sequences[this.#state] ?? this.#sequences.idle;
    const frame = frames[this.#frameIndex] ?? frames[0];
    this.#timer = setTimeout(() => {
      const next = this.#frameIndex + 1;
      if (next >= frames.length) {
        this.#completedCycles += 1;
        if (!this.#loop || this.#completedCycles >= this.#cycles) {
          if (this.#returnTo) this.#start(this.#returnTo, { loop: true });
          return;
        }
        this.#frameIndex = 0;
      } else this.#frameIndex = next;
      this.#paint();
      this.#schedule();
    }, frame.duration);
  }

  #clearTimer(): void { if (this.#timer) clearTimeout(this.#timer); this.#timer = undefined; }
}
