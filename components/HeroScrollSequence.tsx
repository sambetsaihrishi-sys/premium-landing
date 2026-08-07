"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { drawImageCover } from "@/lib/drawImageCover";
import { useProgressRefs } from "@/lib/progress-context";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { useIsSmallViewport } from "@/lib/useIsSmallViewport";
import HeadlineCylinder from "@/components/HeadlineCylinder";
import ScrimOverlay from "@/components/ScrimOverlay";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const FRAMES_DIR = "/hero/frames";
const SCROLL_VH = 600; // total scroll length of the pinned section
const LERP_FACTOR = 0.1;
const SNAP_EPSILON = 0.001;
const TILT_FADE_FRAMES = 6; // tilt effect fades out within this many frames of scroll

export default function HeroScrollSequence() {
  const heroRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);

  const imagesRef = useRef<HTMLImageElement[]>([]);
  const frameCountRef = useRef(0);

  const [firstFrameReady, setFirstFrameReady] = useState(false);
  const [canvasVisible, setCanvasVisible] = useState(false);
  const [frameFiles, setFrameFiles] = useState<string[] | null>(null);
  const [loadError, setLoadError] = useState(false);

  const isInViewRef = useRef(true);
  const currentFrameRef = useRef(0);
  const targetFrameRef = useRef(0);
  const mouseTargetRef = useRef({ x: 0, y: 0 });
  const mouseCurrentRef = useRef({ x: 0, y: 0 });

  const { rawProgress, frame, easedProgress } = useProgressRefs();

  const reducedMotion = useReducedMotion();
  const isSmallViewport = useIsSmallViewport();
  const staticMode = isSmallViewport;

  // ---- 1. Discover frames at runtime (never hardcoded) ----
  useEffect(() => {
    let cancelled = false;
    fetch("/api/frame-count")
      .then((res) => res.json())
      .then((data: { count: number; files: string[]; error?: string }) => {
        if (cancelled) return;
        if (!data.files || data.files.length === 0) {
          setLoadError(true);
          return;
        }
        frameCountRef.current = data.files.length;
        setFrameFiles(data.files);
      })
      .catch(() => {
        if (!cancelled) setLoadError(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // ---- 2. Preload: frame 1 first (blocking paint), then the rest in background ----
  useEffect(() => {
    if (!frameFiles || frameFiles.length === 0) return;

    let cancelled = false;
    const images: HTMLImageElement[] = new Array(frameFiles.length);

    const loadOne = (index: number): Promise<void> =>
      new Promise((resolve) => {
        const img = new Image();
        img.decoding = "async";
        img.onload = () => resolve();
        img.onerror = () => resolve(); // don't block the sequence on one bad frame
        img.src = `${FRAMES_DIR}/${frameFiles[index]}`;
        images[index] = img;
      });

    (async () => {
      // First frame: load and reveal immediately, no black flash.
      await loadOne(0);
      if (cancelled) return;
      imagesRef.current = images;
      setFirstFrameReady(true);

      if (staticMode) return; // small screens / reduced motion: frame 1 only

      // Remaining frames: load asynchronously in the background.
      const rest = frameFiles.map((_, i) => i).filter((i) => i !== 0);
      await Promise.all(rest.map(loadOne));
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [frameFiles, staticMode]);

  // ---- 3. Fade the canvas in 600ms after the first frame is ready ----
  useEffect(() => {
    if (!firstFrameReady) return;
    const raf = requestAnimationFrame(() => setCanvasVisible(true));
    return () => cancelAnimationFrame(raf);
  }, [firstFrameReady]);

  // ---- 4. High-DPI canvas sizing ----
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2.5);
    const w = window.innerWidth;
    const h = window.innerHeight;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    const ctx = canvas.getContext("2d");
    if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }, []);

  useEffect(() => {
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, [resizeCanvas]);

  // ---- 5. Pause rendering when the hero leaves the viewport ----
  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        isInViewRef.current = entry.isIntersecting;
      },
      { threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // ---- 5b. Pin the sequence for the full 600vh scroll duration ----
  useEffect(() => {
    if (staticMode) return;
    const trigger = ScrollTrigger.create({
      trigger: heroRef.current as HTMLElement,
      start: "top top",
      end: "bottom bottom",
      pin: pinRef.current as HTMLElement,
      pinSpacing: false,
      anticipatePin: 1,
    });
    return () => trigger.kill();
  }, [staticMode]);

  // ---- 6. Cursor tracking for the pre-scroll "floating sculpture" tilt ----
  useEffect(() => {
    if (staticMode) return;
    const onMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1; // -1..1
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      mouseTargetRef.current = { x: nx, y: ny };
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [staticMode]);

  // ---- 7. The single rAF loop: progress -> smoothed frame -> draw + tilt ----
  useEffect(() => {
    if (staticMode) return;
    if (!firstFrameReady) return;

    let rafId: number;

    const tick = () => {
      rafId = requestAnimationFrame(tick);
      if (!isInViewRef.current) return; // paused while hero is off-screen

      const heroEl = heroRef.current;
      const canvas = canvasRef.current;
      const frameCount = frameCountRef.current;
      if (!heroEl || !canvas || frameCount === 0) return;

      // -- Progress computed every frame from the hero's own rect --
      const rect = heroEl.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      const rawProg =
        scrollable > 0
          ? Math.min(1, Math.max(0, -rect.top / scrollable))
          : 0;
      rawProgress.current = rawProg;

      targetFrameRef.current = rawProg * (frameCount - 1);

      // -- Smoothed playhead: lerp toward target, snap when close --
      const diff = targetFrameRef.current - currentFrameRef.current;
      if (Math.abs(diff) < SNAP_EPSILON) {
        currentFrameRef.current = targetFrameRef.current;
      } else {
        currentFrameRef.current += diff * LERP_FACTOR;
      }

      frame.current = currentFrameRef.current;
      easedProgress.current =
        frameCount > 1 ? currentFrameRef.current / (frameCount - 1) : 0;

      // -- Cross-blended draw: floor frame opaque, next frame at fractional alpha --
      const images = imagesRef.current;
      const floor = Math.floor(currentFrameRef.current);
      const clampedFloor = Math.min(Math.max(floor, 0), frameCount - 1);
      const frac = currentFrameRef.current - floor;
      const nextIdx = Math.min(clampedFloor + 1, frameCount - 1);

      const ctx = canvas.getContext("2d");
      if (ctx) {
        const w = window.innerWidth;
        const h = window.innerHeight;
        ctx.clearRect(0, 0, w, h);

        const baseImg = images[clampedFloor];
        if (baseImg && baseImg.complete) {
          drawImageCover(ctx, baseImg, w, h, 1);
        }

        if (frac > 0 && nextIdx !== clampedFloor) {
          const nextImg = images[nextIdx];
          if (nextImg && nextImg.complete) {
            drawImageCover(ctx, nextImg, w, h, frac);
          }
        }
      }

      // -- Pre-scroll floating tilt, fading out over the first few frames --
      const tiltFade = Math.max(
        0,
        1 - currentFrameRef.current / TILT_FADE_FRAMES
      );
      const mc = mouseCurrentRef.current;
      const mt = mouseTargetRef.current;
      mc.x += (mt.x - mc.x) * 0.08;
      mc.y += (mt.y - mc.y) * 0.08;

      const tiltEl = tiltRef.current;
      if (tiltEl) {
        const rotateY = mc.x * 8 * tiltFade;
        const rotateX = -mc.y * 8 * tiltFade;
        const translateX = mc.x * 14 * tiltFade;
        const translateY = mc.y * 14 * tiltFade;
        const scale = 1 + 0.02 * tiltFade;
        tiltEl.style.transform = `perspective(1400px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translate3d(${translateX}px, ${translateY}px, 0) scale(${scale})`;
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [staticMode, firstFrameReady, frame, rawProgress, easedProgress]);

  // ---- Static / reduced-motion / mobile fallback ----
  if (staticMode) {
    return (
      <section
        ref={heroRef}
        className="relative w-full h-[100svh] overflow-hidden bg-ink"
      >
        {frameFiles && frameFiles[0] && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={`${FRAMES_DIR}/${frameFiles[0]}`}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            style={{
              opacity: firstFrameReady ? 1 : 0,
              transition: "opacity 600ms ease-out",
            }}
          />
        )}
        <ScrimOverlay />
        <HeadlineCylinder staticMode />
      </section>
    );
  }

  return (
    <section
      ref={heroRef}
      className="relative w-full bg-ink"
      style={{ height: `${SCROLL_VH}vh` }}
    >
      <div
        ref={pinRef}
        className="relative top-0 left-0 w-full h-[100svh] overflow-hidden"
      >
        <div ref={tiltRef} className="tilt-wrapper absolute inset-0">
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full"
            style={{
              opacity: canvasVisible ? 1 : 0,
              transition: "opacity 600ms ease-out",
            }}
          />
        </div>

        {!firstFrameReady && !loadError && (
          <div className="absolute inset-0 bg-ink" />
        )}

        {loadError && (
          <div className="absolute inset-0 flex items-center justify-center bg-ink text-paper/50 text-sm px-6 text-center">
            Add frame images to <code className="mx-1">public/hero/frames</code>
            (e.g. frame_0001.jpg, frame_0002.jpg …) to power the sequence.
          </div>
        )}

        <ScrimOverlay />
        <HeadlineCylinder />
      </div>
    </section>
  );
}
