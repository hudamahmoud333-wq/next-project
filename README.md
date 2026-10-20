# FreshCart (Next.js + TypeScript)

E-commerce front end built on the Route E-commerce API, following the FreshCart demo.

## Stack
Next.js (App Router) · TypeScript · Tailwind CSS v4 · TanStack React Query · react-hot-toast · lucide-react

## Run
```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

## Structure
- `src/lib/api.ts` – every endpoint (auth header is `token`, not `Authorization`)
- `src/lib/types.ts` – response/request types
- `src/providers` – React Query + Auth context (token + user in localStorage)
- `src/hooks` – `useCart` (API v2), `useWishlist`
- `src/app` – pages: `/`, `/products`, `/products/[id]`, `/categories`, `/categories/[id]`, `/brands`, `/deals`,
  `/cart`, `/checkout`, `/wishlist`, `/login`, `/register`, `/forgot-password`, `/profile`, `/profile/orders`,
  `/allorders` (payment return), `/contact`, and static pages via `/[slug]` (about, help, privacy, ...)

## Notes
- Cart and Orders use API **v2**. Online payment uses `POST /api/v1/orders/checkout-session/:cartId` because
  that is the only checkout-session endpoint in the collection. If it rejects a v2 cart id, check which id it expects.
- The Postman collection has no saved response examples for v2. `normalizeCart()` in `src/lib/api.ts`
  maps the cart defensively; adjust only that function if the real response differs.
- Theme colors live in `src/app/globals.css` (`--color-primary: #16a34a`, taken from the demo screenshot).
- The hero uses `public/hero.jpg` with a green overlay (see `src/components/home/HeroSlider.tsx`).
