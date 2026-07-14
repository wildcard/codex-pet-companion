import { defineCodexPetCompanion } from './component.js';

if (typeof customElements !== 'undefined') defineCodexPetCompanion();

export * from './types.js';
export * from './atlas.js';
export * from './animator.js';
export * from './component.js';
export { getDefaultAssetBaseUrl, setDefaultAssetBaseUrl } from './runtime.js';
