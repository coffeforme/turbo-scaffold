import type { StateManager } from "../shared/StateManager";
import { useZustandStore, zustandDispatch } from "./store";

export class ZustandStateManager implements StateManager {
  getState() {
    return useZustandStore.getState();
  }

  getCounterValue(): number {
    return useZustandStore.getState().counter.value;
  }

  incrementCounter(): void {
    zustandDispatch({ type: "counter/increment" });
  }

  decrementCounter(): void {
    zustandDispatch({ type: "counter/decrement" });
  }

  getContactState() {
    return useZustandStore.getState().contact;
  }

  submitContactStart(): void {
    zustandDispatch({ type: "contact/submitContactStart" });
  }

  submitContactSuccess(): void {
    zustandDispatch({ type: "contact/submitContactSuccess" });
  }

  submitContactFailure(error: string): void {
    zustandDispatch({ type: "contact/submitContactFailure", payload: error });
  }

  resetContactForm(): void {
    zustandDispatch({ type: "contact/resetContactForm" });
  }

  getFeedbackState() {
    return useZustandStore.getState().feedback;
  }

  submitFeedbackStart(): void {
    zustandDispatch({ type: "feedback/submitFeedbackStart" });
  }

  submitFeedbackSuccess(): void {
    zustandDispatch({ type: "feedback/submitFeedbackSuccess" });
  }

  submitFeedbackFailure(error: string): void {
    zustandDispatch({ type: "feedback/submitFeedbackFailure", payload: error });
  }

  resetFeedbackForm(): void {
    zustandDispatch({ type: "feedback/resetFeedbackForm" });
  }

  getUserState() {
    return useZustandStore.getState().user;
  }

  setUser(user: any): void {
    useZustandStore.setState((state) => ({
      user: { ...state.user, user, loading: false, error: null },
    }));
  }

  setUserLoading(loading: boolean): void {
    useZustandStore.setState((state) => ({
      user: { ...state.user, loading },
    }));
  }

  setUserError(error: string): void {
    useZustandStore.setState((state) => ({
      user: { ...state.user, error, loading: false },
    }));
  }

  clearUser(): void {
    useZustandStore.setState((state) => ({
      user: { ...state.user, user: null, loading: false, error: null },
    }));
  }
}
