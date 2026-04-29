import Link from "next/link";
import { Instagram, Mail, Phone, Clock } from "lucide-react";
import { CherryFlowerIcon } from "./cherry-icons";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/40 bg-rose-gold/40 mt-20">
      <div className="container-narrow py-12 grid gap-10 md:grid-cols-3">
        <div>
          <Link href="/" className="flex items-center gap-2">
            <CherryFlowerIcon className="h-7 w-7 text-cherry-bloom" />
            <span className="font-serif text-xl text-cherry-leaf">Indescent Nails</span>
          </Link>
          <p className="mt-4 text-sm text-foreground/70 leading-relaxed">
            Prothésiste ongulaire passionnée. Pose, nail art et déposes dans un
            univers calme et raffiné.
          </p>
        </div>
        <div className="text-sm space-y-3">
          <div className="font-medium text-cherry-leaf uppercase tracking-wider text-xs">
            Contact
          </div>
          <a
            href="https://instagram.com/indescentnails"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-foreground/80 hover:text-cherry-bloom"
          >
            <Instagram className="h-4 w-4" /> @indescentnails
          </a>
          <a
            href="mailto:contact@indescent-nails.fr"
            className="flex items-center gap-2 text-foreground/80 hover:text-cherry-bloom"
          >
            <Mail className="h-4 w-4" /> contact@indescent-nails.fr
          </a>
          <div className="flex items-center gap-2 text-foreground/80">
            <Phone className="h-4 w-4" /> 06 XX XX XX XX
          </div>
        </div>
        <div className="text-sm space-y-3">
          <div className="font-medium text-cherry-leaf uppercase tracking-wider text-xs">
            Horaires
          </div>
          <div className="flex items-start gap-2 text-foreground/80">
            <Clock className="h-4 w-4 mt-0.5" />
            <div>
              <div>Mar — Jeu : 10h — 19h</div>
              <div>Sam : 9h — 17h</div>
              <div className="text-foreground/50">Lun, Ven, Dim : fermé</div>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-border/40">
        <div className="container-narrow py-4 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-foreground/60">
          <div>© {new Date().getFullYear()} Indescent Nails. Tous droits réservés.</div>
          <nav className="flex gap-4">
            <Link href="/mentions-legales" className="hover:text-cherry-bloom">Mentions légales</Link>
            <Link href="/confidentialite" className="hover:text-cherry-bloom">Politique de confidentialité</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
