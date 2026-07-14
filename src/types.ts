export type StandardPetState = 'idle' | 'running-right' | 'running-left' | 'waving' | 'jumping' | 'failed' | 'waiting' | 'running' | 'review';
export type CompanionState = StandardPetState | 'look-around' | 'resting' | 'sleeping';

export interface CodexPetManifest {
  id: string;
  displayName: string;
  description?: string;
  spriteVersionNumber?: 1 | 2;
  spritesheetPath: string;
}

export interface SpriteFrame { row: number; column: number; duration: number }

export interface DialogueTopic {
  id: string;
  label: string;
  title: string;
  body: string;
  href?: string;
  linkLabel?: string;
}

export interface PetSource {
  manifest?: CodexPetManifest;
  manifestUrl?: string;
  atlasUrl?: string;
}

export interface CompanionBehaviors {
  roam?: boolean;
  drag?: boolean;
  tuck?: boolean;
  sleep?: boolean;
  waveOnHover?: boolean;
}

export interface CodexPetCompanionConfig extends PetSource {
  name?: string;
  mode?: 'floating' | 'inline';
  scale?: number;
  state?: CompanionState;
  autoplay?: boolean;
  reducedMotion?: boolean | 'user-preference';
  behaviors?: CompanionBehaviors;
  dialogue?: DialogueTopic[];
  persistenceKey?: string | false;
  zIndex?: number;
  sleepAfterMs?: number;
  startPosition?: { x: number; y: number };
  assetBaseUrl?: string;
}

export interface PlayOptions { loop?: boolean; cycles?: number; returnTo?: CompanionState }

export interface CompanionController {
  play(state: CompanionState, options?: PlayOptions): void;
  setState(state: CompanionState): void;
  pause(): void;
  resume(): void;
  destroy(): void;
  zoomies?(): Promise<void>;
  startRoaming?(): Promise<boolean>;
  readonly state: CompanionState;
}

export interface CodexPetReadyDetail {
  manifest: CodexPetManifest;
  atlasUrl: string;
}
