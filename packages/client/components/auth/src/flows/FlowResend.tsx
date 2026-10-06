import { Trans } from "@lingui/solid/macro";

import { useApi } from "@sonm/client";
import { useInstance } from "@sonm/instance";
import { A, useNavigate } from "@sonm/routing";
import { Button } from "@sonm/ui";

import { FlowTitle } from "./Flow";
import { setFlowCheckEmail } from "./FlowCheck";
import { Fields, Form } from "./Form";

/**
 * Flow for resending email verification
 */
export default function FlowResend() {
  const api = useApi();
  const navigate = useNavigate();
  const { config } = useInstance();

  /**
   * Resend email verification
   * @param data Form Data
   */
  async function resend(data: FormData) {
    const email = data.get("email") as string;
    const captcha = data.get("captcha") as string;

    await api.post("/auth/account/reverify", {
      email,
      captcha,
    });

    setFlowCheckEmail(email);
    navigate("/login/check", { replace: true });
  }

  return (
    <>
      <FlowTitle
        subtitle={
          <Trans>Enter your email and we'll send you a fresh link.</Trans>
        }
      >
        <Trans>Resend verification</Trans>
      </FlowTitle>
      <Form onSubmit={resend} captcha={config.features.captcha.key}>
        <Fields fields={["email"]} />
        <Button type="submit" size="md">
          <Trans>Resend</Trans>
        </Button>
      </Form>
      <A href="/login/auth">
        <Button variant="text">
          <Trans>Go back to login</Trans>
        </Button>
      </A>
    </>
  );
}
