let defaultAssetBaseUrl = 'https://unpkg.com/codex-pet-companion@0.1.1/pets/kavana/';

export function setDefaultAssetBaseUrl(url: string): void {
  defaultAssetBaseUrl = new URL(url, typeof document === 'undefined' ? 'https://example.invalid/' : document.baseURI).href;
}

export function getDefaultAssetBaseUrl(): string { return defaultAssetBaseUrl; }
