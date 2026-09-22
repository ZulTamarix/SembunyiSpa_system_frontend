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

export function Table<T>({ fieldName, data }: TableProps<T>) {
  return (
    <div className="border border-border rounded-2xl overflow-hidden overflow-x-auto scrollbar-hide shadow-sm">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-border">
            {fieldName.map((col) => (
              <th key={col.key} className="text-left px-6 py-3 text-xs font-bold uppercase tracking-wider text-title whitespace-nowrap">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="bg-white">
          {data.map((row, i) => (
            <tr key={i} className="border-b border-border last:border-0 hover:bg-hover transition-colors">
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