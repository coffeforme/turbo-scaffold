# `@repo/eslint-config`

Shared ESLint configuration package for the workspace.

## Usage

Consume this package from an app or package-level ESLint config to keep linting rules aligned across the monorepo.

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
structure:
  - "index.js"
  - "package.json"
runtime_dependencies:
  - "eslint"
  - "@typescript-eslint/eslint-plugin"
  - "@typescript-eslint/parser"
  - "eslint-config-prettier"
used_by:
  - "Lintable apps and packages across the repo"
capabilities:
  - "Shared TypeScript lint rules"
  - "Prettier-friendly config"
```
