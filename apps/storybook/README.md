# Storybook

This app hosts the component showcase for the monorepo.

Storybook runs from `apps/storybook`, but the stories themselves live next to the shared UI components in `packages/ui`.

## Quick Start

Run Storybook from the repo root with:

```sh
pnpm --filter storybook dev
```

## Run Storybook

```sh
pnpm --filter storybook dev
```

To generate the static build:

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

Use this structure for new stories:

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

## Naming Conventions

- Component file: `myComponent.tsx`
- Story file: `myComponent.stories.tsx`
- Story title:
  - `Atoms/Button`
  - `Molecules/Counter`
  - `Organisms/FeedbackForm`

Keep the Storybook title aligned with the existing Atomic Design folders in `packages/ui/components`.

## Practical Tips

- Prefer colocated stories over central story folders.
- Start with a `Default` story first.
- Add `tags: ["autodocs"]` so Storybook docs pages are generated automatically.
- Use `args` for simple prop-driven components.
- Use a `render` function when the component needs local interaction state.
- Keep stories focused on component behavior, not app-level data fetching or routing.

## Current Examples

You can use these as references:

- `packages/ui/components/atoms/Button/button.stories.tsx`
- `packages/ui/components/atoms/Rating/rating.stories.tsx`
- `packages/ui/components/molecules/Counter/counter.stories.tsx`
- `packages/ui/components/organisms/Header/header.stories.tsx`
- `packages/ui/components/organisms/FeedbackForm/feedbackForm.stories.tsx`

## Storybook References

Official Storybook docs for enhancing stories:

- Writing stories with args:
  https://storybook.js.org/docs/writing-stories/args
- Controls and `argTypes`:
  https://storybook.js.org/docs/essentials/controls
- Interaction patterns and interactive stories:
  https://storybook.js.org/docs/writing-stories/args

These are especially useful when you want to:

- add richer controls for props
- make stories interactive without app wiring
- document multiple component states cleanly
- improve autodocs output
