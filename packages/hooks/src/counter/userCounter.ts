import { useDispatch, useSelector } from "react-redux";
import { increment } from "@repo/state";
import type { RootState } from "@repo/state";

export function useCounter() {
  const dispatch = useDispatch();

  const value = useSelector((state: RootState) => state.counter.value);

  const increase = () => dispatch(increment());

  return {
    value,
    increase,
  };
}
