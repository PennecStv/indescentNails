"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";

import { cn } from "@/lib/utils";

interface MagneticProps {
  children: React.ReactNode;
  className?: string;
  strength?: number;
  as?: "div" | "a";
  href?: string;
}

export function Magnetic({
  children,
  className,
  strength = 0.18,
  as = "div",
  href,
}: MagneticProps) {
  const reduced = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { damping: 18, stiffness: 220, mass: 0.4 });
  const sy = useSpring(y, { damping: 18, stiffness: 220, mass: 0.4 });

  function handleMove(e: React.MouseEvent<HTMLDivElement | HTMLAnchorElement>) {
    if (reduced) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    x.set((e.clientX - cx) * strength);
    y.set((e.clientY - cy) * strength);
  }

  function handleLeave() {
    x.set(0);
    y.set(0);
  }

  const commonProps = {
    onMouseMove: handleMove,
    onMouseLeave: handleLeave,
    style: { x: sx, y: sy },
    className: cn("inline-block", className),
  };

  if (as === "a") {
    return (
      <motion.a href={href} {...commonProps}>
        {children}
      </motion.a>
    );
  }
  return <motion.div {...commonProps}>{children}</motion.div>;
}
