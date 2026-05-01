"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";

import { cn } from "@/lib/utils";

interface StrokeBranchProps {
  className?: string;
  /** Décale la position des fleurs sur la courbe (0..1) */
  flowerDelays?: number[];
}

/**
 * Branche stylisée qui se peint au fur et à mesure du scroll. Quelques
 * fleurs apparaissent en cascade le long du tracé.
 */
export function StrokeBranch({ className }: StrokeBranchProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const pathLength = useTransform(scrollYProgress, [0, 0.6], [0, 1]);
  const flower1 = useTransform(scrollYProgress, [0.18, 0.32], [0, 1]);
  const flower2 = useTransform(scrollYProgress, [0.34, 0.5], [0, 1]);
  const flower3 = useTransform(scrollYProgress, [0.5, 0.66], [0, 1]);

  if (reduced) {
    return null;
  }

  return (
    <div
      ref={ref}
      className={cn("pointer-events-none absolute", className)}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 600 800"
        className="w-full h-full"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Branche principale */}
        <motion.path
          d="M30,780 C 90,640 200,560 240,440 C 280,320 200,220 280,120 C 340,40 480,60 560,30"
          stroke="#7A9E7E"
          strokeWidth={1.6}
          strokeLinecap="round"
          fill="none"
          opacity={0.55}
          style={{ pathLength }}
        />
        {/* Petite branche secondaire */}
        <motion.path
          d="M240,440 C 280,420 320,440 360,400"
          stroke="#7A9E7E"
          strokeWidth={1.2}
          strokeLinecap="round"
          fill="none"
          opacity={0.45}
          style={{ pathLength }}
        />

        {/* Fleur 1 — petite */}
        <motion.g
          style={{ transformOrigin: "240px 580px", scale: flower1, opacity: flower1 }}
        >
          <FlowerCluster cx={240} cy={580} scale={0.7} />
        </motion.g>
        {/* Fleur 2 — moyenne */}
        <motion.g
          style={{ transformOrigin: "260px 320px", scale: flower2, opacity: flower2 }}
        >
          <FlowerCluster cx={260} cy={320} scale={1} />
        </motion.g>
        {/* Fleur 3 — petite */}
        <motion.g
          style={{ transformOrigin: "440px 90px", scale: flower3, opacity: flower3 }}
        >
          <FlowerCluster cx={440} cy={90} scale={0.65} />
        </motion.g>
      </svg>
    </div>
  );
}

function FlowerCluster({
  cx,
  cy,
  scale = 1,
}: {
  cx: number;
  cy: number;
  scale?: number;
}) {
  const r = 5 * scale;
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill="#C4A5A7" opacity={0.85} />
      <circle cx={cx + r * 1.2} cy={cy - r * 0.6} r={r * 0.85} fill="#C4A5A7" opacity={0.7} />
      <circle cx={cx - r * 1.1} cy={cy - r * 0.4} r={r * 0.85} fill="#EDE0E1" opacity={0.85} />
      <circle cx={cx + r * 0.3} cy={cy - r * 1.4} r={r * 0.7} fill="#C4A5A7" opacity={0.6} />
      <circle cx={cx} cy={cy} r={r * 0.35} fill="#F4D27A" opacity={0.9} />
    </g>
  );
}
