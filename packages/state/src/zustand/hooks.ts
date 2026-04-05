import { useZustandStore, zustandDispatch } from "./store";
import type { RootState } from "../shared/types";

export const useZustandDispatch = () => zustandDispatch;
export const useZustandSelector = <T>(selector: (state: RootState) => T): T => {
  return useZustandStore(selector);
};
