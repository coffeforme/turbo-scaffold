import { hasAccess, useAuthSession } from "@repo/auth";
import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

export interface RouteAccessConfig {
  effect: "redirect" | "error";
  redirectTo?: string;
  authenticated?: boolean;
  roles?: string[];
  permissions?: string[];
}

interface RestrictedRouteProps {
  access: RouteAccessConfig;
  fallback?: ReactNode;
  children: ReactNode;
}

export function RestrictedRoute({ access, fallback, children }: RestrictedRouteProps) {
  const { session } = useAuthSession();
  const meetsAuthentication = access.authenticated ? Boolean(session?.user) : true;
  const meetsAuthorization = hasAccess(session, {
    roles: access.roles,
    permissions: access.permissions,
  });
  const allowed = meetsAuthentication && meetsAuthorization;

  if (allowed) {
    return <>{children}</>;
  }

  if (access.effect === "redirect") {
    return <Navigate replace to={access.redirectTo ?? "/quick-view"} />;
  }

  return <>{fallback}</>;
}
