# Product Hunt launch kit: Codex Pet Web

Status: distribution-ready; gallery assets, maker-profile eligibility, and Kobi's final launch approval remain open.

## Positioning

Codex Pet Web is a tiny, framework-neutral JavaScript SDK that puts any compatible Codex pet on any website. Kavana, a black-and-tan Shiba Inu with purposeful zoomies, is the default companion and the reference implementation.

The hook is delight. The substance is a real compatibility layer: one package, a standards-based custom element, npm and CDN installation, validated Codex pet manifests, transparent sprite playback, accessible interaction, and integration paths proven on vanilla HTML, Kavana's site, and Caro.sh.

## Submission fields

- Product name: `Codex Pet Web`
- Primary URL: `https://pets.caro.sh`
- Tagline (56 characters): `Put any Codex pet on any website with one tiny SDK`
- Pricing: `Free`
- Suggested launch tags: `Developer Tools`, `Open Source`, `Web Development`
- Repository: `https://github.com/wildcard/codex-pet-companion`
- npm package: `https://www.npmjs.com/package/codex-pet-companion`
- X handle: leave blank unless a dedicated product account exists
- Makers: Kobi Kadosh / `wildcard` plus any confirmed co-makers
- Suggested shoutouts: GitHub, npm, Cloudflare

### Description (under 500 characters)

Codex Pet Web is an open-source, framework-neutral JavaScript SDK for adding any compatible Codex pet to a website. Install it from npm or a CDN, point it at a pet manifest and transparent spritesheet, and embed one custom element. Kavana comes built in, complete with purposeful zoomies. Accessible keyboard, touch, reduced-motion, persistence, and lifecycle behavior are included and tested on vanilla HTML, Kavana's site, and Caro.sh.

## Maker's first comment

Hi Product Hunt! I made Codex Pet Web because a small piece of personality can make a development tool—or a website—feel genuinely yours.

It began with Kavana, a black-and-tan Shiba Inu created from Karo, our real and very loved dog. Kavana first lived inside Codex Desktop. We then brought her to the Caro.sh website, where she could roam, nap, wave, chat, be dragged to a favorite spot, and trot away when tucked aside.

That implementation was delightful, but it was tied to one pet and one site. Codex Pet Web extracts the reusable part into a tiny, framework-neutral SDK:

- use any compatible `pet.json` + transparent `spritesheet.webp`
- install from npm, ESM/CDN, or a single script tag
- use the standards-based `<codex-pet-companion>` custom element on plain HTML or modern frameworks
- get Kavana as the built-in default, including her zoomies
- preserve keyboard, touch, focus, reduced-motion, persistence, and cleanup behavior
- use the hosted agent skill when you want Codex or another coding agent to perform the integration

The package is open source and the demos are real integrations, not mockups. I would especially value feedback on the first-run integration, compatibility with community Codex pets, and whether the default behavior feels delightful without distracting from the host site.

Thank you for meeting Kavana. ❤️

## Gallery storyboard

Product Hunt currently requires at least two gallery images and recommends 1270×760. Prepare these only from verified product states:

1. Hero: Kavana doing zoomies across the Codex Pet Web demo, with the one-line script-tag install visible.
2. Any pet: side-by-side Kavana v2 and the bundled v1 compatibility fixture using the same SDK API.
3. Three surfaces: vanilla HTML, Kavana's field guide, and Caro.sh, each labeled with the same package version.
4. Accessibility: keyboard focus, touch controls, and reduced-motion still pose, presented as product capabilities rather than a compliance wall.
5. Agent install: the lean skill prompt followed by a real successful integration summary.

Thumbnail: 240×240 square, under 3 MB. Use Kavana on a clean transparent or brand-colored background. If animated, make the first frame readable because Product Hunt animates GIF thumbnails on hover rather than automatically.

## Distribution gates

- [x] Public repository URL confirmed.
- [x] Package name reserved and public npm version is installable from a clean directory.
- [x] `npm view <package> version dist-tags repository license` matches the launch copy.
- [x] npm tarball contents checked with `npm pack --dry-run`.
- [x] CDN/script-tag URL tested in a clean static HTML page without a bundler.
- [x] ESM import tested in a modern bundler.
- [x] Kavana is the documented default and can do zoomies without additional assets.
- [x] A second compatible Codex pet proves the SDK is not Kavana-specific.
- [x] Vanilla demo, Kavana website, and Caro.sh integration are live on the same released version.
- [x] Keyboard, touch/coarse-pointer, focus, reduced-motion, cleanup, and CSP tests are green.
- [x] README, LICENSE, CONTRIBUTING, CODE_OF_CONDUCT, SECURITY, changelog, tagged GitHub release, and support path are public.
- [x] Registry signature is verified for `0.1.0`, and trusted publishing is configured for future releases.
- [x] Primary URL has an immediate try/install path and no signup wall.
- [ ] Two 1270×760 gallery images and one 240×240 thumbnail are ready.
- [ ] Maker profile is complete and the Product Hunt account is eligible to launch.

## Launch mechanics

- Product Hunt says the best day is the day the maker is prepared. Weekends can work well for personal or side projects and reportedly receive more Visit clicks; weekdays bring more competition and normal working-hour participation.
- If maximizing the full Product Hunt day, schedule for 12:01 a.m. Pacific. Only do this when the maker can remain available to answer questions for the following day.
- The launch can be scheduled up to one month in advance and drafts auto-save.
- Self-hunt. A third-party hunter is not required and offers no stated advantage.
- Share the direct launch link and ask people to visit, try it, and leave honest feedback. Never ask for upvotes or offer rewards tied to votes.
- Do not schedule until the user has reviewed the final gallery, copy, package version, and go-live URL.

## Launch-day response lane

1. Verify the npm/CDN install, demo, GitHub release, Kavana site, and Caro.sh immediately before launch.
2. Post the maker comment when the launch goes live.
3. Keep one maintainer available for installation failures and one place to record feedback.
4. Answer technical questions concretely; link to code, tests, or a focused issue.
5. Record visits, successful first installs, GitHub stars/forks, npm downloads, issue quality, and demo engagement. Treat feedback and reproducible installs as stronger early signals than leaderboard rank alone.
6. Publish a short retrospective after the first week: what people tried, what broke, what changed, and what comes next.

## Current primary sources

- Product Hunt Launch Guide: https://www.producthunt.com/launch
- Product Hunt preparation and field requirements: https://www.producthunt.com/launch/preparing-for-launch
- Product Hunt sharing rules: https://www.producthunt.com/launch/sharing-your-launch
- Product Hunt featuring guidelines: https://help.producthunt.com/en/articles/9883485-product-hunt-featuring-guidelines
- GitHub community-profile guidance: https://docs.github.com/en/communities/setting-up-your-project-for-healthy-contributions/about-community-profiles-for-public-repositories
- npm trusted publishing and automatic provenance: https://docs.npmjs.com/trusted-publishers/
