"use client";

import { useEffect, useRef } from "react";
import { useProgressRefs } from "@/lib/progress-context";

interface HeadlineBeat {
  lines: string[]; // all but the last render in sans, last line renders in Instrument Serif
}

const HEADLINES: HeadlineBeat[] = [
  { lines: ["Sambet Sai Hrishi", "Computer Science", "& AI."] },
  { lines: ["Full stack engineer.", "Agentic AI", "builder."] },
  { lines: ["From data to", "deployed", "systems."] },
];

const RADIUS = 140; // px — cylinder radius the headlines sit on
const ANGLE_STEP = 90; // degrees between each headline face on the cylinder

export default function HeadlineCylinder({
  staticMode = false,
}: {
  staticMode?: boolean;
}) {
  const stageRef = useRef<HTMLDivElement>(null);
  const cylinderRef = useRef<HTMLDivElement>(null);
  const { easedProgress } = useProgressRefs();
  const currentRotationRef = useRef(0);

  useEffect(() => {
    if (staticMode) return;

    let rafId: number;
    const tick = () => {
      rafId = requestAnimationFrame(tick);
      const cylinder = cylinderRef.current;
      if (!cylinder) return;

      // Map full scroll progress across all headline beats.
      const totalRotation = (HEADLINES.length - 1) * ANGLE_STEP;
      const targetRotation = easedProgress.current * totalRotation;

      // Light extra smoothing so the roll feels physical, not linear.
      currentRotationRef.current +=
        (targetRotation - currentRotationRef.current) * 0.12;

      const rot = currentRotationRef.current;
      // Subtle vertical drift while rolling reinforces the "rolling upward" feel.
      const driftY = -((rot % ANGLE_STEP) / ANGLE_STEP) * 4;

      cylinder.style.transform = `translateY(${driftY}px) rotateX(${rot}deg)`;
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [staticMode, easedProgress]);

  return (
    <div
      ref={stageRef}
      className="headline-3d-stage pointer-events-none absolute inset-0 flex items-center"
    >
      <div className="relative pl-8 sm:pl-16 lg:pl-24 max-w-xl">
        <div
          ref={cylinderRef}
          className="relative"
          style={{
            transformStyle: "preserve-3d",
            height: "8.5rem",
          }}
        >
          {HEADLINES.map((beat, i) => (
            <div
              key={i}
              className="headline-3d-face absolute inset-0 flex flex-col justify-center"
              style={{
                transform: staticMode
                  ? undefined
                  : `rotateX(${-i * ANGLE_STEP}deg) translateZ(${RADIUS}px)`,
                opacity: staticMode && i !== 0 ? 0 : 1,
              }}
            >
              {beat.lines.map((line, li) => {
                const isLast = li === beat.lines.length - 1;
                return (
                  <span
                    key={li}
                    className={
                      isLast
                        ? "font-serif italic text-5xl sm:text-6xl lg:text-7xl leading-[1.05] text-paper"
                        : "font-sans font-light text-2xl sm:text-3xl lg:text-4xl leading-[1.15] text-paper/90"
                    }
                  >
                    {line}
                  </span>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
