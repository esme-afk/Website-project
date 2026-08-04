# Purpose Driven REI — Website

Self-contained pages for **Purpose Driven REI** (luxury real-estate investing),
built for the **GoHighLevel** website builder → *Custom Code / Code Block*
element. Each page is one paste-in block: inlined GSAP + ScrollTrigger, inlined
fonts, all styles/scripts, real media on `assets.cdn.filesafe.space`.

## Pages
- **`index.html`** — the **Home** page (paste into the Home page's Code block).
- **`mission.html`** — the **Mission / About** page (paste into a NEW GHL page —
  see slug note below).

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

### ⚠️ Mission page slug
The Home page's **Mission** menu item links to **`/mission`**. Create the new
GHL page with the URL slug **`mission`** so that link resolves. If you use a
different slug, tell me and I'll update the links. The Mission page's own nav
links back to the Home page sections via `/#team`, `/#invest`, etc.

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
