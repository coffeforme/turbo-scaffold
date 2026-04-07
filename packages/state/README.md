## `@repo/state`

Shared state package with parallel Redux Toolkit and Zustand implementations behind one common contract.

### Structure

```text
src/
  shared/
  redux/
  zustand/
  managers/
```

### Shared Contract

Use the shared `StateManager` interface when you want the same mutations and state access regardless of implementation:

```ts
import { StateManager, ReduxStateManager, ZustandStateManager } from "@repo/state";

const reduxManager: StateManager = new ReduxStateManager();
const zustandManager: StateManager = new ZustandStateManager();
```

Or select one dynamically:

```ts
import { StateManagerFactory } from "@repo/state";

const manager = StateManagerFactory.create("redux");
```

### Install

```sh
pnpm add typescript @repo/state --filter .
```
