import { StateManager } from './StateManager';
import { useZustandStore, zustandDispatch } from '../store';

export class ZustandStateManager implements StateManager {
  // Counter operations
  getCounterValue(): number {
    return useZustandStore.getState().counter.value;
  }

  incrementCounter(): void {
    zustandDispatch({ type: 'counter/increment' });
  }

  decrementCounter(): void {
    zustandDispatch({ type: 'counter/decrement' });
  }

  // Contact form operations
  getContactState() {
    const state = useZustandStore.getState().contact;
    return {
      submitting: state.submitting,
      submitted: state.submitted,
      error: state.error,
    };
  }

  submitContactStart(): void {
    zustandDispatch({ type: 'contact/submitContactStart' });
  }

  submitContactSuccess(): void {
    zustandDispatch({ type: 'contact/submitContactSuccess' });
  }

  submitContactFailure(error: string): void {
    zustandDispatch({ type: 'contact/submitContactFailure', payload: error });
  }

  resetContactForm(): void {
    zustandDispatch({ type: 'contact/resetContactForm' });
  }

  // Feedback form operations
  getFeedbackState() {
    const state = useZustandStore.getState().feedback;
    return {
      submitting: state.submitting,
      submitted: state.submitted,
      error: state.error,
    };
  }

  submitFeedbackStart(): void {
    zustandDispatch({ type: 'feedback/submitFeedbackStart' });
  }

  submitFeedbackSuccess(): void {
    zustandDispatch({ type: 'feedback/submitFeedbackSuccess' });
  }

  submitFeedbackFailure(error: string): void {
    zustandDispatch({ type: 'feedback/submitFeedbackFailure', payload: error });
  }

  resetFeedbackForm(): void {
    zustandDispatch({ type: 'feedback/resetFeedbackForm' });
  }

  // User operations
  getUserState() {
    const state = useZustandStore.getState().user;
    return {
      user: state.user,
      loading: state.loading,
      error: state.error,
    };
  }

  setUser(user: any): void {
    useZustandStore.setState((state) => ({
      user: { ...state.user, user, loading: false, error: null }
    }));
  }

  setUserLoading(loading: boolean): void {
    useZustandStore.setState((state) => ({
      user: { ...state.user, loading }
    }));
  }

  setUserError(error: string): void {
    useZustandStore.setState((state) => ({
      user: { ...state.user, error, loading: false }
    }));
  }

  clearUser(): void {
    useZustandStore.setState((state) => ({
      user: { user: null, loading: false, error: null }
    }));
  }
}