# Sillage — Fragrance Studio

A responsive, editorial e-commerce landing page for a fictional independent perfume house. Built with React, Vite, Tailwind CSS, `motion/react`, and Lenis.

## Run locally

```bash
npm install
npm run dev
```

Create a production build with `npm run build`.

## Product catalogue

The storefront requests fragrance products from the public [DummyJSON products API](https://dummyjson.com/products/category/fragrances?limit=12). Product names, pricing, and product image URLs are used in the marquee, hero, and draggable shelf. If the API is unavailable, a small local demo catalogue and fallback imagery keep the page usable.

## Interactions

- Explore menu with keyboard Escape support and a full-screen mobile sheet
- Scroll-driven hero and story scene, plus two editorial product marquees
- Draggable fragrance shelf with keyboard-accessible previous/next controls
- Add-to-bag drawer with quantity controls
- Newsletter form confirmation state
- Lenis smooth scrolling and reduced-motion fallbacks
