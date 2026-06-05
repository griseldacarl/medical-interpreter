# AGENTS.md

Greenfield project — only a design doc exists; no code has been written yet.

**Note:** Directory name has a typo (`Intepreter`). Preserve it.

## Stack & Setup

| | |
|---|---|
| **Stack** | Vite 5 + React 18 + TypeScript 5 + Tailwind CSS 3 |
| **Package manager** | npm |
| **Backend** | None — fully static SPA, deploy `dist/` anywhere |
| **Router** | None — state-based routing in `App.tsx` via `useState<View>` |
| **Persistence** | `localStorage` key `srs-data` (SM-2 card states) |
| **Testing** | Vitest + jsdom + `@testing-library/react` |

## Commands

| Command | What it does |
|---------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | `tsc && vite build` → `dist/` |
| `npm run preview` | Preview production build |
| `npm run lint` | `tsc --noEmit` (typecheck only) |
| `npm run typecheck` | `tsc --noEmit` (same as lint) |
| `npm test` | `vitest run` |

**Run order when modifying:** `lint → build → test`

## Architecture

- **3 views** driven by `useState<View>` in `App.tsx`: `home` | `study` | `quiz`
- **Data**: 180 terms across 7 body systems. Each system in `src/data/<system>.ts` (snake_case), aggregated in `src/data/index.ts`
- **ID convention**: `<prefix>-NNN` — `sk-`, `mu-`, `cv-`, `nv-`, `re-`, `di-`, `po-`
- **Languages**: 9 codes — `ar`, `rw`, `sw`, `zh`, `fr`, `so`, `es`, `ja`, `en`
- **Type shape**: `TranslationEntry` with `translations: Record<LanguageCode, string>`, `phonetic?: Partial<Record<LanguageCode, string>>`, optional `japaneseDetail`

## Conventions

- **No comments** in production code
- **Tailwind utility classes only** — no CSS modules, no styled-components
- **File naming**: Components `PascalCase.tsx`, hooks `camelCase.ts` (use-prefix), data `snake_case.ts`, types `camelCase.ts`
- **Tests**: `<name>.test.ts` next to source file
- **Import order**: externals → types → data → hooks → components
- **Romaji apostrophes** must use double-quoted strings: `"kin'niku"`
- **Every entry** must have all 9 language keys in `translations` (TypeScript enforces this via `Record<LanguageCode, string>`)

## Single Source of Truth

The full design is in `medical_interpreter_design_document.md` — read it before making changes.

## Data Convention for `phonetic`

`phonetic` is `Partial<Record<LanguageCode, string>>` — each language key is optional. Only include a phonetic guide when the source script differs from Latin (Arabic, Chinese, Japanese) or when pronunciation is non-obvious.
