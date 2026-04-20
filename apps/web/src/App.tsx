import { Navbar, type NavbarItem } from "@repo/ui";
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import styles from "./App.module.scss";
import { appRoutes } from "./routes/config";
import { routes } from "./routes";
import { RestrictedRoute } from "./routes/RestrictedRoute";

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const navigationItems: NavbarItem[] = appRoutes
    .filter((route) => route.showInNav)
    .map((route) => ({
      id: route.path,
      label: route.label,
      description: route.description,
      badge: route.badge,
    }));

  return (
    <div className={styles.appShell}>
      <Navbar
        activeItemId={location.pathname}
        brand="My Turborepo"
        items={navigationItems}
        onNavigate={navigate}
      />

      <main className={styles.content}>
        <Routes>
          <Route element={<Navigate replace to={routes.quickView} />} path={routes.home} />
          {appRoutes.map((route) => (
            <Route
              element={
                route.access ? (
                  <RestrictedRoute access={route.access} fallback={route.fallback}>
                    {route.element}
                  </RestrictedRoute>
                ) : (
                  route.element
                )
              }
              key={route.path}
              path={route.path}
            />
          ))}
        </Routes>
      </main>
    </div>
  );
}

export default App;
