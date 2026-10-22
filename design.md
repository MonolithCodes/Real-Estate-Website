# Design System & Product Spec — Luxury Real Estate Advisory Website

**Stack:** React 19 + TypeScript + Vite · **Mood:** editorial, gold-accented, cinematic photography on a **light** canvas.

> **Project decisions (override anything below that conflicts)** [Decision]
> 1. **Market: Texas, USA.** Destinations are Austin & the Hill Country, Dallas–Fort Worth, and Houston & The Woodlands. US English, USD, `+1` phone. Texas-specific compliance: TREC license line, Consumer Protection Notice and Information About Brokerage Services pages, Equal Housing statement (all placeholders pending legal review).
> 2. **Light theme.** The reference is dark; this build is light. The page canvas is warm ivory, text is warm near-black, and gold is used for accents and fills.
> 3. **Dark scope for imagery.** Heroes, the final CTA, the footer and cards that sit on photography use the `.theme-dark` scope (see §4.1). Every inner page starts with a dark hero so the transparent header (light text) is always legible; the header turns ivory with dark text after 40px of scroll.
> 4. **Text-safe gold.** On light surfaces, gold *text* uses `--accent` / `--accent-strong` (AA contrast). The bright gold tints (`--gold-bright`, `--gold`) are for fills, gradients, borders and anything on the dark scope.
> 5. **Sample data.** Project names, builders, testimonials, people and statistics are fictional placeholders (`src/data/*`). Imagery is sourced from Unsplash and Wikimedia Commons, with attributions in `public/images/CREDITS.md`.
>
> **Implemented light tokens** (authoritative values live in `src/styles/tokens.css`):
> `--bg-base #FBF9F5` · `--bg-alt #F3EEE5` · `--bg-surface #FFFFFF` · `--bg-ink #12100C` · `--text-primary #1B1812` · `--text-secondary #3F3A30` · `--text-muted #5A5649` · `--text-subtle #6B675C` · `--accent #8A6B2E` · `--accent-strong #7A5B1E` · `--gold-bright #E6CA65` · `--gold #C5A880` · `--gold-deep #9A7B4F`. The dark palette in §4.1 below is what `.theme-dark` remaps to.

## 0. About this document

### 0.1 Reference registry

| # | Reference | Status | What it contributes |
|---|---|---|---|
| 1 | https://alcasa.co.uk/ (ACRE – UAE property advisory) | **Analyzed** (HTML, CSS and JS bundle) | Entire visual system, page set, components, animation specs |
| 2 | _not yet provided_ | Pending | — |
| 3 | _not yet provided_ | Pending | — |
| 4 | _not yet provided_ | Pending | — |
| 5 | _not yet provided_ | Pending | — |

Only reference #1 has been supplied so far. Everything below is grounded in it. When references 2–5 are supplied, add a row above, then merge new findings into the section marked **Reference Delta** at the end of §3, §7, §9 and §10 (patterns to adopt are noted in the same tagging scheme).

### 0.2 Evidence tags

- **[Observed]** read directly from the reference site's HTML/CSS/JS (class names, hex values, motion parameters, routes).
- **[Derived]** a deliberate extension that follows the observed system but was not visible on the reference.
- **[Decision]** a product/UX choice we are making for our own site.

### 0.3 Rules of use

- This file is the design source of truth. If code and this file disagree, this file wins unless the user says otherwise.
- Components consume **tokens** (§4), never raw hex/px/easing values.
- Replace the reference's brand, regions, developers and copy with our own. Keep the system.

---

## 1. Brand & Design Principles

**Positioning:** premium, advisory-led, globally minded — a trusted guide with developer access, never a pushy seller. Core line on the reference: *"Advisory first. Always."*

| Principle | Expression in UI |
|---|---|
| Dark and cinematic | Near-black canvas, full-bleed photography, film grain on hero and CTA. |
| One accent family | Gold only (three tints). No secondary UI hues. |
| Editorial typography | Large light serif headlines vs. tiny wide-tracked uppercase labels. |
| Numbers before adjectives | Yields, visa terms, tax facts and "from" prices surfaced as big display figures. |
| Calm confidence | Generous whitespace, slow expo-out easing, zero bounce. |
| Contact is always one tap away | Header CTA, floating "Speak to an Adviser", mobile action bar, final CTA. |
| Smooth, not showy | Motion reveals content; it never delays it or blocks reading. |

**Do**
- Sentence-case headlines; one italic gold phrase per hero.
- Muted-grey body so headings and gold carry hierarchy.
- One primary (gold-gradient) button per viewport.
- Attribute published prices; show "Price on Request" when unknown.

**Don't**
- No pure white sections, no pure `#000`.
- No second accent color (reference only uses brand colors on social icons).
- No bold Cormorant headlines; no all-caps headlines.
- No bouncy/spring easing, no parallax that moves text out of reach, no auto-playing sound.
- No guaranteed-return claims.

---

## 2. Website Structure (Information Architecture)

### 2.1 Sitemap  [Observed routes]

```
/                              Home
/destinations                  Destinations index
  /destinations/dubai
  /destinations/abu-dhabi
  /destinations/ras-al-khaimah
  /destinations/:slug          (template)
/opportunities                 Curated opportunities (listing)
  /opportunities/:slug         Project detail
/developments                  Selected developments (developer-led listing)
  /developments/:slug          Development detail
/advisory                      Advisory services & process
/land-development-jv           Land, Development & Joint Venture
/insights                      Guides & articles (index)
  /insights/:slug              Article (e.g. uae-golden-visa-property,
                               branded-residences-dubai-uae, buying-uae-property-from-uk)
/client-stories                Testimonials index
/about                         About / Founders & Team
/private-consultation          Booking / enquiry
/privacy-policy  /terms-of-use  /disclaimer  /cookie-policy  /sitemap
/404
```

### 2.2 Navigation model

| Area | Items |
|---|---|
| Primary nav [Observed] | Home · Destinations · Opportunities · Developments · Advisory · Insights · About · **Private Consultation** (CTA pill) |
| Footer "Explore" | Destinations · Current Opportunities · Selected Developments · Lifestyle & Investment Guidance · ACRE Insights |
| Footer "Destinations" | Dubai · Abu Dhabi · Ras Al Khaimah & Al Marjan Island |
| Footer "Company" | Client Stories · Founders & Team · Contact |
| Footer "Legal" | Privacy Policy · Terms of Use · Disclaimer · Cookie Policy · Sitemap |
| Persistent contact | Floating "Speak to an Adviser" (desktop) · Mobile bar: WhatsApp / Enquire / Call |

Active-route rule: current link is gold-bright (`NavLink` `isActive`); the home link uses `end` matching.

### 2.3 Content model

| Entity | Key fields |
|---|---|
| Project (Opportunity) | slug, title, tag/category, location, district, emirate, descriptor, price (string), developer, status, completion, unit types, payment plan, gallery[], highlights[], amenities[], coordinates |
| Development | slug, developer, name, summary, projects[] |
| Destination | slug, title, kicker, excerpt, hero image, "why" pillars[], districts[], market facts, FAQs[] |
| Article | slug, title, category, excerpt, date, read time, hero, body blocks, related[] |
| Testimonial | quote, name (initials), descriptor, buyer type |
| Partner | name, logo (mono), type (developer / brand) |
| Stat | value, label |
| Enquiry | name, email, phone, destination, budget, timeline, message, consent, source page |

Prices are strings, never numbers.

---

## 3. Core Features & Functionality

### 3.1 Feature list

| # | Feature | Where | Notes |
|---|---|---|---|
| F1 | Smooth scrolling | Global | **[Observed]** Lenis smooth-scroll. Disable for reduced motion and when focus is in a form/menu. |
| F2 | Sticky adaptive header | Global | **[Observed]** transparent → blurred dark bar after 40px scroll. |
| F3 | Mobile full-screen menu | <1280px | **[Observed]** overlay below header, large serif links, gold CTA. Closes on route change. |
| F4 | Hero with intro choreography | Home + inner heroes | Staged reveal (see §9.3). |
| F5 | Looping marquee ticker | Home | Developers, districts, value claims. |
| F6 | Curated opportunity grid | Home, /opportunities | Cards with tag, location, price, link. |
| F7 | Filter & search | /opportunities, header search [Decision] | Filter by destination, category, price band, status; client-side, URL-synced (`?dest=dubai&cat=beachfront`). |
| F8 | Project detail | /opportunities/:slug | Gallery/lightbox, key facts, sticky enquiry card, similar projects. |
| F9 | Destination pages | /destinations/* | Hero, pillars, districts, related projects, FAQ, CTA. |
| F10 | Insights/blog | /insights | Cards, categories, reading column, inline CTA, related. |
| F11 | Testimonials | Home, /client-stories | Anonymised quotes + buyer type. |
| F12 | Private consultation form | /private-consultation, modals | Validation, consent, WhatsApp fallback, success state. |
| F13 | WhatsApp / call deep links | Global | `https://wa.me/<number>?text=<prefilled>`, `tel:`. |
| F14 | Cookie consent | Global | Decline-by-default styling parity (reject equal weight to accept). |
| F15 | SEO | All | Per-page meta, JSON-LD, sitemap.xml, canonical, prerender key pages. |
| F16 | Analytics events | Global | `cta_click`, `whatsapp_click`, `form_submit`, `card_view_details`, `filter_change`. |
| F17 | Currency/units toggle [Decision] | Project detail | AED ⇄ GBP ⇄ USD display (indicative), sq ft ⇄ m². |
| F18 | Saved shortlist [Decision] | Cards, /shortlist | Heart toggle persisted to `localStorage`; "Send my shortlist" in the form. |
| F19 | Brochure gate [Decision] | Project detail | "Request brochure" opens the short form; no dead-end downloads. |

### 3.2 Functional behaviors

- **Routing:** client-side (React Router); scroll to top on route change (Lenis `scrollTo(0, {immediate:true})`); restore hash anchors; focus moves to `<h1>` after navigation.
- **Header:** `scrollY > 40` toggles solid state; listener is passive; recompute on mount.
- **Forms:** inline validation on blur, summary on submit; honeypot + rate limit; success replaces the form with confirmation + "Chat on WhatsApp" fallback.
- **Cards:** the whole card is a link; tag and price are read in DOM order after the title.
- **Filters:** debounce search 200ms; show result count; "Clear all" ghost button; empty state with CTA to consult.
- **Gallery:** keyboard arrows, ESC to close, swipe on touch, focus trap, preload next image.
- **Third-party:** map (dark style), analytics and chat load after interaction/consent to protect performance.

### 3.3 Reference Delta — Features
_Add features gleaned from references 2–5 here._

---

## 4. Design Tokens

### 4.1 Color  [Observed]

```css
:root {
  /* Surfaces */
  --bg-base:      #0B0C10;
  --bg-alt:       #0D0F15;
  --bg-surface:   #13151D;
  --bg-footer:    #08090D;
  --bg-whatsapp:  #0E382B;               /* floating contact only */
  --bg-header-solid: rgba(11,12,16,.85);
  --bg-mobile-menu:  rgba(10,10,10,.97);
  --bg-mobilebar:    rgba(10,10,10,.92);

  /* Text */
  --text-primary:   #F4F3EF;
  --text-secondary: #C9CDD6;  /* over imagery */
  --text-muted:     #9DA3AE;  /* body */
  --text-subtle:    #6B7280;  /* legal */
  --text-on-gold:   #0B0C10;

  /* Gold family */
  --gold-bright: #E6CA65;
  --gold:        #C5A880;
  --gold-deep:   #9A7B4F;

  /* Gradients */
  --grad-gold-fill: linear-gradient(to right, #E6CA65, #C5A880, #9A7B4F);
  --grad-gold-tag:  linear-gradient(to right, #E6CA65, #C5A880);
  --grad-gold-text: linear-gradient(135deg, #E6CA65, #C5A880 50%, #9A7B4F);
  --hairline: linear-gradient(90deg, transparent, rgba(197,168,128,.5), transparent);

  /* Borders */
  --border-section: rgba(197,168,128,.12);
  --border-card:    rgba(197,168,128,.15);
  --border-card-hover: rgba(197,168,128,.45);
  --border-header:  rgba(197,168,128,.15);
  --border-gold-btn:  rgba(197,168,128,.40);
  --border-ghost-btn: rgba(244,243,239,.35);
  --border-mobilebar: rgba(197,168,128,.25);

  /* Interaction */
  --selection: rgba(197,168,128,.35);
  --scroll-thumb: #2A2D38;
  --glow-gold: 0 0 24px rgba(197,168,128,.45);
  --glow-gold-lg: 0 0 28px rgba(197,168,128,.45);
  --shadow-card-hover: 0 24px 60px -20px rgba(0,0,0,.7), 0 0 0 1px rgba(197,168,128,.15);

  /* Semantic (form states) [Derived] */
  --danger: #E5484D;
  --success: #E6CA65;     /* success is expressed in gold, not green */
}
```

**Usage map**

| Token | Use for |
|---|---|
| `--gold-bright` | Active nav, stats, prices, link hover, card-title hover, kicker text, focus ring |
| `--gold` | Eyebrows, "View all/Discover/View Details", footer column headings, ticker text (80%) |
| `--gold-deep` | Gradient end stop, scrollbar hover |
| `--bg-alt` | Alternate sections (destinations, testimonials) |
| `--text-secondary` | Any text placed on photography |
| `--bg-whatsapp` | Only the floating contact pill |

**Contrast (on `--bg-base`)**: primary ≈ 17:1 · muted ≈ 7.5:1 · gold-bright ≈ 11:1 · gold ≈ 8:1 · subtle ≈ 4:1 (non-essential 12px legal only; lighten to `#8A919C` if audits flag it).

### 4.2 Typography  [Observed]

| Role | Family | Weights | Fallback |
|---|---|---|---|
| Display | **Cormorant Garamond** | 300 400 500 600 + italic 300 400 | Playfair Display, serif |
| UI / body | **Plus Jakarta Sans** | 300 400 500 600 700 | Manrope, sans-serif |

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet">
```

| Style | Font | Mobile → Tablet → Desktop | Weight | Tracking | Case | Color |
|---|---|---|---|---|---|---|
| Hero H1 (2 lines) | Display | `4xl → 5xl → 6xl+` (36/48/60+) | 300 | normal | Sentence | primary; line 2 italic gold gradient |
| Hero tagline | Display | `2xl → 3xl` (24/30) | 300 | `0.025em` | Sentence | gold-bright |
| Hero paragraph | Sans | `lg` 18 | 300 | normal | Sentence | secondary |
| Section H2 | Display | `3xl → 4xl → 5xl` (30/36/48), leading-tight | 300 | normal | Sentence | primary |
| Final CTA H2 | Display | `4xl → 5xl` | 300 | normal | Sentence | primary |
| Stat number | Display | `4xl → 5xl → 6xl` (36/48/60) | 300 | normal | – | gold-bright |
| Pillar H3 | Display | `2xl` 24 | 400 | normal | Sentence | primary |
| Destination H3 | Display | `3xl` 30 | 400 | normal | Sentence | primary |
| Card H3 | Display | `xl` 20, leading-snug | 400 | normal | Sentence | primary → gold-bright hover |
| Mobile menu link | Display | `3xl` 30 | 400 | normal | Sentence | primary / gold-bright active |
| Eyebrow `.eyebrow` | Sans | 12/16 | 600 | `0.25em` | UPPER | gold |
| Nav link | Sans | 12 | 400 | `0.18em` | UPPER | muted → primary |
| Button | Sans | 14 (header: 12) | 600 | `0.14em` | UPPER | per variant |
| Tag chip | Sans | 10 | 600 | `0.2em` | UPPER | on-gold |
| Card location | Sans | 11 | 400 | `0.18em` | UPPER | muted |
| Card link | Sans | 11 | 400 | `0.15em` | UPPER | gold |
| Kicker (destination) | Sans | 11 | 400 | `0.2em` | UPPER | gold-bright |
| "View all" link | Sans | 12 | 400 | `0.2em` | UPPER | gold → bright |
| Body | Sans | 14–16, relaxed | 300 | normal | Sentence | muted |
| Footer title | Sans | 12 | 600 | `0.25em` | UPPER | gold |
| Legal | Sans | 12 | 300 | normal | Sentence | subtle |
| Ticker | Display italic | 18 | 400 | normal | Sentence | gold @ 80% |
| Article body [Derived] | Sans | 17–18 / 1.75 | 300 | normal | Sentence | secondary |
| Article pull-quote [Derived] | Display italic | `2xl–3xl` | 300 | normal | Sentence | gold-bright |

Rules: headlines are light; max headline measure 672px (`max-w-2xl`); paragraphs 512–672px; article column 720px; use `text-wrap: balance` on headings, `pretty` on paragraphs; numerals lining.

### 4.3 Spacing & Layout  [Observed]

| Token | Value |
|---|---|
| Container | `max-w-7xl` 1280px · `px-6` (24) → `lg:px-10` (40) |
| Header | 80px (`h-20`); mobile menu starts at `top-20` |
| Section | `py-24` (96) standard · `py-20` (80) partners · `py-16` (64) stats |
| Eyebrow → H2 | 16px (`mb-4`), hero 24, final CTA 20 |
| H2 → content | 24 (with paragraph) · 48 (cards) · 56 (pillars) |
| Grid gap | 24–32 [Derived] |
| Card padding | 20–24 [Derived] |
| Button padding | `px-8 py-4` · header `px-6 py-3` |
| Nav gap | 32 |
| Card height (destination) | 480px |
| Land banner image | `h-80` 320px |

Base unit 4px; use multiples of 4/8.

### 4.4 Radius, borders, shadow, blur

| Element | Radius |
|---|---|
| Cards | 16 (`rounded-2xl`) |
| Buttons, chips, social, floating CTA | full |
| Inputs [Derived] | 12 (`rounded-xl`) |
| Scrollbar thumb | 6 |

Blur: header solid `backdrop-blur-xl`; mobile menu `backdrop-blur-2xl`; mobile bar `backdrop-blur-xl`; ghost button `backdrop-blur-sm`.

### 4.5 Z-index

`menu overlay 40` · `header 50` · `floating contact / mobile bar 50` · `modal/lightbox 60` · `toast 70` · grain overlay is `::after` with `pointer-events:none`.

### 4.6 Breakpoints  [Observed Tailwind defaults]

`sm 640` · `md 768` · `lg 1024` · `xl 1280` (desktop nav appears) · `2xl 1536`.

### 4.7 Motion tokens

```css
:root {
  --ease-lux: cubic-bezier(.22, 1, .36, 1);   /* all physical movement */
  --ease-ui:  cubic-bezier(.4, 0, .2, 1);     /* color/opacity */
  --dur-fast: 300ms;   /* color, opacity, glow */
  --dur-base: 500ms;   /* card lift, header, border */
  --dur-slow: 900ms;   /* image zoom, text reveal */
  --dur-hero: 2600ms;  /* hero image settle */
  --reveal-distance: 24px;
  --reveal-stagger: 100ms;
}
```

---

## 5. Global Styles & Utilities  [Observed]

```css
html { -webkit-text-size-adjust:100%; -webkit-tap-highlight-color:transparent; line-height:1.5; }
body { margin:0; background:var(--bg-base); color:var(--text-muted);
       font-family:'Plus Jakarta Sans',Manrope,sans-serif; overflow-x:hidden; }
a { color:inherit; text-decoration:inherit; }
img,video { max-width:100%; height:auto; display:block; }
h1,h2,h3,h4 { font-size:inherit; font-weight:inherit; }

::selection { background:var(--selection); color:var(--text-primary); }
::-webkit-scrollbar { width:10px; }
::-webkit-scrollbar-track { background:var(--bg-base); }
::-webkit-scrollbar-thumb { background:var(--scroll-thumb); border-radius:6px; }
::-webkit-scrollbar-thumb:hover { background:var(--gold-deep); }
input::placeholder, textarea::placeholder { color:#9CA3AF; opacity:1; }

.font-display { font-family:'Cormorant Garamond','Playfair Display',serif; }
.eyebrow { color:var(--gold); font-size:.75rem; line-height:1rem; font-weight:600; letter-spacing:.25em; text-transform:uppercase; }
.text-gold-gradient { background:var(--grad-gold-text); -webkit-background-clip:text; background-clip:text; -webkit-text-fill-color:transparent; }
.gold-hairline { height:1px; background:var(--hairline); }

.grain { position:relative; }
.grain::after { content:""; position:absolute; inset:0; pointer-events:none; opacity:.05;
  background-image:url("data:image/svg+xml;charset=utf-8,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='a'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23a)'/%3E%3C/svg%3E"); }

.mask-line { display:block; overflow:hidden; }          /* wrapper for slide-up text reveal */

.card-hover { transition:transform .5s var(--ease-lux), border-color .5s ease, box-shadow .5s ease; }
.card-hover:hover { border-color:var(--border-card-hover); box-shadow:var(--shadow-card-hover); transform:translateY(-8px); }
.card-img { transition:transform .9s var(--ease-lux); }
.card-hover:hover .card-img { transform:scale(1.06); }

.marquee-track { animation:marquee-slow 60s linear infinite; }
@keyframes marquee-slow { from{transform:translateX(0)} to{transform:translateX(-50%)} }

.skip-link { position:absolute; left:-9999px; }
.skip-link:focus { left:16px; top:16px; z-index:100; }
:focus-visible { outline:2px solid var(--gold-bright); outline-offset:3px; }
```

---

## 6. Components

### 6.1 Buttons  [Observed]

All: `inline-flex items-center justify-center gap-2`, `rounded-full`, UPPERCASE, semibold, tracking `0.14em`.

| Variant | Spec | Hover | Active / Focus |
|---|---|---|---|
| **Primary** | `px-8 py-4 text-sm`, text `#0B0C10`, bg `--grad-gold-fill` | `box-shadow: --glow-gold-lg`, 300ms | active `scale(.98)`; focus ring gold-bright offset 3 |
| **Header CTA** | `px-6 py-3 text-xs`, same gradient | glow `--glow-gold`, 300ms | same |
| **Ghost** (on imagery) | `px-8 py-4`, 1px `--border-ghost-btn`, text primary, `backdrop-blur-sm` | border + text → gold-bright, 300ms | same |
| **Gold outline** (on solid) | 1px `--border-gold-btn`, text gold-bright | bg `rgba(197,168,128,.08)`, 300ms | same |
| **Text link** | 14px gold-bright, underline offset 4, decoration `rgba(230,202,101,.4)` | decoration → solid gold-bright | — |
| **Arrow link** | 11–12px UPPER wide tracking, gold, arrow icon | color → bright; `gap 8 → 14px`; arrow nudges right | — |

Disabled [Derived]: 50% opacity, no glow, `cursor:default`. Loading [Derived]: replace label with a 16px gold spinner; keep width.

### 6.2 Header  [Observed]

- `fixed top-0 inset-x-0 z-50 transition-all duration-500`.
- **Top state:** `bg-transparent`.
- **Scrolled (`scrollY > 40`):** `bg rgba(11,12,16,.85)` + `backdrop-blur-xl` + `border-b rgba(197,168,128,.15)`.
- Inner: container `flex items-center justify-between h-20`. Logo `h-14`, hover opacity .85.
- Desktop nav (≥1280): 7 links `gap-8` + CTA pill. `aria-label="Primary"`.
- Below 1280: hamburger (Lucide `menu` 26px) → `x` when open; `aria-label` toggles "Open menu / Close menu".
- **Mobile menu:** `fixed inset-0 top-20 z-40`, bg `rgba(10,10,10,.97)`, `backdrop-blur-2xl`, top border gold 15%. Links: display `3xl`, `py-3`, `border-b --border-section`, active gold-bright; container `px-8 pt-10 gap-2`. CTA: full-width pill `mt-8`. Auto-closes on route change; lock body scroll while open [Derived].
- Header search [Decision]: icon button left of CTA; expands to a 360px input with live results dropdown.

### 6.3 Hero  [Observed]

- `section.relative.min-h-screen.flex.items-end.overflow-hidden.grain`.
- Background image `w-full h-full object-cover`, settles from `scale(1.15)` → `1` over 2.6s ease-lux. Dark gradient overlays (bottom-up and left-right) keep text ≥4.5:1 [Derived].
- Content bottom-left of container, large bottom padding.
- Order: eyebrow → H1 (2 lines in `mask-line`) → tagline → paragraph → CTA row (Primary + Ghost) → helper line "Buying from the UK? [text link]".
- Inner-page hero (`~60vh`): same structure; image `opacity .25–.5` on `--bg-base` with `scale(1.12) → 1` over 2.2s [Observed].
- Scroll cue [Derived]: 1px × 48px gold line with a travelling dot, bottom-center; hides after first scroll.

### 6.4 Ticker  [Observed]
Two identical item sets in one track, `translateX(0 → -50%)`, 60s linear infinite. Items: display italic 18px, gold @ 80%, `px-8`. Mix: developers, districts, value claims. Duplicate set `aria-hidden`. Edge fade mask: `mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)` [Derived].

### 6.5 Stats strip  [Observed]
`section.py-16.border-b --border-section`. Grid 2 cols → 4 at `lg`. Number display light gold-bright; label 14px muted light `max-w-[200px] mt-3`. Counter animation [Derived]: numeric values count up over 1.6s once in view (non-numeric stay static).

### 6.6 Section header  [Observed]
`eyebrow` → `H2 max-w-2xl` on the left; optional arrow link ("View all", "All client stories") aligned to bottom-right; stacks below on mobile.

### 6.7 Property card  [Observed]

```
<a.card-hover.group  bg #13151D  border 1px card  rounded-2xl overflow-hidden>
  [image 4:3 .card-img] [chip TOP-LEFT 16/16: tag]
  body: location (11px UPPER) · title (display xl) · descriptor (14px) 
        footer: price (12px medium gold-bright) ··· "VIEW DETAILS →" (11px UPPER gold)
```
Chip: `text-[10px] tracking-[.2em] font-semibold px-3 py-1.5 rounded-full`, `--grad-gold-tag`, dark text. Grid `1 → 2 (md) → 3 (lg)` columns. Title colour → gold-bright on hover. Shortlist heart [Decision] top-right, appears on hover/focus.
Tag vocabulary: Branded Residence · Island Living · Commercial · Beachfront · Villa Community · New Launch · Palm Address · Ultra-Luxury · Boutique · Community · Seafront.

### 6.8 Destination card  [Observed]
`h-[480px] rounded-2xl relative`, full-bleed image + bottom-up gradient; pinned content: kicker (gold-bright 11px) → H3 (display 3xl) → 2-line clamped paragraph (secondary) → "Discover →" arrow link. 3-up at `md`.

### 6.9 Pillar  [Observed]
3 columns; H3 display 2xl `mb-4`; paragraph 14px light relaxed. Optional hairline above and numeral "01/02/03" in display gold [Derived].

### 6.10 Land / JV banner  [Observed]
Split: eyebrow + H2 (`mb-6`) + paragraph (`max-w-lg mb-8`) + gold-outline button | image `h-80 w-full object-cover`. Section `relative overflow-hidden py-24`; subtle gold radial glow behind text [Derived].

### 6.11 Partner logos  [Observed]
`py-20 border-y`; centred eyebrow `mb-10`; flex-wrap centred; heights `h-7 sm:h-8` (wide marks `h-12`); `opacity .6 → 1` on hover, 300ms; monochrome only.

### 6.12 Testimonial  [Observed + Derived]
On `--bg-alt`. Three cards: `--bg-surface`, `rounded-2xl`, 1px card border, `p-8`. Quote display italic xl–2xl with large gold opening mark; attribution name gold-bright 14px; descriptor muted 12px; buyer-type chip.

### 6.13 Final CTA  [Observed]
`section.relative.py-24.overflow-hidden.grain`, centred. Eyebrow → H2 (4xl/5xl) → paragraph (`max-w-xl mx-auto mb-10`) → Primary + Gold-outline (WhatsApp with number).

### 6.14 Footer  [Observed]
`--bg-footer`, `border-t --border-card`. Brand column: logo `h-12`, description `max-w-sm` 14px light, contact lines (phone, email, "London & UAE · Private consultations by appointment") each with icon, hover gold-bright. Social: three `w-10 h-10` circles. Four link columns (titles 12px UPPER `.25em` gold semibold `mb-5`; links 14px muted → gold-bright 300ms). Bottom: disclaimer (12px subtle, `max-w-4xl`), copyright `mt-4`. Social hover: `translateY(-3px) scale(1.06)` + coloured glow, active `translateY(-1px) scale(1.02)`, 350ms; gloss overlay `linear-gradient(180deg,#ffffff61,#ffffff14 45%,transparent 60%)`.

### 6.15 Floating contact (≥640)  [Observed]
`fixed bottom-6 right-6 z-50`, pill, bg `--bg-whatsapp`, border `rgba(197,168,128,.35)`, text primary, `pl-4 pr-5 py-3.5`, label "Speak to an Adviser" 12px semibold; shadow `0 12px 40px -8px rgba(14,56,43,.8)` intensifies on hover.

### 6.16 Mobile action bar (<640)  [Observed]
`fixed bottom-0 inset-x-0 z-50`, bg `--bg-mobilebar`, `backdrop-blur-xl`, top border `--border-mobilebar`. Three equal cells (icon over 10px UPPER `.15em` label): WhatsApp (gold-bright), Enquire (primary), Call (primary), `py-3`. Add `padding-bottom: env(safe-area-inset-bottom)`; reserve equal bottom space on `body`.

### 6.17 Forms  [Derived]
- Input: bg `--bg-surface`, 1px `--border-card`, `rounded-xl`, `px-4 py-3.5`, 16px text (prevents iOS zoom), placeholder `#6B7280–#9CA3AF`.
- Label: eyebrow style above field.
- Hover: border `rgba(197,168,128,.3)`. Focus: border gold-bright + `0 0 0 3px rgba(230,202,101,.15)`.
- Error: border `--danger`, 12px helper text; success: gold check + copy.
- Select: custom chevron in gold; options list on `--bg-surface`.
- Phone: country-code prefix select; default from locale.
- Consent checkbox: 20px square, gold fill when checked, links to Privacy Policy.
- Multi-step (consultation, 3 steps: Intent → Details → Contact) with gold progress hairline.

### 6.18 Modal / Lightbox / Drawer  [Derived]
Overlay `rgba(8,9,13,.85)` + blur; panel `--bg-surface`, radius 16, `p-8`; enter: fade + `translateY(16px) → 0` 400ms ease-lux; exit 250ms; focus trap; ESC closes; scroll-lock.

### 6.19 Toast / Cookie banner  [Derived]
Bottom-left card `--bg-surface`, gold hairline top, 14px text; "Reject non-essential" and "Accept" buttons equal visual weight; slides up 400ms.

### 6.20 Breadcrumbs, filter chips, pagination, tables, accordion  [Derived]
- Breadcrumb: 11px UPPER `.18em` muted; `/` separators gold-deep; current gold.
- Filter chip: pill, 1px card border, muted; active = gold-tag fill + dark text; hover border gold 45%.
- "Load more": gold-outline button; results count in muted 12px.
- Table: `--bg-surface`, row dividers `--border-section`, label muted, value primary, key figures gold-bright.
- Accordion (FAQ): question display xl; plus icon rotates 45° (300ms); panel height animates 400ms ease-lux; hairline between items.
- Tabs: uppercase labels with 2px gold underline sliding between tabs (350ms ease-lux).
- Skeletons: `--bg-surface` blocks with a gold-tinted shimmer (1.6s).

### 6.21 Iconography
Lucide, stroke 1.5, 20–26px (menu 26). Colors: gold or gold-bright; muted for neutral. Icons used: menu, x, arrow-right, arrow-up-right, map-pin, phone, mail, message-circle, instagram, facebook, linkedin, heart, chevron-down, play.

### 6.23 Home hero story (scroll-built 3D house)  [Derived]

The home page opens with a pinned, scroll-driven story in which a 3D house assembles itself (code: `src/components/home/HeroStory`, `src/three`). It replaces the photographic home hero.

- **Exception to "dark hero first"** [Decision]: the story opens on the ivory canvas (`--bg-base`) with a faint gold survey grid. The route sets `handle.lightHero`, so the header starts in its solid ivory state (§6.2) and stays legible. Inner pages keep dark heroes.
- **Structure:** a section `(pinned length + 100) svh` tall holding a `position: sticky` 100svh stage. Pinned length is 600vh on desktop and 450vh on mobile. The stage holds the canvas (`aria-hidden`, plus a visually hidden description), the copy overlay, the progress rail and the hand-off seam. GSAP ScrollTrigger (`scrub: 1`) writes progress into a mutable store. Progress is never kept in React state.
- **Stages:** hero, 01 Location, 02 Structure, 03 Craft, 04 Light, 05 Life (stats from the featured listing), 06 Living, then the reveal ("Your home is already out there."). There is exactly one `<h1>`, in the hero copy. Every stage title is an `<h2>`.
- **Copy cards:** `--bg-glass` panel, 1px `--border-card`, `--radius-card`, `--shadow-card`, max 27rem. Cards alternate start/end sides and the camera frames the house on the opposite side. Each card enters by rising 48px and leaves by moving up, tied to its stage's scroll window. On mobile, cards sit in the lower ~45% above the action bar and the house sits in the upper ~55%. The reveal card is centred and uses `.theme-dark` on `--bg-glass-dark`.
- **Progress rail:** right edge, six uppercase micro-labels (`--fs-label`, `--tr-label`) with 9px gold dots on a 1px track. The current stage gets `aria-current="step"`, `--accent-strong` text and a `--gold-bright` dot with `--glow-gold`. Each item is a 44px hit area. On mobile the rail shows dots only.
- **Spec chips** (desktop, medium/high tier): pill, `--bg-glass`, 1px `--border-card-hover`, an 8px gold-bright dot, a 12px label (600) and a muted detail. They are pinned to the model and hidden when geometry occludes them.
- **Atmosphere:** the background runs `--bg-base` → `--scene-sky-morning` → `--bg-base` → `--bg-alt` → `--scene-sky-golden` → `--bg-ink` (dusk). The WebGL clear colour uses the same values. On exit an ivory seam rises from the bottom and the canvas fades, so the next section (Curated Opportunities) follows without an edge.
- **3D palette:** `--scene-*` tokens in `tokens.css`. They are read at runtime and never used for UI. The gold blueprint edges use `--gold`.
- **Motion:** parts are a pure function of progress, with damped smoothing. The hero copy uses the §9.3 staged rise. Under reduced motion there is no pinning: a static layout shows the finished house on a slow turntable and stacks the same copy. Without WebGL, the poster (`public/house-poster.webp`) replaces the canvas.

### 6.22 Reference Delta — Components
_Add component patterns from references 2–5 here._

---

## 7. Page Layouts

Section background rhythm (home): `base (hero) → base (ticker, stats) → base (opportunities) → alt (destinations) → base (pillars) → base (land) → base+border-y (partners) → alt (testimonials) → base+grain (CTA) → footer`.

### 7.1 Home  [Observed]
1. Hero 100vh — eyebrow, 2-line H1, tagline, paragraph, Primary + Ghost, UK-guide link.
2. Ticker.
3. Stats strip (4).
4. Curated Opportunities — eyebrow, H2, "View all", 12 cards.
5. Lifestyle Destinations (alt) — eyebrow, H2 "Three emirates. Three rhythms of life.", 3 tall cards.
6. Why choose us — "Advisory first. Always." + 3 pillars.
7. Land, Development & JV banner.
8. Developer partnerships logos.
9. Client stories (alt) — H2 "Trusted across continents", 3 quotes, "All client stories".
10. Final CTA — "Begin with a private conversation."
11. Footer + floating contact / mobile bar.

### 7.2 Destinations index  [Observed route / Derived layout]
Page hero (60vh) → intro paragraph → 3 large destination cards (alternating image left/right on desktop, 2-col) → comparison table (yields, lifestyle, ownership rules) → CTA.

### 7.3 Destination detail (Dubai / Abu Dhabi / RAK & Al Marjan)  [Derived]
Hero with kicker → "Why [destination]" 3 pillars → district grid (card with image, name, one-liner, avg yield stat) → featured projects (3–6 cards) → market facts band (stats) → FAQ accordion → related insights → final CTA.

### 7.4 Opportunities (listing)  [Derived]
Page hero (short, 40vh) → sticky filter bar (destination, category, price band, status, search; mobile: bottom-sheet) → result count + sort → card grid with infinite "Load more" → empty state → CTA.

### 7.5 Project detail  [Derived]
Gallery hero (large image + 4 thumbs; lightbox) → title block (tag, H1, location, price, share/save) → two-column: left = overview, key facts table, highlights, amenities icon grid, payment plan, floor plans tabs, location map; right = **sticky enquiry card** (240px below header; price from, form, WhatsApp, call) → "Similar opportunities" → final CTA. Mobile: enquiry card becomes bottom sheet triggered by the action bar.

### 7.6 Developments & Development detail  [Derived]
Index: developer cards (logo, summary, # projects). Detail: developer hero, track-record stats, project grid.

### 7.7 Advisory  [Derived]
Hero → "How we work" numbered steps 01–04 with hairlines and line-draw on scroll → services pillars → who we serve (UK buyers, Golden Visa, investors) → FAQ → CTA.

### 7.8 Land, Development & JV  [Observed route]
Hero → opportunity types (plot acquisition, structuring, JV) 3 pillars → process timeline → case snapshot stats → enquiry form for investors/family offices.

### 7.9 Insights
Index [Derived]: featured article (large 2-col card), category filter chips, 3-col article cards (16:9 image, category eyebrow, display title, excerpt, date · read time). Article: hero image, 720px column, TOC (sticky, ≥1024), body with pull-quotes, inline CTA block, author box, related articles, final CTA. Reading progress hairline at the top of the header (gold, scaleX bound to scroll).

### 7.10 Client stories  [Observed route]
Header → masonry/2-col quote cards with buyer-type chips → stats → CTA.

### 7.11 About / Founders & Team  [Derived]
Story hero → values (3 pillars) → founders (portrait 4:5, name display xl, role eyebrow, short bio, LinkedIn) → offices (London & UAE) → regulatory/credentials strip → CTA.

### 7.12 Private consultation  [Observed route]
Two columns: left = eyebrow, H1, reassurance bullets (what happens next, response time, confidentiality), direct contacts; right = multi-step form card. WhatsApp alternative below.

### 7.13 Legal pages & Sitemap
720px column, display H1, muted body, in-page TOC. Sitemap page = grouped link lists.

### 7.14 404  [Observed route]
Centered display "Page not found", suggestion links, gold-outline "Back to home".

### 7.15 Reference Delta — Layouts
_Add page layouts from references 2–5 here._

---

## 8. Responsiveness

| Range | Layout | Notes |
|---|---|---|
| <640 | 1 col; hamburger; **mobile action bar**; hero `min-h-screen` (use `svh`) | Container `px-6`; H2 30px; stats 2×2; cards stack; destination cards 420px tall; ticker slower padding; hide floating pill |
| 640–767 | 1–2 col | Floating contact appears; action bar hides |
| 768–1023 | 2 col grids | Pillars may stay 1 col until `lg`; filters inline |
| 1024–1279 | 3 col grids; container `px-10` | Hamburger still used |
| ≥1280 | Full nav + CTA; 3-col cards; sticky detail sidebars | |
| ≥1536 | Container stays 1280; hero imagery expands | Max content width never exceeds 1280 |

Rules
- Mobile-first CSS; verify at 375, 414, 768, 1024, 1280, 1536.
- Use `svh/dvh` for full-screen heroes to avoid mobile address-bar jumps.
- Touch targets ≥ 44px; spacing between tappable items ≥ 8px.
- No horizontal scroll (`body overflow-x:hidden` is a safety net, not a fix).
- Hover effects wrapped in `@media (hover:hover) and (pointer:fine)`; touch gets `:active` feedback instead (scale .98 / border gold).
- Images: `srcset` + `sizes`; art-direct hero crops for portrait (focal point on skyline/building).
- Tables convert to stacked definition lists on mobile.
- Sticky elements (filters, sidebar) turn into bottom sheets on mobile.
- Font sizes in `rem`; respect user zoom up to 200%.

---

## 9. Animation System

### 9.1 Principles
1. **Slow and soft:** expo-out easing `cubic-bezier(.22,1,.36,1)` for every transform.
2. **Reveal once:** scroll reveals fire a single time, with `margin:-60px` trigger offset.
3. **Cheap properties only:** `transform`, `opacity`, `box-shadow`, `color`, `border-color`.
4. **Never block content:** no animation exceeds ~1s on text, except hero image settle (2.6s) which is purely visual.
5. **Respect motion preferences** (§9.9).

### 9.2 Smooth scroll  [Observed: Lenis]
- Library: Lenis (inertial smooth scroll). Typical config: `lerp 0.1`, `smoothWheel true`, `syncTouch false`.
- Drive with `requestAnimationFrame`; destroy on unmount.
- Anchor links use `lenis.scrollTo(target, {offset:-96})` (header height + gap).
- Disable when `prefers-reduced-motion`, or inside modals (`lenis.stop()`), mobile menu open, and nested scrollers (`data-lenis-prevent`).

### 9.3 Page-load choreography (hero)  [Observed values]

| Step | Element | From → To | Duration | Delay |
|---|---|---|---|---|
| 1 | Hero image | `scale 1.15 → 1` | 2.6s | 0 |
| 2 | Eyebrow | `opacity 0, y16 → 1, 0` | 0.7s | 0.15s |
| 3 | H1 line 1 (in `.mask-line`) | `y 110% → 0%` | 0.9s | 0.25s |
| 4 | H1 line 2 (italic gold) | `y 110% → 0%` | 0.9s | 0.45s [Derived stagger] |
| 5 | Tagline | `opacity 0, y18 → 1, 0` | 0.9s | 0.85s |
| 6 | Paragraph | `opacity 0, y22 → 1, 0` | 0.9s | 1.0s |
| 7 | CTA row | `opacity 0, y22 → 1, 0` | 0.9s | 1.1s |
| 8 | UK-guide helper | `opacity 0 → 1` | 0.9s | 1.35s |
| 9 | Inner-page hero image | `scale 1.12 → 1` (opacity .25) | 2.2s | 0 |
| 10 | Inner-page hero text | `opacity 0, y20 → 1, 0` | 0.8s | 0.5–0.65s |

Total hero intro ≈ 2.2s; the page is readable from ~1.2s.

### 9.4 Scroll-triggered reveal  [Observed]
Reusable `<Reveal>` wrapper:

```ts
// Framer Motion equivalent of the reference's Reveal component
initial   = { opacity: 0, y: 24 }           // `y` prop configurable
whileInView = { opacity: 1, y: 0 }
viewport  = { once: true, margin: '-60px' }
transition = { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }
```

Applied to: section eyebrows, H2s, paragraphs, stat items, cards, pillars, testimonials, CTA blocks.

| Context | Delay pattern |
|---|---|
| Section header | eyebrow 0 → H2 +0.1 → paragraph +0.2 |
| Card grid | `delay = (index % columns) × 0.1` so each row staggers left→right, not the whole grid |
| Stats | 0, .1, .2, .3 |
| Pillars | 0, .12, .24 |
| Footer columns | none (static) |

Implementation without Framer Motion [Decision-compatible]: `IntersectionObserver` with `rootMargin:'0px 0px -60px 0px'`, add `.is-visible` once, CSS `opacity/transform` transition `800ms var(--ease-lux)`. Pre-hide only with JS enabled (`.js .reveal{opacity:0;transform:translateY(24px)}`) so no-JS and crawlers see content.

### 9.5 Scroll-linked effects
| Effect | Behavior | Source |
|---|---|---|
| Header state | `scrollY > 40` → blurred bar, 500ms transition | **Observed** |
| Reading progress (articles) | 1px gold line, `scaleX = scrollYProgress` | **Derived** (reference imports `useScroll`) |
| Hero parallax | Image translateY `0 → 12%` over first viewport, text unchanged; transform-only | Derived |
| Stat counters | Count up 0 → value, 1.6s ease-out, once | Derived |
| Process timeline | Gold line height/scaleY grows with scroll; step dots fill when passed | Derived |
| Image mask reveal | Section images unveil with `clip-path: inset(0 0 100% 0) → inset(0)` 1.1s | Derived |
| Parallax in banners | Land/JV image ±40px at 0.3 speed (desktop only, hover-capable) | Derived |
| Scroll cue | Fades out after 80px scroll | Derived |
| Back-to-top | Appears after 1.5 viewports; gold-outline circle, 300ms | Derived |

### 9.6 Hover & focus animations  [Observed unless tagged]

| Element | Hover / focus effect | Duration · easing |
|---|---|---|
| Nav link | color muted → primary (active = gold-bright) | 300ms ui |
| Header CTA | glow `0 0 24px rgba(197,168,128,.45)` | 300ms |
| Logo | opacity → .85 | 300ms |
| **Primary button** | glow `0 0 28px …`; slight shine sweep [Derived]: `::after` gradient moves left→right | 300ms · 700ms sweep |
| **Ghost button** | border + text → gold-bright | 300ms |
| **Gold-outline button** | bg `rgba(197,168,128,.08)` | 300ms |
| Text link | underline colour → solid | 300ms |
| Arrow link | `gap 8 → 14px` (arrow slides) + colour → bright | 300ms |
| **Property card** | lift −8px, border → 45% gold, shadow `0 24px 60px -20px #000b3`, ring | 500ms lux |
| Card image | `scale 1 → 1.06` | 900ms lux |
| Card title | colour → gold-bright | 300ms |
| "View Details" | arrow shifts +4px [Derived] | 300ms |
| **Destination card** | same lift/zoom; kicker stays; "Discover" gap grows 8→14px | 500/900ms |
| Pillar [Derived] | hairline above extends 40% → 100% width | 600ms |
| Partner logo | opacity .6 → 1 | 300ms |
| Footer link | colour → gold-bright | 300ms |
| Footer contact link | colour → gold-bright | 300ms |
| **Social button** | `translateY(-3px) scale(1.06)` + brand glow; active `translateY(-1px) scale(1.02)` | 350ms lux |
| Floating contact | shadow grows; icon nudges −2px [Derived] | 300ms |
| Input | border → gold 30%; focus → gold-bright + 3px halo [Derived] | 200ms |
| Chip / filter | border → gold 45%; active fills gold | 250ms |
| Accordion icon | rotate 0 → 45° | 300ms |
| Ticker | pauses on hover [Derived] | `animation-play-state` |
| Cursor follower [Derived, optional desktop] | 12px gold ring following pointer with lerp .15; expands to 48px "View" over cards | 300ms |

Touch devices: skip lift/zoom; use `:active` (scale .98, border gold 45%).

### 9.7 Interaction & state transitions
| Interaction | Animation |
|---|---|
| Mobile menu open | Overlay fade 300ms; links stagger fade-up (`y12`, 60ms stagger) [Derived]; hamburger ↔ close icon crossfade 200ms |
| Route change | Fade-out 200ms → fade-in/rise 500ms; scroll to top immediately [Derived] |
| Filter change | Grid fades to .4 then new cards stagger-in (60ms); layout shift minimised with fixed card height |
| Gallery open | Overlay 300ms; image scales from thumbnail origin 500ms lux [Derived] |
| Form step change | Slide 24px + fade, 400ms; progress hairline widens |
| Form success | Check icon draws (stroke-dashoffset 600ms) then copy fades in |
| Toast / cookie | Slide-up 400ms; auto-dismiss toasts 5s |
| Skeleton → content | Crossfade 300ms |
| Shortlist heart | Scale pop 1 → 1.25 → 1 (250ms) + fill gold |

### 9.8 Performance rules for motion
- Animate only `transform`/`opacity` (+ `box-shadow`, colour on hover). Never animate `height/top/left/width` except accordion (use grid-rows `0fr → 1fr`).
- `will-change: transform` only on actively animating elements, removed afterwards.
- Cap simultaneous animated elements per viewport to ~12; use `once:true`.
- Hero image: avoid transform on an element that is also `object-fit` heavy; wrap in a div and scale the wrapper.
- Pause marquee and Lenis when the tab is hidden.
- Grain is a static SVG — no animation.

### 9.9 Reduced motion
```css
@media (prefers-reduced-motion: reduce) {
  *,*::before,*::after { animation-duration:.01ms !important; animation-iteration-count:1 !important; transition-duration:.01ms !important; scroll-behavior:auto !important; }
  .marquee-track { animation:none; }
  .card-hover:hover { transform:none; }
  .card-hover:hover .card-img { transform:none; }
}
```
Also: do not initialise Lenis; reveals render in final state; counters show final value; parallax off. Colour/border changes may remain (instant).

### 9.10 Reference Delta — Animations
_Add hover/scroll patterns from references 2–5 here (e.g., horizontal-scroll galleries, text-splitting, custom cursors, page transitions)._

---

## 10. UI / UX Guidelines

### 10.1 Conversion UX
- Primary goal per page: **book a private consultation**; secondary: WhatsApp.
- Every long page ends with the final CTA; project pages also carry a sticky enquiry affordance.
- CTA hierarchy: Primary (gold gradient) → Ghost/Outline → Text link. Max one primary in view.
- Reduce form friction: ≤ 5 required fields on first step; progressive disclosure for budget/timeline.
- Provide response expectation ("We reply within one working day") and confidentiality note near forms.
- Offer WhatsApp wherever a form appears.

### 10.2 Content & trust
- Lead with outcome, back with a fact; avoid superlatives without proof.
- Show developer logos, anonymised client stories, regulated-status/credentials, office locations.
- Attribute prices ("From AED 1.5m · developer-published"); otherwise "Price on Request".
- Disclaimer in footer and near any yield/return figure ("indicative, not guaranteed").
- Anonymise clients with initials + city + buyer type.

### 10.3 Voice & copy
Calm, confident, concise, aspirational. Two-beat headlines ("Live the lifestyle. Own the address."). CTA verbs: *Explore, Discover, View Details, Book, Speak to*. Eyebrows 1–3 words. British English (UK audience). Dates `20 October 2026`; currency `AED 1.5m`, `£`, `$` with indicative conversions.

### 10.4 Accessibility (WCAG 2.2 AA)
- Landmarks (`header`, `nav aria-label`, `main`, `section aria-labelledby`, `footer`); skip link; one `<h1>`.
- Focus-visible 2px gold-bright ring offset 3 on every interactive element (cards included); logical order.
- Hit area ≥ 44×44; icon-only controls have `aria-label`; menu toggle exposes `aria-expanded` and `aria-controls`.
- Text on imagery sits on overlays ≥ 4.5:1 at all crops; verify hero at mobile and desktop.
- Marquee: decorative duplicate `aria-hidden`; pause on hover/focus; stop on reduced motion.
- Don't rely on colour alone (active nav also gets weight or underline on focus).
- Forms: visible labels, `aria-describedby` for errors, `autocomplete` tokens, error summary focus.
- Modals: focus trap, ESC, return focus.
- Alt text describes the property/place; decorative images `alt=""`.
- Test with keyboard-only, VoiceOver/NVDA, 200% zoom, and axe + Lighthouse.

### 10.5 Performance budgets
| Metric | Target |
|---|---|
| LCP (mobile 4G) | ≤ 2.5s |
| CLS | ≤ 0.05 |
| INP | ≤ 200ms |
| JS (initial, gzip) | ≤ 180KB (Lenis ~4KB; Framer Motion tree-shaken or replace with CSS/IO) |
| Hero image | ≤ 250KB mobile, AVIF/WebP, `fetchpriority="high"`, `<link rel=preload>` |
| Fonts | 2 families, `swap`, preconnect; subset Latin |

Lazy-load below-fold images with explicit `width/height`; route-level code splitting; defer map/analytics/chat until interaction or consent.

### 10.6 SEO & structured data
- Unique `<title>` (≤ 60 chars) and meta description (≤ 155) per page; canonical; OG/Twitter images (1200×630, dark on-brand).
- Hero tagline carries the keyword phrase ("[City] Property Investment for [Audience]").
- JSON-LD: `Organization`, `RealEstateAgent`, `WebSite` (+ `SearchAction`), `BreadcrumbList`, `Residence`/`Product`+`Offer` on projects, `Article`, `FAQPage`.
- Prerender/SSG key routes (Vite SSG or prerender plugin); sitemap.xml + robots.txt; clean slugs; internal links from guides to projects.
- Reveal pre-hide must not hide content from crawlers (see §9.4).

### 10.7 Privacy & compliance
Consent banner with equal-weight accept/reject; analytics gated by consent; GDPR/UK-GDPR language in forms; retain minimal data; link Privacy/Cookie policies in footer and forms.

### 10.8 Error, empty & edge states
404 page; empty filter state with "Reset filters" + consultation CTA; network error toast with retry; image fallback = `--bg-surface` block with gold monogram; form submission failure keeps data and offers WhatsApp.

### 10.9 Imagery & art direction
- Subjects: skylines, aerials, villas, branded-residence lobbies, interiors, lifestyle. Warm golden/blue hour, slightly desaturated, high dynamic range.
- Ratios: hero 16:9+ (≥1920×1080) with portrait crop; property 4:3; destination ≈ 3:4 (480 tall); team 4:5; article 16:9; OG 1.91:1.
- Overlays: hero `linear-gradient(to top, rgba(11,12,16,.9), rgba(11,12,16,.2) 60%, rgba(11,12,16,.5))`; cards `to top, rgba(11,12,16,.85) → transparent 60%`.
- Logos: mono, uniform optical height, 60% opacity. Renders only when developer-supplied; avoid stock-y 3D.

### 10.10 Reference Delta — UX
_Add UX learnings from references 2–5 here._

---

## 11. Implementation Guide (React 19 + Vite + TypeScript)

### 11.1 Folder structure
```
src/
  styles/        tokens.css  base.css  motion.css
  lib/           lenis.ts  reveal.ts  analytics.ts  seo.ts  format.ts
  hooks/         useScrolled.ts  useReducedMotion.ts  useInView.ts  useMediaQuery.ts  useLenis.ts
  components/
    layout/      Header  MobileMenu  Footer  FloatingContact  MobileActionBar  PageHero
    ui/          Button  Eyebrow  SectionHeader  Tag  ArrowLink  Input  Select  Modal  Accordion  Tabs  Toast  Reveal
    sections/    Hero  Ticker  StatsStrip  PropertyGrid  DestinationGrid  Pillars  LandBanner  PartnerLogos  Testimonials  FinalCta  Timeline  Faq
    cards/       PropertyCard  DestinationCard  TestimonialCard  ArticleCard  TeamCard
    forms/       ConsultationForm  EnquiryCard  FiltersBar
  data/          properties.ts  destinations.ts  articles.ts  testimonials.ts  partners.ts  nav.ts  stats.ts
  pages/         Home Destinations DestinationDetail Opportunities ProjectDetail Developments DevelopmentDetail
                 Advisory LandJv Insights Article ClientStories About Consultation Legal NotFound
  router.tsx  main.tsx
```

### 11.2 Types
```ts
type ButtonVariant = 'primary' | 'ghost' | 'outline' | 'link';
interface Project { slug:string; title:string; tag:string; location:string; emirate:'dubai'|'abu-dhabi'|'rak';
  descriptor:string; price:string; developer:string; status:'new-launch'|'off-plan'|'ready'; image:string; gallery:string[]; }
interface Destination { slug:string; title:string; kicker:string; excerpt:string; image:string }
interface Testimonial { quote:string; name:string; descriptor:string; buyerType:string }
interface Stat { value:string; label:string }
```

### 11.3 Reveal component (Framer Motion or CSS)
```tsx
<Reveal y={24} delay={0.1} once>…</Reveal>
```
Respects reduced-motion (renders children without transform), uses `viewport margin -60px`, duration `0.8`, ease-lux.

### 11.4 Styling approach
Tokens in `tokens.css`; components consume variables. Plain CSS Modules or Tailwind v4 (`@theme` mapping the tokens) — pick one and don't mix hard-coded values.

### 11.5 Testing hooks
Keep `data-testid` on key CTAs, nav links, cards (`project-card-<slug>`, `destination-card-<slug>`, `hero-cta-*`, `nav-cta-private-consultation`, `mobile-menu-toggle`, `site-header`) as the reference does.

---

## 12. Quality Checklist (per page)

**Design**
- [ ] Only §4 tokens used; no stray hex/px/easing.
- [ ] Headlines Cormorant 300; labels Plus Jakarta uppercase with correct tracking.
- [ ] One primary button per viewport; alt-background rhythm respected.
- [ ] Card anatomy complete (tag, location, title, descriptor, price, link).

**Motion**
- [ ] Hero intro matches §9.3; reveals fire once; grid stagger by column.
- [ ] Hover states (§9.6) present on every interactive element, with keyboard-focus parity.
- [ ] Touch devices use `:active` instead of hover lift.
- [ ] Reduced-motion verified (no Lenis, no marquee, no parallax).

**Responsive**
- [ ] 375 / 414 / 768 / 1024 / 1280 / 1536 checked; no horizontal scroll.
- [ ] Mobile bar and floating pill never cover content or footer; safe-area padding applied.
- [ ] Sticky filters/sidebars become bottom sheets on mobile.

**UX & content**
- [ ] Final CTA present; WhatsApp reachable; form success/failure paths work.
- [ ] Prices attributed; disclaimer in footer; no guaranteed returns.
- [ ] Empty/error/404 states designed.

**Quality**
- [ ] Lighthouse: Performance ≥ 90 (mobile), Accessibility ≥ 95, SEO ≥ 95.
- [ ] axe: 0 critical issues; keyboard-only path completed.
- [ ] `npm run lint` and `npm run build` pass.
