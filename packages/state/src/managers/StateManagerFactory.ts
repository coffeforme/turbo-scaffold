import { StateManager, StateManagerType } from './StateManager';
import { ReduxStateManager } from './ReduxStateManager';
import { ZustandStateManager } from './ZustandStateManager';

export class StateManagerFactory {
  static create(type: StateManagerType): StateManager {
    switch (type) {
      case 'redux':
        return new ReduxStateManager();
      case 'zustand':
        return new ZustandStateManager();
      default:
        throw new Error(`Unknown state manager type: ${type}`);
    }
  }
}