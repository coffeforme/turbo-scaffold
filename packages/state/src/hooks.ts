import { useDispatch as useReduxDispatch, useSelector as useReduxSelector, TypedUseSelectorHook } from "react-redux";
import { useZustandStore, zustandDispatch } from "./store";
import type { RootState, AppDispatch } from "./store";

// Redux hooks
export const useAppDispatch = () => useReduxDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useReduxSelector;

// Zustand hooks
export const useZustandDispatch = () => zustandDispatch;
export const useZustandSelector = <T>(selector: (state: RootState) => T): T => {
  return useZustandStore(selector);
};

// Unified hooks (Redux by default for backward compatibility)
export const useDispatch = () => useReduxDispatch<AppDispatch>();
export const useSelector: TypedUseSelectorHook<RootState> = useReduxSelector;