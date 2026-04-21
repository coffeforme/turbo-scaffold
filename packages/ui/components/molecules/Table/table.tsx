import type { ReactNode } from "react";
import styles from "./table.module.scss";

export interface TableColumn<T> {
  header: string;
  key: keyof T | string;
  render?: (row: T) => ReactNode;
  align?: "left" | "center" | "right";
}

interface TableProps<T> {
  caption?: string;
  columns: TableColumn<T>[];
  rows: T[];
  emptyMessage?: string;
}

export function Table<T extends Record<string, unknown>>({
  caption,
  columns,
  rows,
  emptyMessage = "No data available.",
}: TableProps<T>) {
  return (
    <div className={styles.wrap}>
      <table className={styles.table}>
        {caption ? <caption className={styles.caption}>{caption}</caption> : null}
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                className={column.align ? styles[column.align] : styles.left}
                key={String(column.key)}
                scope="col"
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td className={styles.empty} colSpan={columns.length}>
                {emptyMessage}
              </td>
            </tr>
          ) : (
            rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {columns.map((column) => (
                  <td className={column.align ? styles[column.align] : styles.left} key={String(column.key)}>
                    {column.render ? column.render(row) : String(row[column.key as keyof T] ?? "")}
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
