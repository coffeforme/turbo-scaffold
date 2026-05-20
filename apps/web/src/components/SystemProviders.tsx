import { AuthProviderSystem, AuthSessionProvider } from "@repo/auth";
import type { PropsWithChildren } from "react";
import { BrowserRouter } from "react-router-dom";
import { UploadManagerPanel, UploadManagerProvider } from "@repo/ui";
import { appConfig } from "../config/appConfig";
import { AuthIdlePrompt } from "./AuthIdlePrompt";
import { StateProvider } from "./StateProvider";

export function SystemProviders({ children }: PropsWithChildren) {
  return (
    <BrowserRouter basename={appConfig.basename}>
      <AuthProviderSystem>
        <AuthSessionProvider closeOnIdleTime idleTime={12 * 60 * 60 * 1000} idleWarningTime={5 * 60 * 1000}>
          <UploadManagerProvider mode="zustand">
            <StateProvider>{children}</StateProvider>
            <AuthIdlePrompt />
            <UploadManagerPanel viewType="minimizedView" />
          </UploadManagerProvider>
        </AuthSessionProvider>
      </AuthProviderSystem>
    </BrowserRouter>
  );
}
