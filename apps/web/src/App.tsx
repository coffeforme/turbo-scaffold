import { useEffect, useRef, useState } from "react";
import {
  Navbar,
  type NavbarItem,
  useWidgetTheme,
  WidgetBar,
} from "@repo/ui";
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import styles from "./App.module.scss";
import { appRoutes } from "./routes/config";
import { routes } from "./routes";
import { RestrictedRoute } from "./routes/RestrictedRoute";

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const fixedNavbarRef = useRef<HTMLDivElement | null>(null);
  const [fixedNavbarHeight, setFixedNavbarHeight] = useState(0);
  const {
    paletteOptions,
    selectedPaletteId,
    setSelectedPaletteId,
    customPalette,
    setCustomPalette,
    navbarControls,
    setNavbarControls,
    containerControls,
    setContainerControls,
    exportedConfig,
  } = useWidgetTheme();
  const navigationItems: NavbarItem[] = appRoutes
    .filter((route) => route.showInNav)
    .map((route) => ({
      id: route.path,
      label: route.label,
      description: route.description,
      badge: route.badge,
    }));
  const isFixedNavbar = navbarControls.mode === "fixed";
  const navbarWrapStyle = isFixedNavbar
    ? ({
        top: `${navbarControls.marginTop}px`,
        left: `${navbarControls.marginX}px`,
        right: `${navbarControls.marginX}px`,
      } as const)
    : ({
        marginTop: `${navbarControls.marginTop}px`,
        marginLeft: `${navbarControls.marginX}px`,
        marginRight: `${navbarControls.marginX}px`,
      } as const);
  const navbarStyle = {
    padding: `${navbarControls.paddingY}px ${navbarControls.paddingX}px`,
  } as const;

  useEffect(() => {
    if (!isFixedNavbar || !fixedNavbarRef.current || typeof ResizeObserver === "undefined") {
      return;
    }

    const element = fixedNavbarRef.current;
    const updateHeight = () => {
      setFixedNavbarHeight(element.getBoundingClientRect().height);
    };

    updateHeight();

    const observer = new ResizeObserver(() => {
      updateHeight();
    });

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [isFixedNavbar, navigationItems.length, navbarControls.paddingX, navbarControls.paddingY]);

  const contentStyle = isFixedNavbar
    ? ({
        paddingTop: `${navbarControls.marginTop + fixedNavbarHeight + 24}px`,
      } as const)
    : undefined;

  return (
    <div className={styles.appFrame}>
      <WidgetBar
        containerControls={containerControls}
        customPalette={customPalette}
        onContainerControlChange={(field, value) =>
          setContainerControls((current) => ({
            ...current,
            [field]: value,
          }))
        }
        navbarControls={navbarControls}
        onCustomPaletteChange={(field, value) => setCustomPalette((current) => ({ ...current, [field]: value }))}
        onNavbarControlChange={(field, value) =>
          setNavbarControls((current) => ({
            ...current,
            [field]: value,
          }))
        }
        onPaletteChange={(paletteId) => setSelectedPaletteId(paletteId as typeof selectedPaletteId)}
        paletteOptions={paletteOptions}
        selectedPaletteId={selectedPaletteId}
        exportConfig={exportedConfig}
      />

      <div className={styles.appShell}>
        <div
          className={`${styles.navbarWrap} ${isFixedNavbar ? styles.navbarFixed : ""}`}
          ref={isFixedNavbar ? fixedNavbarRef : null}
          style={navbarWrapStyle}
        >
          <Navbar
            activeItemId={location.pathname}
            brand="My Turborepo"
            className={isFixedNavbar ? styles.navbarFixedInner : undefined}
            items={navigationItems}
            onNavigate={navigate}
            style={navbarStyle}
          />
        </div>

        <main className={`${styles.content} ${isFixedNavbar ? styles.contentFixed : ""}`} style={contentStyle}>
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
    </div>
  );
}

export default App;
