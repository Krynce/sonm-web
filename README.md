# Sonm Web

Web client for Sonm. Solid.js + Vite, forked from Stoat for Web (AGPL-3.0).

## Packages

| Package | What |
|---|---|
| `packages/client` | The web app |
| `packages/sonm.js` | Reactive client SDK (forked from stoat.js, MIT) |
| `packages/sonm-api` | API types and request builder, generated from the backend's OpenAPI (MIT) |
| `packages/solid-livekit-components` | LiveKit bindings for voice/video (MIT) |

## Development

Needs Node 24+ and pnpm 11 (`mise install` sets both up), plus a running `sonm-backend`.

```sh
pnpm install
mise build:deps       # builds sonm-api, sonm.js, livekit components, i18n catalogs
mise dev              # vite dev server
mise build && mise start   # production build + preview
```

Without mise:

```sh
pnpm --filter sonm-api build
pnpm --filter sonm.js build
pnpm --filter solid-livekit-components build
pnpm --filter client exec lingui compile --typescript
pnpm --filter client exec vite --host
```

Checks: `mise build:check` (tsc), `mise test:unit`, `mise lint`, `mise format`, `mise lingui:check`.

## Configuration

Set in `packages/client/.env` (see `.env.example`) or, for the Docker image, as container env vars:

| Variable | Default | |
|---|---|---|
| `VITE_API_URL` | `<origin>/api` | Sonm API base URL |
| `VITE_SUPPORT_URL` | none | Help link on login / loading screens |
| `VITE_SOURCE_URL` | this repo | "Source code" link (AGPL) |
| `VITE_EMOJI_URL` | upstream CDN | Unicode emoji packs |

Everything else (files, embeds, GIFs, gateway, legal links) comes from the API's `GET /`.

## API types

After changing the backend API:

```sh
curl http://localhost:14702/openapi.json > packages/sonm-api/OpenAPI.json
pnpm --filter sonm-api generate
```

## Docker

```sh
docker build -t sonm-web .
docker run -p 5000:5000 -e VITE_API_URL=https://sonm.example/api sonm-web
```
