import type { ContainerWidgetControls, NavbarWidgetControls, WidgetCustomPalette, WidgetPaletteOption } from "./widgetBar";

export type WidgetPaletteId =
  | "lagoon"
  | "ember"
  | "cobalt"
  | "midnight"
  | "pantone-classic-blue"
  | "pantone-living-coral"
  | "custom";

type PaletteDefinition = WidgetCustomPalette;

export const widgetPaletteOptions: WidgetPaletteOption[] = [
  {
    id: "lagoon",
    label: "Lagoon",
    description: "Teal primary, amber accent, airy surfaces.",
    swatches: ["#0f766e", "#115e59", "#f59e0b", "#f5f7fb"],
  },
  {
    id: "ember",
    label: "Ember",
    description: "Burnt orange energy with warm dark ink.",
    swatches: ["#c2410c", "#9a3412", "#7c3aed", "#f9ede3"],
  },
  {
    id: "cobalt",
    label: "Cobalt",
    description: "Sharp blue primary with electric contrast.",
    swatches: ["#2563eb", "#1d4ed8", "#06b6d4", "#eaf2ff"],
  },
  {
    id: "midnight",
    label: "Midnight",
    description: "Dark mode palette with cool surfaces and bright cyan contrast.",
    swatches: ["#60a5fa", "#38bdf8", "#1e293b", "#020617"],
  },
  {
    id: "pantone-classic-blue",
    label: "Pantone Classic Blue",
    description: "Inspired by Pantone 19-4052, balanced with warm neutrals.",
    swatches: ["#34568b", "#1f3a68", "#d7a44d", "#f3f0ea"],
  },
  {
    id: "pantone-living-coral",
    label: "Pantone Living Coral",
    description: "Inspired by Pantone 16-1546 with deep teal support tones.",
    swatches: ["#ff6f61", "#d95d52", "#227c70", "#fff4ef"],
  },
  {
    id: "custom",
    label: "Custom",
    description: "Use your own palette values.",
    swatches: ["#0f766e", "#f59e0b", "#132238", "#f5f7fb"],
  },
];

export const widgetPalettePresets: Record<Exclude<WidgetPaletteId, "custom">, PaletteDefinition> = {
  lagoon: {
    primary: "#0f766e",
    primaryStrong: "#115e59",
    accent: "#f59e0b",
    ink: "#132238",
    slate: "#5a6a85",
    surface: "#ffffff",
    page: "#f5f7fb",
  },
  ember: {
    primary: "#c2410c",
    primaryStrong: "#9a3412",
    accent: "#7c3aed",
    ink: "#2b211b",
    slate: "#6c5a4d",
    surface: "#fff8f3",
    page: "#f9ede3",
  },
  cobalt: {
    primary: "#2563eb",
    primaryStrong: "#1d4ed8",
    accent: "#06b6d4",
    ink: "#11243f",
    slate: "#58708f",
    surface: "#f8fbff",
    page: "#eaf2ff",
  },
  midnight: {
    primary: "#60a5fa",
    primaryStrong: "#38bdf8",
    accent: "#f59e0b",
    ink: "#e2e8f0",
    slate: "#94a3b8",
    surface: "#0f172a",
    page: "#020617",
  },
  "pantone-classic-blue": {
    primary: "#34568b",
    primaryStrong: "#1f3a68",
    accent: "#d7a44d",
    ink: "#1f2937",
    slate: "#667085",
    surface: "#fffdf9",
    page: "#f3f0ea",
  },
  "pantone-living-coral": {
    primary: "#ff6f61",
    primaryStrong: "#d95d52",
    accent: "#227c70",
    ink: "#2d1f1d",
    slate: "#74605a",
    surface: "#fffaf7",
    page: "#fff4ef",
  },
};

export const defaultWidgetCustomPalette: WidgetCustomPalette = {
  primary: "#0f766e",
  primaryStrong: "#115e59",
  accent: "#f59e0b",
  ink: "#132238",
  slate: "#5a6a85",
  surface: "#ffffff",
  page: "#f5f7fb",
};

export const defaultWidgetNavbarControls: NavbarWidgetControls = {
  mode: "fixed",
  marginTop: 0,
  marginX: 0,
  paddingY: 16,
  paddingX: 20,
};

export const defaultWidgetContainerControls: ContainerWidgetControls = {
  radius: 3,
  buttonRadius: 8,
  contentWidth: 75,
  mode: "stretch",
};

function hexToRgb(hex: string) {
  const normalized = hex.replace("#", "");
  const safe = normalized.length === 3 ? normalized.split("").map((part) => `${part}${part}`).join("") : normalized;
  const parsed = Number.parseInt(safe, 16);

  return {
    r: (parsed >> 16) & 255,
    g: (parsed >> 8) & 255,
    b: parsed & 255,
  };
}

function mixHex(colorA: string, colorB: string, ratio: number) {
  const a = hexToRgb(colorA);
  const b = hexToRgb(colorB);
  const mix = (start: number, end: number) => Math.round(start + (end - start) * ratio);

  return `rgb(${mix(a.r, b.r)}, ${mix(a.g, b.g)}, ${mix(a.b, b.b)})`;
}

function rgbaFromHex(hex: string, alpha: number) {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function clampContentWidthPercent(value: number) {
  return Math.min(Math.max(value, 60), 100);
}

export function resolveWidgetPalette(
  selectedPaletteId: WidgetPaletteId,
  customPalette: WidgetCustomPalette,
) {
  return selectedPaletteId === "custom" ? customPalette : widgetPalettePresets[selectedPaletteId];
}

export function createWidgetThemeVariables(
  selectedPaletteId: WidgetPaletteId,
  customPalette: WidgetCustomPalette,
  containerControls: ContainerWidgetControls,
) {
  const palette = resolveWidgetPalette(selectedPaletteId, customPalette);
  const isDarkPalette = selectedPaletteId === "midnight";
  const isStretchContainers = containerControls.mode === "stretch";
  const contentWidthPercent = clampContentWidthPercent(containerControls.contentWidth);

  return {
    "--ui-color-primary": palette.primary,
    "--ui-color-primary-strong": palette.primaryStrong,
    "--ui-color-primary-soft": isDarkPalette ? mixHex(palette.primary, palette.page, 0.72) : mixHex(palette.primary, "#ffffff", 0.82),
    "--ui-color-primary-shadow": rgbaFromHex(palette.primary, 0.75),
    "--ui-color-primary-border-soft": rgbaFromHex(palette.primary, 0.24),
    "--ui-color-primary-border-medium": rgbaFromHex(palette.primary, 0.28),
    "--ui-color-primary-border-strong": rgbaFromHex(palette.primary, 0.5),
    "--ui-color-focus-ring": rgbaFromHex(palette.primary, 0.22),
    "--ui-color-accent": palette.accent,
    "--ui-color-ink": palette.ink,
    "--ui-color-slate": palette.slate,
    "--ui-color-surface": palette.surface,
    "--ui-color-surface-soft": isDarkPalette ? mixHex(palette.surface, "#ffffff", 0.06) : mixHex(palette.surface, "#0f172a", 0.03),
    "--ui-color-border": isDarkPalette ? rgbaFromHex(palette.slate, 0.28) : mixHex(palette.slate, "#ffffff", 0.7),
    "--ui-color-shadow": isDarkPalette ? rgbaFromHex("#000000", 0.48) : rgbaFromHex(palette.ink, 0.16),
    "--ui-page-top": isDarkPalette ? mixHex(palette.page, palette.primary, 0.18) : mixHex(palette.page, palette.primary, 0.08),
    "--ui-page-bottom": isDarkPalette ? mixHex(palette.page, "#000000", 0.12) : mixHex(palette.page, palette.surface, 0.35),
    "--ui-radius-container": `${containerControls.radius}px`,
    "--ui-radius-button": `${containerControls.buttonRadius}px`,
    "--ui-content-width": `${contentWidthPercent}%`,
    "--ui-container-padding": isStretchContainers ? "1rem" : "1.5rem",
    "--ui-container-gap": isStretchContainers ? "0.85rem" : "1rem",
    "--color-page": palette.page,
  } as Record<`--${string}`, string>;
}
