"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Menu, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { CherryFlowerIcon } from "./cherry-icons";
import { CherryBlossom } from "./motion/cherry-blossom";
import { FillButton } from "./motion/fill-button";

const NAV_ITEMS = [
  { href: "/", label: "Accueil" },
  { href: "/prestations", label: "Prestations" },
  { href: "/reservation", label: "Réserver" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const reduced = useReducedMotion();
  const pathname = usePathname();

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 24);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Close mobile menu when path changes
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <motion.header
      initial={reduced ? false : { y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.19, 1, 0.22, 1], delay: 0.3 }}
      className={cn(
        "sticky top-0 z-40 transition-[background-color,backdrop-filter,border-color,padding] duration-500",
        scrolled
          ? "bg-background/85 backdrop-blur-xl border-b border-border/50"
          : "bg-background/0 border-b border-transparent"
      )}
    >
      <div
        className={cn(
          "container-narrow flex items-center justify-between transition-[height] duration-500",
          scrolled ? "h-14" : "h-20"
        )}
      >
        <Link
          href="/"
          className="group flex items-center gap-2.5"
          onClick={() => setOpen(false)}
        >
          <motion.span
            initial={false}
            animate={{ rotate: scrolled ? 0 : 8 }}
            transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
            className="inline-flex"
          >
            <CherryFlowerIcon
              className={cn(
                "transition-[height,width,color] duration-500 text-cherry-bloom group-hover:text-cherry-leaf",
                scrolled ? "h-5 w-5" : "h-7 w-7"
              )}
            />
          </motion.span>
          <span
            className={cn(
              "font-serif tracking-wide text-cherry-leaf transition-[font-size] duration-500",
              scrolled ? "text-base" : "text-xl"
            )}
          >
            Indescent <span className="italic text-cherry-bloom">Nails</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-9">
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "link-editorial text-[11px] uppercase tracking-[0.25em] transition-colors",
                  isActive
                    ? "text-cherry-bloom"
                    : "text-foreground/70 hover:text-cherry-bloom"
                )}
              >
                {item.label}
                {isActive && (
                  <motion.span
                    layoutId="nav-active-dot"
                    className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-cherry-bloom"
                  />
                )}
              </Link>
            );
          })}
          <FillButton href="/reservation" variant="primary" size="default">
            Prendre rendez-vous
          </FillButton>
        </nav>

        <button
          type="button"
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={open}
          className="md:hidden relative z-10 p-2 text-cherry-leaf"
          onClick={() => setOpen((v) => !v)}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={open ? "close" : "open"}
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="inline-flex"
            >
              {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </motion.span>
          </AnimatePresence>
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
            className="md:hidden fixed inset-0 top-0 z-[-1] bg-background cherry-branch-bg overflow-hidden"
          >
            <div className="absolute -bottom-10 -right-10 opacity-60 pointer-events-none">
              <CherryBlossom size={300} delay={0.3} withStem={false} />
            </div>
            <motion.nav
              className="relative flex flex-col items-start gap-2 px-8 pt-28 pb-10"
              initial="hidden"
              animate="show"
              exit="hidden"
              variants={{
                hidden: {},
                show: { transition: { staggerChildren: 0.07 } },
              }}
            >
              {NAV_ITEMS.map((item, i) => (
                <motion.div
                  key={item.href}
                  variants={{
                    hidden: { opacity: 0, y: 30 },
                    show: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.7, ease: [0.19, 1, 0.22, 1] },
                    },
                  }}
                  className="w-full overflow-hidden"
                >
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="flex items-baseline gap-4 py-3 border-b border-border/40 group"
                  >
                    <span className="section-numeral !text-base !opacity-70">
                      0{i + 1}
                    </span>
                    <span className="font-serif text-3xl text-cherry-leaf group-hover:text-cherry-bloom transition-colors">
                      {item.label}
                    </span>
                  </Link>
                </motion.div>
              ))}
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  show: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.7, ease: [0.19, 1, 0.22, 1] },
                  },
                }}
                className="mt-8"
              >
                <FillButton
                  href="/reservation"
                  variant="primary"
                  size="lg"
                  onClick={() => setOpen(false)}
                >
                  Prendre rendez-vous
                </FillButton>
              </motion.div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
