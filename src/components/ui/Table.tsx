// Table.tsx
import React from "react";

export interface Column<T> {
  key: string;
  header: string;
  render?: (row: T) => React.ReactNode;
}

interface TableProps<T> {
  fieldName: Column<T>[];
  data: T[];
}

export function Table<T extends { id?: string | number }>({
  fieldName,
  data,
}: TableProps<T>) {
  return (
    <div className="bg-body border border-border rounded-2xl overflow-hidden overflow-x-auto  scrollbar-hide shadow-sm">
      <table className="w-full border-collapse">
        {/* title */}
        <thead>
          <tr className="border-b border-[#d9cdb8]">
            {fieldName.map((col) => (
              <th key={col.key} className="text-left px-6 py-3 text-xs font-bold uppercase tracking-wider text-title whitespace-nowrap">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        {/* data */}
        <tbody className="bg-white">
          {data.map((row, i) => (
            <tr
              key={row.id ?? i}
              className="border-b border-border last:border-0 hover:bg-tertiary transition-colors"
            >
              {fieldName.map((col) => (
                <td key={col.key} className="px-6 py-3 align-middle text-title text-sm whitespace-nowrap">
                  {col.render
                    ? col.render(row)
                    : (row as any)[col.key] ?? "—"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Table;