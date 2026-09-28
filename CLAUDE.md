# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development

This is a vanilla JS project with no build step. Run it with a local HTTPS server (required by ArcGIS):

```
http-server -S -C /Users/inge/Documents/dev/ssl/localhost.pem -K /Users/inge/Documents/dev/ssl/localhost-key.pem
```

There are no tests, linters, or package dependencies.

## Architecture

The app is a single-page ArcGIS mapping template using [Calcite Design System](https://developers.arcgis.com/calcite-design-system/) web components and the ArcGIS Maps SDK loaded from CDN via `<script type="module" src="https://js.arcgis.com/5.0/">`. ArcGIS modules are imported at runtime using the global `$arcgis.import()` — not npm imports.

**HTML is the declarative source of truth** for UI structure and Norwegian labels. Panel headings, action labels, and assistant copy live in `index.html`, not in config.

**Key files:**
- `src/config.js` — the file a template user edits: `appId`, `mapItemId`, `suggestedPrompts`. Frozen; `validateConfig()` runs from `App` constructor.
- `src/main.js` — minimal entry point: instantiate `App`, call `start()`, surface fatal errors via `NotificationService`.
- `src/App.js` — orchestrates the lifecycle: `#authenticate()` → `#initMap()` → `#initPanels()` → `#wirePortalItem()`. Owns the post-auth DOM writes (user element, navigation logo).
- `src/lib/dom.js` — `qs(selector)` (throws), `qsOptional(selector)` (returns null), and a frozen `SELECTORS` constant for every well-known DOM target.
- `src/lib/OAuth2.js` — `authenticate(appId)` returns `{ portal, userInfo, signIn, signOut }`. No DOM coupling, no module-level state. "Not signed in" is a normal branch (`userInfo: null`); other errors throw.
- `src/lib/html.js` — `element(tag, attrs?, children?)` and `div(...)` factories; `appendChildren()` exported.
- `src/components/PanelManager.js` — wires a `calcite-action-bar` to its `[data-panel-id]` siblings inside the same `calcite-shell-panel`. Validates pairings on construction; caches references; orphan actions (no matching panel) are allowed for external-link forks. Public API: `activate(id)`, `deactivate()`, `toggle(id)`, `activeId`.
- `src/components/Alert.js` — `Alert` base + `ErrorAlert`/`WarningAlert`/`InfoAlert`/`ConfirmationAlert`. `KINDS` and `ICONS` constants. Validates `title`/`message`. Sets `role="alert"` for danger, `role="status"` otherwise. `close()` method.
- `src/services/NotificationService.js` — `notify(...)`, `notifyError/Warning/Info/Success(title, message)`. Single seam for spawning toasts.
- `src/styles/main.css` — global styles, `prefers-color-scheme`, `.visually-hidden`, print rules.

**Theme:** Dark/light mode is controlled by the `calcite-mode-dark` / `calcite-mode-light` class on the `#calcite-theme` wrapper div (the source of truth). `src/styles/main.css` sets `color-scheme` from `prefers-color-scheme` so native UI (scrollbars, form controls) follows the OS preference. Calcite's own `--calcite-color-*` tokens drive component theming — don't redefine them.

**HTML structure:** `calcite-shell` > `calcite-shell-panel` (start, for map tool panels) + `calcite-shell-panel` (end, for AI assistant) + `arcgis-map`. Action bar buttons use `data-action-id` to match corresponding panels with `data-panel-id`. The `#alert-container` is an `aria-live="polite"` region.

## Conventions

- Plain vanilla JS, no JSDoc / `@ts-check`. ES modules with `type="module"`. Native browser APIs (no polyfills, no shims).
- Use `qs(SELECTORS.X)` rather than inline `document.querySelector` strings.
- Spawn alerts via `NotificationService`, not by constructing `Alert` directly in feature code.
- New panels: add the `<calcite-action data-action-id="X">` and `<calcite-panel data-panel-id="X">` to `index.html`. `PanelManager` discovers them automatically — no JS changes required.
