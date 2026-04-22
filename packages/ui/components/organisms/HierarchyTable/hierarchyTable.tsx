import { useMemo, useState, type ReactNode } from "react";
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
  defaultExpandedIds?: string[];
}

type FlattenedRow<T> = {
  level: number;
  row: T;
};

const collectExpandedIds = <T extends HierarchyNode>(rows: T[]): string[] =>
  rows.flatMap((row) => [row.id, ...collectExpandedIds((row.children ?? []) as T[])]);

const flattenRows = <T extends HierarchyNode>(
  rows: T[],
  expandedIds: Set<string>,
  level = 0,
): FlattenedRow<T>[] =>
  rows.flatMap((row) => {
    const nextRows =
      row.children && row.children.length > 0 && expandedIds.has(row.id)
        ? flattenRows((row.children ?? []) as T[], expandedIds, level + 1)
        : [];

    return [{ row, level }, ...nextRows];
  });

export function HierarchyTable<T extends HierarchyNode>({
  columns,
  rows,
  emptyMessage = "No hierarchy data available.",
  defaultExpandedIds,
}: HierarchyTableProps<T>) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(
    () => new Set(defaultExpandedIds ?? collectExpandedIds(rows)),
  );

  const flattenedRows = useMemo(() => flattenRows(rows, expandedIds), [expandedIds, rows]);

  const toggleRow = (rowId: string) => {
    setExpandedIds((current) => {
      const next = new Set(current);

      if (next.has(rowId)) {
        next.delete(rowId);
      } else {
        next.add(rowId);
      }

      return next;
    });
  };

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
                      {columnIndex === 0 && row.children && row.children.length > 0 ? (
                        <button
                          aria-label={expandedIds.has(row.id) ? "Collapse row" : "Expand row"}
                          className={styles.toggle}
                          onClick={() => toggleRow(row.id)}
                          type="button"
                        >
                          <span className={`${styles.chevron} ${expandedIds.has(row.id) ? styles.open : ""}`} />
                        </button>
                      ) : null}
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
