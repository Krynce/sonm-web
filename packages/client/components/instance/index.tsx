import { useLingui } from "@lingui/solid/macro";
import {
  createContext,
  createMemo,
  createSignal,
  JSXElement,
  Show,
  useContext,
} from "solid-js";
import { Dynamic } from "solid-js/web";

import { CONFIGURATION } from "@sonm/common";
import { LoadingScreen, useSnackbar } from "@sonm/ui";

import Instance, { _newClient } from "./Instance";

const instanceContext = createContext<Instance>();

export function InstanceContext(props: { children?: JSXElement }) {
  const snackbar = useSnackbar();
  const { t } = useLingui();

  const [inst, setInst] = createSignal<Instance>();

  (async () => {
    try {
      const cli = _newClient(CONFIGURATION.DEFAULT_API_URL);
      await cli.initConfig();
      setInst(new Instance(CONFIGURATION.DEFAULT_API_URL, cli));
    } catch (e) {
      console.error(e);
      const api = CONFIGURATION.DEFAULT_API_URL;
      const reason =
        (e as Error).message === "Failed to fetch"
          ? t`Couldn't fetch server configuration from ${api}.`
          : e;
      snackbar.show({
        message: t`Oops, something went wrong! ${reason}`,
        placement: "bottom",
        closeable: true,
        autoCloseDelay: 30000,
      });
    }
  })();

  //Finish init in reactive scope
  const instInit = createMemo(() => {
    const i = inst();
    if (i) i._init();
    return i;
  });

  return (
    <Show when={instInit()} fallback={<LoadingScreen />}>
      <Dynamic component={instanceContext.Provider} value={instInit()}>
        {props.children}
      </Dynamic>
    </Show>
  );
}

export const useInstance = () => useContext(instanceContext)!;
