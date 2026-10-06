import { Trans } from "@lingui/solid/macro";

import { Dialog, DialogProps } from "@sonm/ui";

import { Modals } from "../types";

/**
 * Modal to notify the user they've been signed out
 * TODO: show if user is banned, etc
 */
export function SignedOutModal(
  props: DialogProps & Modals & { type: "signed_out" },
) {
  return (
    <Dialog
      show={props.show}
      onClose={props.onClose}
      title={<Trans>You've been signed out of Sonm!</Trans>}
      actions={[{ text: <Trans>OK</Trans> }]}
    >
      <></>
    </Dialog>
  );
}
