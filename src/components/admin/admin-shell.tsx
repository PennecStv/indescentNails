"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarDays,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  Sparkles,
  X,
} from "lucide-react";

import { CherryFlowerIcon } from "@/components/public/cherry-icons";
import { cn } from "@/lib/utils";

type NavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
};

const NAV: NavItem[] = [
  { href: "/admin", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/admin/calendrier", label: "Calendrier", icon: CalendarDays },
  { href: "/admin/reservations", label: "Réservations", icon: ClipboardList },
  { href: "/admin/prestations", label: "Prestations", icon: Sparkles },
  { href: "/admin/messages", label: "Messages", icon: Mail },
];

interface AdminShellProps {
  user: { name: string; email: string };
  signOutAction: () => Promise<void>;
  children: React.ReactNode;
}

export function AdminShell({ user, signOutAction, children }: AdminShellProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  return (
    <div className="min-h-screen bg-cream">
      {/* Sidebar — desktop */}
      <aside className="hidden lg:flex lg:fixed lg:inset-y-0 lg:left-0 lg:w-64 lg:flex-col lg:border-r lg:border-border/60 lg:bg-white">
        <SidebarContent
          user={user}
          isActive={isActive}
          signOutAction={signOutAction}
        />
      </aside>

      {/* Mobile topbar */}
      <header className="lg:hidden sticky top-0 z-30 flex items-center justify-between border-b border-border/60 bg-white px-4 py-3">
        <Link href="/admin" className="flex items-center gap-2">
          <CherryFlowerIcon className="h-6 w-6 text-cherry-bloom" />
          <span className="font-serif text-lg text-cherry-leaf">Admin</span>
        </Link>
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          aria-label="Ouvrir le menu"
          className="p-2 text-foreground/70 hover:text-cherry-leaf"
        >
          <Menu className="h-5 w-5" />
        </button>
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <button
            type="button"
            aria-label="Fermer le menu"
            className="absolute inset-0 bg-ink/40"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 w-72 bg-white shadow-xl flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-border/60">
              <Link
                href="/admin"
                className="flex items-center gap-2"
                onClick={() => setMobileOpen(false)}
              >
                <CherryFlowerIcon className="h-6 w-6 text-cherry-bloom" />
                <span className="font-serif text-lg text-cherry-leaf">
                  Admin
                </span>
              </Link>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                aria-label="Fermer"
                className="p-2 text-foreground/70"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <SidebarContent
              user={user}
              isActive={isActive}
              signOutAction={signOutAction}
              onNavigate={() => setMobileOpen(false)}
              hideBrand
            />
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="lg:pl-64">
        <main className="px-4 sm:px-6 lg:px-10 py-6 lg:py-10 max-w-6xl mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

interface SidebarContentProps {
  user: { name: string; email: string };
  isActive: (href: string) => boolean;
  signOutAction: () => Promise<void>;
  onNavigate?: () => void;
  hideBrand?: boolean;
}

function SidebarContent({
  user,
  isActive,
  signOutAction,
  onNavigate,
  hideBrand,
}: SidebarContentProps) {
  return (
    <div className="flex h-full flex-col">
      {!hideBrand && (
        <div className="px-6 py-6 border-b border-border/60">
          <Link href="/admin" className="flex items-center gap-2">
            <CherryFlowerIcon className="h-7 w-7 text-cherry-bloom" />
            <div>
              <div className="font-serif text-lg text-cherry-leaf leading-tight">
                Indescent Nails
              </div>
              <div className="text-[11px] uppercase tracking-wider text-foreground/55">
                Espace admin
              </div>
            </div>
          </Link>
        </div>
      )}

      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition",
                active
                  ? "bg-cherry-leaf/10 text-cherry-leaf font-medium"
                  : "text-foreground/75 hover:bg-cream hover:text-cherry-leaf"
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border/60 p-4 space-y-3">
        <div className="px-2">
          <div className="text-sm font-medium text-foreground truncate">
            {user.name}
          </div>
          <div className="text-xs text-foreground/55 truncate">
            {user.email}
          </div>
        </div>
        <form action={signOutAction}>
          <button
            type="submit"
            className="w-full flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-foreground/75 hover:bg-cream hover:text-cherry-leaf transition"
          >
            <LogOut className="h-4 w-4" />
            Se déconnecter
          </button>
        </form>
      </div>
    </div>
  );
}
