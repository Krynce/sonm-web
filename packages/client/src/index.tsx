/**
 * Configure contexts and render App
 */

import { JSX, onMount } from "solid-js";
import { render } from "solid-js/web";

import { Navigate, Route, Router, useParams } from "@solidjs/router";
import { QueryClient, QueryClientProvider } from "@tanstack/solid-query";
import "material-symbols";
import "mdui/mdui.css";
import { PublicBot, PublicChannelInvite } from "sonm.js";

import FlowCheck from "@sonm/auth/src/flows/FlowCheck";
import FlowConfirmReset from "@sonm/auth/src/flows/FlowConfirmReset";
import FlowCreate from "@sonm/auth/src/flows/FlowCreate";
import FlowDeleteAccount from "@sonm/auth/src/flows/FlowDelete";
import FlowLogin from "@sonm/auth/src/flows/FlowLogin";
import FlowResend from "@sonm/auth/src/flows/FlowResend";
import FlowReset from "@sonm/auth/src/flows/FlowReset";
import FlowVerify from "@sonm/auth/src/flows/FlowVerify";
import { ClientContext, SoundContext, useClient } from "@sonm/client";
import { DeviceContext } from "@sonm/common";
import { I18nProvider } from "@sonm/i18n";
import { InstanceContext } from "@sonm/instance";
import { KeybindContext } from "@sonm/keybinds";
import { ModalContext, ModalRenderer, useModals } from "@sonm/modal";
import { VoiceContext } from "@sonm/rtc";
import { StateContext, SyncWorker, useState } from "@sonm/state";
import {
  FloatingManager,
  LoadTheme,
  SnackbarController,
  SnackbarProvider,
} from "@sonm/ui";

/* @refresh reload */
import "@sonm/ui/styles";

import AuthPage from "./Auth";
import Interface from "./Interface";
import "./index.css";
import { DevelopmentPage } from "./interface/Development";
import { Friends } from "./interface/Friends";
import { HomePage } from "./interface/Home";
import { ServerHome } from "./interface/ServerHome";
import { ChannelPage } from "./interface/channels/ChannelPage";
import "./serviceWorkerInterface";

/**
 * Redirect PWA start to the last active path
 */
function PWARedirect() {
  const state = useState();
  return <Navigate href={state.layout.getLastActivePath()} />;
}

/**
 * Open settings and redirect to last active path
 */
function SettingsRedirect() {
  const { openModal } = useModals();

  onMount(() => openModal({ type: "settings", config: "user" }));
  return <PWARedirect />;
}

/**
 * Open invite and redirect to last active path
 */
function InviteRedirect() {
  const params = useParams();
  const client = useClient();
  const { openModal, showError } = useModals();

  onMount(() => {
    if (params.code) {
      client()
        // TODO: add a helper to sonm.js for this
        .api.get(`/invites/${params.code as ""}`)
        .then((invite) => PublicChannelInvite.from(client(), invite))
        .then((invite) => openModal({ type: "invite", invite }))
        .catch(showError);
    }
  });

  return <PWARedirect />;
}

/**
 * Open bot invite and redirect to last active path
 */
function BotRedirect() {
  const params = useParams();
  const client = useClient();
  const { openModal, showError } = useModals();

  onMount(() => {
    if (params.code) {
      client()
        // TODO: add a helper to sonm.js for this
        .api.get(`/bots/${params.code as ""}/invite`)
        .then((invite) => new PublicBot(client(), invite))
        .then((invite) => openModal({ type: "add_bot", invite }))
        .catch(showError);
    }
  });

  return <PWARedirect />;
}

function MountContext(props: { children?: JSX.Element }) {
  const client = new QueryClient();

  return (
    <StateContext>
      <KeybindContext>
        <ModalContext>
          <ClientContext>
            <LoadTheme />
            <SoundContext>
              <VoiceContext>
                <QueryClientProvider client={client}>
                  {props.children}
                  <ModalRenderer />
                  <FloatingManager />
                </QueryClientProvider>
              </VoiceContext>
            </SoundContext>
            <SyncWorker />
          </ClientContext>
        </ModalContext>
      </KeybindContext>
    </StateContext>
  );
}

const routes = () => (
  <Route component={MountContext}>
    <Route path="/login" component={AuthPage as never}>
      <Route path="/delete/:token" component={FlowDeleteAccount} />
      <Route path="/check" component={FlowCheck} />
      <Route path="/create" component={FlowCreate} />
      <Route path="/create/:code" component={FlowCreate} />
      <Route path="/auth" component={FlowLogin} />
      <Route path="/resend" component={FlowResend} />
      <Route path="/reset" component={FlowReset} />
      <Route path="/verify/:token" component={FlowVerify} />
      <Route path="/reset/:token" component={FlowConfirmReset} />
      <Route path="/*" component={FlowLogin} />
    </Route>
    <Route path="/" component={Interface as never}>
      <Route path="/pwa" component={PWARedirect} />
      <Route path="/dev" component={DevelopmentPage} />
      <Route path="/settings" component={SettingsRedirect} />
      <Route path="/invite/:code" component={InviteRedirect} />
      <Route path="/bot/:code" component={BotRedirect} />
      <Route path="/friends" component={Friends} />
      <Route path="/server/:server/*">
        <Route path="/channel/:channel/*" component={ChannelPage} />
        <Route path="/*" component={ServerHome} />
      </Route>
      <Route path="/channel/:channel/*" component={ChannelPage} />
      <Route path="/*" component={HomePage} />
    </Route>
  </Route>
);

const snackbarCtrl = new SnackbarController();

render(
  () => (
    <DeviceContext>
      <I18nProvider>
        <SnackbarProvider controller={snackbarCtrl}>
          <Router>
            <Route path="/" component={InstanceContext}>
              {routes()}
            </Route>
          </Router>
          {/* <ReportBug /> */}
        </SnackbarProvider>
      </I18nProvider>
    </DeviceContext>
  ),
  document.getElementById("root") as HTMLElement,
);
