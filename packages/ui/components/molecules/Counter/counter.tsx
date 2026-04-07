import styles from "./counter.module.scss";

type Props = {
  value: number;
  onIncrement: () => void;
};

export function Counter({ value, onIncrement }: Props) {
  return (
    <button className={styles.counter} onClick={onIncrement}>
      Count: {value}
    </button>
  );
}
