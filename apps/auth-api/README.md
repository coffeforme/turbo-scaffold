# `auth-api`

Sample Express API used to exercise the custom and mixed authentication providers.

## Run

Use one of these commands from the repo root:

```sh
pnpm --filter auth-api dev
pnpm run dev:auth-api
```

The error you saw happens when `pnpm --filter auth-api` is run without the script name after the filter. `--filter` only scopes the command; it does not execute anything by itself.

## Endpoints

- `POST /auth/login`
- `POST /auth/logout`
- `GET /auth/session`
- `POST /auth/refresh`

The default local URL used by the web auth demo is `http://localhost:4001`.
