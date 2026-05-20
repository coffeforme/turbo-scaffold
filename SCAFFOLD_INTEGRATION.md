# Scaffold Integration

## Purpose

This document explains how the current Turbo monorepo scaffold should be represented inside the broader scaffold tooling that already contains the React-only project structure generator.

## Related Tooling

Existing React-only scaffold source:

`S:\coffee\workspaces\code\research\react-scaffold\coffeforme\CreateProjectStructure.ps1`

That script generates a single-application React structure.

This repository is the monorepo-oriented counterpart for cases where the developer needs:

- multiple apps
- shared packages
- Storybook
- reusable auth, API, persistence, and state layers

## Recommended Scaffold Options

- `React App Scaffold`
  Purpose: single React application folder structure
  Source: `CreateProjectStructure.ps1`

- `Turbo Monorepo Scaffold`
  Purpose: package-based web application workspace
  Source: this repository template

## Installation Paths

### PowerShell

```powershell
git clone <your-template-source> my-app
Set-Location my-app
pnpm install
pnpm --filter web dev
```

### Bash

```bash
git clone <your-template-source> my-app
cd my-app
pnpm install
pnpm --filter web dev
```

## Suggested External Tool Additions

The scaffold tool directory should expose this repository as a real scaffold option, not just mention it in docs.

Recommended artifacts:

- `CreateTurboMonorepoScaffold.ps1`
- `CreateTurboMonorepoScaffold.sh`
- external scaffold README updates describing when to choose each scaffold

## AI Context

```yaml
doc: "SCAFFOLD_INTEGRATION.md"
purpose: "Explain how this repo should be exposed as a scaffold option in the external scaffold tooling."
related_tool:
  - "S:\\coffee\\workspaces\\code\\research\\react-scaffold\\coffeforme\\CreateProjectStructure.ps1"
recommended_external_artifacts:
  - "CreateTurboMonorepoScaffold.ps1"
  - "CreateTurboMonorepoScaffold.sh"
scaffold_options:
  - "React App Scaffold"
  - "Turbo Monorepo Scaffold"
```
