import { AuthSessionProvider } from "@repo/auth";
import { createContext, useContext, useState, type PropsWithChildren } from "react";

type IdlePreset = "disabled" | "30s" | "2m" | "12h";
type WarningPreset = "5s" | "10s" | "30s" | "5m";

interface IdlePresetConfig {
  closeOnIdleTime: boolean;
  idleTime: number;
  idleWarningTime: number;
}

interface AuthSessionRuntimeContextValue {
  idlePreset: IdlePreset;
  setIdlePreset: (preset: IdlePreset) => void;
  warningPreset: WarningPreset;
  setWarningPreset: (preset: WarningPreset) => void;
  idleConfig: IdlePresetConfig;
}

const PRESET_CONFIG: Record<IdlePreset, IdlePresetConfig> = {
  disabled: {
    closeOnIdleTime: false,
    idleTime: 12 * 60 * 60 * 1000,
    idleWarningTime: 5 * 60 * 1000,
  },
  "30s": {
    closeOnIdleTime: true,
    idleTime: 30 * 1000,
    idleWarningTime: 10 * 1000,
  },
  "2m": {
    closeOnIdleTime: true,
    idleTime: 2 * 60 * 1000,
    idleWarningTime: 30 * 1000,
  },
  "12h": {
    closeOnIdleTime: true,
    idleTime: 12 * 60 * 60 * 1000,
    idleWarningTime: 5 * 60 * 1000,
  },
};

const WARNING_PRESET_MS: Record<WarningPreset, number> = {
  "5s": 5 * 1000,
  "10s": 10 * 1000,
  "30s": 30 * 1000,
  "5m": 5 * 60 * 1000,
};

const AuthSessionRuntimeContext = createContext<AuthSessionRuntimeContextValue | undefined>(undefined);

export function AuthSessionRuntimeProvider({ children }: PropsWithChildren) {
  const [idlePreset, setIdlePreset] = useState<IdlePreset>("12h");
  const [warningPreset, setWarningPreset] = useState<WarningPreset>("5m");
  const baseConfig = PRESET_CONFIG[idlePreset];
  const resolvedWarningTime = Math.min(
    WARNING_PRESET_MS[warningPreset],
    Math.max(1000, baseConfig.idleTime - 1000),
  );
  const idleConfig = {
    ...baseConfig,
    idleWarningTime: baseConfig.closeOnIdleTime ? resolvedWarningTime : baseConfig.idleWarningTime,
  };

  return (
    <AuthSessionRuntimeContext.Provider
      value={{ idlePreset, setIdlePreset, warningPreset, setWarningPreset, idleConfig }}
    >
      <AuthSessionProvider
        closeOnIdleTime={idleConfig.closeOnIdleTime}
        idleTime={idleConfig.idleTime}
        idleWarningTime={idleConfig.idleWarningTime}
      >
        {children}
      </AuthSessionProvider>
    </AuthSessionRuntimeContext.Provider>
  );
}

export function useAuthSessionRuntime() {
  const context = useContext(AuthSessionRuntimeContext);

  if (!context) {
    throw new Error("useAuthSessionRuntime must be used within an AuthSessionRuntimeProvider");
  }

  return context;
}
