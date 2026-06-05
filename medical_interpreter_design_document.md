# Medical Interpreter — Complete Design Document

> A static single-page application (SPA) for learning medical/anatomy terminology.
> Users select a source language and body system, then study or quiz themselves on
> English translations using flip-cards with SM-2 spaced repetition.

---

## 1. Project Overview

| Property | Value |
|----------|-------|
| **Goal** | Learn anatomy terms from 8 source languages into English |
| **Stack** | Vite 5 + React 18 + TypeScript 5 + Tailwind CSS 3 |
| **Router** | None — state-based routing in `App.tsx` |
| **Backend** | None — 100 % client-side static site. Deploy `dist/` anywhere. |
| **Persistence** | `localStorage` key `srs-data` (SM-2 card states) |
| **Testing** | Vitest + jsdom + `@testing-library/react` |
| **Package manager** | npm |

## 2. Directory Structure

```
medical-interpretor/
  index.html              # HTML shell, Google Fonts links, root mount point
  package.json            # Dependencies, scripts
  tsconfig.json           # TypeScript config (strict, jsx: react-jsx)
  vite.config.ts          # Vite config + Tailwind plugin
  tailwind.config.js      # Tailwind content paths, theme extensions
  postcss.config.js       # PostCSS with Tailwind + autoprefixer
  AGENTS.md               # Convenant for opencode agents
  Design.md               # Visual design tokens (colors, typography, layout)
  medical_interpreter_design_document.md  # ← This file — complete reference

  src/
    main.tsx              # ReactDOM.createRoot entry point
    App.tsx               # State-based router: home | study | quiz
    index.css             # Tailwind directives (@tailwind base/components/utilities)

    types/
      flashcard.ts        # BodySystem, LanguageCode, JapaneseDetail, TranslationEntry

    data/
      index.ts            # allTerms aggregate + filterBySystem + filterByLanguage
      skeletal.ts         # 28 bone terms
      muscular.ts         # 24 muscle terms
      cardiovascular.ts   # 28 heart/vessel terms
      nervous.ts          # 25 nerve/brain terms
      respiratory.ts      # 20 lung/airway terms
      digestive.ts        # 27 digestive organ terms
      positions.ts        # 28 directional/anatomical position terms

    hooks/
      useSRS.ts           # SM-2 spaced repetition (localStorage)

    components/
      DeckSelector.tsx    # Language + body system picker sidebar
      FlashCard.tsx       # 3D flip card (front: source term, back: English)
      QuizPanel.tsx       # Multiple-choice quiz (4 options)
      SRSControls.tsx     # Again / Hard / Good / Easy rating buttons
      ProgressBar.tsx     # "Card N of M" progress indicator
      JapaneseStack.tsx   # Kanji + hiragana + romaji + katakana stacked display

    views/
      StudyView.tsx       # Flip-card study session with SRS
      QuizView.tsx        # Multiple-choice quiz session
```

## 3. Type System

File: `src/types/flashcard.ts`

```typescript
export type BodySystem =
  | 'skeletal'
  | 'muscular'
  | 'cardiovascular'
  | 'nervous'
  | 'respiratory'
  | 'digestive'
  | 'positions'

export type LanguageCode =
  | 'ar' | 'rw' | 'sw' | 'zh' | 'fr' | 'so' | 'es' | 'ja' | 'en'
//    Arabic  Kinyarw   Swahili  Chinese French Somali Spanish  Japan  English
//    (العربية)         (Kiswahili) (中文) (Français)(Soomaali)(Español)(日本語)

export interface JapaneseDetail {
  kanji: string
  hiragana: string
  katakana: string
  romaji: string
}

export interface TranslationEntry {
  id: string              // e.g. "sk-001", "cv-014"
  system: BodySystem      // which body system
  translations: Record<LanguageCode, string>  // term in each language
  phonetic?: Partial<Record<LanguageCode, string>>  // pronunciation guide
  japaneseDetail?: JapaneseDetail  // full Japanese script breakdown (if sourceLang === 'ja')
  position?: string       // optional note (e.g. "anterior view")
}
```

### Language Code Reference

| Code | Language | Native name | Font |
|------|----------|-------------|------|
| `ar` | Arabic | العربية | Noto Sans Arabic |
| `rw` | Kinyarwanda | Kinyarwanda | Inter |
| `sw` | Swahili | Kiswahili | Inter |
| `zh` | Chinese (simplified) | 中文 | Noto Sans SC |
| `fr` | French | Français | Inter |
| `so` | Somali | Soomaali | Inter |
| `es` | Spanish | Español | Inter |
| `ja` | Japanese | 日本語 | Noto Sans JP |
| `en` | English | English | Inter |

## 4. Data Architecture

### File Layout

Each body system has its own file in `src/data/<system>.ts`. Every file:

1. Imports `TranslationEntry` from `../types/flashcard`
2. Exports a typed array (e.g. `export const skeletalTerms: TranslationEntry[] = [...]`)
3. Aggregator in `src/data/index.ts` spreads all arrays into `allTerms`

### Entry Pattern

```typescript
{
  id: 'sk-001',                              // system prefix + 3-digit zero-padded
  system: 'skeletal',                        // matches BodySystem union
  translations: {
    ar: 'عظم',                               // Arabic
    rw: 'iyagufa',                           // Kinyarwanda
    sw: 'mfupa',                             // Swahili
    zh: '骨头',                              // Chinese (simplified)
    fr: 'os',                                // French
    so: 'lafla',                             // Somali
    es: 'hueso',                             // Spanish
    ja: '骨',                                // Japanese (kanji)
    en: 'bone',                              // English
  },
  phonetic: {
    ar: 'ʿaẓm',                              // Arabic romanization
    rw: 'iyagufa',                           // Kinyarwanda (native script)
    sw: 'mfupa',                             // Swahili (native)
    zh: 'gǔtou',                             // Chinese pinyin
    fr: 'ɔs',                                // French IPA-like guide
    so: 'lafla',                             // Somali (native)
    es: 'weso',                              // Spanish pronunciation guide
    ja: 'hone',                              // Japanese romaji (Hepburn)
  },
  japaneseDetail: {                          // only present for Japanese
    kanji: '骨',
    hiragana: 'ほね',
    katakana: 'ボーン',                      // English-derived loanword
    romaji: 'hone',
  },
}
```

### ID Naming Convention

| Prefix | System | Count |
|--------|--------|-------|
| `sk-` | skeletal | 28 |
| `mu-` | muscular | 24 |
| `cv-` | cardiovascular | 28 |
| `nv-` | nervous | 25 |
| `re-` | respiratory | 20 |
| `di-` | digestive | 27 |
| `po-` | positions | 28 |
| **Total** | | **180** |

### Aggregator & Filters

`src/data/index.ts` exports:

```typescript
const allTerms: TranslationEntry[]  // flat array of all 180 entries
filterBySystem(system)              // filter to one BodySystem (or 'all')
filterByLanguage(terms, lang)       // keep entries with a translation in `lang`
```

## 5. Japanese Support

### The JapaneseDetail Field

Added as an optional field on `TranslationEntry` to accommodate Japanese's four-script writing system:

- **kanji** — Sino-Japanese logographic characters (e.g. `骨`, `筋肉`, `心臓`)
- **hiragana** — native phonetic syllabary reading (e.g. `ほね`, `きんにく`, `しんぞう`)
- **katakana** — English-derived loanword in katakana (e.g. `ボーン`, `マッスル`, `ハート`)
- **romaji** — Hepburn romanization of the hiragana reading (e.g. `hone`, `kin'niku`, `shinzō`)

### JapaneseStack Component

File: `src/components/JapaneseStack.tsx`

When `sourceLang === 'ja'` and `entry.japaneseDetail` exists, FlashCard and QuizPanel render `<JapaneseStack>` instead of the generic term + phonetic line.

**Visual hierarchy (stacked vertically, centered):**

```
┌──────────────────┐
│     skeletal     │  ← system badge (text-xs)
│                  │
│       骨         │  ← kanji (text-3xl font-bold text-slate-800)
│     ほね         │  ← hiragana (text-xl text-slate-500)
│     hone         │  ← romaji (text-sm italic text-slate-400)
│    ボーン        │  ← katakana (text-sm text-slate-400)
│                  │
│  tap to reveal   │
└──────────────────┘
```

### Romaji Apostrophe Handling

Some romaji strings contain apostrophes (e.g. `kin'niku`, `en'i`, `kin'i`). These values MUST use double quotes in the TypeScript source to avoid string termination:

```typescript
phonetic: { ..., ja: "kin'niku" },
japaneseDetail: { ..., romaji: "kin'niku" },
```

### Conventions for Katakana Loanwords

For every term, the `katakana` field contains the **English-derived loanword** in katakana script (e.g. ボーン from "bone", スケルトン from "skeleton", ハート from "heart"). This provides an alternative entry point for learners familiar with English terminology.

## 6. Routing (State-Based)

File: `src/App.tsx`

No router library. A single `useState<View>` drives three views:

```
App
 ├─ view='home'  →  Home screen: 2 buttons (Study / Quiz)
 ├─ view='study' →  StudyView component
 │                    └─ DeckSelector sidebar + FlashCard + SRSControls
 └─ view='quiz'  →  QuizView component
                      └─ DeckSelector sidebar + QuizPanel
```

State lifted to App: `system` (which body system), `sourceLang` (which language).

## 7. UI Components

### DeckSelector (`src/components/DeckSelector.tsx`)

**Props:** `selectedSystem`, `onSelectSystem`, `sourceLang`, `onSelectLang`

**Layout:** Sidebar on desktop (`lg:flex-row`), horizontal scroll on mobile.

**Language buttons (in order):**

| Key | Label |
|-----|-------|
| `ar` | العربية |
| `rw` | Kinyarwanda |
| `sw` | Kiswahili |
| `zh` | 中文 |
| `fr` | Français |
| `so` | Soomaali |
| `es` | Español |
| `ja` | 日本語 |

**System buttons:** All Systems, Skeletal, Muscular, Cardiovascular, Nervous, Respiratory, Digestive, Positions.

**States:**
- Active pill: `bg-teal-100 text-teal-700`
- Inactive: `bg-white text-slate-600 hover:bg-slate-100`

### FlashCard (`src/components/FlashCard.tsx`)

**Props:** `entry`, `sourceLang`, `flipped`, `onFlip`

**3D Flip mechanism:**
- Outer container: `perspective-1000` (CSS `perspective: 1000px`)
- Inner rotator: `transition-transform duration-400 ease-in-out`, toggles `rotateY(180deg)`
- Front face: `backface-visibility: hidden`
- Back face: `backface-visibility: hidden; transform: rotateY(180deg)`

**Front content:**
- If `sourceLang === 'ja' && entry.japaneseDetail`: render `<JapaneseStack>`
- Else: show `entry.translations[sourceLang]` (large text) + `entry.phonetic?.[sourceLang]` (italic below)

**Back content:** `entry.translations.en` (English) + optional `entry.position`

**States:**
- Flipped: shows back face
- Not flipped: shows front face

### QuizPanel (`src/components/QuizPanel.tsx`)

**Props:** `entry`, `sourceLang`, `onNext`

**Question display:**
- Same conditional as FlashCard: JapaneseStack for `ja`, otherwise term + phonetic
- Correct answer: `entry.translations.en`

**Answer options:** 4 total — 1 correct + 3 distractors randomly sampled from `allTerms`.
Shuffled each time via Fisher-Yates.

**States:**
- Unanswered: all buttons `border-slate-200 text-slate-700` with hover
- Correct selected: `border-emerald-500 bg-emerald-50 text-emerald-700`
- Wrong selected: `border-rose-500 bg-rose-50 text-rose-700` (correct also highlighted green)
- All disabled after answering; "Next" button appears

### SRSControls (`src/components/SRSControls.tsx`)

**Props:** `onRate`

Four buttons: **Again** (rose, quality=1), **Hard** (amber, quality=2), **Good** (teal, quality=3), **Easy** (emerald, quality=4).

### ProgressBar (`src/components/ProgressBar.tsx`)

**Props:** `current`, `total`

Renders "Card N of M" with a thin horizontal bar filling proportionally.

## 8. SM-2 Spaced Repetition

File: `src/hooks/useSRS.ts`

Implements the **SuperMemo SM-2 algorithm** (1987):

```typescript
interface SRSCard {
  id: string
  easeFactor: number     // starts at 2.5, min 1.3
  interval: number       // days until next review
  repetitions: number    // consecutive correct answers
  nextReview: number     // timestamp (ms)
}
```

**Rating → quality mapping:**

| Button | Quality | Effect |
|--------|---------|--------|
| Again | 1 | Reset repetitions to 0, interval = 1 day |
| Hard | 2 | Interval * 1.2, ease factor -= 0.15 |
| Good | 3 | Standard SM-2 calculation |
| Easy | 4 | Bonus interval multiplier |

**Persistence:** Serialized to `localStorage` under key `srs-data`.

**Key values:**
- Interval formula: `(prev * easeFactor)` for quality ≥ 3, reset to 1 / 6 for quality < 3
- Ease factor adjustment: `EF + (0.1 - (5-q) * (0.08 + (5-q) * 0.02))`
- First review: interval = 1 day, second = 6 days

## 9. Styling — Design Tokens

### Colors

| Role | Hex | Tailwind class |
|------|-----|----------------|
| Page background | `#f8fafc` | `slate-50` |
| Card front | `#ffffff` | `white` |
| Card back | `#f1f5f9` | `slate-100` |
| Primary | `#0f766e` | `teal-700` |
| Primary light | `#ccfbf1` | `teal-100` |
| Accent (correct) | `#0891b2` | `cyan-600` |
| Danger (wrong) | `#e11d48` | `rose-600` |
| Text | `#1e293b` | `slate-800` |
| Muted | `#64748b` | `slate-500` |
| Correct answer | `#10b981` | `emerald-500` |
| Wrong answer | `#f43f5e` | `rose-500` |

### Typography

| Use | Font stack |
|-----|------------|
| UI / English | `Inter`, system-ui, sans-serif |
| Arabic | `Noto Sans Arabic`, sans-serif |
| Chinese | `Noto Sans SC`, sans-serif |
| Japanese | `Noto Sans JP`, sans-serif |
| Swahili/Kinyarwanda/Somali/French/Spanish | `Inter`, system-ui, sans-serif |

All loaded from Google Fonts in `index.html`.

### Spacing & Radius

| Element | Classes |
|---------|---------|
| Cards | `rounded-2xl shadow-lg` |
| Buttons | `rounded-xl px-5 py-2.5` |
| Deck pills | `rounded-lg` |
| General padding | `p-4` / `p-6` |

### Responsive Breakpoints

| Range | Layout |
|-------|--------|
| < 640px | Single column, card fills width |
| 640–1023px | Card `max-w-md` centered, deck selector as horizontal scroll |
| ≥ 1024px | Two-column: sidebar (240px) + main card area (`lg:flex-row`) |

## 10. Card Flip Animation

CSS 3D transform approach — no JavaScript animation libraries:

```css
/* Applied via inline styles + Tailwind classes */
.perspective-1000 { perspective: 1000px; }
.backface-hidden  { backface-visibility: hidden; }
```

- Duration: 400ms `ease-in-out`
- Card inner div rotates on Y axis
- Front and back are absolutely positioned children with `backface-hidden`
- Front has `rotateY(0deg)`, back has `rotateY(180deg)`
- On click, toggle `rotateY(180deg)` on the container

## 11. Quiz Logic

1. **Distractor selection:** Random sample 3 unique entries from `allTerms` (excluding current), take their English translations
2. **Shuffle:** Fisher-Yates shuffle on the 4 options
3. **Answer check:** Compare selected string to `entry.translations.en`
4. **Color feedback:** Green for correct answer (always highlighted after answer), red for wrong selection

## 12. Commands

| Command | Action |
|---------|--------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | `tsc && vite build` → outputs to `dist/` |
| `npm run preview` | Preview the production build |
| `npm run lint` | `tsc --noEmit` (typecheck only) |
| `npm run typecheck` | `tsc --noEmit` |
| `npm test` | Vitest |

Run in order when modifying: `lint → build → test`.

## 13. Data Flow

```
User opens app
  ↓
App.tsx shows Home (view='home')
  ↓
User picks Study or Quiz
  ↓
StudyView / QuizView rendered
  ├─ DeckSelector (sidebar): language + system pickers
  │   ├─ Language button → updates sourceLang in App state
  │   └─ System button → updates system in App state
  │
  ├─ Filtering pipeline (useMemo):
  │     allTerms → filterBySystem(system) → sort by nextReview (SRS)
  │
  ├─ FlashCard:
  │     current term → JapaneseStack (if ja) or term+phonetic (front)
  │     click → flip → SRSControls appear
  │     rate → rateCard(id, quality) → next card
  │
  └─ QuizPanel:
        current term → JapaneseStack (if ja) or term+phonetic (question)
        4 options → select → color feedback → Next
```

## 14. Conventions

### Code Style
- No comments in production code
- Tailwind utility classes only — no CSS modules, no styled-components
- Multi-line object formatting for readability (each field on its own line for data entries)
- Single-line for simple entries under 140 chars

### File Naming
- Components: `PascalCase.tsx`
- Hooks: `camelCase.ts` with `use` prefix
- Data: `snake_case.ts` (system names)
- Types: `camelCase.ts`
- Tests: `<filename>.test.ts` next to source file

### Data File Rules
1. Each system file exports a named const: `export const skeletalTerms: TranslationEntry[]`
2. The array is the default export of the module
3. All entries must have every language key in `translations` (enforced by TypeScript `Record<LanguageCode, string>`)
4. `phonetic` is optional per-language (`Partial<Record<…>>`)
5. `japaneseDetail` is optional and only meaningful when `sourceLang === 'ja'`

### Import Order
1. External packages (`react`, `react-dom`)
2. Types (`../types/flashcard`)
3. Data (`../data`)
4. Hooks (`../hooks/useSRS`)
5. Components (`../components/FlashCard`)

## 15. OpenCode Rebuild Guide

To recreate this project from scratch in a new opencode session:

### Step 1 — Scaffold Project

```
npm create vite@latest medical-interpretor -- --template react-ts
cd medical-interpretor
npm install
npm install -D tailwindcss@3 postcss autoprefixer
npx tailwindcss init -p
```

### Step 2 — Configure Tailwind

`tailwind.config.js` — set `content: ["./index.html", "./src/**/*.{ts,tsx}"]`
`src/index.css` — add `@tailwind base; @tailwind components; @tailwind utilities;`

### Step 3 — Write the type system (`src/types/flashcard.ts`)

Include all 9 language codes, `JapaneseDetail`, and `TranslationEntry`.

### Step 4 — Build data files

Create `src/data/skeletal.ts` (28 terms), `muscular.ts` (24), `cardiovascular.ts` (28), `nervous.ts` (25), `respiratory.ts` (20), `digestive.ts` (27), `positions.ts` (28). Each exports a `TranslationEntry[]`. Create `src/data/index.ts` as aggregator.

### Step 5 — Write the SRS hook (`src/hooks/useSRS.ts`)

Implement SM-2 with `localStorage` persistence under `srs-data`.

### Step 6 — Write UI components

In order: `DeckSelector`, `FlashCard`, `JapaneseStack`, `QuizPanel`, `SRSControls`, `ProgressBar`.

### Step 7 — Write views

`StudyView` (filters → sorts by SRS → cycles through → rates), `QuizView` (filters → shuffles → multiple choice).

### Step 8 — Wire in `App.tsx`

State-based routing with `useState<View>`. Home screen has two buttons.

### Step 9 — Configure `index.html`

Add Google Fonts for Inter, Noto Sans Arabic, Noto Sans SC, Noto Sans JP.

### Step 10 — Verify

```
npx tsc --noEmit
npm run build
npm run dev
```

### Step 11 — Write docs

`AGENTS.md` (commands, conventions, data flow), `Design.md` (visual tokens), `medical_interpreter_design_document.md` (this file).

---

## 16. Appendix — Test Configuration

For Vitest + jsdom + `@testing-library/react`:

```
npm install -D vitest jsdom @testing-library/react @testing-library/jest-dom
```

`vite.config.ts` — add `test: { environment: 'jsdom', globals: true }`.

Place tests next to their source files: `src/hooks/useSRS.test.ts`.

Run with: `npm test` (alias for `vitest run`).

---

## 17. Appendices

### A. Deployment — Cloudflare Pages

**Two methods:**

| Method | When to use |
|--------|-------------|
| **Git integration** (dashboard) | Auto-deploys on every `git push` |
| **`npx wrangler pages deploy dist/`** | One-off or preview deployments from CLI |

**Git integration setup:**
1. Cloudflare Dashboard → Workers & Pages → Create → Pages → Connect to Git
2. Select `griseldacarl/medical-interpreter`
3. Build command: `npm run build`
4. Build output directory: `dist`
5. Save — every push to `main` auto-deploys

**SPA client-side routing:**

Cloudflare Pages **does not** automatically serve `index.html` for unknown routes.
A `_routes.json` file in `public/` is required:

```json
{
  "version": 1,
  "include": ["/*"],
  "exclude": ["/assets/*", "/images/*", "/favicon.svg", "/icons.svg"]
}
```

**Do NOT use `_redirects` with `/* /index.html 200`** — Cloudflare Pages rejects this with:
> `Infinite loop detected in this rule. This would cause a redirect to strip .html or /index and end up triggering this rule again.`

**Direct CLI deploy (no git auto-deploy):**
```bash
npx wrangler login                          # one-time OAuth
npx wrangler pages project create medical-interpreter --production-branch main
npm run build && npx wrangler pages deploy dist/ --project-name medical-interpreter --branch main
```

**URL:** `https://medical-interpreter.pages.dev`

### B. Tips & Tricks (Lessons Learned)

#### TypeScript Config Gotchas

| Setting | Effect |
|---------|--------|
| `verbatimModuleSyntax: true` | Requires `import type` for type-only imports: `import type { TranslationEntry } from './flashcard'` |
| `erasableSyntaxOnly: true` | Forbids `enum`, `namespace`, and parameter properties. Use union types instead: `type View = 'home' \| 'study' \| 'quiz' \| 'search' \| 'bodySearch'` |

Both are enabled in Vite 8 + TypeScript 6 scaffolding.

#### Romaji Apostrophes

Apostrophes in romaji (e.g. `kin'niku`, `en'i`) **must use double-quoted strings** in TypeScript source. Single quotes would terminate the string:

```typescript
// Correct
ja: "kin'niku",
romaji: "kin'niku",

// Wrong — TypeScript error
ja: 'kin'niku',
```

#### Formal Register Requirement

Every language translation must use **formal/respectful register**:
- French: always *vous*, never *tu*
- Spanish: always *usted*, never *tú*
- Chinese: polite forms (您 preferred over 你 for formal contexts)
- Japanese: です/ます form, respectful vocabulary
- Arabic: formal فصحى register, respectful phrasing (أنتم/حضرتك)
- Somali, Swahili, Kinyarwanda: formal/polite address

This applies to interview dialogues (doctor questions and patient responses).

#### Web Speech API Locale Mapping

Not all browsers support every locale. Tested mappings:

| Code | Locale | Notes |
|------|--------|-------|
| `ar` | `ar-SA` | Arabic (Saudi Arabia) |
| `rw` | `rw-RW` | Kinyarwanda |
| `sw` | `sw-TZ` | Swahili (Tanzania) |
| `zh` | `zh-CN` | Chinese (Simplified) |
| `fr` | `fr-FR` | French (France) |
| `so` | `so-SO` | Somali |
| `es` | `es-ES` | Spanish (Spain) |
| `ja` | `ja-JP` | Japanese |
| `en` | `en-US` | English (US) |

The `useSpeak` hook wraps `window.speechSynthesis` with error handling for unsupported locales.

#### Gray's Anatomy Image Matching

55+ anatomy plates from Gray's Anatomy are stored in `public/images/` named like `gray_plate_001.png`. Matching is done via a `imageMap` in each data file (e.g. `skeletalImageMap: Record<string, string>` mapping term IDs to image filenames). Images not found in the map hide gracefully via `useState + onError` on the `<img>` tag.

**Image error handling pattern:**
```tsx
const [imgError, setImgError] = useState(false)
{!imgError && imagePath && (
  <img src={imagePath} alt="" onError={() => setImgError(true)} />
)}
```

#### Body Map SVG Overlay

Body images (1408×768) use an SVG overlay with `<rect>` regions for clickable anatomy areas:
- `viewBox="0 0 1408 768"` for coordinate consistency
- Rectangles defined in `src/data/bodyRegions.ts` per view
- 4 views: male/female × anterior/posterior
- 17 clickable regions per view
- Coordinates may need manual adjustment — run `npm run dev` and hover to test

#### Mobile Responsiveness Patterns

| Element | Minimum touch target | Tailwind classes |
|---------|---------------------|------------------|
| SpeakButton | 44×44px | `min-w-[44px] min-h-[44px]` |
| NavBar tabs | 44×44px | `min-w-[44px]` + responsive padding |
| SRSControls buttons | 44px height | `p-2 sm:p-3` |
| DeckSelector pills | 40px height | `px-3 py-2 sm:px-4 sm:py-2.5` |

General approach: **mobile-first**, with `sm:` breakpoint for tablet+.

#### Component Extraction Pattern

When a UI section is reused across two views, extract it:
1. Start inline (e.g. result card in SearchView)
2. When BodySearch needs it too → extract to `ResultCard.tsx`
3. Both views import and pass same props shape

This avoids code duplication without premature abstraction.

#### Cloudflare Pages Deployment

- `_redirects` with `/* /index.html 200` causes an **infinite loop error** — use `_routes.json` instead
- The `npm run build` command in tsconfig+based projects runs `tsc -b` then `vite build`
- Build output is `dist/` — set as output directory
- For local testing before deploy: `npm run preview` serves the production build
- Wrangler may warn about uncommitted changes — pass `--commit-dirty=true` to silence

#### Pre-Deployment Checklist

Run in order:
```bash
npm run lint        # tsc --noEmit
npm run build       # tsc -b && vite build
npm test            # vitest run
```

#### State Persistence Across Tabs

When adding new navigation views, the selected `system` and `sourceLang` are lifted to `App.tsx` state so they persist when switching between tabs (Home → Study → Quiz → Search → Body). The `useSRS` hook also persists to `localStorage` so the SM-2 card states survive page refreshes.

#### Data Generation Script

For bulk-generated data (180 anatomy terms):
1. Write a Node script in `scripts/generate-data.js`
2. Use translation objects for each term
3. The script outputs TS arrays that you copy into the system data files
4. This is faster than hand-writing 180 entries but requires careful review for accuracy

#### Interview System Extension

Adding a new body system (`'interview'`) required:
1. Extending the `BodySystem` union type — changes in one file (`types/flashcard.ts`)
2. Creating data file with correct ID prefix (`in-`)
3. Importing and aggregating in `src/data/index.ts`
4. Adding a button in `DeckSelector.tsx`
5. No other component changes needed — filters, FlashCard, QuizPanel, SearchView all work automatically

---

*Document generated: 2026-06-03*
*Last updated: 2026-06-04*
*Covers all 266 medical/interview terms across 8 systems and 9 languages.*
