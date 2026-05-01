"use client";

import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";

import { cn } from "@/lib/utils";

interface Tilt3DProps {
  children: React.ReactNode;
  className?: string;
  /** Amplitude max de la rotation X/Y, en degrés. */
  intensity?: number;
  /** Si vrai, applique un glare (reflet lumineux) qui suit la souris. */
  glare?: boolean;
  /** Décale légèrement le contenu vers l'avant (translateZ). */
  depth?: number;
}

/** Default: glare off — trop agressif pour un site éditorial. */

/**
 * Carte qui s'incline en 3D selon la position du curseur (perspective +
 * rotateX/Y). Utilise un spring pour un mouvement fluide. Réagit sur le
 * conteneur entier — le contenu peut être n'importe quoi.
 */
export function Tilt3D({
  children,
  className,
  intensity = 8,
  glare = false,
  depth = 16,
}: Tilt3DProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);

  const springCfg = { stiffness: 150, damping: 18, mass: 0.4 };
  const sx = useSpring(mx, springCfg);
  const sy = useSpring(my, springCfg);

  const rotateX = useTransform(sy, [0, 1], [intensity, -intensity]);
  const rotateY = useTransform(sx, [0, 1], [-intensity, intensity]);

  // Glare position
  const glareX = useTransform(sx, [0, 1], ["0%", "100%"]);
  const glareY = useTransform(sy, [0, 1], ["0%", "100%"]);

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    if (reduced || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    mx.set(x);
    my.set(y);
  }

  function handleLeave() {
    mx.set(0.5);
    my.set(0.5);
  }

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ perspective: 1000 }}
      className={cn("relative", className)}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="relative h-full w-full will-change-transform"
      >
        <div style={{ transform: `translateZ(${depth}px)` }} className="h-full">
          {children}
        </div>
        {glare && (
          <motion.span
            aria-hidden
            style={{
              background: `radial-gradient(circle at var(--gx) var(--gy), rgba(255,255,255,0.55), rgba(255,255,255,0) 50%)`,
              ["--gx" as string]: glareX,
              ["--gy" as string]: glareY,
            }}
            className="pointer-events-none absolute inset-0 rounded-[inherit] mix-blend-overlay opacity-0 transition-opacity duration-500 group-hover:opacity-100 hover:opacity-100"
          />
        )}
      </motion.div>
    </div>
  );
}
