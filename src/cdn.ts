import { createCodexPetCompanion, defineCodexPetCompanion } from './component.js';
import { getDefaultAssetBaseUrl, setDefaultAssetBaseUrl } from './runtime.js';
import { assertAtlasDimensions, expectedAtlasSize, validateManifest } from './atlas.js';

const scriptUrl = typeof document !== 'undefined' ? document.currentScript?.getAttribute('src') : undefined;
if (scriptUrl) setDefaultAssetBaseUrl(new URL('../pets/kavana/', new URL(scriptUrl, document.baseURI)).href);
if (typeof customElements !== 'undefined') defineCodexPetCompanion();

export { createCodexPetCompanion, defineCodexPetCompanion, getDefaultAssetBaseUrl, setDefaultAssetBaseUrl, assertAtlasDimensions, expectedAtlasSize, validateManifest };
