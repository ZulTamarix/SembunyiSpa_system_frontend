import { CircleChevronLeft, CircleChevronRight } from "lucide-react";
import React, { useState } from "react";

export interface Column<T> {
  key: string;
  header: string;
  align?: "left" | "center" | "right";
  render?: (row: T) => React.ReactNode;
  mergeRows?: boolean;
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
  dateNavigation?: boolean;
  onDateChange?: (date: string) => void;
}

const alignClass = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
} as const;

export function Table<T>({ fieldName, data, loading = false, skeletonRows = 6,  emptyText = "No data found", title, subtitle, className = "", dateNavigation = false, onDateChange }: TableProps<T>) {
 
  // #region 0) --> change date
    const pad = (n: number) => String(n).padStart(2, "0");
    const toISO = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
    const [date, setDate] = useState(toISO(new Date()));

    const goTo = (iso: string) => {
        if (!iso) return;
        setDate(iso);
        onDateChange?.(iso);
    };

    const addDays = (n: number) => {
        const d = new Date(date + "T00:00:00");
        d.setDate(d.getDate() + n);
        goTo(toISO(d));
    };
  // #endregion


  return (
    <div className={className}>
      
      {/* label */}
      {(title || subtitle || dateNavigation) && (
          <div className="mb-4 px-1">

              <div className="flex flex-wrap items-center justify-between gap-4">

                  {title && (
                      <div className="inline-block">
                          <h2 className="text-xl font-bold tracking-tight text-title sm:text-2xl">
                              {title}
                          </h2>
                          <span aria-hidden="true" className="mt-1.5 block h-1 w-full rounded-full bg-secondary" />
                      </div>
                  )}

                  {dateNavigation && (
                      <div className="flex items-center gap-2">
                          <button onClick={() => addDays(-1)} aria-label="Previous day"
                              className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg bg-secondary text-white transition-all hover:-translate-x-1">
                              <CircleChevronLeft />
                          </button>

                          <input type="date" value={date} onChange={(e) => goTo(e.target.value)}
                              className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-900" />

                          <button onClick={() => addDays(1)} aria-label="Next day"
                              className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg bg-secondary text-white transition-all hover:translate-x-1">
                              <CircleChevronRight />
                          </button>
                      </div>
                  )}
              </div>

              {subtitle && (
                  <p className="mt-2 text-sm font-medium text-gray-500">{subtitle}</p>
              )}
          </div>
      )}

      {/* table */}
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
                  <tr key={i} className="border-b border-border last:border-0 hover:bg-hover transition-colors">
                      {fieldName.map((col) => {
                          if (col.mergeRows && i !== 0) return null;

                          return (
                            <td key={col.key} rowSpan={col.mergeRows ? data.length : undefined} className={`px-6 py-3 align-middle text-title text-sm whitespace-nowrap ${alignClass[col.align ?? "left"]} ${col.mergeRows ? "border-r border-border" : ""}`}>
                                {col.render ? col.render(row) : (row as any)[col.key] ?? "—"}
                            </td>
                          );
                      })}
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