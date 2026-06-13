# `@repo/ui`

Shared design system and component library for the workspace, including interactive mechanisms that are demonstrated in both the web app and Storybook.

## Purpose

Use this package for reusable UI artifacts that should stay consistent across apps and remain easy to document, preview, and maintain.

## Tech Highlights

- Atomic Design-inspired structure
- SCSS Modules for component styling
- shared tokens and mixins under `styles`
- Storybook-backed component demos
- higher-order mechanisms for overlays, upload flows, preview/code switching, and runtime theme controls

## Consumed By

- `apps/web`
- `apps/storybook`

## Implementation References

- package entrypoints: `index.ts`, `components/index.ts`
- styling foundation: `styles/_tokens.scss`, `styles/_mixins.scss`
- implementation folders:
  - `components/atoms`
  - `components/molecules`
  - `components/organisms`
  - `components/mechanisms`
- component showcase app: `apps/storybook`
- story authoring guide: `apps/storybook/README.md`

## Structure

- `atoms` for primitives like buttons, inputs, labels, text, select, textarea, upload input, and rating
- `molecules` for composed blocks like cards, counters, and tables
- `organisms` for larger feature-ready sections like forms, navigation, charts, hierarchy tables, and error states
- `mechanisms` for interaction-heavy system components like modal flows, preview/code flip containers, and the upload manager
- `mechanisms` also includes the widget bar used to live-tune palette, container density/radius, and navbar layout in the web app shell

## Key Mechanisms

- `Modal` supports `backdropMode="blur" | "transparent" | "plain"` plus `overlayOpacity`
- `ConfirmDialog` composes `Modal` and inherits the same backdrop behavior
- `FlipContainer` switches between live preview and implementation view
- `UploadManagerProvider` supports `internal`, `controlled`, or `zustand` state strategies
- `UploadManagerPanel` supports minimized and resume views for global upload tracking
- `UploadInput` can be used directly or through the manager
- `WidgetBar` exposes palette selection, dark/Pantone/custom palettes, shared container density and radius controls, button radius, page width percentage, navbar layout controls, and a draggable shell

## Storybook

Story files live beside the components they document inside `packages/ui`.

Examples:

- `packages/ui/components/atoms/Button/button.stories.tsx`
- `packages/ui/components/mechanisms/UploadManager/uploadManager.stories.tsx`
- `packages/ui/components/mechanisms/WidgetBar/widgetBar.stories.tsx`
- `packages/ui/components/organisms/HierarchyTable/hierarchyTable.stories.tsx`

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
  - "Widget bar for runtime palette switching, dark/Pantone/custom palettes, shared container density/radius, button radius, page width percentage, navbar layout controls, and draggable positioning"
  - "Shared SCSS tokens and mixins"
storybook_refs:
  - "apps/storybook/README.md"
  - "packages/ui/components/**/*.stories.tsx"
implementation_refs:
  - "apps/web/src/pages/static/Components/Components.tsx"
  - "apps/web/src/App.tsx"
```
