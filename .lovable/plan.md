## Traffic Severity AI — Frontend Build Plan

A two-page TanStack Start app with a premium dark, developer-focused aesthetic (subtle borders, mono accents for labels). Frontend-only; classification API is mocked.

### Design system (src/styles.css)

- Force dark theme by default (apply `dark` class on `<html>` in `__root.tsx`).
- Refresh tokens for a near-black background, soft elevated surfaces, faint white borders, and accent colors:
  - `--severity-minor` (green), `--severity-moderate` (amber), `--severity-severe` (red)
  - `--gradient-surface`, `--shadow-glow`, glass card via `backdrop-blur` + low-opacity border
- Typography: Inter for body, JetBrains Mono for labels/metrics (via Google Fonts link in root `head()`).

### Routes

- `src/routes/__root.tsx` — add shared `<SiteHeader />`, dark-mode wrapper, font links, and meta.
- `src/routes/index.tsx` — Classification Dashboard.
- `src/routes/architecture.tsx` — Project Architecture page (own `head()` meta).

### Shared components (`src/components/`)

- `SiteHeader.tsx` — Title "Traffic Severity AI" + nav links (`/`, `/architecture`) using `<Link>` with `activeProps`.
- `ui/` shadcn primitives already present (Card, Button, Badge, Progress, ScrollArea) — reuse.

### Dashboard components (`src/components/dashboard/`)

- `UploadDropzone.tsx` — drag-and-drop + file picker, accepts `.jpg/.jpeg/.png/.mp4`. Validates type, emits selected `File`.
- `MediaPreview.tsx` — renders `<img>` for images or muted/looping `<video>` for video; exposes a ref to the video element.
- `SeverityBadge.tsx` — large pill with color from severity token.
- `ConfidenceBar.tsx` — `Progress` + numeric % in mono font.
- `FrameTimeline.tsx` — vertical scrolling list of past frames (timestamp, mini severity dot, confidence). Uses `ScrollArea`, auto-scrolls to newest.
- `ResultsPanel.tsx` — composes badge + bar + timeline + skeleton loaders while first result pending.

### Custom hook (`src/hooks/useMediaClassifier.ts`)

Encapsulates all processing:

- Input: the selected `File`.
- For images: convert to `FormData` and call `classifyFrame()` once.
- For videos: on `loadeddata`, set up a `setInterval` (1s) that draws the current `videoEl` frame to an offscreen `<canvas>`, calls `canvas.toBlob()` → `File`, sends via `classifyFrame()`. Pauses interval on `pause/ended`, resumes on `play`. Cleans up on unmount / new file.
- Maintains state: `currentResult`, `history: ClassificationResult[]`, `isLoading`, `error`.
- Returns `{ canvasRef, videoRef, currentResult, history, isLoading }`.

### Mock API (`src/lib/classify.ts`)

- `classifyFrame(file: File): Promise<{ severity: 'Minor'|'Moderate'|'Severe'; confidence: number; timestamp: number }>`
- Simulated 400–900ms latency; weighted random severity; confidence 0.6–0.99.
- TODO comment marking the real Hugging Face endpoint swap point.

### Architecture page (`/architecture`)

- Hero: "Under the Hood" + subtitle, centered, max-width prose.
- Responsive 3-column grid (stacks on mobile) of glass `Card`s:
  1. The Models — YOLOv11 + EfficientNet-B0
  2. The Frontend — React + Canvas client-side frame extraction
  3. The Infrastructure — Docker, FastAPI, Hugging Face Spaces
- Each card: monospace eyebrow label, icon (lucide-react), short paragraph.
- Footer-area "Back to Dashboard" `<Link to="/">` styled as outline button.
- Per-route `head()` meta (title, description, og tags).

### Loading / empty states

- Dropzone shows hint copy when empty.
- Results panel shows skeleton bars before first classification.
- Spinner overlay on dropzone while initial file is being prepared.

### Files to create

```
src/routes/architecture.tsx
src/components/SiteHeader.tsx
src/components/dashboard/UploadDropzone.tsx
src/components/dashboard/MediaPreview.tsx
src/components/dashboard/ResultsPanel.tsx
src/components/dashboard/SeverityBadge.tsx
src/components/dashboard/ConfidenceBar.tsx
src/components/dashboard/FrameTimeline.tsx
src/hooks/useMediaClassifier.ts
src/lib/classify.ts
```

Modify: `src/routes/__root.tsx`, `src/routes/index.tsx`, `src/styles.css`.

### Out of scope

- No backend, no real HF call, no auth, no persistence.

---

**Clarifying questions before I build:**

1. For the video frame interval — strict 1 second, or should I expose a small control (e.g. 0.5s / 1s / 2s) so you can demo throughput?
2. The timeline history — keep a rolling window (e.g. last 30 frames) for performance, or unbounded with virtualized scroll?