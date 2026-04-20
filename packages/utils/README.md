# `@repo/utils`

General-purpose shared utility package.

## Usage

This package is the fallback place for helpers that are genuinely generic and do not belong to a more specific domain package.

Prefer moving code into a focused package when the utility becomes clearly tied to auth, UI, state, API, or another domain.

## AI Context

```yaml
package: "@repo/utils"
purpose: "General reusable helpers that do not belong to a more specific domain package."
entrypoints:
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
