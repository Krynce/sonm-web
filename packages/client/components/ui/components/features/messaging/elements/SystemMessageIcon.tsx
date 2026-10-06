import { Symbol } from "@sonm/ui/components/utils/Symbol";
import { Match, Switch } from "solid-js";

import { SystemMessage } from "sonm.js";
import { styled } from "styled-system/jsx";

import { useTime } from "@sonm/i18n";
import { Tooltip } from "@sonm/ui/components/floating";
import { Time, formatTime } from "@sonm/ui/components/utils";

/**
 * System Message Icon
 */
export function SystemMessageIcon(props: {
  createdAt: Date;
  isServer: boolean;
  systemMessage: SystemMessage;
}) {
  const dayjs = useTime();

  return (
    <Base type={props.systemMessage.type}>
      <Tooltip
        content={() => <Time format="relative" value={props.createdAt} />}
        aria={
          formatTime(dayjs, {
            format: "relative",
            value: props.createdAt,
          }) as string
        }
        placement="top"
      >
        <Switch
          fallback={
            <Symbol size={16} fill>
              info
            </Symbol>
          }
        >
          <Match when={props.systemMessage.type === "user_added"}>
            <Symbol size={16}>add</Symbol>
          </Match>
          <Match
            when={props.systemMessage.type === "user_left" && !props.isServer}
          >
            <Symbol size={16}>remove</Symbol>
          </Match>
          <Match when={props.systemMessage.type === "user_remove"}>
            <Symbol size={16}>close</Symbol>
          </Match>
          <Match when={props.systemMessage.type === "user_kicked"}>
            <Symbol size={16} fill>
              cancel
            </Symbol>
          </Match>
          <Match when={props.systemMessage.type === "user_banned"}>
            <Symbol size={16} fill>
              remove_moderator
            </Symbol>
          </Match>
          <Match when={props.systemMessage.type === "user_joined"}>
            <Symbol size={16}>arrow_forward</Symbol>
          </Match>
          <Match
            when={props.systemMessage.type === "user_left" && props.isServer}
          >
            <Symbol size={16}>arrow_back</Symbol>
          </Match>
          <Match when={props.systemMessage.type === "channel_renamed"}>
            <Symbol size={16} fill>
              sell
            </Symbol>
          </Match>
          <Match
            when={props.systemMessage.type === "channel_description_changed"}
          >
            <Symbol size={16}>format_align_left</Symbol>
          </Match>
          <Match when={props.systemMessage.type === "channel_icon_changed"}>
            <Symbol size={16} fill>
              image
            </Symbol>
          </Match>
          <Match
            when={props.systemMessage.type === "channel_ownership_changed"}
          >
            <Symbol size={16} fill>
              key
            </Symbol>
          </Match>
          <Match
            when={
              props.systemMessage.type === "message_pinned" ||
              props.systemMessage.type === "message_unpinned"
            }
          >
            <Symbol size={16}>push_pin</Symbol>
          </Match>
          <Match when={props.systemMessage.type === "call_started"}>
            <Symbol size={16}>call</Symbol>
          </Match>
        </Switch>
      </Tooltip>
    </Base>
  );
}

const Base = styled("div", {
  base: {
    width: "62px",
    display: "grid",
    placeItems: "center",
  },
  variants: {
    type: {
      user_added: {
        color: "var(--md-sys-color-primary)",
      },
      user_joined: {
        color: "var(--md-sys-color-primary)",
      },
      channel_ownership_changed: {
        color: "var(--md-sys-color-primary)",
      },
      user_left: {
        color: "var(--md-sys-color-error)",
      },
      user_kicked: {
        color: "var(--md-sys-color-error)",
      },
      user_banned: {
        color: "var(--md-sys-color-error)",
      },
      text: {
        color: "var(--md-sys-color-primary)",
      },
      user_remove: {
        color: "var(--md-sys-color-primary)",
      },
      channel_renamed: {
        color: "var(--md-sys-color-primary)",
      },
      channel_description_changed: {
        color: "var(--md-sys-color-primary)",
      },
      channel_icon_changed: {
        color: "var(--md-sys-color-primary)",
      },
      message_pinned: {
        color: "var(--md-sys-color-primary)",
      },
      message_unpinned: {
        color: "var(--md-sys-color-primary)",
      },
      call_started: {
        color: "var(--md-sys-color-primary)",
      },
    },
  },
});
