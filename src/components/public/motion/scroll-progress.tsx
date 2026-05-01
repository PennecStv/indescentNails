"use client";

import { motion, useScroll, useSpring } from "motion/react";

/**
 * Fine barre de progression du scroll, fixée tout en haut.
 * Utilise un spring pour adoucir le mouvement.
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      style={{ scaleX, transformOrigin: "0% 50%" }}
      className="fixed top-0 left-0 right-0 z-50 h-[2px] bg-gradient-to-r from-cherry-bloom via-cherry-leaf to-cherry-bloom"
      aria-hidden="true"
    />
  );
}
