import styles from "./barChart.module.scss";

export interface BarChartItem {
  label: string;
  value: number;
  tone?: "primary" | "accent" | "neutral";
}

interface BarChartProps {
  items: BarChartItem[];
  maxValue?: number;
}

export function BarChart({ items, maxValue }: BarChartProps) {
  const computedMax = maxValue ?? Math.max(...items.map((item) => item.value), 1);

  return (
    <div className={styles.chart}>
      {items.map((item) => {
        const width = `${(item.value / computedMax) * 100}%`;
        const toneClass = item.tone ? styles[item.tone] : styles.primary;

        return (
          <div className={styles.row} key={item.label}>
            <div className={styles.header}>
              <span className={styles.label}>{item.label}</span>
              <span className={styles.value}>{item.value}</span>
            </div>
            <div className={styles.track}>
              <div className={`${styles.fill} ${toneClass}`} style={{ width }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
