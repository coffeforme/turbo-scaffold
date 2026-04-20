# `@repo/types`

Placeholder package for workspace-wide TypeScript domain types.

## Intended Role

Use this package when a contract needs to be shared across multiple packages without dragging runtime code along with it.

Good candidates:

- domain DTOs
- normalized app contracts
- shared API payload types
- reusable entity models

## AI Context

```yaml
package: "@repo/types"
purpose: "Central location for shared TypeScript-only domain contracts."
entrypoints: []
structure:
  - "Add shared domain models here before duplicating contracts across packages."
runtime_dependencies: []
used_by:
  - "Currently minimal usage"
capabilities:
  - "Reserved shared type location for future reusable contracts"
```
