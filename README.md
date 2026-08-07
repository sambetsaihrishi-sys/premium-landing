# AURA — Cinematic Scroll Landing Page

A fullscreen, scroll-scrubbed image-sequence landing page built with
Next.js (App Router), TypeScript, Tailwind CSS, GSAP, and Lenis.

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

`public/hero/frames` already contains a 150-frame starter sequence
extracted from your uploaded clip, so the scroll-scrub effect works
immediately — scroll down to scrub forward, scroll up to scrub back.

## Swapping in your own sequence

Drop any number of sequentially-named frames into `public/hero/frames`
(e.g. `frame_0001.jpg`, `frame_0002.jpg`, …). Nothing in the code
hardcodes a frame count — `app/api/frame-count/route.ts` reads the
folder at request time (`export const dynamic = "force-dynamic"`) and
the client fetches that list on mount, so you can add or remove frames
without touching any code.

For best results:
- Keep every frame the same aspect ratio.
- JPG at ~70–85% quality is usually the best size/quality trade-off for
  a long sequence; WEBP works too.
- More frames = smoother scrubbing but a larger download. 120–300
  frames is a good range for a single hero section.

## How the moving pieces fit together

- **`components/HeroScrollSequence.tsx`** — pins a 600vh section,
  computes scroll progress every animation frame from the hero's own
  `getBoundingClientRect()`, smooths it into a floating-point frame
  position (`current += (target - current) * 0.1`, snapping under
  `0.001`), and cross-blends the floor/ceiling frames on a high-DPI
  canvas so slow scrolling stays fluid instead of stepping frame to
  frame. An `IntersectionObserver` halts the render loop entirely
  once the hero scrolls out of view.
- **`lib/useLenis.ts`** — boots Lenis (duration 1.2, smooth wheel,
  touch multiplier 1.6, exponential ease-out) and drives it from a
  single GSAP ticker `requestAnimationFrame` loop, kept in sync with
  `ScrollTrigger`. Fully skipped when `prefers-reduced-motion` is set.
- **`lib/progress-context.tsx`** — a shared ref (not React state) for
  the eased scroll progress, so the headline cylinder and any future
  synced elements read it on their own rAF tick with zero re-renders.
- **`components/HeadlineCylinder.tsx`** — three headline beats placed
  on an invisible 3D cylinder (`perspective`, `rotateX`,
  `translateZ`, `backface-visibility: hidden`) that physically rolls
  upward in sync with the eased playhead, rather than cross-fading.
- **Mobile / reduced motion** — screens ≤768px and
  `prefers-reduced-motion: reduce` skip preloading the sequence
  entirely and render `frame_0001.jpg` full-screen as a static hero.

## Stack

Next.js 14 (App Router) · TypeScript · Tailwind CSS · GSAP +
ScrollTrigger · Lenis · Instrument Serif (headline accent) + Inter
(body).
