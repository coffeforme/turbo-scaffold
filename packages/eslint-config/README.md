# `@repo/eslint-config`

Shared linting baseline for workspace apps and packages.

## Purpose

Use this package to keep lint rules aligned across the monorepo instead of redefining TypeScript and formatting-friendly rules per project.

## Tech Highlights

- shared ESLint baseline
- TypeScript-aware linting
- Prettier-friendly configuration

## Consumed By

- lintable apps and packages across the repo

## Implementation References

- config entrypoint: `index.js`

## Usage

```js
module.exports = {
  extends: ["@repo/eslint-config"],
};
```

## AI Context

```yaml
package: "@repo/eslint-config"
purpose: "Shared linting baseline reused across apps and packages."
entrypoints:
  - "index.js"
look_here_first:
  - "index.js"
structure:
  - "index.js: shared ESLint preset"
  - "package.json"
runtime_dependencies:
  - "eslint"
  - "@typescript-eslint/eslint-plugin"
  - "@typescript-eslint/parser"
  - "eslint-config-prettier"
used_by:
  - "Workspace apps and packages with ESLint"
capabilities:
  - "Shared TypeScript lint rules"
  - "Prettier-friendly config"
```
