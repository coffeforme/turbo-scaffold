import type { ReactNode } from "react";
import styles from "./hierarchyTable.module.scss";

export interface HierarchyNode {
  id: string;
  children?: HierarchyNode[];
}

export interface HierarchyColumn<T> {
  header: string;
  render: (row: T) => ReactNode;
}

interface HierarchyTableProps<T extends HierarchyNode> {
  columns: HierarchyColumn<T>[];
  rows: T[];
  emptyMessage?: string;
}

type FlattenedRow<T> = {
  level: number;
  row: T;
};

const flattenRows = <T extends HierarchyNode>(rows: T[], level = 0): FlattenedRow<T>[] =>
  rows.flatMap((row) => [
    { row, level },
    ...flattenRows((row.children ?? []) as T[], level + 1),
  ]);

export function HierarchyTable<T extends HierarchyNode>({
  columns,
  rows,
  emptyMessage = "No hierarchy data available.",
}: HierarchyTableProps<T>) {
  const flattenedRows = flattenRows(rows);

  return (
    <div className={styles.wrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th key={`${column.header}-${index}`}>{column.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {flattenedRows.length === 0 ? (
            <tr>
              <td className={styles.empty} colSpan={columns.length}>
                {emptyMessage}
              </td>
            </tr>
          ) : (
            flattenedRows.map(({ row, level }) => (
              <tr key={row.id}>
                {columns.map((column, columnIndex) => (
                  <td key={`${row.id}-${columnIndex}`}>
                    <div
                      className={columnIndex === 0 ? styles.primaryCell : styles.cell}
                      style={columnIndex === 0 ? { paddingLeft: `${1 + level * 1.2}rem` } : undefined}
                    >
                      {columnIndex === 0 && level > 0 ? <span className={styles.branch} /> : null}
                      {column.render(row)}
                    </div>
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
