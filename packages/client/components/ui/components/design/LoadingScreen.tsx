import { Trans, useLingui } from "@lingui/solid/macro";
import { JSX, Show, createSignal, onCleanup, onMount } from "solid-js";
import { styled } from "styled-system/jsx";

import { CONFIGURATION } from "@sonm/common";
import { Button, CircularProgress, Symbol, Text } from "@sonm/ui";

/**
 * How long to wait before showing troubleshooting advice
 */
const TROUBLESHOOTING_DELAY = 10_000;

/**
 * Loading screen shown while the client connects for the first time.
 *
 * If the connection does not succeed within {@link TROUBLESHOOTING_DELAY},
 * a notice is shown to help the user diagnose their connection issues.
 */
export function LoadingScreen() {
  const { t } = useLingui();
  const [slow, setSlow] = createSignal(false);

  onMount(() => {
    const timer = setTimeout(() => setSlow(true), TROUBLESHOOTING_DELAY);
    onCleanup(() => clearTimeout(timer));
  });

  return (
    <Base>
      <Spinner>
        <CircularProgress />
      </Spinner>

      <Show when={slow()}>
        <NoticeContent
          symbol="wifi_off"
          label={t`This is taking longer than usual.`}
          title={t`You may be experiencing connection issues.`}
          url={CONFIGURATION.SUPPORT_URL}
          action={<Trans>Troubleshooting</Trans>}
        />
      </Show>
    </Base>
  );
}

/**
 * A notice that can be shown below the loading spinner
 */
function NoticeContent(props: {
  symbol: string;
  label: JSX.Element;
  title: JSX.Element;
  url?: string;
  action: JSX.Element;
}) {
  return (
    <Notice>
      <Header>
        <Impact>
          <Symbol size={28}>{props.symbol}</Symbol>
          <Text class="label" size="large">
            {props.label}
          </Text>
        </Impact>
        <Text class="title" size="medium">
          {props.title}
        </Text>
      </Header>
      <Show when={props.url}>
        <Button
          variant="text"
          onPress={() =>
            window.open(props.url, "_blank", "noopener,noreferrer")
          }
        >
          {props.action}
        </Button>
      </Show>
    </Notice>
  );
}

/**
 * Full-height container that keeps the spinner centred
 */
const Base = styled("div", {
  base: {
    position: "relative",
    display: "flex",
    flexGrow: 1,
    minHeight: 0,
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
});

/**
 * Fixed size wrapper so the spinner does not stretch inside the flex column
 */
const Spinner = styled("div", {
  base: {
    flexShrink: 0,
    width: "48px",
    height: "48px",
  },
});

/**
 * Incident notice
 */
const Notice = styled("div", {
  base: {
    position: "absolute",
    top: "calc(50% + 48px)",
    insetInline: 0,

    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "var(--gap-lg)",
    textAlign: "center",
    maxWidth: "42ch",
    marginInline: "auto",
    paddingInline: "var(--gap-lg)",
    color: "var(--md-sys-color-on-surface-variant)",
  },
});

/**
 * Impact level and title
 */
const Header = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "var(--gap-md)",
  },
});

/**
 * Current incident impact level with symbol
 */
const Impact = styled("div", {
  base: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "var(--gap-md)",
    letterSpacing: "0.05em",
    color: "var(--md-sys-color-on-surface-variant)",
  },
});
