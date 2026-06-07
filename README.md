# Lone Wolf Hauling Inc. — Landing Page

San Diego's premium roll-off dumpster rental & hauling. This repo contains
the **Menu** and **Hero** sections of the site's first page.

## Highlights

- **Menu** — logo + primary links (About, Services, Sizes) on the left;
  an amber **Get in Contact** button + animated burger on the right. The
  burger opens a full-screen overlay (Home, About, Services, Sizes,
  Reviews, Contact Us) with a circular reveal and staggered links.
- **Hero** — a **scroll-driven 360° truck reveal** rendered with
  **Three.js**. The sequence plays forward as you scroll down and reverses
  as you scroll up (GSAP `ScrollTrigger` scrub). Scroll speed is slowed by
  **40%**, the headline sits **center-left** with a subtle **parallax**,
  and the background stays clean white.
- **Micro-interactions** — buttons sweep/flip colour on hover, ripple on
  click, and the CTAs are gently magnetic toward the cursor.

## Run locally

The frames load via `fetch`, so use a static server (not `file://`):

```bash
# any of these from the project root
python3 -m http.server 8000
# or
npx serve .
```

Then open <http://localhost:8000>.

## Tech

- [Three.js](https://threejs.org/) (full-screen quad + `CanvasTexture`)
- [GSAP](https://gsap.com/) + ScrollTrigger
- Loaded from CDN — no build step required.

## Structure

```
index.html
css/styles.css        Brand tokens, nav, overlay, hero, buttons
js/menu.js            Burger / overlay / sticky nav / micro-interactions
js/hero.js            Three.js scroll-driven frame sequence + parallax
assets/frames/        frame_0001.jpg … frame_0169.jpg (360° truck reveal)
assets/fonts/         Drop Protofo Bold + PP Mori here (see README)
```

## Brand

| Token | HEX |
|-------|-----|
| Obsidian Black  | `#0B0B0B` |
| Burnt Red       | `#B02400` |
| Safety Amber    | `#D99A21` |
| Warm Off White  | `#F3EFE8` |

Gradients and full palette live as CSS variables at the top of
`css/styles.css`.
