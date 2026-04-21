# `@repo/ui`

Shared design system and component library for the workspace.

## Structure

The package is organized by component depth:

- `atoms` for primitives like buttons, inputs, labels, text, select, textarea, and rating
- `molecules` for composed blocks like cards, counters, and tables
- `organisms` for larger feature-ready sections like forms, navigation, charts, and error states
- `mechanisms` for interaction-heavy system components like modal flows, preview/code flip containers, and the upload manager

## Styling

`@repo/ui` uses SCSS modules for component styles and keeps shared visual tokens in `styles/_tokens.scss` and common patterns in `styles/_mixins.scss`.

## Consuming the Package

Import from the package entrypoint or the component barrel:

```ts
import { Button, Card, Header } from "@repo/ui";
```

## Key Mechanisms

`@repo/ui` includes a few higher-order UI mechanisms that are meant to be reused across pages instead of reimplemented ad hoc.

- `Modal` supports `backdropMode="blur" | "transparent" | "plain"` plus `overlayOpacity` for stronger visual control.
- `ConfirmDialog` composes `Modal` and inherits the same backdrop behavior for destructive or confirm flows.
- `FlipContainer` lets a section switch between a live preview and an implementation view.
- `UploadManagerProvider` can run in `internal`, `controlled`, or `zustand` mode, which makes uploads available across the app while still allowing teams to choose their state strategy.
- `UploadManagerPanel` is the floating system view that shows tracked uploads, including where in the app the upload started.
- `UploadInput` is the reusable file-input atom that can be used directly or through the manager.

## AI Context

```yaml
package: "@repo/ui"
purpose: "Reusable design system with atoms, molecules, organisms, and mechanisms."
entrypoints:
  - "index.ts"
  - "components/index.ts"
look_here_first:
  - "styles/_tokens.scss"
  - "styles/_mixins.scss"
  - "components/atoms"
  - "components/molecules"
  - "components/organisms"
  - "components/mechanisms"
structure:
  - "atoms: primitive UI controls"
  - "molecules: composed UI building blocks"
  - "organisms: larger feature-ready UI sections"
  - "mechanisms: interaction-heavy system components"
runtime_dependencies:
  - "react"
  - "react-dom"
used_by:
  - "apps/web"
  - "apps/storybook"
capabilities:
  - "Buttons, inputs, labels, text, textareas, select, upload input, rating"
  - "Cards, tables, counters"
  - "Header, navbar, feedback form, login form, error state, hierarchy table, charts"
  - "Modal and confirmation mechanisms with blur, transparent, plain, and custom opacity backdrop support"
  - "Flip-container preview/code switching with a fixed top-right SVG toggle"
  - "Upload manager with internal, controlled, or Zustand-backed state and source metadata per upload"
  - "Shared SCSS tokens and mixins"
```
