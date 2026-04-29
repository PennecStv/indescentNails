"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { CherryFlowerIcon } from "./cherry-icons";

const NAV_ITEMS = [
  { href: "/", label: "Accueil" },
  { href: "/prestations", label: "Prestations" },
  { href: "/reservation", label: "Réserver" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border/40 bg-background/85 backdrop-blur-md">
      <div className="container-narrow flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <CherryFlowerIcon className="h-6 w-6 text-cherry-bloom" />
          <span className="font-serif text-lg tracking-wide text-cherry-leaf">
            Indescent Nails
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm uppercase tracking-wider text-foreground/70 transition-colors hover:text-cherry-bloom"
            >
              {item.label}
            </Link>
          ))}
          <Link href="/reservation" className="btn-primary-cta">
            Prendre rendez-vous
          </Link>
        </nav>

        <button
          type="button"
          aria-label="Menu"
          className="md:hidden p-2 text-foreground/70"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      <div
        className={cn(
          "md:hidden border-t border-border/40 bg-background overflow-hidden transition-[max-height] duration-300",
          open ? "max-h-96" : "max-h-0"
        )}
      >
        <nav className="flex flex-col py-4 px-6 gap-3">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="text-sm uppercase tracking-wider text-foreground/80 py-2"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/reservation"
            onClick={() => setOpen(false)}
            className="btn-primary-cta mt-2 self-start"
          >
            Prendre rendez-vous
          </Link>
        </nav>
      </div>
    </header>
  );
}
