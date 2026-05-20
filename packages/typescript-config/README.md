# `@repo/typescript-config`

Shared TypeScript preset package for apps and packages across the workspace.

## Purpose

Use this package to keep TypeScript project settings aligned instead of copying compiler options into every `tsconfig`.

## Tech Highlights

- reusable `base.json`
- Vite-oriented `vite.json`
- low-friction `extends` usage across apps and packages

## Consumed By

- nearly every app and package in the workspace

## Implementation References

- `base.json`
- `vite.json`

## Example

```json
{
  "extends": "@repo/typescript-config/vite.json",
  "include": ["src"]
}
```

## AI Context

```yaml
package: "@repo/typescript-config"
purpose: "Shared TypeScript presets for apps and packages."
entrypoints:
  - "base.json"
  - "vite.json"
look_here_first:
  - "base.json"
  - "vite.json"
structure:
  - "JSON preset files consumed via tsconfig extends"
runtime_dependencies: []
used_by:
  - "Nearly every workspace package and app"
capabilities:
  - "Base TypeScript defaults"
  - "Vite-oriented app config"
  - "Preset reuse via extends"
```
