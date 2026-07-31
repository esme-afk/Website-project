# Purpose Driven REI — Home Page

Single self-contained home page for **Purpose Driven REI** (luxury real-estate
investing), built for the **GoHighLevel** website builder → *Custom Code / Code
Block* element.

## Files
- **`index.html`** — the production deliverable. Fully self-contained: inlined
  GSAP + ScrollTrigger, inlined fonts, all styles and scripts. Uses the client's
  real media on `assets.cdn.filesafe.space`. **This is the file to paste into the
  GoHighLevel code block.**
- **`source.template.html`** — the un-inlined source template (build markers for
  fonts/GSAP, `USE_PLACEHOLDERS` flag) used to generate `index.html` and the
  preview.

## How to use in GoHighLevel
1. Add a **Custom Code / Code** element to a blank section (full width, no padding).
2. Paste the entire contents of `index.html`.
3. Save & preview.

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
