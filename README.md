# DOT Graph Viewer

A fully static, in-browser Graphviz `.dot` / `.gv` file viewer built with React, TypeScript, Vite, and Graphviz WebAssembly.

**No backend. No server. Everything runs in your browser.**

## Features

- Drag-and-drop or file-picker upload (`.dot` / `.gv`)
- Graphviz WASM rendering (`@hpcc-js/wasm`)
- Interactive SVG viewer — zoom (mouse wheel), pan, fit-to-screen
- One-click SVG download
- Friendly error messages for invalid DOT syntax
- SVG sanitization via DOMPurify
- Deployable to GitHub Pages, Netlify, Cloudflare Pages, Azure Static Web Apps

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Build

```bash
npm run build    # outputs to dist/
npm run preview  # preview the production build
```

## Deploy to GitHub Pages

1. Push this repo to GitHub.
2. In **Settings → Pages**, set the source to **GitHub Actions**.
3. Edit `.github/workflows/deploy.yml` and update `VITE_BASE_PATH` to match your repository name (e.g. `/dot-viewer/`).
4. Push to `main` — the workflow builds and deploys automatically.

### Manual deploy (gh-pages branch)

```bash
npm run deploy
```

Requires `gh-pages` package (already in devDependencies) and a configured remote origin.

## Tech Stack

| Layer | Library |
|---|---|
| UI framework | React 19 + TypeScript |
| Build tool | Vite 6 |
| DOT rendering | @hpcc-js/wasm |
| Pan / zoom | svg-pan-zoom |
| SVG sanitization | DOMPurify |
| Styling | Tailwind CSS 3 |

## License

This project is licensed under the [Mozilla Public License 2.0](LICENSE).
Third-party dependency licenses and attribution requirements are listed in
[THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).

## Project Structure

```
src/
├── components/
│   ├── FileUploader.tsx   # drag-and-drop / file picker
│   ├── GraphViewer.tsx    # SVG rendering + pan/zoom
│   ├── Toolbar.tsx        # zoom controls + download button
│   └── ErrorPanel.tsx     # render error display
├── services/
│   └── graphviz.ts        # WASM singleton + renderDot()
├── hooks/
│   └── useGraphviz.ts     # async render state
├── App.tsx
└── main.tsx
```

## Phase 2 (Planned)

- Live Monaco editor with split-pane preview
- Example gallery (dependency graph, org chart, state machine…)
- URL sharing via compressed DOT content
- PNG export via Canvas API
- Web Worker rendering for large graphs
