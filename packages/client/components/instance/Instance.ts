import { Accessor, createMemo, createSignal } from "solid-js";

import { Client, UserLimits } from "sonm.js";

export default class Instance {
  readonly origin = location.origin;

  readonly apiUrl: string;
  readonly mediaUrl: string;
  readonly proxyUrl: string;

  #cli;
  #setCli;
  #firstInit = true;
  readonly config;

  //Instead of these, use the reactive limits accessor below when possible
  readonly globalLimits;
  readonly baseLimits;

  /** Current enforced limits based on user type */
  readonly limits!: Accessor<UserLimits>;

  constructor(apiUrl: string, cli: Client) {
    const apiCfg = cli.configuration!;
    const [getCli, setCli] = createSignal(cli);
    this.#cli = getCli;
    this.#setCli = setCli;

    //Endpoints
    this.apiUrl = apiUrl;
    this.mediaUrl = apiCfg.features.files.url;
    this.proxyUrl = apiCfg.features.embeds.url;

    //Features
    this.config = apiCfg;
    this.globalLimits = apiCfg.features.limits.global;
    this.baseLimits = apiCfg.features.limits.new_user;
  }

  /** Note: This is slightly risky- If you import with const braces, eg. `const { client } = useInstance()`,
   * it won't be reactive. `useClient()` is preferred to avoid ambiguity. */
  get client(): Client {
    return this.#cli();
  }

  /** Initialize reactive vars; must be called in reactive scope */
  _init() {
    //@ts-expect-error set readonly
    this.limits = createMemo(() => this.client.limits ?? this.baseLimits);
  }

  /** Absolute URL for an app path */
  href(path: string) {
    return this.origin + path;
  }

  /** Create a new client, disposing the old one */
  newClient() {
    //Reuse initial client for first login only
    if (this.#firstInit) {
      this.#firstInit = false;
      return this.client;
    }

    this.client.events.removeAllListeners();
    this.client.removeAllListeners();
    this.client.events.disconnect();

    this.#setCli(_newClient(this.apiUrl));
    return this.client;
  }
}

export function _newClient(apiUrl: string) {
  const cli = new Client({
    baseURL: apiUrl,
    autoReconnect: false,
    syncUnreads: true,
    debug: import.meta.env.DEV,
  });

  // start fetching config right away; connect() needs it
  cli.initConfig();
  return cli;
}
