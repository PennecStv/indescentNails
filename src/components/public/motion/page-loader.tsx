"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

import { CherryBlossom } from "./cherry-blossom";

const LOADER_KEY = "indescent-loader-shown";

/**
 * Loader full-screen joué au premier mount d'une session :
 *  - rideau cream qui se ferme
 *  - fleur de cerisier qui s'épanouit au centre
 *  - rideau qui se déchire (deux moitiés qui partent en opposition)
 *
 * Une fois joué, on stocke un flag en sessionStorage : il ne rejoue pas
 * lors d'une navigation interne.
 */
export function PageLoader() {
  const [show, setShow] = useState<boolean | null>(null);

  useEffect(() => {
    const already =
      typeof window !== "undefined" &&
      window.sessionStorage.getItem(LOADER_KEY) === "1";
    if (already) {
      setShow(false);
      return;
    }
    setShow(true);
    const t = setTimeout(() => {
      setShow(false);
      try {
        window.sessionStorage.setItem(LOADER_KEY, "1");
      } catch {
        /* ignore */
      }
    }, 2600);
    return () => clearTimeout(t);
  }, []);

  // Lock body scroll while shown
  useEffect(() => {
    if (show) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [show]);

  if (show === null) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="page-loader"
          className="fixed inset-0 z-[100] pointer-events-none flex items-center justify-center"
          aria-hidden="true"
        >
          {/* Rideau haut */}
          <motion.div
            className="absolute top-0 left-0 right-0 bg-cream"
            initial={{ height: "50%" }}
            exit={{ y: "-100%" }}
            transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1], delay: 0.1 }}
            style={{ height: "50%" }}
          />
          {/* Rideau bas */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 bg-cream"
            initial={{ height: "50%" }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1], delay: 0.1 }}
            style={{ height: "50%" }}
          />

          {/* Trait éditorial */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.3 } }}
            transition={{ duration: 1.2, ease: [0.19, 1, 0.22, 1], delay: 0.2 }}
            className="absolute left-1/2 -translate-x-1/2 top-[calc(50%-110px)] h-px w-[140px] bg-cherry-bloom origin-center z-10"
          />

          {/* Fleur centrale */}
          <motion.div
            className="relative z-10 flex flex-col items-center gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1, transition: { duration: 0.4 } }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <CherryBlossom size={220} delay={0.3} withStem={false} idle />
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.4, ease: [0.19, 1, 0.22, 1] }}
            >
              <div className="font-serif italic text-2xl md:text-3xl text-cherry-leaf">
                Indescent <span className="text-cherry-bloom">Nails</span>
              </div>
              <div className="mt-2 text-[10px] uppercase tracking-[0.4em] text-foreground/55">
                Une parenthèse
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
