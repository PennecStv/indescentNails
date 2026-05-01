"use client";

import {
  motion,
  useReducedMotion,
  type MotionProps,
  type Variants,
} from "motion/react";

import { cn } from "@/lib/utils";

interface CherryBlossomProps extends MotionProps {
  size?: number;
  className?: string;
  /** Délai avant le début de l'animation (en s) */
  delay?: number;
  /** Couleur des pétales (CSS var, hex, etc.) */
  petalColor?: string;
  /** Couleur du centre (étamines) */
  centerColor?: string;
  /** Couleur du contour (stroke draw) */
  strokeColor?: string;
  /** Mode trigger : 'mount' au montage, 'inView' au scroll */
  trigger?: "mount" | "inView";
  /** Si vrai, joue en boucle (idle pulse) */
  idle?: boolean;
  /** Inclut la tige + sépales */
  withStem?: boolean;
}

const easeBloom = [0.34, 1.4, 0.64, 1] as const;
const easeOutExpo = [0.19, 1, 0.22, 1] as const;

/**
 * Fleur de cerisier 5 pétales, animée en 3 phases :
 *  1. Tige + sépales se peignent (stroke draw via pathLength)
 *  2. Pétales s'épanouissent un par un (scale + rotate from center)
 *  3. Étamines apparaissent au centre
 */
export function CherryBlossom({
  size = 200,
  className,
  delay = 0,
  petalColor = "#C4A5A7",
  centerColor = "#9C6F76",
  strokeColor = "#7A9E7E",
  trigger = "mount",
  idle = false,
  withStem = true,
  ...rest
}: CherryBlossomProps) {
  const reduced = useReducedMotion();

  // Si reduced motion : on affiche la fleur d'emblée (opacité fade simple)
  const reduceVariant: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.6, delay },
    },
  };

  const containerVariants: Variants = reduced
    ? reduceVariant
    : {
        hidden: {},
        visible: {
          transition: {
            delayChildren: delay,
            staggerChildren: 0.0,
          },
        },
      };

  // Stem path (courbe organique vers le bas)
  const stemVariants: Variants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { duration: 0.9, ease: easeOutExpo },
        opacity: { duration: 0.3 },
      },
    },
  };

  // Sépales (calice) — apparaissent après la tige
  const sepalVariants: Variants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 0.85,
      transition: {
        pathLength: { duration: 0.4, delay: 0.7, ease: easeOutExpo },
        opacity: { duration: 0.3, delay: 0.7 },
      },
    },
  };

  // Pétale : commence comme un bouton fermé puis s'épanouit
  const petalVariant = (i: number): Variants => ({
    hidden: { scale: 0, opacity: 0, rotate: -8 },
    visible: {
      scale: 1,
      opacity: 1,
      rotate: 0,
      transition: {
        delay: (withStem ? 0.95 : 0) + i * 0.09,
        duration: 0.85,
        ease: easeBloom,
      },
    },
  });

  // Centre : apparait après le bloom complet
  const centerVariants: Variants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        delay: (withStem ? 0.95 : 0) + 5 * 0.09 + 0.1,
        duration: 0.5,
        ease: easeBloom,
      },
    },
  };

  const initial = reduced ? "hidden" : "hidden";
  const animateProp = trigger === "mount" ? "visible" : undefined;
  const whileInViewProp = trigger === "inView" ? "visible" : undefined;

  // 5 pétales, écartés à 72°
  const petals = [0, 1, 2, 3, 4];

  return (
    <motion.svg
      viewBox="-120 -100 240 240"
      width={size}
      height={size}
      className={cn("overflow-visible", className)}
      variants={containerVariants}
      initial={initial}
      animate={animateProp}
      whileInView={whileInViewProp}
      viewport={trigger === "inView" ? { once: true, amount: 0.3 } : undefined}
      aria-hidden="true"
      {...rest}
    >
      {withStem && (
        <>
          {/* Tige principale, qui se peint depuis le bas */}
          <motion.path
            d="M0,140 C 5,100 -10,60 0,20"
            stroke={strokeColor}
            strokeWidth={2.2}
            strokeLinecap="round"
            fill="none"
            variants={stemVariants}
            style={{ opacity: 0.7 }}
          />
          {/* Petite feuille gauche */}
          <motion.path
            d="M-2,90 C -22,82 -32,70 -28,55 C -12,55 -4,70 -2,90 Z"
            stroke={strokeColor}
            strokeWidth={1.4}
            fill={strokeColor}
            fillOpacity={0.18}
            variants={sepalVariants}
          />
          {/* Petite feuille droite */}
          <motion.path
            d="M3,75 C 18,72 26,62 23,50 C 12,52 5,62 3,75 Z"
            stroke={strokeColor}
            strokeWidth={1.4}
            fill={strokeColor}
            fillOpacity={0.18}
            variants={sepalVariants}
          />
          {/* Calice (sépales sous la fleur) */}
          <motion.path
            d="M-10,28 C -6,22 6,22 10,28"
            stroke={strokeColor}
            strokeWidth={1.6}
            strokeLinecap="round"
            fill="none"
            variants={sepalVariants}
          />
        </>
      )}

      {/* Pétales : chacun pivote autour de l'axe central (0,0) */}
      <g style={{ transform: "translate(0px, 0px)" }}>
        {petals.map((i) => {
          const angle = i * 72;
          return (
            <motion.path
              key={i}
              // Forme de pétale : bas pointu vers (0,0), top arrondi
              d="M0,4 C -28,-4 -32,-50 -10,-78 C -3,-86 3,-86 10,-78 C 32,-50 28,-4 0,4 Z"
              fill={petalColor}
              stroke={petalColor}
              strokeWidth={0.6}
              variants={petalVariant(i)}
              style={{
                transformOrigin: "0px 4px",
                transform: `rotate(${angle}deg)`,
              }}
            />
          );
        })}
      </g>

      {/* Centre de la fleur — discret, sans glow doré */}
      <motion.circle
        cx={0}
        cy={0}
        r={4}
        fill={centerColor}
        fillOpacity={0.85}
        variants={centerVariants}
      />

      {/* Idle pulse — discret */}
      {idle && !reduced && (
        <motion.circle
          cx={0}
          cy={0}
          r={5.5}
          fill="none"
          stroke={centerColor}
          strokeWidth={1.5}
          initial={{ opacity: 0, scale: 1 }}
          animate={{ opacity: [0, 0.4, 0], scale: [1, 2.4, 2.6] }}
          transition={{
            duration: 3.2,
            repeat: Infinity,
            delay: (withStem ? 1.6 : 0.6) + delay,
            ease: "easeOut",
          }}
        />
      )}
    </motion.svg>
  );
}
