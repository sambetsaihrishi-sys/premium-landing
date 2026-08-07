"use client";

import { useLenis } from "@/lib/useLenis";
import { useReducedMotion } from "@/lib/useReducedMotion";

export default function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const reducedMotion = useReducedMotion();
  useLenis(reducedMotion);

  return <>{children}</>;
}
