# `@repo/typescript-config`

Shared TypeScript configuration presets for workspace packages and apps.

## Example

```json
{
  "extends": "@repo/typescript-config/vite.json",
  "include": ["src"]
}
```

## Available Presets

- `base.json` for general package defaults
- `vite.json` for Vite-based apps and browser-focused TypeScript settings

## AI Context

```yaml
package: "@repo/typescript-config"
purpose: "Shared TypeScript presets for apps and packages."
entrypoints:
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
