import { useEffect, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from "react";
import { Input } from "../../atoms/Input/input";
import { Label } from "../../atoms/Label/label";
import { Select } from "../../atoms/Select/select";
import { Text } from "../../atoms/Text/text";
import { resolveWidgetPalette } from "./themeConfig";
import styles from "./widgetBar.module.scss";

export interface WidgetPaletteOption {
  id: string;
  label: string;
  description?: string;
  swatches: string[];
}

export interface WidgetCustomPalette {
  primary: string;
  primaryStrong: string;
  accent: string;
  ink: string;
  slate: string;
  surface: string;
  page: string;
}

export interface NavbarWidgetControls {
  mode: "floating" | "fixed";
  marginTop: number;
  marginX: number;
  paddingY: number;
  paddingX: number;
}

export interface ContainerWidgetControls {
  radius: number;
  buttonRadius: number;
  contentWidth: number;
  mode: "spaced" | "stretch";
}

interface WidgetBarProps {
  paletteOptions: WidgetPaletteOption[];
  selectedPaletteId: string;
  onPaletteChange: (paletteId: string) => void;
  customPalette: WidgetCustomPalette;
  onCustomPaletteChange: <K extends keyof WidgetCustomPalette>(field: K, value: WidgetCustomPalette[K]) => void;
  navbarControls: NavbarWidgetControls;
  onNavbarControlChange: <K extends keyof NavbarWidgetControls>(field: K, value: NavbarWidgetControls[K]) => void;
  containerControls: ContainerWidgetControls;
  onContainerControlChange: <K extends keyof ContainerWidgetControls>(field: K, value: ContainerWidgetControls[K]) => void;
  exportConfig?: string;
}

function NumberField({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className={styles.field}>
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} min={0} onChange={(event) => onChange(Number(event.target.value))} type="number" value={value} />
    </div>
  );
}

function clampPosition(value: number, min: number, max: number) {
  if (max < min) {
    return min;
  }

  return Math.min(Math.max(value, min), max);
}

export function WidgetBar({
  paletteOptions,
  selectedPaletteId,
  onPaletteChange,
  customPalette,
  onCustomPaletteChange,
  navbarControls,
  onNavbarControlChange,
  containerControls,
  onContainerControlChange,
  exportConfig,
}: WidgetBarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [palettesExpanded, setPalettesExpanded] = useState(false);
  const [customizationSourceId, setCustomizationSourceId] = useState<string | null>(null);
  const widgetRef = useRef<HTMLElement | null>(null);
  const dragOffsetRef = useRef({ x: 0, y: 0 });
  const resizeHeightRef = useRef(0);
  const [position, setPosition] = useState({ x: 24, y: 120 });
  const [widgetHeight, setWidgetHeight] = useState(560);
  const [exportStatus, setExportStatus] = useState<"idle" | "copied" | "failed">("idle");
  const visiblePaletteId = selectedPaletteId === "custom" && customizationSourceId ? customizationSourceId : selectedPaletteId;
  const activePalette = paletteOptions.find((option) => option.id === visiblePaletteId);
  const showCustomControls = selectedPaletteId === "custom";
  const activeSwatches =
    selectedPaletteId === "custom"
      ? [customPalette.primary, customPalette.primaryStrong, customPalette.accent, customPalette.surface]
      : (activePalette?.swatches ?? [customPalette.primary, customPalette.accent, customPalette.surface]);
  const isDesktop = typeof window !== "undefined" ? window.innerWidth > 1100 : true;

  useEffect(() => {
    if (typeof window === "undefined" || !isDesktop || !widgetRef.current) {
      return;
    }

    const element = widgetRef.current;
    const nextY = clampPosition((window.innerHeight - element.offsetHeight) / 2, 24, Math.max(24, window.innerHeight - element.offsetHeight - 24));

    setPosition((current) => ({
      x: clampPosition(current.x, 16, Math.max(16, window.innerWidth - element.offsetWidth - 16)),
      y: nextY,
    }));
  }, [collapsed, isDesktop]);

  useEffect(() => {
    setExportStatus("idle");
  }, [exportConfig]);

  useEffect(() => {
    if (typeof window === "undefined" || !isDesktop) {
      return;
    }

    const handleResize = () => {
      if (!widgetRef.current) {
        return;
      }

      const element = widgetRef.current;

      setPosition((current) => ({
        x: clampPosition(current.x, 16, Math.max(16, window.innerWidth - element.offsetWidth - 16)),
        y: clampPosition(current.y, 24, Math.max(24, window.innerHeight - element.offsetHeight - 24)),
      }));
      setWidgetHeight((current) => clampPosition(current, 320, Math.max(320, window.innerHeight - 48)));
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [isDesktop]);

  const startDragging = (event: ReactPointerEvent<HTMLElement>) => {
    if (!isDesktop || !widgetRef.current) {
      return;
    }

    const element = widgetRef.current;
    const bounds = element.getBoundingClientRect();

    dragOffsetRef.current = {
      x: event.clientX - bounds.left,
      y: event.clientY - bounds.top,
    };

    const handlePointerMove = (moveEvent: PointerEvent) => {
      if (!widgetRef.current) {
        return;
      }

      const nextX = moveEvent.clientX - dragOffsetRef.current.x;
      const nextY = moveEvent.clientY - dragOffsetRef.current.y;
      const maxX = Math.max(16, window.innerWidth - widgetRef.current.offsetWidth - 16);
      const maxY = Math.max(24, window.innerHeight - widgetRef.current.offsetHeight - 24);

      setPosition({
        x: clampPosition(nextX, 16, maxX),
        y: clampPosition(nextY, 24, maxY),
      });
    };

    const handlePointerUp = () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
  };

  const startResizing = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!isDesktop || !widgetRef.current) {
      return;
    }

    resizeHeightRef.current = widgetRef.current.getBoundingClientRect().height;
    const startY = event.clientY;

    const handlePointerMove = (moveEvent: PointerEvent) => {
      const nextHeight = resizeHeightRef.current + (moveEvent.clientY - startY);
      setWidgetHeight(clampPosition(nextHeight, 320, Math.max(320, window.innerHeight - 48)));
    };

    const handlePointerUp = () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
  };

  const handleExportConfig = async () => {
    if (!exportConfig) {
      return;
    }

    try {
      if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(exportConfig);
      }
      setExportStatus("copied");
    } catch {
      setExportStatus("failed");
    }
  };

  const handleStartCustomization = () => {
    const sourcePalette = resolveWidgetPalette(selectedPaletteId as Parameters<typeof resolveWidgetPalette>[0], customPalette);

    (Object.entries(sourcePalette) as Array<[keyof WidgetCustomPalette, WidgetCustomPalette[keyof WidgetCustomPalette]]>).forEach(
      ([field, value]) => {
        onCustomPaletteChange(field, value);
      },
    );

    setCustomizationSourceId(selectedPaletteId);
    onPaletteChange("custom");
    setPalettesExpanded(false);
  };

  const widgetStyle = isDesktop
    ? ({
        left: `${position.x}px`,
        top: `${position.y}px`,
        maxBlockSize: `${widgetHeight}px`,
      } as CSSProperties)
    : undefined;

  if (collapsed) {
    return (
      <aside
        aria-label="Theme widget"
        className={`${styles.widgetBar} ${styles.collapsed}`}
        ref={widgetRef}
        style={widgetStyle}
      >
        <button className={styles.collapsedDragHandle} onPointerDown={startDragging} type="button">
          <span className={styles.toggleIcon}>::</span>
          <span className={styles.toggleLabel}>Theme</span>
        </button>
        <button className={styles.collapseToggle} onClick={() => setCollapsed(false)} type="button">
          <span className={styles.toggleIcon}>+</span>
          <span className={styles.srOnly}>Expand widget</span>
        </button>
        <div className={styles.collapsedPreview}>
          {activeSwatches.slice(0, 3).map((color) => (
            <span className={styles.collapsedSwatch} key={color} style={{ backgroundColor: color }} />
          ))}
        </div>
        <div className={styles.collapsedMeta}>
          <span className={styles.collapsedChip}>{navbarControls.mode}</span>
          <span className={styles.collapsedChip}>{containerControls.mode}</span>
          <span className={styles.collapsedChip}>{containerControls.radius}px</span>
        </div>
        <div className={styles.collapsedStats}>
          <span>T {navbarControls.marginTop}</span>
          <span>X {navbarControls.marginX}</span>
          <span>P {navbarControls.paddingY}/{navbarControls.paddingX}</span>
          <span>W {containerControls.contentWidth}%</span>
        </div>
      </aside>
    );
  }

  return (
    <aside className={styles.widgetBar} ref={widgetRef} style={widgetStyle}>
      <div className={styles.section}>
        <div className={styles.headerRow}>
          <div className={styles.headerCopy}>
            <Text
              as="strong"
              className={styles.dragHandle}
              onPointerDown={startDragging}
              size="sm"
              weight="strong"
            >
              Theme Widget
            </Text>
            <Text size="sm" tone="muted">
              Switch the palette and navbar layout live to preview how shared UI adapts across the app.
            </Text>
            {exportConfig ? (
              <button className={styles.exportButton} onClick={handleExportConfig} type="button">
                {exportStatus === "copied" ? "Config copied" : exportStatus === "failed" ? "Copy failed" : "Export config"}
              </button>
            ) : null}
          </div>
          <button className={styles.collapseToggle} onClick={() => setCollapsed(true)} type="button">
            <span className={styles.toggleIcon}>-</span>
            <span className={styles.srOnly}>Collapse widget</span>
          </button>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.field}>
          <Label>Palette</Label>
          <div className={styles.paletteChooser}>
            {activePalette ? (
              <button
                className={`${styles.paletteOption} ${styles.paletteOptionActive}`}
                onClick={() => setPalettesExpanded((current) => !current)}
                type="button"
              >
                <span className={styles.paletteStrip}>
                  {activeSwatches.map((color, index) => (
                    <span className={styles.paletteSwatch} key={`${activePalette.id}-${index}`} style={{ backgroundColor: color }} />
                  ))}
                </span>
                <span className={styles.paletteMeta}>
                  <span className={styles.paletteLabel}>
                    {activePalette.label}
                    {selectedPaletteId === "custom" && customizationSourceId ? " Customized" : ""}
                  </span>
                  {activePalette.description ? <span className={styles.paletteDescription}>{activePalette.description}</span> : null}
                </span>
              </button>
            ) : null}

            <div className={styles.paletteActions}>
              <button className={styles.secondaryAction} onClick={() => setPalettesExpanded((current) => !current)} type="button">
                {palettesExpanded ? "Hide palettes" : "Browse palettes"}
              </button>
              {!showCustomControls ? (
                <button className={styles.secondaryAction} onClick={handleStartCustomization} type="button">
                  Customize selected
                </button>
              ) : null}
            </div>

            {palettesExpanded ? (
              <div className={styles.paletteList}>
                {paletteOptions
                  .filter((option) => option.id !== selectedPaletteId && option.id !== "custom")
                  .map((option) => {
                    const swatches = option.swatches;

                    return (
                      <button
                        className={styles.paletteOption}
                        key={option.id}
                        onClick={() => {
                          setCustomizationSourceId(null);
                          onPaletteChange(option.id);
                          setPalettesExpanded(false);
                        }}
                        type="button"
                      >
                        <span className={styles.paletteStrip}>
                          {swatches.map((color, index) => (
                            <span className={styles.paletteSwatch} key={`${option.id}-${index}`} style={{ backgroundColor: color }} />
                          ))}
                        </span>
                        <span className={styles.paletteMeta}>
                          <span className={styles.paletteLabel}>{option.label}</span>
                          {option.description ? <span className={styles.paletteDescription}>{option.description}</span> : null}
                        </span>
                      </button>
                    );
                  })}
              </div>
            ) : null}
          </div>
        </div>

        {activePalette?.description ? (
          <Text size="sm" tone="muted">
            {activePalette.description}
          </Text>
        ) : null}

        {showCustomControls ? (
          <div className={styles.paletteGrid}>
            {(
              [
                ["primary", "Primary"],
                ["primaryStrong", "Primary Strong"],
                ["accent", "Accent"],
                ["ink", "Ink"],
                ["slate", "Muted"],
                ["surface", "Surface"],
                ["page", "Page Background"],
              ] as const
            ).map(([field, label]) => (
              <div className={styles.colorField} key={field}>
                <div className={styles.colorFieldHeader}>
                  <Label htmlFor={`palette-${field}`}>{label}</Label>
                  <span className={styles.colorValue}>{customPalette[field]}</span>
                </div>
                <div className={styles.colorControl}>
                  <input
                    className={styles.colorSpinner}
                    id={`palette-${field}`}
                    onChange={(event) => onCustomPaletteChange(field, event.target.value)}
                    type="color"
                    value={customPalette[field]}
                  />
                  <div className={styles.colorTrack} style={{ backgroundColor: customPalette[field] }} />
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </div>

      <div className={styles.section}>
        <div className={styles.groupHeader}>
          <Text as="strong" size="sm" weight="strong">
            Containers
          </Text>
          <Text size="sm" tone="muted">
            Adjust shared card spacing and rounded corners across the app.
          </Text>
        </div>

        <div className={styles.field}>
          <Label htmlFor="container-mode">Container Mode</Label>
          <Select
            id="container-mode"
            onChange={(event) => onContainerControlChange("mode", event.target.value as ContainerWidgetControls["mode"])}
            value={containerControls.mode}
          >
            <option value="spaced">Spaced</option>
            <option value="stretch">Stretch</option>
          </Select>
        </div>

        <NumberField
          id="container-radius"
          label="Container Radius"
          onChange={(value) => onContainerControlChange("radius", value)}
          value={containerControls.radius}
        />

        <NumberField
          id="button-radius"
          label="Button Radius"
          onChange={(value) => onContainerControlChange("buttonRadius", value)}
          value={containerControls.buttonRadius}
        />

        <NumberField
          id="content-width"
          label="Content Width (%)"
          onChange={(value) => onContainerControlChange("contentWidth", value)}
          value={containerControls.contentWidth}
        />
      </div>

      <div className={styles.section}>
        <div className={styles.groupHeader}>
          <Text as="strong" size="sm" weight="strong">
            Navbar
          </Text>
          <Text size="sm" tone="muted">
            Switch layout and fine tune the navigation placement.
          </Text>
        </div>

        <div className={styles.field}>
          <Label htmlFor="navbar-mode">Navbar Mode</Label>
          <Select
            id="navbar-mode"
            onChange={(event) => onNavbarControlChange("mode", event.target.value as NavbarWidgetControls["mode"])}
            value={navbarControls.mode}
          >
            <option value="floating">Floating</option>
            <option value="fixed">Fixed</option>
          </Select>
        </div>

        <div className={styles.compactGrid}>
          <NumberField
            id="navbar-margin-top"
            label="Top Margin"
            onChange={(value) => onNavbarControlChange("marginTop", value)}
            value={navbarControls.marginTop}
          />
          <NumberField
            id="navbar-margin-x"
            label="Side Margin"
            onChange={(value) => onNavbarControlChange("marginX", value)}
            value={navbarControls.marginX}
          />
          <NumberField
            id="navbar-padding-y"
            label="Vertical Padding"
            onChange={(value) => onNavbarControlChange("paddingY", value)}
            value={navbarControls.paddingY}
          />
          <NumberField
            id="navbar-padding-x"
            label="Horizontal Padding"
            onChange={(value) => onNavbarControlChange("paddingX", value)}
            value={navbarControls.paddingX}
          />
        </div>
      </div>

      <div
        aria-hidden="true"
        className={styles.resizeHandle}
        onPointerDown={startResizing}
      />
    </aside>
  );
}
