# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

**indescentNails** is a booking website for a nail artist. The project is in its initial state — no framework, tooling, or source files have been added yet.

### Where we stopped last time

◼ Composants motion primitives (reveal, magnetic, marquee, parallax-branch, noise)
◼ Composants signature v2 : `cherry-blossom` (fleur SVG animée 5 pétales), `fill-button` (wipe hover gauche→droite), `page-loader` (rideau + bloom), `scroll-progress` (barre top), `bloom-reveal` (reveal + fleur), `stroke-branch` (branche qui se peint au scroll)
◼ Refonte site-header (sticky shrink, indicateur active layoutId, fill-button, mobile menu fleuri)
◼ Refonte site-footer (marquee, fill-button outline, fleur en décor)
◼ Refonte home v2 : grosses fleurs animées au hero, double marquee, stats éditoriales, branche stroke au scroll, hover cards avec fleurs qui apparaissent, citation flottante
◼ Refonte prestations v2 : sommaire sticky, layout magazine, fleur signature par catégorie, hover row avec fleur
◼ Refonte contact v2 : hero éditorial, card Insta avec fleur révélée au hover, form en card glassy

Note : Magnetic n'est plus utilisé (le composant existe mais est inutilisé) — remplacé par `fill-button` partout.

### Suite possible

  ◻ Refonte page réservation (booking wizard) — toujours en design d'origine
  ◻ Brancher l'envoi d'email réel (Resend/Nodemailer) — Phase 5
  ◻ Migration SQLite → Postgres — Phase 6   
