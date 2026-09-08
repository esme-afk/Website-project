# Purpose Driven REI — Website

Self-contained pages for **Purpose Driven REI** (luxury real-estate investing),
built for the **GoHighLevel** website builder → *Custom Code / Code Block*
element. Each page is one paste-in block: inlined GSAP + ScrollTrigger, inlined
fonts, all styles/scripts, real media on `assets.cdn.filesafe.space`.

## Pages
- **`index.html`** — the **main / Mission page** (paste into the Home page's Code
  block). Home and Mission are now combined into this single powerful landing
  page; the "Mission" nav item scrolls to its `#mission` section. This is the
  page to publish at `/`.
- **`mission.html`** — legacy standalone Mission page, superseded by `index.html`.
  Kept for reference; you can delete the separate `/mission` GHL page.
- **`invest.html`** — the **Invest** page (GHL page slug `invest`).
- **`community.html`** — the **Community** page (GHL page slug `community`). Embeds
  three Instagram reels (via `instagram.com/embed.js`) and links the "Register"
  buttons to `/register`. Instagram embeds and the register link only work on the
  live site, not in the sandbox preview.

Nav links are absolute (`/mission`, `/invest`, `/#team`, ...), so publish each
page at the matching slug on `purposedrivenrei.com`.

## Files
- **`index.html`** / **`mission.html`** — production deliverables to paste into
  GoHighLevel.
- **`source.template.html`** / **`mission.source.template.html`** — un-inlined
  source templates (build markers for fonts/GSAP, `USE_PLACEHOLDERS` flag).
- **`mission.body.template.html`** — the Mission page body/script; the shared
  head/CSS is spliced in from `source.template.html` at assemble time.
- **`build.mjs`** — inlines fonts + GSAP and emits both prod + placeholder-preview
  builds for both pages. (Uses replacement *functions* so `$&`/`$'` sequences in
  the minified libraries are not mangled.)

## How to use in GoHighLevel
1. Add a **Custom Code / Code** element to a blank section (full width, no padding).
2. Paste the entire contents of `index.html` (Home) or `mission.html` (Mission).
3. Save & preview.

### ⚠️ Page slugs
Menu links point to **`/mission`** and **`/invest`**, so create those GHL pages
with the URL slugs **`mission`** and **`invest`**. If you use different slugs,
tell me and I'll update the links. In-page section links go back to Home via
`/#team`, `/#portfolio`, etc.

### ⚠️ Invest hero video (.mov)
The Invest hero uses the supplied **`.mov`** video as its background. `.mov`
plays in Safari but many Chrome/Android browsers will not autoplay it. For
reliable playback everywhere, provide an **`.mp4` (H.264)** version and I'll
swap it in. Until then, non-supporting browsers show the in-brand dark hero.

### Investor form
The Invest page form is client-side only (shows a thank-you state). Wire it to a
native GHL form or webhook to capture leads. The "Book an Investor Call" buttons
currently point to that form — swap the `href` for a Calendly/GHL calendar link
when ready.

The markup is scoped under `.pdrei`, so it won't collide with GHL's own styles.
The form is client-side only (shows a thank-you state) — swap it for a native
GHL form or webhook when wiring up leads.

## Design system
| Token | Value | Use |
|------|-------|-----|
| Green | `#123C35` | Main/footer backgrounds |
| Ink | `#202624` | Primary text |
| Cream | `#F7F4EC` | Page background |
| Gold | `#C7A76A` | Buttons & accents |
| Stone | `#B7AA98` | Secondary backgrounds / borders |

- **Display type:** IvyPresto Display (headlines/section headings)
- **UI/body type:** Manrope (body 20px; nav/buttons 15px with wider tracking)

### ⚠️ IvyPresto Display
IvyPresto Display is a commercial font (Adobe Fonts) and is **not** embedded in
this file. For the exact intended look, add IvyPresto Display to the GoHighLevel
site via **Adobe Fonts / a custom @font-face** and it will be used automatically.
Until then the page falls back to **Playfair Display** (a close high-contrast
serif, embedded here) → Georgia → serif.

## Sections
Hero (video bg) · Our Mission · Our Team · Partner With Us (private-money
overview) · Portfolio · Our Community · Stay Connected · Join Our Network (form)
· Footer.

## Motion
GSAP + ScrollTrigger: hero intro stagger, scroll reveals, portfolio batch
stagger, image parallax, count-up stats, magnetic buttons, and button
click-acknowledgement micro-interactions. Respects `prefers-reduced-motion`.
