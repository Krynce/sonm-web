# sonm-api

Types and a typed request builder for the Sonm REST API.

- `src/index.ts` is hand-written (the `API` client).
- `src/{schema,routes,params,types}.ts` are generated from `OpenAPI.json`:

```sh
curl http://localhost:14702/openapi.json > OpenAPI.json
pnpm --filter sonm-api generate
```

Generator adapted from [@insertish/oapi](https://github.com/insertish/oapi) (MIT).
