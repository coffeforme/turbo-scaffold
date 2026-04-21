import { AuthProviderSystem, AuthSessionProvider } from "@repo/auth";
import type { PropsWithChildren } from "react";
import { BrowserRouter } from "react-router-dom";
import { UploadManagerPanel, UploadManagerProvider } from "@repo/ui";
import { StateProvider } from "./StateProvider";

export function SystemProviders({ children }: PropsWithChildren) {
  return (
    <BrowserRouter>
      <AuthProviderSystem>
        <AuthSessionProvider>
          <UploadManagerProvider mode="zustand">
            <StateProvider>{children}</StateProvider>
            <UploadManagerPanel />
          </UploadManagerProvider>
        </AuthSessionProvider>
      </AuthProviderSystem>
    </BrowserRouter>
  );
}
