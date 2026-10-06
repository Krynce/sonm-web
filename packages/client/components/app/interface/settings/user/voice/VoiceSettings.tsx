import { Show } from "solid-js";

import { useInstance } from "@sonm/instance";
import { Column } from "@sonm/ui";

import { ScreenShareOptions } from "./ScreenShareOptions";
import { VoiceInputOptions } from "./VoiceInputOptions";
import { VoiceProcessingOptions } from "./VoiceProcessingOptions";

/**
 * Configure voice options
 */
export function VoiceSettings() {
  const { limits } = useInstance();

  return (
    <Column gap="lg">
      <VoiceInputOptions />
      <VoiceProcessingOptions />
      <Show when={limits().video}>
        <ScreenShareOptions />
      </Show>
    </Column>
  );
}
