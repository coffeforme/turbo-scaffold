import { useEffect, useMemo, useState } from "react";
import type { ContainerWidgetControls, NavbarWidgetControls, WidgetCustomPalette } from "./widgetBar";
import {
  createWidgetThemeVariables,
  defaultWidgetContainerControls,
  defaultWidgetCustomPalette,
  defaultWidgetNavbarControls,
  type WidgetPaletteId,
  widgetPaletteOptions,
} from "./themeConfig";

function applyThemeVariables(variables: Record<`--${string}`, string>) {
  if (typeof document === "undefined") {
    return;
  }

  const targets = [document.documentElement, document.body, document.getElementById("app")].filter(
    Boolean,
  ) as HTMLElement[];

  targets.forEach((target) => {
    for (const [key, value] of Object.entries(variables)) {
      target.style.setProperty(key, value);
    }
  });
}

export function useWidgetTheme() {
  const [selectedPaletteId, setSelectedPaletteId] = useState<WidgetPaletteId>("cobalt");
  const [customPalette, setCustomPalette] = useState<WidgetCustomPalette>(defaultWidgetCustomPalette);
  const [navbarControls, setNavbarControls] = useState<NavbarWidgetControls>(defaultWidgetNavbarControls);
  const [containerControls, setContainerControls] = useState<ContainerWidgetControls>(defaultWidgetContainerControls);

  const themeVariables = useMemo(
    () => createWidgetThemeVariables(selectedPaletteId, customPalette, containerControls),
    [containerControls, customPalette, selectedPaletteId],
  );

  useEffect(() => {
    applyThemeVariables(themeVariables);
  }, [themeVariables]);

  const exportedConfig = useMemo(
    () =>
      JSON.stringify(
        {
          palette: selectedPaletteId,
          customPalette,
          navbar: navbarControls,
          containers: containerControls,
        },
        null,
        2,
      ),
    [containerControls, customPalette, navbarControls, selectedPaletteId],
  );

  return {
    paletteOptions: widgetPaletteOptions,
    selectedPaletteId,
    setSelectedPaletteId,
    customPalette,
    setCustomPalette,
    navbarControls,
    setNavbarControls,
    containerControls,
    setContainerControls,
    exportedConfig,
  };
}
