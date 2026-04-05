# TaleSoup

> 事は全てエレガントに運べ

**Story Engineering Platform** — A platform where humans and AI collaboratively design, accumulate, and refine story structures as graphs.

---

## Concept

TaleSoup is not just a writing tool. It is a platform for **story engineering** — reverse-engineering what makes a story compelling, accumulating structural patterns, and progressively shifting the balance of creative work toward AI.

```
Initially    Human 8 : AI 2
                ↓
Data grows   Human 5 : AI 5
                ↓
Eventually   Human 2 : AI 8
```

**Project Momotaro** — The first project. Used to validate core features using the tale of Momotaro.

---

## Quick Start

### Browser (recommended for development)

```bash
npm install
npm run dev
# → http://localhost:5173
```

### Tauri Desktop

```bash
npm run tauri:dev
```

> **WSL2 note:** If the window fails to open, try:
>
> ```bash
> WEBKIT_DISABLE_DMABUF_RENDERER=1 npx tauri dev
> ```

---

## Tech Stack

| Layer                  | Technology                   |
| ---------------------- | ---------------------------- |
| Desktop shell          | Tauri 2                      |
| Frontend               | React 18 + TypeScript + Vite |
| Graph editor           | @xyflow/react (React Flow)   |
| State management       | Zustand                      |
| Backend _(Sprint 2+)_  | Rust / Axum                  |
| Database _(Sprint 2+)_ | PostgreSQL + pgvector        |
| AI _(Sprint 2+)_       | Claude API (Tool Use)        |

---

## Project Structure

```
talesoup/
├── src/
│   ├── App.tsx                        # Screen routing (list ↔ editor)
│   ├── App.css                        # Global styles / CSS variables
│   ├── main.tsx                       # Entry point
│   ├── pages/
│   │   └── TaleListPage.tsx           # Home screen — tale list
│   ├── components/
│   │   ├── tale/
│   │   │   ├── TaleCard.tsx           # Tale card
│   │   │   └── NewTaleModal.tsx       # New tale creation modal
│   │   ├── graph/
│   │   │   ├── GraphCanvas.tsx        # React Flow canvas
│   │   │   └── EntityNode.tsx         # Custom node component
│   │   ├── detail/
│   │   │   └── DetailPanel.tsx        # Right panel — entity detail
│   │   ├── chat/
│   │   │   └── ChatPanel.tsx          # Bottom panel — chat input
│   │   └── layout/
│   │       └── TopBar.tsx             # Header / breadcrumb navigation
│   ├── lib/
│   │   ├── store.ts                   # Zustand global state
│   │   ├── graphUtils.ts              # Entity → React Flow conversion
│   │   └── sampleData.ts             # Project Momotaro sample data
│   └── types/
│       └── index.ts                   # Core data type definitions
└── src-tauri/                         # Tauri 2 backend
    ├── src/
    │   ├── main.rs
    │   └── lib.rs                     # Tauri commands (Sprint 2+)
    ├── tauri.conf.json
    └── capabilities/
        └── default.json
```

---

## Data Model

Defined in `src/types/index.ts`. Based on `ARCHITECTURE.md`.

```
Tale            The entire story
  └── Scene     A scene within the story
        └── StoryEvent   An event or foreshadowing within a scene
Entity          Character / Place / Organization / Item
Relationship    Relationship between entities (weighted)
TwistPattern    Twist pattern library (Sprint 4)
ChoiceRecord    Human choice history (Sprint 4)
```

---

## Screen Flow

```
Launch
  └── Tale List (home)
        ├── Click card  → Graph editor
        │     └── Click "TaleSoup" in breadcrumb → Back to list
        └── "+ New Tale" → Creation modal → Graph editor
```

---

## Sprint Plan

### Sprint 1 — Graph manual editing ✅

- [x] Tale list screen
- [x] New tale creation modal
- [x] React Flow graph canvas
- [x] Custom node (EntityNode) with type-based accent colors
- [x] Right panel — entity detail with scene list
- [x] Bottom panel — chat input (stub)
- [x] TopBar breadcrumb navigation
- [x] Sample data (Project Momotaro — 3 scenes, 5 characters)
- [ ] Manual node add / edit form

### Sprint 2 — Chat input → graph update

- [ ] Backend (Axum + PostgreSQL)
- [ ] Claude API Tool Use integration
- [ ] Text input → graph reflection
- [ ] ChoiceRecord persistence

### Sprint 3 — AI as story assistant

- [ ] Twist suggestion
- [ ] Foreshadowing suggestion
- [ ] Scene generation (Sonnet)
- [ ] Contradiction detection
- [ ] AI suggestion accept/reject UI

### Sprint 4 — Research foundation

- [ ] TwistPattern library accumulation
- [ ] ChoiceRecord analytics
- [ ] Neo4j integration (experimental analysis)
- [ ] Pattern suggestion from past choices

---

## Environment Variables

Copy `.env.example` to `.env.local` and fill in values (Sprint 2+).

```env
VITE_API_URL=http://localhost:8080
# ANTHROPIC_API_KEY is used server-side only — never set it here
```

---

## Development Notes

- CSS variables are prefixed `--ts-*` (e.g. `--ts-bg`, `--ts-text`). Dark mode is automatic via `prefers-color-scheme`.
- The graph canvas shows entities scoped to the current scene when a scene is selected, or all entities in the tale when no scene is selected.
- `ChatPanel` calls `processIntent()` which is currently a stub. Wire it to `POST /api/chat` in Sprint 2.
