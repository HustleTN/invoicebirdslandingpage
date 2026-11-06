# InvoiceBirds Homepage

Marketing homepage for InvoiceBirds, built with Next.js (App Router), TypeScript, Tailwind CSS v4 and Lucide React.

## Getting started

```bash
npm install
npm run dev     # http://localhost:3000
npm run lint
npm run build
```

## Project structure

```
src/
├── app/                 # Routes, root layout, global styles
│   ├── globals.css      # Design tokens (@theme) and base styles
│   ├── layout.tsx       # Shell: skip link, header, <main>, footer
│   └── page.tsx         # Homepage
├── components/
│   ├── layout/          # Site-wide chrome (header, footer)
│   ├── sections/        # Homepage sections (add one file per section)
│   └── ui/              # Reusable primitives (Container, …)
├── config/site.ts       # Site name, URL, description
└── lib/cn.ts            # Class-name merge helper
```

## Design tokens

Defined in `src/app/globals.css` and available as Tailwind utilities:

| Token            | Value     | Example utility             |
| ---------------- | --------- | --------------------------- |
| `navy`           | `#0A2540` | `bg-navy`, `text-navy`      |
| `green`          | `#01B047` | `bg-green`, `text-green`    |
| `white`          | `#FFFFFF` | `bg-white`                  |
| `surface`        | `#F2F5F8` | `bg-surface`                |
| `content` width  | `1280px`  | `max-w-content`             |

Breakpoints: `sm` 640px · `md` 768px · `lg` 1024px · `xl` 1280px · `2xl` 1536px.

Wrap section content in `<Container>` to get the 1280px max width and responsive gutters.

## Adding the Satoshi font

The font stack already prefers `var(--font-satoshi)`, falling back to the system sans-serif stack. Once the font files are available:

1. Add the `.woff2` files to `src/app/fonts/`.
2. Load them in `src/app/layout.tsx`:

   ```tsx
   import localFont from "next/font/local";

   const satoshi = localFont({
     src: [
       { path: "./fonts/Satoshi-Regular.woff2", weight: "400", style: "normal" },
       { path: "./fonts/Satoshi-Medium.woff2", weight: "500", style: "normal" },
       { path: "./fonts/Satoshi-Bold.woff2", weight: "700", style: "normal" },
     ],
     variable: "--font-satoshi",
     display: "swap",
   });
   ```

3. Add `satoshi.variable` to the `<html>` element's `className`.
