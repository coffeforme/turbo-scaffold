import styles from "./donutChart.module.scss";

export interface DonutChartSegment {
  label: string;
  value: number;
  color: string;
}

interface DonutChartProps {
  title: string;
  totalLabel?: string;
  segments: DonutChartSegment[];
}

export function DonutChart({ title, totalLabel = "Total", segments }: DonutChartProps) {
  const total = segments.reduce((sum, segment) => sum + segment.value, 0);
  const conicStops = segments.reduce<string[]>((acc, segment, index) => {
    const previous = acc[index - 1];
    const start = previous ? Number(previous.split(" ")[1].replace("%", "")) : 0;
    const end = start + (segment.value / Math.max(total, 1)) * 100;
    acc.push(`${segment.color} ${start}% ${end}%`);
    return acc;
  }, []);

  return (
    <div className={styles.wrap}>
      <div
        aria-label={title}
        className={styles.chart}
        style={{ background: `conic-gradient(${conicStops.join(", ")})` }}
      >
        <div className={styles.center}>
          <span className={styles.totalLabel}>{totalLabel}</span>
          <strong className={styles.totalValue}>{total}</strong>
        </div>
      </div>

      <div className={styles.legend}>
        {segments.map((segment) => (
          <div className={styles.legendItem} key={segment.label}>
            <span className={styles.swatch} style={{ background: segment.color }} />
            <span className={styles.legendLabel}>{segment.label}</span>
            <span className={styles.legendValue}>{segment.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
