import { AuthProviderSystem } from "@repo/auth";
import type { PropsWithChildren } from "react";
import { BrowserRouter } from "react-router-dom";
import { UploadManagerPanel, UploadManagerProvider } from "@repo/ui";
import { appConfig } from "../config/appConfig";
import { AuthIdlePrompt } from "./AuthIdlePrompt";
import { AuthSessionRuntimeProvider } from "./AuthSessionRuntimeProvider";
import { StateProvider } from "./StateProvider";

export function SystemProviders({ children }: PropsWithChildren) {
  return (
    <BrowserRouter basename={appConfig.basename}>
      <AuthProviderSystem>
        <AuthSessionRuntimeProvider>
          <UploadManagerProvider mode="zustand">
            <StateProvider>{children}</StateProvider>
            <AuthIdlePrompt />
            <UploadManagerPanel viewType="minimizedView" />
          </UploadManagerProvider>
        </AuthSessionRuntimeProvider>
      </AuthProviderSystem>
    </BrowserRouter>
  );
}
