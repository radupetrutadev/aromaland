# Aroma Land Shop — redesign

A new front end for [aromaland-shop.ro](https://www.aromaland-shop.ro/): modern, uncluttered,
mobile-first, and built to get a shopper from landing to placed order in as few steps as possible.

Static HTML, CSS and vanilla JavaScript. **No build step, no framework, no dependencies,
no webfonts, no third-party requests.**

## Run it

Any static file server works — there is nothing to compile.

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

Deploy by uploading the repository root to any static host or CDN
(Netlify, Cloudflare Pages, GitHub Pages, nginx).

## Pages

| File | Purpose |
| --- | --- |
| `index.html` | Home — hero, category grid, bestsellers, shop-by-intent |
| `catalog.html` | Catalog with instant client-side filters, sorting, and linkable URLs |
| `product.html` | Product detail (`?id=<product-id>`), variants, sticky mobile buy bar |
| `cart.html` | Full cart review |
| `checkout.html` | Single-screen guest checkout + order confirmation |
| `info.html` | Delivery, returns, payment, FAQ, about, contact — one page instead of ten |

## How the purchase path was shortened

The old flow was: category page → product page → cart page → login/account → multi-step
checkout. This build cuts that to **two clicks minimum**.

- **Add to cart from any product grid.** Every card has a `+` button, so the product page is
  optional rather than a mandatory stop.
- **`Cumpără acum` on the product page** adds the item and jumps straight to checkout,
  skipping the cart entirely.
- **Slide-in cart drawer** — reviewing and adjusting the cart never costs a page load.
- **Guest checkout on one screen.** No account, no login wall, no wizard. Only the fields
  needed to ship the order; choosing in-store pickup removes the address block completely.
- **Free-shipping progress bar** shows exactly how much more is needed to clear 250 lei.
- **Instant search** (`/` or `⌘/Ctrl+K`) is diacritic-insensitive, so `lamaie` finds `Lămâie`.
- **Prefetch on hover/touch** warms the next page before the click lands.
- **The order total is repeated on the submit button**, so the final amount is never a surprise.

## Performance

Measured locally in Chromium on the home page:

- **6 requests total**, all first-party — 4 JS files, 1 CSS file, 1 document.
- **Zero third-party requests**, zero webfonts, zero image files.
- DOMContentLoaded ~35–70 ms.

All product, category and hero artwork is generated inline SVG (`assets/js/art.js`), so page
weight does not grow with catalog size and there are no image round-trips. The theme is applied
by a tiny inline script in `<head>` so dark mode never flashes white.

## Accessibility

Skip link, one `<h1>` per page, labelled controls, visible focus rings, focus trapping in the
drawer/search/menu, focus preserved across cart re-renders, `prefers-reduced-motion` honoured,
and 40 px minimum tap targets.

## Structure

```
index.html  catalog.html  product.html  cart.html  checkout.html  info.html
assets/
  css/main.css      design tokens + all component styles (light & dark)
  js/data.js        catalog data and pricing helpers   ← integration seam
  js/art.js         inline SVG artwork generator
  js/store.js       cart state (localStorage, cross-tab sync) + theme
  js/app.js         shared UI: header, drawer, search, toasts
  js/home.js  js/catalog.js  js/product.js  js/cart.js  js/checkout.js
```

Header and footer markup is repeated in each page on purpose: it keeps first paint free of
JavaScript. When this is wired into a templating layer, they become a single partial.

## Integrating with the real shop

Three seams, all clearly marked in the source:

1. **`assets/js/data.js`** — the whole catalog. Every page reads products only through
   `AL.products` / `AL.categories`, so swapping this for a fetch from the live product feed
   (or server-rendering it) needs no changes elsewhere.
2. **`submitOrder()` in `assets/js/checkout.js`** — currently a simulated delay. Replace with
   the real order API, and redirect to the payment processor when the method is `card`.
3. **`productArt()` in `assets/js/art.js`** — replace with real photography when the photo
   pipeline is ready; call sites only need a `src`.

Business rules already wired to match the current shop: 250 lei free-shipping threshold,
19,90 lei courier fee, courier vs. in-store pickup, card vs. cash on delivery, 30-day returns,
and invoicing to a company (`CUI`).

### Before going live

- **Product data is representative placeholder content**, modelled on the real Aroma Land range
  but not the live catalog. Names, prices, stock levels, ratings and review counts must be
  replaced with the real feed.
- Fill in the contact details in `info.html#contact` (marked with `TODO`).
- Add the real Terms & Conditions and GDPR privacy policy (`info.html#termeni`,
  `info.html#confidentialitate`) — both are placeholders.
- Point `<link rel="canonical">` and Open Graph URLs at the production domain.
