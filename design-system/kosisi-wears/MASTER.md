# Design System Master File

> **LOGIC:** When building a specific page, first check `design-system/pages/[page-name].md`.
> If that file exists, its rules **override** this Master file.
> If not, strictly follow the rules below.
>
> **Source of truth:** This file documents the design system **already implemented** in
> `app/globals.css` and `app/layout.tsx` — it is not a fresh recommendation. The ui-ux-pro-max
> skill's generic suggestion (Rubik/Nunito Sans, brown/tan palette) was evaluated and rejected
> in favor of the project's existing, more deliberate luxury identity below. Use this file to
> keep new pages/components consistent with what's already built.

---

**Project:** Kosisi Wears
**Generated:** 2026-08-10
**Category:** E-commerce Luxury / Fashion

---

## Global Rules

### Color Palette (light mode — see `.dark` block in globals.css for dark values)

| Role | OKLCH (globals.css) | CSS Variable |
|------|----------------------|--------------|
| Background | `oklch(0.99 0 0)` | `--background` |
| Foreground | `oklch(0.12 0 0)` | `--foreground` |
| Card | `oklch(1 0 0)` | `--card` |
| Primary | `oklch(0.12 0 0)` (near-black) | `--primary` |
| Primary Foreground | `oklch(0.99 0 0)` | `--primary-foreground` |
| Secondary / Muted | `oklch(0.96 0 0)` | `--secondary` / `--muted` |
| Accent | `oklch(0.94 0 0)` | `--accent` |
| **Gold (brand accent)** | `oklch(0.78 0.14 85)` (light) / `oklch(0.82 0.15 85)` (dark) | `--gold` |
| Destructive | `oklch(0.55 0.22 27)` | `--destructive` |
| Border | `oklch(0.9 0 0)` | `--border` |
| Ring | `oklch(0.75 0.1 85)` | `--ring` |

**Notes:** Black/white/charcoal base with a warm gold accent (`--gold`) reserved for CTAs, badges, and premium highlights. Full dark-mode equivalents already defined in the `.dark` block — dark mode is the site's default theme (see `src/lib/theme.tsx`).

### Typography

- **Heading Font:** Playfair Display (`--font-display`, `font-display` utility, applied to h1–h4)
- **Body Font:** Inter (`--font-sans`)
- **Mood:** luxury, editorial, high-contrast, fashion-forward
- Loaded via `next/font/google` in `app/layout.tsx` — do not add a separate Google Fonts `<link>`.

### Spacing / Layout Conventions

| Token | Usage |
|-------|-------|
| `.container-luxury` | Max-width 80rem, centered, 1.25rem inline padding — standard page container |
| `.hover-lift` | Standard interactive hover treatment (transform + shadow, 0.4s cubic-bezier) |
| `--radius: 0.25rem` | Base radius; `--radius-sm` through `--radius-4xl` scale from this via `@theme inline` |

### Component Foundation

Built on **shadcn/ui** (Radix primitives) with Tailwind v4's `@theme inline` token mapping — new components should use existing shadcn primitives in `src/components/ui/` rather than introducing new one-off styles, and pull colors from the semantic tokens above (`bg-background`, `text-foreground`, `bg-primary`, `text-gold`, etc.), never raw hex values.

---

## Page Pattern Guidance (for new pages)

For product/landing-style pages, follow **Hero-Centric Design**: full-bleed hero (site already has `hero.jpg` / `lookbook.jpg`), single value-prop strip, featured products, one dominant CTA. For product detail pages, favor **Product Review/Ratings Focused** ordering: hero product image + rating, breakdown, reviews, buy CTA alongside reviews (site already has `customer-reviews.ts`).

---

## Anti-Patterns (Do NOT Use)

- ❌ Raw hex codes in components — always use the semantic CSS variables / Tailwind tokens above
- ❌ Emojis as icons — use `lucide-react` (already a dependency)
- ❌ Introducing a second font family outside Playfair Display / Inter
- ❌ Light-mode-only styling — this app is dark-mode-default; verify both themes
- ❌ Missing `cursor-pointer`, layout-shifting hovers, low-contrast text, instant (0ms) state changes, invisible focus states

---

## Pre-Delivery Checklist

- [ ] Colors pulled from semantic tokens (`bg-primary`, `text-gold`, etc.), not raw hex
- [ ] `lucide-react` icons only, no emoji
- [ ] `cursor-pointer` on all clickable elements
- [ ] Hover/transition states 150–300ms
- [ ] Both light and dark mode verified (`.dark` class toggle via `useTheme()`)
- [ ] Focus states visible for keyboard navigation
- [ ] `prefers-reduced-motion` respected
- [ ] Responsive: 375px, 768px, 1024px, 1440px
- [ ] Touch targets ≥44×44px
- [ ] Text contrast ≥4.5:1 in both themes
