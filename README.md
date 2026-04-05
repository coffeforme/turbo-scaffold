# `Turborepo` Vite starter

This is a community-maintained example. If you experience a problem, please submit a pull request with a fix. GitHub Issues will be closed.

## State Management

This project supports two state management libraries: **Redux Toolkit** and **Zustand**. You can switch between them to compare their approaches and performance characteristics.

The `@repo/state` package is now organized by implementation:

```text
packages/state/src/
  shared/    # shared RootState types, selectors, and StateManager contract
  redux/     # Redux store, slices, hooks, and ReduxStateManager
  zustand/   # Zustand store, hooks, and ZustandStateManager
  managers/  # agnostic factory/provider/hooks built on the shared contract
```

Both implementations expose the same state shape and mutation surface through the shared `StateManager` interface, so you can choose Redux or Zustand on demand without changing the consuming code contract.

### Switching Between State Managers

The application includes a toggle in the UI (top of the Home page) to switch between Redux and Zustand at runtime. This allows you to:

- Compare performance characteristics
- Test the same features with different state management approaches
- Evaluate developer experience and bundle size differences

### Redux Toolkit (Default)

**Pros:**
- Mature ecosystem with extensive middleware support
- Strong TypeScript integration
- Predictable state updates with actions/reducers
- Excellent debugging with Redux DevTools

**Usage:**
```typescript
import { useAppDispatch, useAppSelector } from '@repo/state';
import { increment } from '@repo/state';

function MyComponent() {
  const dispatch = useAppDispatch();
  const count = useAppSelector(state => state.counter.value);

  return (
    <button onClick={() => dispatch(increment())}>
      Count: {count}
    </button>
  );
}
```

### Zustand

**Pros:**
- Lightweight with minimal boilerplate
- No provider needed (global state)
- Simple API with less ceremony
- Better performance for small to medium applications

**Usage:**
```typescript
import { useZustandDispatch, useZustandSelector } from '@repo/state';

function MyComponent() {
  const dispatch = useZustandDispatch();
  const count = useZustandSelector(state => state.counter.value);

  return (
    <button onClick={() => dispatch({ type: 'counter/increment' })}>
      Count: {count}
    </button>
  );
}
```

### Direct Implementation Selection

If you want to choose an implementation explicitly, import the concrete manager or create one through the factory while still coding against the shared contract:

```typescript
import {
  ReduxStateManager,
  ZustandStateManager,
  StateManager,
  StateManagerFactory,
} from "@repo/state";

const reduxManager: StateManager = new ReduxStateManager();
const zustandManager: StateManager = new ZustandStateManager();
const dynamicManager = StateManagerFactory.create("zustand");
```

### Agnostic State Management (Recommended)

For the most flexible and implementation-agnostic approach, use the agnostic hooks exported from `@repo/state`. Components access shared state only through hooks, while the hook implementation manages API calls, configuration, and state mutation internally.

```typescript
import {
  useAgnosticCounter,
  useAgnosticContactForm,
  UseAgnosticContactFormConfig,
} from '@repo/state';

const contactConfig: UseAgnosticContactFormConfig = {
  submitContact: async (data) => {
    await api.sendContact(data);
  },
  onSuccess: () => {
    console.log('Contact submitted successfully');
  },
  onFailure: (error) => {
    console.error('Contact submission failed', error);
  },
  resetOnSuccess: true,
};

const feedbackConfig: UseAgnosticFeedbackFormConfig = {
  submitFeedback: async (data) => {
    await api.sendFeedback(data);
  },
  onSuccess: () => {
    console.log('Feedback submitted successfully');
  },
  onFailure: (error) => {
    console.error('Feedback submission failed', error);
  },
  resetOnSuccess: true,
};

function MyComponent() {
  const { value, increment } = useAgnosticCounter();
  const { formData, updateField, submitForm, submitting } = useAgnosticContactForm(contactConfig);
  const {
    formData: feedbackData,
    updateField: updateFeedbackField,
    submitForm: submitFeedback,
    submitting: feedbackSubmitting,
  } = useAgnosticFeedbackForm(feedbackConfig);

  // Component is completely unaware of Redux vs Zustand
  return (
    <div>
      <button onClick={increment}>Count: {value}</button>
      <input
        value={formData.name}
        onChange={(e) => updateField('name', e.target.value)}
      />
      <button onClick={submitForm} disabled={submitting}>
        Submit
      </button>
      <textarea
        value={feedbackData.comment}
        onChange={(e) => updateFeedbackField('comment', e.target.value)}
      />
      <button onClick={submitFeedback} disabled={feedbackSubmitting}>
        Submit Feedback
      </button>
    </div>
  );
}
```

**Benefits:**
- **Zero Coupling**: Components don't know which state management implementation is used
- **Hook-based configuration**: API behavior and mutation logic are configured at the hook layer
- **Easy Migration**: Switch implementations without changing components
- **Type Safety**: Full TypeScript support with unified interface
- **Testability**: Mock the hook behavior in tests
- **Future-Proof**: Add new state management libraries without changing component code

## Commit Conventions

This project follows [Conventional Commits](https://conventionalcommits.org/) for consistent and meaningful commit messages. See [COMMIT_CONVENTIONS.md](COMMIT_CONVENTIONS.md) for details.

### Quick Commit
After making changes, use the auto-commit feature:

```sh
git add .
pnpm run auto-commit-msg
```

Or generate a new one anytime:
```sh
pnpm run update-commit-msg
```

### VS Code Integration
Use the built-in VS Code tasks for commit message management:
- **Update Commit Message**: Generate a new commit message
- **Generate Commit Message**: View current message
- **Copy Commit Message to Clipboard**: Copy message for manual commit

The commit message automatically updates before and after each commit.

## Using this example

Run the following command:

```sh
npx create-turbo@latest -e with-vite-react
```

## What's inside?

This Turborepo includes the following packages and apps:

### Apps and Packages

- `web`: React [Vite](https://vitejs.dev) TypeScript app
- `@repo/ui`: shared UI component library used by `web`
- `@repo/eslint-config`: shared ESLint configuration package
- `@repo/typescript-config`: shared TypeScript config package
- `@repo/hooks`: shared React hook utilities package
- `@repo/math`: shared math utility package
- `@repo/state`: shared state management package
- `@repo/types`: shared type definitions package
- `@repo/api`: shared API utilities package
- `@repo/persistence`: shared persistence utilities package
- `@repo/utils`: shared utility functions package
- `@repo/infrastructure`: shared infrastructure utilities package

Each package and app is 100% [TypeScript](https://www.typescriptlang.org/).

### Utilities

This Turborepo has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting

### UI Components

The `@repo/ui` package provides a component library organized using Atomic Design principles:

#### Atoms (Basic UI Elements)
- **Button**: Basic button component
- **Rating**: Interactive star rating component (1-5 stars)

#### Molecules (Simple Components)
- **Counter**: Number display with increment functionality

#### Organisms (Complex Components)
- **Header**: Page header with title
- **FeedbackForm**: Complete feedback form with rating, category selection, and comments

#### Usage Example
```tsx
import { Button, Rating, FeedbackForm } from '@repo/ui';

// Basic components
<Button>Click me</Button>
<Rating value={3} onChange={setRating} />

// Complex organism
<FeedbackForm
  formData={feedbackData}
  updateField={updateField}
  onSubmit={handleSubmit}
  // ... other props
/>
```
