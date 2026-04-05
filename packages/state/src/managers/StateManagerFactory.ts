import type { StateManager, StateManagerType } from "../shared/StateManager";
import { ReduxStateManager } from "../redux/ReduxStateManager";
import { ZustandStateManager } from "../zustand/ZustandStateManager";

export class StateManagerFactory {
  static create(type: StateManagerType): StateManager {
    switch (type) {
      case "redux":
        return new ReduxStateManager();
      case "zustand":
        return new ZustandStateManager();
      default:
        throw new Error(`Unknown state manager type: ${type}`);
    }
  }
}
