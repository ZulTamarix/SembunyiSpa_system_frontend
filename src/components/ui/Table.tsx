import React from "react";

export interface Column<T> {
  key: string;
  header: string;
  align?: "left" | "center" | "right";
  render?: (row: T) => React.ReactNode;
}

interface TableProps<T> {
  fieldName: Column<T>[];
  data: T[];
  loading?: boolean;
  skeletonRows?: number;
  emptyText?: string;
}

// Tailwind purges dynamic classes like `text-${align}`, so map them explicitly
const alignClass = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
} as const;

export function Table<T>({
  fieldName,
  data,
  loading = false,
  skeletonRows = 6,
  emptyText = "No data found",
}: TableProps<T>) {
  return (
    <div
      className="relative border border-border rounded-2xl overflow-hidden overflow-x-auto scrollbar-hide shadow-sm"
      aria-busy={loading}
    >
      {/* Thin indeterminate progress bar on top while loading */}
      {/* {loading && (
        <div className="absolute top-0 left-0 right-0 h-0.5 overflow-hidden bg-border z-10">
          <div className="h-full w-1/3 bg-title animate-[slide_1.1s_ease-in-out_infinite]" />
        </div>
      )} */}

      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-border">
            {fieldName.map((col) => (
              <th
                key={col.key}
                className={`px-6 py-3 text-xs font-bold uppercase tracking-wider text-title whitespace-nowrap ${alignClass[col.align ?? "left"]}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="bg-white">
          {loading ? (
            // Skeleton rows
            Array.from({ length: skeletonRows }).map((_, i) => (
              <tr key={`sk-${i}`} className="border-b border-border last:border-0">
                {fieldName.map((col, j) => (
                  <td key={col.key} className="px-6 py-4">
                    <div
                      className={`h-3.5 rounded-md bg-gray-200 animate-pulse ${
                        col.align === "right" ? "ml-auto" : col.align === "center" ? "mx-auto" : ""
                      }`}
                      // vary widths so it looks natural
                      style={{ width: `${55 + ((i * 7 + j * 13) % 40)}%` }}
                    />
                  </td>
                ))}
              </tr>
            ))
          ) : data.length === 0 ? (
            // Empty state
            <tr>
              <td
                colSpan={fieldName.length}
                className="py-4 text-center text-sm text-gray-400"
              >
                {emptyText}
              </td>
            </tr>
          ) : (
            data.map((row, i) => (
              <tr
                key={i}
                className="border-b border-border last:border-0 hover:bg-hover transition-colors"
              >
                {fieldName.map((col) => (
                  <td
                    key={col.key}
                    className={`px-6 py-3 align-middle text-title text-sm whitespace-nowrap ${alignClass[col.align ?? "left"]}`}
                  >
                    {col.render ? col.render(row) : (row as any)[col.key] ?? "—"}
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

export default Table;