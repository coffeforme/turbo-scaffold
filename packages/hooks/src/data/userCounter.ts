import { useAppDispatch, useAppSelector, useZustandDispatch, useZustandSelector } from "@repo/state";
import { increment } from "@repo/state";

// Hook that works with both Redux and Zustand
export function useCounter(useZustand = false) {
  if (useZustand) {
    // Zustand implementation
    const value = useZustandSelector((state) => state.counter.value);
    const dispatch = useZustandDispatch();

    const increase = () => dispatch({ type: 'counter/increment' });

    return {
      value,
      increase,
    };
  } else {
    // Redux implementation
    const dispatch = useAppDispatch();
    const value = useAppSelector((state) => state.counter.value);

    const increase = () => dispatch(increment());

    return {
      value,
      increase,
    };
  }
}
