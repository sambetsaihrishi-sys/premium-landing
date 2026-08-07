"use client";

import { createContext, useContext, useRef, MutableRefObject } from "react";

interface ProgressRefs {
  /** Raw scroll progress through the pinned hero, 0..1, updated every rAF. */
  rawProgress: MutableRefObject<number>;
  /** Eased/lerped floating-point frame position (0..frameCount-1). */
  frame: MutableRefObject<number>;
  /** Eased progress 0..1 derived from `frame` — what other animations
   *  (headlines, scrims, etc.) should read on their own rAF tick. */
  easedProgress: MutableRefObject<number>;
}

const ProgressContext = createContext<ProgressRefs | null>(null);

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const rawProgress = useRef(0);
  const frame = useRef(0);
  const easedProgress = useRef(0);

  return (
    <ProgressContext.Provider value={{ rawProgress, frame, easedProgress }}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgressRefs(): ProgressRefs {
  const ctx = useContext(ProgressContext);
  if (!ctx) {
    throw new Error("useProgressRefs must be used within a ProgressProvider");
  }
  return ctx;
}
