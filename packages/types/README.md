# `@repo/types`

Shared TypeScript contract package reserved for cross-package domain models and DTOs.

## Purpose

Use this package when a type must be shared across multiple packages without pulling runtime code into the dependency graph.

## Tech Highlights

- TypeScript-only contracts
- zero runtime dependency
- clean place for shared domain DTOs and entity models

## Consumed By

- currently minimal usage
- intended for broad workspace reuse as shared contracts grow

## Implementation References

- add shared domain models directly under `src` when they become cross-package concerns

## AI Context

```yaml
package: "@repo/types"
purpose: "Central location for shared TypeScript-only domain contracts."
entrypoints: []
look_here_first:
  - "src"
structure:
  - "Add shared domain models here before duplicating contracts across packages."
runtime_dependencies: []
used_by:
  - "Currently minimal usage"
capabilities:
  - "Reserved shared type location for future reusable contracts"
```
