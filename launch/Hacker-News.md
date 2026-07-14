# Hacker News launch draft: Codex Pet Web

Status: draft-ready, but the submission form must not be populated until the SDK's public package, CDN build, and live demo pass the distribution gates in `Product-Hunt.md`. Never submit without Kobi's explicit approval.

## Submission

Title:

> Show HN: Codex Pet Web – put any Codex pet on any website

URL:

> `[GO-LIVE SDK DEMO URL]`

Use the live, interactive SDK demo or documentation page where readers can immediately try Kavana and copy a working npm/CDN example. Do not use a waitlist or static announcement page.

## First comment

Hi HN — I built Codex Pet Web, a small framework-neutral SDK for putting a Codex pet on any website.

It began with Kavana, a black-and-tan Shiba Inu based on Karo, our real dog. Kavana started as a custom Codex Desktop pet: a `pet.json` manifest plus a transparent WebP sprite atlas. When I contributed her to the Caro open-source project, I built a fairly involved website companion around that atlas—roaming, zoomies, waving, sleeping, pointer-aware looking, drag placement, persistence, and accessible tuck/recall behavior.

The obvious problem was that the website implementation was tied to Kavana and Caro. Codex Pet Web extracts the reusable parts into a package that accepts any compatible Codex pet.

The smallest integration is intentionally plain HTML:

```html
<script type="module" src="[VERIFIED CDN URL]"></script>
<codex-pet></codex-pet>
```

Kavana is the built-in default, so that example gives her room to do the zoomies. You can instead point the element at another compatible `pet.json` and spritesheet. The same package also has an npm/ESM entrypoint for applications that bundle JavaScript.

Under the hood, the package parses and validates the pet manifest, maps Codex v1/v2 atlas geometry into animation states, schedules behavior, and owns lifecycle cleanup. The renderer is a custom element so the core is not coupled to React, Astro, or Caro. Touch, keyboard focus, reduced motion, persistence, transparent playback, and strict-CSP use are part of the public contract rather than demo-only details.

I tested the released package in a plain static page, the Kavana field guide, and Caro.sh, plus a second compatible pet to catch Kavana-specific assumptions. There is also a hosted agent skill: the prompt stays lean, while the skill handles framework discovery, asset validation, integration, and browser checks.

The code, package, examples, and compatibility fixtures are public here:

- SDK: `[SDK REPOSITORY URL]`
- npm: `[NPM PACKAGE URL]`
- Kavana: https://github.com/wildcard/kavana-codex-pet
- Caro integration: https://www.caro.sh/docs/kavana

I would particularly appreciate technical feedback on the custom-element API, manifest compatibility, accessibility defaults, and whether the behavior scheduler stays delightful rather than becoming distracting.

## Pre-submit audit

- [ ] Title begins with `Show HN:` and remains concise.
- [ ] Submission URL is a real interactive product, not a landing page or waitlist.
- [ ] `[VERIFIED CDN URL]`, SDK repository, npm package, and demo URL are replaced with current public links.
- [ ] Two-line HTML example works when pasted into a clean file.
- [ ] Every claimed tested integration is public and on the released package version.
- [ ] Kobi can remain available to answer questions after submission.
- [ ] No request for votes or coordinated comments appears anywhere.
- [ ] Draft is reviewed in the HN form, and the final `submit` control remains untouched pending Kobi's approval.

## Why this fits Show HN

HN's official guidance asks for something people can actually try, made personally by the submitter, without signup barriers. Codex Pet Web qualifies only after the public package and interactive demo are available. The personal origin, compatibility work, and framework-neutral implementation are important context; avoid turning the post into generic launch copy.

Primary source: https://news.ycombinator.com/showhn.html

## Legacy Kavana draft

The repository-root `HN_DRAFT.md` describes the original Kavana-only launch. Keep it as provenance, but use this SDK-centered draft for Codex Pet Web. The final story should lead with the reusable SDK and use Kavana as the personal origin and default experience.
