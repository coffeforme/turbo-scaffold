# Storybook

Dedicated UI showcase app for the monorepo. It runs separately from the main web app while loading stories colocated with artifacts in `packages/ui`.

## Purpose

Use Storybook for onboarding, component discovery, isolated UI review, and maintenance of shared artifacts without needing to boot full application flows.

## Tech Highlights

- Storybook app hosted in `apps/storybook`
- stories colocated with `@repo/ui` components
- autodocs-friendly story structure
- supports atoms, molecules, organisms, and mechanisms

## Consumed By

- `packages/ui`
- developers working on shared UI artifacts

## Implementation References

- Storybook app config: `apps/storybook/.storybook`
- UI artifact source: `packages/ui/components`
- package docs: `packages/ui/README.md`

## Quick Start

Run Storybook from the repo root with:

```sh
pnpm --filter storybook dev
```

Build the static version with:

```sh
pnpm --filter storybook build
```

## Where To Add Stories

Add new stories beside the component they document inside `packages/ui`.

Examples:

```text
packages/ui/components/atoms/Button/button.tsx
packages/ui/components/atoms/Button/button.stories.tsx

packages/ui/components/organisms/FeedbackForm/feedbackForm.tsx
packages/ui/components/organisms/FeedbackForm/feedbackForm.stories.tsx
```

Storybook is configured to load:

```text
packages/ui/**/*.stories.ts
packages/ui/**/*.stories.tsx
```

## Story File Pattern

```tsx
import type { Meta, StoryObj } from "@storybook/react";
import { MyComponent } from "./myComponent";

const meta = {
  title: "Category/MyComponent",
  component: MyComponent,
  tags: ["autodocs"],
} satisfies Meta<typeof MyComponent>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
```

## References

- Args:
  https://storybook.js.org/docs/writing-stories/args
- Controls and `argTypes`:
  https://storybook.js.org/docs/essentials/controls
- Interaction patterns:
  https://storybook.js.org/docs/writing-stories/args

## AI Context

```yaml
app: "storybook"
purpose: "Dedicated UI showcase app loading colocated stories from packages/ui."
entrypoints:
  - ".storybook/main.ts"
  - ".storybook/preview.ts"
look_here_first:
  - ".storybook"
  - "../../packages/ui/components"
used_by:
  - "packages/ui"
  - "Developers onboarding into the design system"
capabilities:
  - "Local component showcase"
  - "Static Storybook build"
  - "Autodocs-ready artifact documentation"
  - "Colocated stories beside implementation files"
integration_refs:
  - "packages/ui/README.md"
  - "packages/ui/components/**/*.stories.tsx"
```
