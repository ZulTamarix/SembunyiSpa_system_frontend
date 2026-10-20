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
  title?: React.ReactNode;      // optional title above the table
  subtitle?: React.ReactNode;   // optional description under the title
  className?: string;           // optional wrapper className
}

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
  title,
  subtitle,
  className = "",
}: TableProps<T>) {
  return (
    <div className={className}>
      
      {/* label */}
      {(title || subtitle) && (
        <div className="mb-4 px-1">
          {title && (
            <div className="inline-block">
              <h2 className="text-xl font-bold tracking-tight text-title sm:text-2xl">
                {title}
              </h2>

              {/* Accent underline, same width as the label */}
              <span
                aria-hidden="true"
                className="mt-1.5 block h-1 w-full rounded-full bg-secondary"
              />
            </div>
          )}

          {subtitle && (
            <p className="mt-2 text-sm font-medium text-gray-500">{subtitle}</p>
          )}
        </div>
      )}

      <div className="relative border border-border rounded-2xl overflow-hidden overflow-x-auto scrollbar-hide shadow-sm" aria-busy={loading}>
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
              Array.from({ length: skeletonRows }).map((_, i) => (
                <tr key={`sk-${i}`} className="border-b border-border last:border-0">
                  {fieldName.map((col, j) => (
                    <td key={col.key} className="px-6 py-4">
                      <div
                        className={`h-3.5 rounded-md bg-gray-200 animate-pulse ${
                          col.align === "right" ? "ml-auto" : col.align === "center" ? "mx-auto" : ""
                        }`}
                        style={{ width: `${55 + ((i * 7 + j * 13) % 40)}%` }}
                      />
                    </td>
                  ))}
                </tr>
              ))
            ) : data.length === 0 ? (
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
    </div>
  );
}

export default Table;