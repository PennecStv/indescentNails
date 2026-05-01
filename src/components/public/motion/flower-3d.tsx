"use client";

import { useEffect, useRef } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";

import { cn } from "@/lib/utils";

interface Flower3DProps {
  size?: number;
  className?: string;
  /** Couleur dominante des pétales */
  petalColor?: string;
  /** Couleur du tout petit centre (volontairement discrète, pas dorée) */
  centerColor?: string;
  /** Si vrai, la fleur tourne lentement en idle */
  autoRotate?: boolean;
  /** Si vrai, la fleur réagit à la souris au niveau window */
  followMouse?: boolean;
  /** Si vrai, parallax de rotation au scroll */
  parallaxScroll?: boolean;
}

/**
 * Fleur de cerisier en pseudo-3D : 5 pétales empilés sur des plans Z
 * différents, avec halo radial flou et rotation continue.
 * Aucun cœur doré — un simple petit cercle rose pour la profondeur.
 */
export function Flower3D({
  size = 280,
  className,
  petalColor = "#C4A5A7",
  centerColor = "#9C6F76",
  autoRotate = true,
  followMouse = false,
  parallaxScroll = false,
}: Flower3DProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 100, damping: 16 });
  const sy = useSpring(my, { stiffness: 100, damping: 16 });

  const rotateY = useTransform(sx, [-0.5, 0.5], [-22, 22]);
  const rotateX = useTransform(sy, [-0.5, 0.5], [22, -22]);

  // Auto-rotate continu
  const baseRotate = useMotionValue(0);
  useEffect(() => {
    if (!autoRotate || reduced) return;
    let frameId: number;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      baseRotate.set(baseRotate.get() + dt * 14);
      frameId = requestAnimationFrame(tick);
    };
    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [autoRotate, reduced, baseRotate]);

  // Mouse parallax (window-level)
  useEffect(() => {
    if (!followMouse || reduced) return;
    function onMove(e: MouseEvent) {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      mx.set((e.clientX - cx) / window.innerWidth);
      my.set((e.clientY - cy) / window.innerHeight);
    }
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [followMouse, reduced, mx, my]);

  // Scroll parallax
  const { scrollY } = useScroll();
  const scrollRotate = useTransform(scrollY, [0, 1500], [0, 360]);

  const petals = [0, 1, 2, 3, 4];

  return (
    <div
      ref={ref}
      className={cn("relative", className)}
      style={{ width: size, height: size, perspective: 800 }}
      aria-hidden
    >
      <motion.div
        className="absolute inset-0 will-change-transform"
        style={{
          transformStyle: "preserve-3d",
          rotateX: followMouse && !reduced ? rotateX : 0,
          rotateY: parallaxScroll
            ? scrollRotate
            : followMouse && !reduced
              ? rotateY
              : 0,
          rotate: autoRotate && !reduced ? baseRotate : 0,
        }}
      >
        {/* Halo arrière flou — donne la profondeur sans briller */}
        <div
          className="absolute left-1/2 top-1/2"
          style={{
            transform: "translate(-50%, -50%) translateZ(-40px)",
            width: size * 0.95,
            height: size * 0.95,
            background: `radial-gradient(circle, ${petalColor}55 0%, transparent 65%)`,
            borderRadius: "50%",
            filter: "blur(20px)",
          }}
        />

        {/* 5 pétales sur des plans Z différents */}
        {petals.map((i) => {
          const angle = i * 72;
          const z = (i - 2) * 8;
          const opacity = 0.85 + (i % 2) * 0.1;
          return (
            <div
              key={i}
              className="absolute left-1/2 top-1/2"
              style={{
                transform: `translate(-50%, -50%) rotate(${angle}deg) translateZ(${z}px)`,
                transformStyle: "preserve-3d",
                width: size * 0.4,
                height: size * 0.7,
                marginTop: -size * 0.45,
              }}
            >
              <svg
                viewBox="-50 -90 100 100"
                width="100%"
                height="100%"
                style={{
                  filter: `drop-shadow(0 ${4 + i}px ${
                    8 + i * 2
                  }px rgba(156, 111, 118, 0.25))`,
                }}
              >
                <defs>
                  <radialGradient
                    id={`petal-${i}`}
                    cx="50%"
                    cy="20%"
                    r="80%"
                  >
                    <stop offset="0%" stopColor="#FBF7F4" stopOpacity="0.95" />
                    <stop offset="55%" stopColor={petalColor} stopOpacity="1" />
                    <stop offset="100%" stopColor="#9C6F76" stopOpacity="1" />
                  </radialGradient>
                </defs>
                <path
                  d="M0,4 C -28,-4 -32,-50 -10,-78 C -3,-86 3,-86 10,-78 C 32,-50 28,-4 0,4 Z"
                  fill={`url(#petal-${i})`}
                  fillOpacity={opacity}
                />
                <path
                  d="M0,0 L0,-80"
                  stroke="#9C6F76"
                  strokeWidth={0.6}
                  opacity={0.4}
                />
              </svg>
            </div>
          );
        })}

        {/* Petit centre rose discret — ni doré ni glow */}
        <div
          className="absolute left-1/2 top-1/2"
          style={{
            transform: "translate(-50%, -50%) translateZ(20px)",
          }}
        >
          <div
            style={{
              width: size * 0.08,
              height: size * 0.08,
              background: centerColor,
              borderRadius: "50%",
              opacity: 0.85,
            }}
          />
        </div>
      </motion.div>
    </div>
  );
}
