# Kosisi Platform — Next.js

This is the original Kosisi Wears storefront + admin suite, migrated off
TanStack Start (Vite) and Lovable's build tooling onto Next.js 15
(App Router). All original features and UI are preserved.

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## What changed in this migration

- **Framework:** TanStack Router/Start → Next.js 15 App Router.
  Every route now lives under `app/`, mostly as a `page.tsx` (server
  component, holds page metadata) + `XClient.tsx` (client component,
  holds the interactive UI) pair.
- **Removed Lovable-specific code:** `lovable-error-reporting.ts`, the
  `@lovable.dev/vite-tanstack-config` build wrapper, and the two
  TanStack-Start-only server files (`server.ts`, `start.ts`) — none of
  these are needed under Next.js.
- **Logo image:** the original logo was referenced via a `.asset.json`
  pointer into Lovable's private asset CDN, not a real file, so it
  couldn't be carried over. `src/lib/brand.ts` now points at
  `/public/kosisi-logo.jpeg` — **add your logo file there** to restore
  it (a placeholder path only, no image included).
- **Search params:** pages that read query params (`/shop`, `/track`,
  `/checkout/success`) now use `useSearchParams()` from
  `next/navigation` and are wrapped in `<Suspense>`, as Next.js
  requires.
- **Dynamic product route:** `/product/[id]` now uses
  `generateMetadata()` for per-product SEO tags and `notFound()` for
  missing products, with a `loading.tsx` skeleton.
- Everything else (cart, wishlist, compare, coupons, checkout flow,
  admin dashboard, auth-gated admin shell, etc.) is unchanged in
  behavior — all client-side state (`localStorage`-backed) works the
  same way it did before.

## Notes

- All data is still mocked/local (no real backend, payment gateway, or
  auth server) — same as the original.
- Admin routes are still client-side gated only (`useAdminSession`) —
  there's no server-side auth check, matching the original behavior.
