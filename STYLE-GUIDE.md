# Stottly Enterprises — Visual & Voice Style Guide

Reference for the Week 4 homepage redesign (`index.html`, v3). Use this when propagating the system to the rest of the site.

## Design direction

Apple marketing-page aesthetic: technical sophistication communicated through restraint and polish, not through decorative "tech" signifiers (no terminal chrome, no brackets/coordinates, no dark-mode-by-default, no monospace accents). Calm, confident, a lot of whitespace.

## Typography

- Display / headings: **Inter Tight** (600–800 weight)
- Body / UI: **Inter** (400–600 weight)
- Both loaded from Google Fonts as free stand-ins for Apple's own SF Pro Display/Text, which cannot be licensed for web use.
- Do not introduce a serif or a monospace face into this system. (Fraunces and JetBrains Mono were used in earlier drafts and were dropped for the Apple direction.)
- Headline letter-spacing runs tight and negative (-1.2px to -2.5px at large sizes). Body copy stays at default tracking.

## Color

```
--white:        #FFFFFF
--paper:        #FBFBFA   background
--panel:        #F3F2EF   secondary surface
--ink:          #1D1D1F   primary text / dark surfaces
--gray:         #6E6E73   secondary text
--gray-2:       #86868B   tertiary text / labels
--line:         rgba(0,0,0,0.08)
--orange:       #FF5A2E   accent — buttons, dark-background tags/eyebrows
--orange-deep:  #B83A15   accent — text on light backgrounds only
```

One accent color only. No secondary/tertiary accent hues except the literal Apple system colors used strictly as venture-card swatches (`#0071E3` blue, `#34C759` green, `#5E5CE6` purple, `#A2845E` tan) — decorative chips, never used as text.

**Contrast rule that matters here:** `#FF5A2E` (vivid orange) fails WCAG AA (3.0:1) as text or as a background under light/paper-colored text. It only works as: (a) a background fill paired with `--ink` text on top, or (b) text sitting on a dark/`--ink` background. For orange text on a light background (eyebrows, hover links in the light sections), use `--orange-deep` instead, which holds 5.5:1. This was caught and fixed once already in the v3 build; don't reintroduce the vivid orange as light-background text when extending the system to other pages.

## Motion

- Scroll-triggered fade + rise (`opacity 0→1`, `translateY(22px)→0`) via `IntersectionObserver`, staggered in ~80ms steps for grouped elements.
- Count-up animation for stat numbers, triggered once on scroll into view.
- Auto-cycling active state on the process-step indicator (2.2s interval).
- Every animation is gated behind `prefers-reduced-motion`: reduced-motion users get the end state immediately, no animation.
- No blinking cursors, no self-drawing SVG lines, no terminal-style typing effects — that belonged to the discarded dark-OS direction, not this one.

## Signature motion (the "wow" layer)

Three interaction patterns sit on top of the base motion system, added deliberately as the site's distinguishing feel. Use them sparingly, only on the elements listed below, not on every hover target.

- **Cursor spotlight (`.spot` class).** A soft radial glow in the accent color tracks the cursor across a card on hover, fading in/out over the surface. Applied to: the featured service card, the two mini service cards, and the five venture cards. `.spot-dark` bumps the glow opacity slightly for cards on ink-colored backgrounds so it stays visible. Implementation: CSS custom properties `--sx`/`--sy` set on `mousemove` via JS, consumed by a `radial-gradient` on a `::before` layer (`z-index:0`, content pushed to `z-index:1`).
- **Magnetic buttons (`.magnetic` class).** Primary/ghost buttons and the nav CTA pull a few pixels toward the cursor as it approaches, then release on mouse-leave. Displacement is capped at 9px so it reads as responsive, not floaty. Applied only to standalone call-to-action buttons, never to inline text links or nav items.
- **Word-by-word headline reveal.** The hero `<h1>` is split into per-word spans at runtime, each clipped inside an `overflow:hidden` wrapper and translated up into view with a ~45ms stagger between words. Reserved for the hero headline only. Section headings (`<h2>`) keep the simpler block-level fade/rise from the base `.reveal` system; giving every heading the word-split treatment would cheapen the effect.

All three are wrapped in `!reduceMotion && matchMedia('(hover: hover)').matches` checks: they're skipped entirely for reduced-motion users and for touch devices that can't hover, degrading gracefully to the plain static cards, buttons, and headline.

## Components

- Buttons: full pill radius (100px), two variants only (solid ink, ghost/outline). No gradient buttons.
- Cards: 20–24px corner radius, soft diffused shadow (`0 24px 60px -30px rgba(0,0,0,.14)` style — never a hard drop shadow), white or ink fill.
- Sticky nav: translucent white with backdrop blur, shadow appears only after scroll starts.
- Section rhythm: generous vertical padding (96–130px between sections), centered section headers with a short eyebrow label above the heading.

## Voice and copy rules

1. **No em dashes.** Use a period, comma, or colon instead, restructuring the sentence if needed rather than reaching for the dash.
2. **Avoid common AI-writing tells.** Do not use: leverage, seamless, robust, cutting-edge, elevate, empower, unlock, unleash, revolutionize, delve, holistic, synergy, paradigm, foster, streamline, bespoke, state-of-the-art, game-changer, transformative, "in today's fast-paced world," "it's important to note," triplet padding ("not just X, but Y and Z" used reflexively), or throat-clearing openers.
3. Write plainly and specifically. Prefer concrete claims ("100+ projects executed") over vague superlative claims ("industry-leading results").
4. Keep sentences short enough to read in one breath. Long compound sentences stitched together with dashes are the pattern being deliberately avoided here.
5. Every claim on the site should be real. No fabricated statistics, testimonials, addresses, or photography. If a fact doesn't exist yet, leave the section out rather than inventing content to fill it.

## Navigation: "The Stottly Index"

Piloted on `blog.html` and `blog/archive.html`, then adopted sitewide. Replaces the older `.site-nav` sticky-bar pattern. Nav is the one place the system breaks from rounded/soft: sharper corners create contrast against the pill buttons and diffused-shadow cards everywhere else.

**Command bar** (`.cmd-bar`, replaces `.site-nav`)
- Floating, not full-width: `position:fixed`, 14px inset from the viewport edges, max-width 1120px, 14px border-radius (not a pill).
- Warm-bone translucent background (`rgba(251,251,250,0.86)`) with backdrop blur; becomes more opaque (`0.97`) once scrolled (`.is-condensed`), and the bar height steps down from 60px to 48px at the same trigger.
- Retracts upward (`translateY(-140%)`) on scroll-down past 140px, reappears instantly on scroll-up. Skipped entirely under `prefers-reduced-motion`.
- Five items max in the persistent bar: brand mark, 2-3 primary links (Work / Ventures / Insights, page-dependent), the CTA pill, and an `INDEX +` toggle. Active link gets a 2px orange underline, not a background fill.
- `INDEX +` opens the full-viewport editorial index; it is not a second hamburger, it is the single expand control on both desktop and mobile.

**Editorial index** (`.editorial-index`, full-viewport overlay)
- Warm-bone background, fades and slides in (`opacity` + `translateY(-12px→0)`, ~300ms), closes on the X button, backdrop click, or Escape.
- Five numbered columns (`01`-`05`): Services, Work, Ventures (with `Active`/`Preview` status tags), Insights, Company. Large `Inter Tight` numerals in `--orange-deep`, plain-weight link lists underneath.
- A "Today's Signal" line at the bottom links to the single most current, most relevant item on that page (latest post on blog pages; can point to the newest press release or venture update elsewhere). Real content only, never a placeholder link.

**Topic channel** (`.topic-channel`, blog + archive only)
- Thin, near-black sticky bar directly under the command bar. Text tabs (not pills) filter visible content live; active tab gets a 2px orange underline. A search icon expands an inline field that combines with whatever topic is active.
- This is content-sorting UI for pages with a filterable grid or list. It does not belong on pages without one (home, services, ventures, portfolio, who-we-are, contact): don't add an empty or decorative topic channel just for visual consistency.
- On `blog.html`, topic tabs pull matching posts from the full archive dataset (`assets/blog-posts-data.js`, generated from `blog/archive.html`'s real rows), not just the front page's default cards, so every tab shows the complete, real set. "Latest" restores the curated front-page view.

**Implementation notes**
- Page-local only: each page keeps its own `.cmd-bar`/`.editorial-index` CSS and JS blocks rather than a shared component, matching this project's existing per-page CSS pattern. Copy the verified block from `blog.html` and adjust only the nav-links list, active state, and "Today's Signal" link per page.
- Since the bar is `position:fixed` instead of the old in-flow sticky nav, the first section on every page needs its top padding bumped to clear the floating bar(s): ~110-120px with just the command bar, ~172px when the topic channel is also present.
- Scroll-hide JS and the index-toggle JS are copy-paste identical across pages; only the topic-channel JS is blog/archive-specific.

## What NOT to do (lessons from earlier drafts)

- v1 (Fraunces serif, static diagram, bone/forest palette) read as "business journal," not technology. Avoid calm symmetric serif layouts if the goal is a technical read.
- v2 (dark-mode-first, bracket/coordinate chrome, terminal status lines, blinking cursor) read as generic "hacker aesthetic," not Apple-style precision. Avoid literal engineering/terminal signifiers.
- The direction that worked: quiet confidence via typography and whitespace, not visual noise.

## Workflow rules (non-negotiable — read before touching this project)

1. **One working copy only.** All edits happen in the `outputs` folder copy of `stottlyenterprises-site-redesign`. This is the sole source of truth.
2. **Never write, copy, or sync files to the Desktop.** Not a backup, not a mirror, not "just in case." If the user explicitly asks for a Desktop copy of something, that's the one exception; otherwise, outputs only, always.
3. **Git lives in one place.** The outputs folder is the actual git working copy with `origin` already pointing at `https://github.com/stottlyenterprises-spec/stottlyenterprises`. Never re-add a remote elsewhere, never suggest committing from a second copy.
4. **Deploy = commit in outputs, then a single `git push origin main` (or `--force` only if history has diverged and outputs is confirmed authoritative) run by the user from that exact folder.** No intermediate "sync to Desktop" step, ever. The real Mac path to that folder — the ONLY path to give the user for `cd`, never Desktop, never guessed — is:
   ```
   /Users/stottlyenterprises/Library/Application Support/Claude/local-agent-mode-sessions/649f1c40-e0e1-4691-bf08-f7e1113992d8/4504b13b-1a07-4ed6-9be9-0afd25da2ff8/local_f33e4852-b196-44a3-9d14-06444bffe602/outputs/stottlyenterprises-site-redesign
   ```
   Always wrap it in quotes in the command (it contains spaces): `cd "<path above>" && git push origin main`.
5. **Verify live, don't assume.** After any push, fetch the actual production URL (cache-busted query string if needed) and confirm the change is really there before telling the user it's done.
6. **Never fabricate content, photography, data, or stats.** Zero em dashes anywhere in copy (exception: pre-existing content inside the untouched BK Ops demo embed, and the `&mdash;` byline pattern already used across all 93 existing posts, kept for consistency).
7. **Before presenting any file as finished:** check tag balance (div open/close counts), JS/JSON syntax, and contrast against this guide's color rules.
8. **Run `./verify-v3.sh` from the project root before every commit that touches page content or CSS.** This script exists because the same handful of leftover-color/weight bugs (pre-v3 blue hero gradient, `font-weight:300` body text, `font-weight:200` un-bumped headlines, stale D.E.E.D.S. "August" wording) kept resurfacing on pages that had already been "finished" once. It exits non-zero on any failure and lists the exact files. Fix everything it flags before committing; do not commit past a failing run.
