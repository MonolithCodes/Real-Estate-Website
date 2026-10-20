# CLAUDE.md — Real Estate Business Website

Luxury real-estate advisory website for **Texas, USA** (Austin, Dallas–Fort Worth, Houston). Light theme with dark photographic heroes and gold accents, modelled on https://alcasa.co.uk/. US English, USD.

## Source of truth

**`design.md` (project root) is the design source of truth.** Read it before creating or changing any UI, and follow it exactly: color tokens, typography, spacing, component anatomy, motion, voice and the checklist in its §12.

- Never hard-code hex values, font sizes or easing curves in components. Use the tokens from `design.md` §2, defined in `src/styles/tokens.css`.
- If a needed pattern is missing from `design.md`, extend it in the same style and add it to `design.md` (mark it `[Derived]`) rather than inventing one-off styling.
- If code and `design.md` disagree, `design.md` wins unless the user says otherwise.

## Stack

- React 19 + TypeScript (strict) + Vite 8
- ESLint 10 (`eslint.config.js`)
- Styling: tokens as CSS variables (`src/styles/tokens.css`) plus either plain CSS or Tailwind v4 mapped to those tokens. Do not mix hard-coded values into components.

## Commands

```bash
npm run dev       # start Vite dev server
npm run build     # tsc -b && vite build  (must pass before finishing a task)
npm run lint      # eslint .
npm run preview   # serve production build
```

Run `npm run lint` and `npm run build` after non-trivial changes and report failures honestly.

## Skills — use them

Use these skills proactively; do not wait to be asked. Invoke via the Skill tool.

| Skill | Use it when |
|---|---|
| `tailwind-4-docs` | Choosing Tailwind v4 utilities/variants, configuring `@theme` tokens, v3→v4 migration, or any Tailwind question. Check the docs rather than relying on v3 memory. |
| `typescript-advanced-types` | Typing data models (`Property`, `Destination`, `Testimonial`), generics for reusable components, discriminated unions (e.g. button variants), utility types. |
| `vercel-react-best-practices` | Writing, reviewing or refactoring any React component: re-renders, bundle size, image/font loading, data fetching, memoization. |
| `web-design-guidelines` | After building or changing UI, and before finishing a page: audit accessibility, UX and Web Interface Guidelines compliance. |

Workflow
1. **Before building UI:** read `design.md`; consult `tailwind-4-docs` if using Tailwind.
2. **While writing code:** apply `typescript-advanced-types` for data/props and `vercel-react-best-practices` for components.
3. **After UI work:** run `web-design-guidelines` on the changed files, then the `design.md` §12 checklist.
4. Other general-purpose skills available in the session (e.g. `code-review`, `simplify`, `security-review`, `run`) may be used when relevant — for example `simplify` before a commit and `run` to verify the change in the browser.

## Project structure (target)

```
src/
  styles/     tokens.css, base.css          # design.md §2–§3
  components/
    layout/   Header, Footer, FloatingContact, MobileActionBar
    ui/       Button, Eyebrow, SectionHeader, Tag, ArrowLink, Input
    sections/ Hero, Ticker, StatsStrip, PropertyGrid, DestinationGrid,
              Pillars, LandBanner, PartnerLogos, Testimonials, FinalCta
    cards/    PropertyCard, DestinationCard, TestimonialCard
  data/       properties.ts, destinations.ts, testimonials.ts, partners.ts, nav.ts
  pages/      Home, Destinations, Opportunities, ProjectDetail, Advisory,
              Insights, About, Contact, Legal, NotFound
```

The repo is currently the stock Vite template (`src/App.tsx`, `src/index.css`, `src/App.css`); replace the template content as pages are built.

## Conventions

**Code**
- Function components, named exports, one component per file, `PascalCase.tsx`.
- Props typed with `type`/`interface`; no `any`. Model variants as union types.
- Content lives in `src/data/*.ts` as typed arrays; components stay presentational.
- Prices are **strings** (`"Price on Request"`, `"From AED 1.5m · developer-published"`), never numbers.
- Prefer semantic HTML (`header`, `nav`, `main`, `section`, `footer`); one `<h1>` per page.

**Design (summary of `design.md`)**
- Light theme: page bg `#FBF9F5`, alternate sections `#F3EEE5`, cards `#FFFFFF`, text `#1B1812`. Heroes, final CTA, footer and cards on photos use the `.theme-dark` scope (ink `#12100C`) so components work unchanged. Gold *text* on light uses `--accent`/`--accent-strong`; bright gold is for fills and the dark scope.
- Every page must start with a dark hero (`PageHero`/`Hero`) so the transparent header stays legible.
- Data in `src/data/*` and imagery in `public/images` are samples (see `CREDITS.md`); keep prices as strings and never claim guaranteed returns.
- Gold family only for accents: `#E6CA65` (active/prices/hover), `#C5A880` (eyebrows/links), `#9A7B4F` (gradient end).
- Headlines: Cormorant Garamond, weight 300, sentence case. UI/body: Plus Jakarta Sans, weight 300–400. Micro-labels: uppercase with wide tracking.
- Primary button = gold gradient pill with dark text; secondary = ghost or gold-outline pill. One primary per viewport.
- Cards: `rounded-2xl`, 1px gold-tinted border, lift −8px and image zoom 1.06 on hover.
- Easing `cubic-bezier(0.22, 1, 0.36, 1)`; animate only `transform`, `opacity`, `box-shadow`, color.
- Respect `prefers-reduced-motion`.

**Accessibility & performance**
- Visible gold focus ring; hit areas ≥ 44px; `aria-label` on icon-only controls.
- Overlay all text on photos so contrast is ≥ 4.5:1.
- Hero image `fetchpriority="high"`; other images lazy-loaded with explicit width/height; prefer AVIF/WebP.

**Copy & compliance**
- Calm, confident, evidence-backed; pair lifestyle language with a concrete fact.
- Attribute published prices ("developer-published"). Never guarantee returns.
- Footer must carry the "general guidance only, not financial/legal/investment advice" disclaimer.
- Placeholder brand/regions from the reference site (ACRE, Dubai, etc.) must be replaced with the client's own details.

## Definition of done

- [ ] Matches `design.md` (tokens only, correct components, §12 checklist)
- [ ] `npm run lint` and `npm run build` pass
- [ ] Checked at 375 / 768 / 1024 / 1280 / 1536 px
- [ ] `web-design-guidelines` audit run on changed UI
- [ ] No leftover Vite template code or unused assets in files you touched

## Working agreements

- Ask before adding new dependencies, changing the stack, or deviating from `design.md`.
- Do not commit or push unless asked.
- Keep changes focused; don't refactor unrelated files.
- Report outcomes plainly: if a check fails or a step was skipped, say so.
