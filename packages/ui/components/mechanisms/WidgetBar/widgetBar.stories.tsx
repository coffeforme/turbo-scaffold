import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { WidgetBar, type ContainerWidgetControls, type NavbarWidgetControls, type WidgetCustomPalette } from "./widgetBar";

const meta = {
  title: "Mechanisms/WidgetBar",
  component: WidgetBar,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof WidgetBar>;

export default meta;

type Story = StoryObj<typeof meta>;

const paletteOptions = [
  { id: "lagoon", label: "Lagoon", description: "Cool teal and sea-glass tones.", swatches: ["#0f766e", "#115e59", "#f59e0b", "#f5f7fb"] },
  { id: "ember", label: "Ember", description: "Warm, high-contrast orange and rust.", swatches: ["#c2410c", "#9a3412", "#7c3aed", "#fff8f3"] },
  { id: "midnight", label: "Midnight", description: "Dark mode palette with vivid blue contrast.", swatches: ["#60a5fa", "#38bdf8", "#1e293b", "#020617"] },
  { id: "pantone-classic-blue", label: "Pantone Classic Blue", description: "Muted blue with warm neutral support.", swatches: ["#34568b", "#1f3a68", "#d7a44d", "#f3f0ea"] },
  { id: "pantone-living-coral", label: "Pantone Living Coral", description: "Coral-led palette with teal support.", swatches: ["#ff6f61", "#d95d52", "#227c70", "#fff4ef"] },
  { id: "custom", label: "Custom", description: "Manually define the palette colors.", swatches: ["#0f766e", "#f59e0b", "#132238", "#f5f7fb"] },
];

const initialCustomPalette: WidgetCustomPalette = {
  primary: "#0f766e",
  primaryStrong: "#115e59",
  accent: "#f59e0b",
  ink: "#132238",
  slate: "#5a6a85",
  surface: "#ffffff",
  page: "#f5f7fb",
};

const initialNavbarControls: NavbarWidgetControls = {
  mode: "floating",
  marginTop: 24,
  marginX: 0,
  paddingY: 16,
  paddingX: 20,
};

const initialContainerControls: ContainerWidgetControls = {
  radius: 28,
  buttonRadius: 999,
  contentWidth: 100,
  mode: "spaced",
};

export const Default: Story = {
  render: () => {
    const [selectedPaletteId, setSelectedPaletteId] = useState("lagoon");
    const [customPalette, setCustomPalette] = useState(initialCustomPalette);
    const [navbarControls, setNavbarControls] = useState(initialNavbarControls);
    const [containerControls, setContainerControls] = useState(initialContainerControls);

    return (
      <div style={{ minHeight: "100vh", padding: "1.5rem", paddingLeft: "21rem", background: "#f5f7fb" }}>
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
          onPaletteChange={setSelectedPaletteId}
          paletteOptions={paletteOptions}
          selectedPaletteId={selectedPaletteId}
        />
      </div>
    );
  },
};
