// tabela gerenerica 

"use client";

type Props<T> = {
  data: T[];
  columns: { key: keyof T; label: string }[];
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
};

export function DataTable<T>({ data, columns, onEdit, onDelete }: Props<T>) {
  return (
    <table className="w-full border">
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={String(col.key)}>{col.label}</th>
          ))}
          <th>Ações</th>
        </tr>
      </thead>

      <tbody>
        {data.map((item, i) => (
          <tr key={i}>
            {columns.map((col) => (
              <td key={String(col.key)}>
                {String(item[col.key])}
              </td>
            ))}

            <td>
              <button onClick={() => onEdit?.(item)}>Editar</button>
              <button onClick={() => onDelete?.(item)}>Excluir</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}