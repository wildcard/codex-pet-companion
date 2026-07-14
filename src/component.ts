import { assertAtlasDimensions, isStateSupported, resolveAtlasUrl, validateManifest } from './atlas.js';
import { SpriteAnimator } from './animator.js';
import { getDefaultAssetBaseUrl } from './runtime.js';
import type { CodexPetCompanionConfig, CodexPetManifest, CodexPetReadyDetail, CompanionState, DialogueTopic } from './types.js';

const TAG_NAME = 'codex-pet-companion';
const DEFAULT_BEHAVIORS = { roam: true, drag: true, tuck: true, sleep: true, waveOnHover: true };
const DEFAULT_DIALOGUE: DialogueTopic[] = [
  { id: 'hello', label: 'Hello', title: "Hi, I'm Kavana.", body: 'My name means intention. I can keep your visitors company while they explore.' },
  { id: 'sdk', label: 'SDK', title: 'Any Codex pet, on any site.', body: 'Swap my two-file pet package for another valid Codex pet without changing the renderer.', href: 'https://github.com/wildcard/codex-pet-companion', linkLabel: 'View the SDK' },
];

const HTMLElementBase: typeof HTMLElement = typeof HTMLElement === 'undefined'
  ? class {} as unknown as typeof HTMLElement
  : HTMLElement;
let template: HTMLTemplateElement | undefined;

function getTemplate(): HTMLTemplateElement {
  if (template) return template;
  template = document.createElement('template');
  template.innerHTML = `
  <style>
    :host { --codex-pet-ink:#251f1b; --codex-pet-panel:#fff8e8; --codex-pet-accent:#b9e4ce; --codex-pet-border:#38271d; --codex-pet-focus:#139979; --codex-pet-z:90; display:block; color:var(--codex-pet-ink); font-family:ui-sans-serif,system-ui,sans-serif; }
    :host([mode="floating"]), :host(:not([mode])) { position:fixed; left:0; top:0; z-index:var(--codex-pet-z); transform:translate3d(var(--pet-x,-140px),var(--pet-y,calc(100vh - 150px)),0); transition:transform var(--pet-travel,0ms) cubic-bezier(.42,0,.24,1); }
    :host([mode="inline"]) { position:relative; width:max-content; }
    :host([data-page-roaming]) { position:fixed; left:0; top:0; z-index:var(--codex-pet-z); width:max-content; pointer-events:none; transform:translate3d(var(--pet-x,-140px),var(--pet-y,calc(100vh - 150px)),0); transition:transform var(--pet-travel,0ms) cubic-bezier(.42,0,.24,1); }
    .wrap { position:relative; display:grid; justify-items:center; width:max-content; }
    .pet { appearance:none; display:grid; justify-items:center; border:0; padding:0; color:inherit; background:transparent; cursor:grab; touch-action:none; user-select:none; filter:drop-shadow(0 12px 14px rgb(31 20 13 / .24)); }
    .pet:active { cursor:grabbing; }
    .pet:focus-visible,.control:focus-visible,.recall:focus-visible,.topic:focus-visible { outline:3px solid var(--codex-pet-focus); outline-offset:4px; }
    .sprite { display:block; overflow:hidden; background-repeat:no-repeat; background-color:transparent; }
    .name { margin-top:-5px; padding:3px 9px; border:2px solid var(--codex-pet-border); border-radius:999px; background:var(--codex-pet-panel); font:800 11px/1 ui-sans-serif,system-ui; letter-spacing:.08em; text-transform:uppercase; }
    .hint { position:absolute; right:-80px; top:-16px; white-space:nowrap; padding:7px 10px; border:2px solid var(--codex-pet-border); border-radius:13px 13px 13px 3px; background:var(--codex-pet-panel); font-size:12px; font-weight:750; }
    .dialogue { position:absolute; left:0; bottom:125px; box-sizing:border-box; width:min(360px,calc(100vw - 28px)); padding:20px; border:2px solid var(--codex-pet-border); border-radius:22px 22px 22px 6px; background:var(--codex-pet-panel); box-shadow:6px 7px 0 var(--codex-pet-border),0 20px 45px rgb(37 31 27 / .16); }
    :host([mode="inline"]) .dialogue { position:relative; bottom:auto; margin-bottom:18px; }
    .dialogue[hidden],.controls[hidden],.hint[hidden],.recall[hidden],.wrap[hidden] { display:none; }
    .dialogue h2 { margin:0 24px 8px 0; font:850 24px/1.05 ui-serif,Georgia,serif; }
    .dialogue p { margin:0; font-size:14px; line-height:1.5; }
    .topics { display:flex; flex-wrap:wrap; gap:5px; margin-top:14px; }
    .topic,.link,.control,.recall { border:2px solid var(--codex-pet-border); background:white; color:inherit; box-shadow:2px 2px 0 var(--codex-pet-border); cursor:pointer; }
    .topic,.link { border-radius:9px; padding:7px 9px; font:750 12px/1 ui-sans-serif,system-ui; text-decoration:none; }
    .topic[aria-pressed="true"] { background:var(--codex-pet-accent); }
    .close { position:absolute; right:10px; top:8px; border:0; background:transparent; color:inherit; font-size:22px; cursor:pointer; }
    .link { display:inline-block; margin-top:12px; background:var(--codex-pet-accent); }
    .controls { position:absolute; left:calc(100% + 5px); top:25px; display:grid; gap:5px; }
    .control { width:27px; height:27px; padding:0; border-radius:50%; font-size:15px; }
    .recall { position:fixed; left:0; top:50%; width:36px; height:48px; padding:0; transform:translateY(-50%); border-radius:0 14px 14px 0; font-size:20px; }
    .recall[data-side="right"] { right:0; left:auto; border-radius:14px 0 0 14px; }
    @media (max-width:600px) { .dialogue { position:fixed; left:14px; right:14px; bottom:145px; width:auto; max-height:calc(100vh - 170px); overflow:auto; } .hint { right:-8px; top:-28px; } }
    @media (prefers-reduced-motion:reduce) { :host { transition:none!important; } .hint { animation:none; } }
  </style>
  <button class="recall" type="button" aria-label="Bring pet back" hidden>›</button>
  <div class="wrap">
    <section class="dialogue" aria-live="polite" hidden>
      <button class="close" type="button" aria-label="Close pet message">×</button>
      <h2></h2><p></p><div class="topics" role="navigation" aria-label="Pet topics"></div><a class="link" target="_blank" rel="noreferrer" hidden></a>
    </section>
    <div class="controls" aria-label="Pet controls">
      <button class="control sleep" type="button" aria-label="Let pet sleep" title="Let pet sleep">☾</button>
      <button class="control tuck" type="button" aria-label="Tuck pet away" title="Tuck pet away">‹</button>
    </div>
    <button class="pet" type="button" aria-expanded="false">
      <span class="hint">Come say hi</span>
      <span class="sprite" aria-hidden="true"></span>
      <span class="name"></span>
    </button>
  </div>`;
  return template;
}

interface DragSession { pointerId: number; offsetX: number; offsetY: number; lastX: number; moved: boolean; startX: number; startY: number }

export class CodexPetCompanionElement extends HTMLElementBase {
  static observedAttributes = ['manifest-url', 'atlas-url', 'name', 'mode', 'state', 'scale'];
  #config: CodexPetCompanionConfig = {};
  #animator?: SpriteAnimator;
  #manifest?: CodexPetManifest;
  #atlasUrl = '';
  #media?: MediaQueryList;
  #motionListener?: () => void;
  #reducedMotion = false;
  #abort?: AbortController;
  #roamTimer?: ReturnType<typeof setTimeout>;
  #sleepTimer?: ReturnType<typeof setTimeout>;
  #zoomiesToken = 0;
  #persistentRoaming = false;
  #drag?: DragSession;
  #position = { x: 22, y: 0 };
  #topic = 0;
  #open = false;
  #sleeping = false;
  #tucked: 'left' | 'right' | undefined;
  #suppressClick = false;
  #hostStyle?: CSSStyleDeclaration;
  #spriteStyle?: CSSStyleDeclaration;
  #initializeQueued = false;

  constructor() {
    super();
    if (typeof document !== 'undefined') {
      const root = this.attachShadow({ mode: 'open' });
      const content = getTemplate().content.cloneNode(true) as DocumentFragment;
      const style = content.querySelector('style');
      if ('adoptedStyleSheets' in root && typeof CSSStyleSheet !== 'undefined') {
        const sheet = new CSSStyleSheet();
        sheet.replaceSync(`${style?.textContent ?? ''}\n:host {}\n.sprite {}`);
        style?.remove();
        root.append(content);
        root.adoptedStyleSheets = [sheet];
        this.#hostStyle = (sheet.cssRules[sheet.cssRules.length - 2] as CSSStyleRule).style;
        this.#spriteStyle = (sheet.cssRules[sheet.cssRules.length - 1] as CSSStyleRule).style;
      } else {
        root.append(content);
      }
    }
  }

  get config(): CodexPetCompanionConfig { return this.#config; }
  set config(value: CodexPetCompanionConfig) {
    const previous = this.#config;
    this.#config = { ...this.#config, ...value, behaviors: { ...this.#config.behaviors, ...value.behaviors } };
    if (!this.isConnected) return;
    const reloadKeys: (keyof CodexPetCompanionConfig)[] = ['manifest', 'manifestUrl', 'atlasUrl', 'assetBaseUrl', 'scale', 'state', 'name', 'reducedMotion'];
    const needsReload = reloadKeys.some((key) => key in value && previous[key] !== this.#config[key]);
    if (needsReload) this.#queueInitialize();
    else {
      this.#renderDialogue();
      this.#updateControls();
      if (this.getAttribute('mode') !== 'inline' && this.#behaviors().roam) this.#startRoam();
      else clearTimeout(this.#roamTimer);
    }
  }

  connectedCallback(): void {
    this.#ensureStyleTargets();
    this.#bind();
    if (this.hasAttribute('mode')) this.#queueInitialize();
    else this.setAttribute('mode', this.#config.mode ?? 'floating');
  }

  disconnectedCallback(): void { this.#cleanup(); }
  attributeChangedCallback(): void { if (this.isConnected) this.#queueInitialize(); }

  #queueInitialize(): void {
    if (this.#initializeQueued) return;
    this.#initializeQueued = true;
    queueMicrotask(() => {
      this.#initializeQueued = false;
      if (this.isConnected) void this.#initialize();
    });
  }

  #ensureStyleTargets(): void {
    if (this.#hostStyle && this.#spriteStyle) return;
    const sheet = this.shadowRoot?.querySelector('style')?.sheet;
    if (!sheet) return;
    const hostRule = sheet.insertRule(':host {}', sheet.cssRules.length);
    const spriteRule = sheet.insertRule('.sprite {}', sheet.cssRules.length);
    this.#hostStyle = (sheet.cssRules[hostRule] as CSSStyleRule).style;
    this.#spriteStyle = (sheet.cssRules[spriteRule] as CSSStyleRule).style;
  }

  play(state: CompanionState, options: { loop?: boolean; cycles?: number; returnTo?: CompanionState } = {}): void {
    if (!this.#manifest) return;
    if (!isStateSupported(state, this.#manifest.spriteVersionNumber)) {
      this.#emitError(new Error(`${state} requires a Codex v2 spritesheet.`));
      return;
    }
    this.#animator?.play(state, options);
  }

  async zoomies(): Promise<void> {
    if (!this.#manifest) return;
    const token = ++this.#zoomiesToken;
    clearTimeout(this.#roamTimer);
    this.dispatchEvent(new CustomEvent('codex-pet-zoomies-start', { bubbles: true }));

    if (this.#reducedMotion) {
      this.play('waving', { loop: false, returnTo: 'idle' });
      this.dispatchEvent(new CustomEvent('codex-pet-zoomies-end', { bubbles: true }));
      return;
    }

    const inline = this.getAttribute('mode') === 'inline';
    if (inline) this.setAttribute('data-page-roaming', '');
    const route = [
      { x: -130, y: Math.max(20, innerHeight - 150), state: 'running-right' as const, travel: 0, wait: 50 },
      { x: Math.max(20, innerWidth - 140), y: Math.max(20, innerHeight - 150), state: 'running-right' as const, travel: 1800, wait: 1850 },
      { x: Math.max(20, innerWidth * .62), y: Math.max(30, innerHeight * .25), state: 'jumping' as const, travel: 650, wait: 800 },
      { x: 20, y: Math.max(30, innerHeight * .55), state: 'running-left' as const, travel: 1700, wait: 1750 },
      { x: Math.max(20, innerWidth * .5), y: Math.max(20, innerHeight - 165), state: 'waving' as const, travel: 900, wait: 1200 },
    ];

    for (const step of route) {
      if (token !== this.#zoomiesToken || !this.isConnected) return;
      this.#position = { x: step.x, y: step.y };
      this.#place(step.x, step.y, step.travel);
      this.#animator?.setState(step.state);
      await new Promise((resolve) => setTimeout(resolve, step.wait));
    }

    if (token !== this.#zoomiesToken || !this.isConnected) return;
    if (inline) this.removeAttribute('data-page-roaming');
    this.#animator?.setState('idle');
    if (!inline) this.#startRoam();
    this.dispatchEvent(new CustomEvent('codex-pet-zoomies-end', { bubbles: true }));
  }

  async startRoaming(): Promise<boolean> {
    if (!this.#manifest) {
      const loaded = await new Promise<boolean>((resolve) => {
        const ready = () => { cleanup(); resolve(true); };
        const failed = () => { cleanup(); resolve(false); };
        const cleanup = () => {
          this.removeEventListener('codex-pet-ready', ready);
          this.removeEventListener('codex-pet-error', failed);
        };
        this.addEventListener('codex-pet-ready', ready, { once: true });
        this.addEventListener('codex-pet-error', failed, { once: true });
      });
      if (!loaded || !this.#manifest) return false;
    }
    if (this.#persistentRoaming) return true;

    this.#persistentRoaming = true;
    this.#zoomiesToken += 1;
    clearTimeout(this.#roamTimer);
    const inline = this.getAttribute('mode') === 'inline';
    if (inline) {
      const bounds = this.getBoundingClientRect();
      this.#position = { x: bounds.left, y: bounds.top };
      this.#place(bounds.left, bounds.top, 0);
      this.setAttribute('data-page-roaming', '');
      await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
    }
    if (!this.isConnected || !this.#persistentRoaming) return false;
    this.#startRoam(true);
    this.dispatchEvent(new CustomEvent('codex-pet-roam-start', { bubbles: true }));
    return true;
  }

  sleep(): void { this.#sleeping = true; this.play('sleeping', { loop: false }); this.#updateControls(); this.#persist(); }
  wake(): void { this.#sleeping = false; this.#animator?.setState('resting'); this.#updateControls(); this.#restartSleepClock(); this.#persist(); }

  tuck(side?: 'left' | 'right'): void {
    if (this.getAttribute('mode') === 'inline') return;
    const bounds = this.getBoundingClientRect();
    this.#tucked = side ?? (bounds.left + bounds.width / 2 > innerWidth / 2 ? 'right' : 'left');
    this.shadowRoot!.querySelector<HTMLElement>('.wrap')!.hidden = true;
    const recall = this.shadowRoot!.querySelector<HTMLButtonElement>('.recall')!;
    recall.hidden = false;
    recall.dataset.side = this.#tucked;
    recall.textContent = this.#tucked === 'right' ? '‹' : '›';
    queueMicrotask(() => recall.focus());
    this.#persist();
  }

  recall(): void {
    this.#tucked = undefined;
    this.shadowRoot!.querySelector<HTMLElement>('.wrap')!.hidden = false;
    this.shadowRoot!.querySelector<HTMLButtonElement>('.recall')!.hidden = true;
    this.shadowRoot!.querySelector<HTMLButtonElement>('.pet')!.focus();
    this.#persist();
  }

  async #initialize(): Promise<void> {
    this.#abort?.abort();
    this.#animator?.destroy();
    this.#abort = new AbortController();
    try {
      const base = this.#config.assetBaseUrl ?? getDefaultAssetBaseUrl();
      const manifestUrl = this.getAttribute('manifest-url') ?? this.#config.manifestUrl ?? new URL('pet.json', base).href;
      const rawManifest = this.#config.manifest ?? await fetch(manifestUrl, { signal: this.#abort.signal }).then((response) => {
        if (!response.ok) throw new Error(`Could not load pet manifest (${response.status}) from ${manifestUrl}`);
        return response.json();
      });
      const manifest = validateManifest(rawManifest);
      const atlasUrl = resolveAtlasUrl(manifest, manifestUrl, this.getAttribute('atlas-url') ?? this.#config.atlasUrl);
      const dimensions = await this.#loadImage(atlasUrl);
      assertAtlasDimensions(dimensions.width, dimensions.height, manifest.spriteVersionNumber);
      this.#manifest = manifest;
      this.#atlasUrl = atlasUrl;
      const scale = Number(this.getAttribute('scale') ?? this.#config.scale ?? 0.5);
      const state = (this.getAttribute('state') ?? this.#config.state ?? 'idle') as CompanionState;
      const sprite = this.shadowRoot!.querySelector<HTMLElement>('.sprite')!;
      this.#animator = new SpriteAnimator(sprite, { atlasUrl, scale, state, reducedMotion: this.#reducedMotion, styleTarget: this.#spriteStyle });
      this.shadowRoot!.querySelector<HTMLElement>('.name')!.textContent = this.getAttribute('name') ?? this.#config.name ?? manifest.displayName;
      const petButton = this.shadowRoot!.querySelector<HTMLButtonElement>('.pet')!;
      petButton.setAttribute('aria-label', `Talk with ${this.#config.name ?? manifest.displayName}`);
      (this.#hostStyle ?? this.style).setProperty('--codex-pet-z', String(this.#config.zIndex ?? 90));
      this.#renderDialogue();
      this.#restore();
      this.#updateControls();
      if (this.getAttribute('mode') !== 'inline') this.#startRoam();
      this.dispatchEvent(new CustomEvent<CodexPetReadyDetail>('codex-pet-ready', { detail: { manifest, atlasUrl }, bubbles: true }));
    } catch (error) {
      if ((error as Error).name !== 'AbortError') this.#emitError(error instanceof Error ? error : new Error(String(error)));
    }
  }

  #bind(): void {
    this.#cleanup(false);
    const root = this.shadowRoot!;
    const pet = root.querySelector<HTMLButtonElement>('.pet')!;
    pet.onclick = () => { if (this.#suppressClick) { this.#suppressClick = false; return; } this.#open = !this.#open; this.#renderDialogue(); };
    pet.onpointerdown = (event) => this.#beginDrag(event);
    pet.onpointermove = (event) => this.#moveDrag(event);
    pet.onpointerup = (event) => this.#endDrag(event);
    pet.onpointercancel = (event) => this.#endDrag(event);
    pet.onmouseenter = () => { if (this.#behaviors().waveOnHover && !this.#open) this.play('waving', { loop: false, returnTo: 'idle' }); };
    pet.onkeydown = (event) => {
      if (this.getAttribute('mode') === 'inline' || !['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) return;
      event.preventDefault();
      const step = event.shiftKey ? 40 : 12;
      if (event.key === 'ArrowLeft') this.#position.x -= step;
      if (event.key === 'ArrowRight') this.#position.x += step;
      if (event.key === 'ArrowUp') this.#position.y -= step;
      if (event.key === 'ArrowDown') this.#position.y += step;
      this.#position = this.#constrain(this.#position);
      this.#place(this.#position.x, this.#position.y, 0);
      this.#persist();
    };
    root.querySelector<HTMLButtonElement>('.close')!.onclick = () => { this.#open = false; this.#renderDialogue(); pet.focus(); };
    root.querySelector<HTMLButtonElement>('.sleep')!.onclick = () => this.#sleeping ? this.wake() : this.sleep();
    root.querySelector<HTMLButtonElement>('.tuck')!.onclick = () => this.tuck();
    root.querySelector<HTMLButtonElement>('.recall')!.onclick = () => this.recall();
    this.#media = matchMedia('(prefers-reduced-motion: reduce)');
    const updateMotion = () => {
      this.#reducedMotion = this.#config.reducedMotion === true || (this.#config.reducedMotion !== false && this.#media!.matches);
      this.#animator?.setReducedMotion(this.#reducedMotion);
      if (this.#reducedMotion) this.#place(22, innerHeight - 150, 0);
    };
    this.#motionListener = updateMotion;
    this.#media.addEventListener('change', updateMotion);
    updateMotion();
  }

  #cleanup(full = true): void {
    this.#zoomiesToken += 1;
    this.#persistentRoaming = false;
    this.removeAttribute('data-page-roaming');
    this.#abort?.abort();
    this.#animator?.destroy();
    clearTimeout(this.#roamTimer);
    clearTimeout(this.#sleepTimer);
    if (this.#media && this.#motionListener) this.#media.removeEventListener('change', this.#motionListener);
    this.#motionListener = undefined;
    if (full) this.#media = undefined;
  }

  #behaviors() { return { ...DEFAULT_BEHAVIORS, ...this.#config.behaviors }; }

  #loadImage(src: string): Promise<{ width: number; height: number }> {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve({ width: image.naturalWidth, height: image.naturalHeight });
      image.onerror = () => reject(new Error(`Could not load pet spritesheet from ${src}`));
      image.src = src;
    });
  }

  #renderDialogue(): void {
    const root = this.shadowRoot!;
    const panel = root.querySelector<HTMLElement>('.dialogue')!;
    panel.hidden = !this.#open;
    root.querySelector<HTMLButtonElement>('.pet')!.setAttribute('aria-expanded', String(this.#open));
    if (!this.#open) return;
    const topics = this.#config.dialogue?.length ? this.#config.dialogue : DEFAULT_DIALOGUE;
    this.#topic = Math.min(this.#topic, topics.length - 1);
    const active = topics[this.#topic];
    panel.querySelector('h2')!.textContent = active.title;
    panel.querySelector('p')!.textContent = active.body;
    const nav = panel.querySelector<HTMLElement>('.topics')!;
    nav.replaceChildren(...topics.map((topic, index) => {
      const button = document.createElement('button');
      button.type = 'button'; button.className = 'topic'; button.textContent = topic.label;
      button.setAttribute('aria-pressed', String(index === this.#topic));
      button.onclick = () => { this.#topic = index; this.#renderDialogue(); };
      return button;
    }));
    const link = panel.querySelector<HTMLAnchorElement>('.link')!;
    link.hidden = !active.href; link.href = active.href ?? '#'; link.textContent = active.linkLabel ?? 'Learn more';
  }

  #updateControls(): void {
    const root = this.shadowRoot!;
    const controls = root.querySelector<HTMLElement>('.controls')!;
    controls.hidden = this.getAttribute('mode') === 'inline' || (!this.#behaviors().sleep && !this.#behaviors().tuck);
    const sleep = root.querySelector<HTMLButtonElement>('.sleep')!;
    sleep.hidden = !this.#behaviors().sleep; sleep.textContent = this.#sleeping ? '☀' : '☾';
    sleep.setAttribute('aria-label', this.#sleeping ? 'Wake pet' : 'Let pet sleep');
    root.querySelector<HTMLButtonElement>('.tuck')!.hidden = !this.#behaviors().tuck;
  }

  #startRoam(force = false): void {
    clearTimeout(this.#roamTimer);
    if (this.#reducedMotion || (!force && !this.#behaviors().roam) || this.#sleeping || this.#tucked) {
      this.#place(this.#position.x || 22, this.#position.y || innerHeight - 150, 0); return;
    }
    const route = [
      { x: 22, y: innerHeight - 150, state: 'running-right' as const, wait: 3000, travel: 2500 },
      { x: 22, y: innerHeight - 150, state: 'waving' as const, wait: 1800, travel: 0 },
      { x: Math.max(22, innerWidth - 220), y: innerHeight - 150, state: 'running-right' as const, wait: 5700, travel: 5100 },
      { x: Math.max(22, innerWidth - 220), y: innerHeight - 150, state: 'look-around' as const, wait: 3100, travel: 0 },
      { x: Math.max(22, innerWidth - 170), y: Math.max(30, innerHeight * .42), state: 'jumping' as const, wait: 2600, travel: 2100 },
      { x: Math.max(22, innerWidth - 170), y: Math.max(30, innerHeight * .42), state: 'review' as const, wait: 2600, travel: 0 },
      { x: 30, y: Math.max(30, innerHeight * .48), state: 'running-left' as const, wait: 6400, travel: 5800 },
      { x: 30, y: Math.max(30, innerHeight * .48), state: 'waiting' as const, wait: 2600, travel: 0 },
      { x: Math.max(22, innerWidth / 2 - 48), y: innerHeight - 170, state: 'jumping' as const, wait: 3000, travel: 2400 },
      { x: Math.max(22, innerWidth / 2 - 48), y: innerHeight - 170, state: 'running' as const, wait: 2800, travel: 0 },
      { x: Math.max(22, innerWidth - 220), y: innerHeight - 150, state: 'running-right' as const, wait: 5000, travel: 4400 },
      { x: Math.max(22, innerWidth - 220), y: innerHeight - 150, state: 'look-around' as const, wait: 3100, travel: 0 },
      { x: 22, y: innerHeight - 150, state: 'running-left' as const, wait: 6100, travel: 5500 },
      { x: 22, y: innerHeight - 150, state: 'waving' as const, wait: 1800, travel: 0 },
    ];
    let index = 0;
    const advance = () => {
      const step = route[index];
      index = index >= route.length - 1 ? 2 : index + 1;
      this.#position = { x: step.x, y: step.y };
      this.#place(step.x, step.y, step.travel);
      if (step.state !== 'look-around' || this.#manifest?.spriteVersionNumber === 2) this.#animator?.setState(step.state);
      this.#roamTimer = setTimeout(advance, step.wait);
    };
    advance();
  }

  #beginDrag(event: PointerEvent): void {
    if (!this.#behaviors().drag || this.getAttribute('mode') === 'inline' || event.button !== 0) return;
    const bounds = this.getBoundingClientRect();
    (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
    this.#drag = { pointerId: event.pointerId, offsetX: event.clientX - bounds.left, offsetY: event.clientY - bounds.top, lastX: event.clientX, moved: false, startX: event.clientX, startY: event.clientY };
    clearTimeout(this.#roamTimer);
  }

  #moveDrag(event: PointerEvent): void {
    if (!this.#drag || this.#drag.pointerId !== event.pointerId) return;
    const delta = event.clientX - this.#drag.lastX;
    if (Math.abs(delta) > 1) this.#animator?.setState(delta > 0 ? 'running-right' : 'running-left');
    this.#drag.lastX = event.clientX;
    this.#drag.moved ||= Math.hypot(event.clientX - this.#drag.startX, event.clientY - this.#drag.startY) > 6;
    this.#position = this.#constrain({ x: event.clientX - this.#drag.offsetX, y: event.clientY - this.#drag.offsetY });
    this.#place(this.#position.x, this.#position.y, 0);
  }

  #endDrag(event: PointerEvent): void {
    if (!this.#drag || this.#drag.pointerId !== event.pointerId) return;
    const target = event.currentTarget as HTMLElement;
    if (target.hasPointerCapture(event.pointerId)) target.releasePointerCapture(event.pointerId);
    if (this.#drag.moved) { this.#suppressClick = true; this.#animator?.setState('resting'); this.#persist(); this.#restartSleepClock(); }
    this.#drag = undefined;
  }

  #constrain(position: { x: number; y: number }) {
    const width = this.getBoundingClientRect().width || 110;
    const height = this.getBoundingClientRect().height || 130;
    return { x: Math.min(Math.max(8, position.x), innerWidth - width - 8), y: Math.min(Math.max(8, position.y), innerHeight - height - 8) };
  }

  #place(x: number, y: number, travel: number): void {
    const style = this.#hostStyle ?? this.style;
    style.setProperty('--pet-x', `${Math.round(x)}px`);
    style.setProperty('--pet-y', `${Math.round(y)}px`);
    style.setProperty('--pet-travel', `${this.#reducedMotion ? 0 : travel}ms`);
  }

  #restartSleepClock(): void {
    clearTimeout(this.#sleepTimer);
    if (!this.#behaviors().sleep || this.#sleeping) return;
    this.#sleepTimer = setTimeout(() => this.sleep(), this.#config.sleepAfterMs ?? 60_000);
  }

  #persist(): void {
    const key = this.#config.persistenceKey === undefined ? 'codex-pet-companion:kavana' : this.#config.persistenceKey;
    if (!key) return;
    try { localStorage.setItem(key, JSON.stringify({ position: this.#position, sleeping: this.#sleeping, tucked: this.#tucked })); } catch { /* optional */ }
  }

  #restore(): void {
    const key = this.#config.persistenceKey === undefined ? 'codex-pet-companion:kavana' : this.#config.persistenceKey;
    if (!key) return;
    try {
      const saved = JSON.parse(localStorage.getItem(key) ?? 'null');
      if (saved?.position) { this.#position = this.#constrain(saved.position); this.#place(this.#position.x, this.#position.y, 0); }
      if (saved?.sleeping) this.sleep();
      if (saved?.tucked === 'left' || saved?.tucked === 'right') this.tuck(saved.tucked);
    } catch { /* optional */ }
  }

  #emitError(error: Error): void {
    this.dispatchEvent(new CustomEvent('codex-pet-error', { detail: { error }, bubbles: true }));
    if (!this.hasAttribute('silent')) console.error(`[${TAG_NAME}]`, error);
  }
}

export function defineCodexPetCompanion(tagName = TAG_NAME): typeof CodexPetCompanionElement {
  if (typeof customElements !== 'undefined' && !customElements.get(tagName)) customElements.define(tagName, CodexPetCompanionElement);
  return CodexPetCompanionElement;
}

export function createCodexPetCompanion(config: CodexPetCompanionConfig = {}): CodexPetCompanionElement {
  defineCodexPetCompanion();
  const element = document.createElement(TAG_NAME) as CodexPetCompanionElement;
  element.config = config;
  return element;
}
