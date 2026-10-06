# sonm.js

Reactive (Solid.js signals) client library for the Sonm API. Forked from stoat.js (MIT).

```ts
import { Client } from "sonm.js";

const client = new Client({ baseURL: "https://sonm.example/api" });
client.on("ready", () => console.info(`Logged in as ${client.user!.username}`));
client.loginBot("...");
```

Raw API types are re-exported as `API` (`import { API } from "sonm.js"`).
