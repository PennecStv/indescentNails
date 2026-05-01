"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";

import { CherryBranchDecoration } from "@/components/public/cherry-icons";
import { cn } from "@/lib/utils";

interface ParallaxBranchProps {
  className?: string;
  intensity?: number;
}

export function ParallaxBranch({
  className,
  intensity = 80,
}: ParallaxBranchProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(
    scrollYProgress,
    [0, 1],
    reduced ? [0, 0] : [-intensity, intensity]
  );
  const rotate = useTransform(
    scrollYProgress,
    [0, 1],
    reduced ? [0, 0] : [-3, 4]
  );

  return (
    <motion.div
      ref={ref}
      style={{ y, rotate }}
      className={cn("pointer-events-none absolute", className)}
    >
      <CherryBranchDecoration className="w-full h-auto" />
    </motion.div>
  );
}
