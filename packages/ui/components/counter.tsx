type Props = {
  value: number;
  onIncrement: () => void;
};

export function Counter({ value, onIncrement }: Props) {
  return (
    <button onClick={onIncrement}>
      Count: {value}
    </button>
  );
}