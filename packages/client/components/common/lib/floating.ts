import { Accessor, createEffect, createSignal, onCleanup } from "solid-js";

import {
  ComputePositionConfig,
  ComputePositionReturn,
  ReferenceElement,
  computePosition,
} from "@floating-ui/dom";

/**
 * Reactively position `floating` next to `reference`.
 * Replaces solid-floating-ui 0.3 (MIT), whose 1.x is an unrelated API.
 */
export function useFloating(
  reference: Accessor<ReferenceElement | undefined | null>,
  floating: Accessor<HTMLElement | undefined | null>,
  options: Partial<ComputePositionConfig> & {
    whileElementsMounted?: (
      reference: ReferenceElement,
      floating: HTMLElement,
      update: () => void,
    ) => () => void;
  } = {},
) {
  const [data, setData] = createSignal<
    Pick<ComputePositionReturn, "strategy"> & {
      x: number | null;
      y: number | null;
    }
  >({ x: null, y: null, strategy: options.strategy ?? "absolute" });

  createEffect(() => {
    const ref = reference();
    const el = floating();
    if (!ref || !el) return;

    let stale = false;
    onCleanup(() => (stale = true));

    const update = () =>
      computePosition(ref, el, options).then((pos) => !stale && setData(pos));

    if (options.whileElementsMounted) {
      onCleanup(options.whileElementsMounted(ref, el, update));
    } else {
      update();
    }
  });

  return {
    get x() {
      return data().x;
    },
    get y() {
      return data().y;
    },
    get strategy() {
      return data().strategy;
    },
  };
}
