import { Match, Show, Switch } from "solid-js";

import { File, MessageEmbed } from "sonm.js";
import { styled } from "styled-system/jsx";

import { IconButton, Text } from "@sonm/ui/components/design";
import { Column, Row } from "@sonm/ui/components/layout";
import { humanFileSize } from "@sonm/ui/components/utils";
import { Symbol } from "@sonm/ui/components/utils/Symbol";

/**
 * Base container
 */
const Base = styled(Row, {
  base: {},
});

interface Props {
  /**
   * File information
   */
  file?: File;

  /**
   * Embed information
   */
  embed?: MessageEmbed;
}

/**
 * Information about a given attachment or embed
 */
export function FileInfo(props: Props) {
  return (
    <Base align>
      <Switch
        fallback={
          <Symbol size={24} fill>
            draft
          </Symbol>
        }
      >
        <Match
          when={
            props.file?.metadata.type === "Image" ||
            props.embed?.type === "Image"
          }
        >
          <Symbol size={24} fill>
            image
          </Symbol>
        </Match>
        <Match
          when={
            props.file?.metadata.type === "Video" ||
            props.embed?.type === "Video"
          }
        >
          <Symbol size={24} fill>
            movie
          </Symbol>
        </Match>
        <Match when={props.file?.metadata.type === "Audio"}>
          <Symbol size={24}>headphones</Symbol>
        </Match>
        <Match when={props.file?.metadata.type === "Text"}>
          <Symbol size={24} fill>
            description
          </Symbol>
        </Match>
      </Switch>
      <Column grow>
        <span>{props.file?.filename}</span>
        <Show when={props.file?.size}>
          <Text class="label" size="small">
            {humanFileSize(props.file!.size!)}
          </Text>
        </Show>
      </Column>
      <Show when={props.file}>
        <a
          target="_blank"
          href={props.file?.originalUrl}
          download={props.file?.filename}
        >
          <IconButton>
            <Symbol>download</Symbol>
          </IconButton>
        </a>
      </Show>
    </Base>
  );
}
