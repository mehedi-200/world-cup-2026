import React from 'react';

const Table = ({ columns = [], data = [], className = '', onRowClick }) => {
  return (
    <div
      className={`
        bg-white/5 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden
        ${className}
      `.trim()}
    >
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-white/5">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-4 py-3 text-left text-gray-400 text-sm uppercase font-medium"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr
                key={row.id || rowIndex}
                className={`
                  border-b border-white/5 hover:bg-white/5 transition
                  ${onRowClick ? 'cursor-pointer' : ''}
                `.trim()}
                onClick={() => onRowClick?.(row, rowIndex)}
              >
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3 text-gray-200">
                    {col.render
                      ? col.render(row[col.key], row)
                      : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-8 text-center text-gray-500"
                >
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
