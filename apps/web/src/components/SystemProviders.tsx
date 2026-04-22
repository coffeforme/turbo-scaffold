import { AuthProviderSystem, AuthSessionProvider } from "@repo/auth";
import type { PropsWithChildren } from "react";
import { BrowserRouter } from "react-router-dom";
import { UploadManagerPanel, UploadManagerProvider } from "@repo/ui";
import { appConfig } from "../config/appConfig";
import { StateProvider } from "./StateProvider";

export function SystemProviders({ children }: PropsWithChildren) {
  return (
    <BrowserRouter basename={appConfig.basename}>
      <AuthProviderSystem>
        <AuthSessionProvider>
          <UploadManagerProvider mode="zustand">
            <StateProvider>{children}</StateProvider>
            <UploadManagerPanel viewType="minimizedView" />
          </UploadManagerProvider>
        </AuthSessionProvider>
      </AuthProviderSystem>
    </BrowserRouter>
  );
}
