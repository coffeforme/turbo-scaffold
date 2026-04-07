// Configuration-based State Manager
// This avoids React dependencies in the state package

import type { StateManager, StateManagerType } from "../shared/StateManager";
import { StateManagerFactory } from './StateManagerFactory';

// Global state manager instance
let currentStateManager: StateManager;
let currentManagerType: StateManagerType = 'redux';

export const getStateManager = (): StateManager => {
  if (!currentStateManager) {
    currentStateManager = StateManagerFactory.create(currentManagerType);
  }
  return currentStateManager;
};

export const getCurrentManagerType = (): StateManagerType => {
  return currentManagerType;
};

export const setStateManagerType = (type: StateManagerType): void => {
  if (type !== currentManagerType) {
    currentManagerType = type;
    currentStateManager = StateManagerFactory.create(type);
  }
};

export const initializeStateManager = (type: StateManagerType = 'redux'): void => {
  setStateManagerType(type);
};
