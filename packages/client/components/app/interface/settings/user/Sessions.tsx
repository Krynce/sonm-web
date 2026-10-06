import { Symbol } from "@sonm/ui/components/utils/Symbol";
import {
  Accessor,
  For,
  Match,
  Show,
  Switch,
  createMemo,
  onMount,
} from "solid-js";

import { Trans } from "@lingui/solid/macro";
import { Session } from "sonm.js";
import { styled } from "styled-system/jsx";

import { useClient } from "@sonm/client";
import { useModals } from "@sonm/modal";
import {
  CategoryButton,
  CircularProgress,
  Column,
  Time,
  iconSize,
} from "@sonm/ui";

import MdLogout from "@material-design-icons/svg/outlined/logout.svg?component-solid";

/**
 * Sessions
 */
export function Sessions() {
  const client = useClient();
  onMount(() => client().sessions.fetch());

  /**
   * Sort the other sessions by created date
   */
  const otherSessions = createMemo(() =>
    client()
      .sessions.filter((session) => !session.current)
      .sort((a, b) => +b.createdAt - +a.createdAt),
  );

  return (
    <Column gap="lg">
      <Switch fallback={<CircularProgress />}>
        <Match when={client().sessions.size()}>
          <ManageCurrentSession otherSessions={otherSessions} />
          <ListOtherSessions otherSessions={otherSessions} />
        </Match>
      </Switch>
    </Column>
  );
}

/**
 * Manage user's current session
 */
function ManageCurrentSession(props: { otherSessions: Accessor<Session[]> }) {
  const client = useClient();
  const { openModal } = useModals();

  /**
   * Resolve current session
   */
  const currentSession = () => client().sessions.get(client().sessionId!);

  return (
    <CategoryButton.Group>
      <CategoryButton.Collapse
        title={<Trans>Current Session</Trans>}
        description={currentSession()?.name}
        icon={<SessionIcon session={currentSession()} />}
      >
        <CategoryButton
          icon="blank"
          action="chevron"
          onClick={() =>
            currentSession() &&
            openModal({
              type: "rename_session",
              session: currentSession()!,
            })
          }
        >
          <Trans>Rename</Trans>
        </CategoryButton>
      </CategoryButton.Collapse>
      {/* <CategoryButton
        action="chevron"
        icon={
          <MdAutoMode
            {...iconSize(24)}
            fill="var(--md-sys-color-error)"
          />
        }
        description={Keeps your last sessions active and automatically logs you out of other ones"}
      >
        Keep Last Active Sessions
      </CategoryButton> */}
      <Show when={props.otherSessions().length}>
        <CategoryButton
          action="chevron"
          onClick={() =>
            openModal({
              type: "sign_out_sessions",
              client: client(),
            })
          }
          icon={<MdLogout {...iconSize(24)} fill="var(--md-sys-color-error)" />}
          description={
            <Trans>Logs you out of all sessions except this device.</Trans>
          }
        >
          <Trans>Log Out Other Sessions</Trans>
        </CategoryButton>
      </Show>
    </CategoryButton.Group>
  );
}

/**
 * List other logged in sessions
 */
function ListOtherSessions(props: { otherSessions: Accessor<Session[]> }) {
  const { openModal, mfaFlow } = useModals();
  const client = useClient();

  return (
    <Show when={props.otherSessions().length}>
      <Column>
        <CategoryButton.Group>
          <For each={props.otherSessions()}>
            {(session) => (
              <CategoryButton.Collapse
                icon={<SessionIcon session={session} />}
                title={<Capitalise>{session.name}</Capitalise>}
                description={
                  <Trans>
                    Created <Time value={session.createdAt} format="relative" />
                  </Trans>
                }
              >
                <CategoryButton
                  icon="blank"
                  action="chevron"
                  onClick={() =>
                    openModal({
                      type: "rename_session",
                      session,
                    })
                  }
                >
                  <Trans>Rename</Trans>
                </CategoryButton>
                <CategoryButton
                  icon="blank"
                  action="chevron"
                  onClick={() => {
                    (async () => {
                      const mfa = await client().account.mfa();
                      const ticket = await mfaFlow(mfa as never);
                      session.delete(ticket!);
                    })();
                  }}
                >
                  <Trans>Log Out</Trans>
                </CategoryButton>
              </CategoryButton.Collapse>
            )}
          </For>
        </CategoryButton.Group>
      </Column>
    </Show>
  );
}

/**
 * Capitalize session titles
 */
const Capitalise = styled("div", {
  base: {
    textTransform: "capitalize",
  },
});

/**
 * Show icon for session
 */
function SessionIcon(props: { session?: Session }) {
  return (
    <Switch fallback={<Symbol size={22}>question_mark</Symbol>}>
      <Match when={/linux/i.test(props.session?.name ?? "")}>
        <Symbol size={22}>terminal</Symbol>
      </Match>
      <Match when={/windows/i.test(props.session?.name ?? "")}>
        <Symbol size={22}>desktop_windows</Symbol>
      </Match>
      <Match when={/android/i.test(props.session?.name ?? "")}>
        <Symbol size={22}>android</Symbol>
      </Match>
      <Match when={/mac.*os|i(Pad)?os/i.test(props.session?.name ?? "")}>
        <Symbol size={22}>laptop_mac</Symbol>
      </Match>
    </Switch>
  );
}
