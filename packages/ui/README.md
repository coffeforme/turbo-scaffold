# `@repo/ui`

Shared design system and component library for the workspace.

## Structure

The package is organized by component depth:

- `atoms` for primitives like buttons, inputs, labels, text, select, textarea, and rating
- `molecules` for composed blocks like cards, counters, and tables
- `organisms` for larger feature-ready sections like forms, navigation, charts, and error states
- `mechanisms` for interaction-heavy system components like modal flows

## Styling

`@repo/ui` uses SCSS modules for component styles and keeps shared visual tokens in `styles/_tokens.scss` and common patterns in `styles/_mixins.scss`.

## Consuming the Package

Import from the package entrypoint or the component barrel:

```ts
import { Button, Card, Header } from "@repo/ui";
```

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
  - "Buttons, inputs, labels, text, textareas, select, rating"
  - "Cards, tables, counters"
  - "Header, navbar, feedback form, login form, error state, hierarchy table, charts"
  - "Modal and confirmation mechanisms"
  - "Shared SCSS tokens and mixins"
```
