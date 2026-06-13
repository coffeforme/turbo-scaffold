import type { ReactNode } from "react";
import About from "../pages/static/About";
import AuthDemo from "../pages/static/AuthDemo/AuthDemo";
import ComponentsPage from "../pages/static/Components/Components";
import Dashboard, { DashboardAccessFallback } from "../pages/authenticated/Dashboard";
import Home from "../pages/static/Home/Home";
import TodosPage from "../pages/static/Todos/Todos";
import Profile from "../pages/authenticated/Profile";
import { routes } from "./index";
import type { RouteAccessConfig } from "./RestrictedRoute";

export interface AppRouteDefinition {
  path: string;
  label: string;
  description?: string;
  badge?: string;
  element: ReactNode;
  showInNav?: boolean;
  access?: RouteAccessConfig;
  fallback?: ReactNode;
}

export const appRoutes: AppRouteDefinition[] = [
  {
    path: routes.quickView,
    label: "Quick View",
    description: "Home dashboard",
    element: <Home />,
    showInNav: true,
  },
  {
    path: routes.authDemo,
    label: "Login Demo",
    description: "Azure, Firebase, API",
    element: <AuthDemo />,
    showInNav: true,
  },
  {
    path: routes.components,
    label: "Components",
    description: "Atoms to mechanisms",
    element: <ComponentsPage />,
    showInNav: true,
  },
  {
    path: routes.todos,
    label: "TODOs",
    description: "ViewModel + persistence",
    element: <TodosPage />,
    showInNav: true,
  },
  {
    path: routes.about,
    label: "About",
    description: "Workspace overview",
    element: <About />,
    showInNav: true,
  },
  {
    path: routes.dashboard,
    label: "Dashboard",
    description: "Authenticated sample",
    badge: "Restricted",
    element: <Dashboard />,
    showInNav: true,
    access: {
      effect: "error",
      permissions: ["view"],
    },
    fallback: <DashboardAccessFallback />,
  },
  {
    path: routes.profile,
    label: "Profile",
    description: "User summary",
    badge: "Restricted",
    element: <Profile />,
    showInNav: true,
    access: {
      effect: "redirect",
      authenticated: true,
      redirectTo: routes.quickView,
    },
    fallback: <section>Redirecting to Quick View...</section>,
  },
];
