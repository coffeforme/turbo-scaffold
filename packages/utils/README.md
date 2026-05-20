# `@repo/utils`

General-purpose shared utility package for helpers that do not belong to a more focused domain package.

## Purpose

Use this package as the fallback home for truly generic helpers. If a helper becomes clearly tied to auth, UI, state, API, or another domain, move it there.

## Tech Highlights

- framework-agnostic utility surface
- lightweight shared dependency option
- clean place to prevent duplication before a stronger domain fit emerges

## Consumed By

- any package that needs generic helpers

## Implementation References

- `src/index.ts`

## AI Context

```yaml
package: "@repo/utils"
purpose: "General reusable helpers that do not belong to a more specific domain package."
entrypoints:
  - "src/index.ts"
look_here_first:
  - "src/index.ts"
structure:
  - "src/index.ts"
runtime_dependencies: []
used_by:
  - "Any package that needs generic helpers"
capabilities:
  - "Shared landing place for non-domain utilities"
notes:
  - "Keep this package framework-agnostic."
  - "If a helper becomes domain-specific, move it to a more focused package."
```
