# `@repo/math`

Small shared utility package for math helpers.

## Current Scope

This package is intentionally tiny right now. It is a good place for framework-agnostic math helpers that can be reused without pulling in app or UI concerns.

## AI Context

```yaml
package: "@repo/math"
purpose: "Tiny framework-agnostic math helpers."
entrypoints:
  - "src/add.ts"
  - "src/subtract.ts"
structure:
  - "src/add.ts"
  - "src/subtract.ts"
runtime_dependencies: []
used_by:
  - "apps/web"
capabilities:
  - "Addition helper"
  - "Subtraction helper"
```
