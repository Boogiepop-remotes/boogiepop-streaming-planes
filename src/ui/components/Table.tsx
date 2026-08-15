import type { ReactNode } from 'react'

export type Column<T> = {
  /** Título de la columna. */
  header: string
  /** Cómo se renderiza la celda. Recibe la fila y su índice (para numerar). */
  cell: (row: T, index: number) => ReactNode
  align?: 'left' | 'right'
  /** Clave por la que se ordena al hacer click; sin esto la columna no ordena. */
  sortKey?: string
}

export type TableProps<T> = {
  columns: Array<Column<T>>
  rows: T[]
  rowKey: (row: T) => string | number
  /** Qué mostrar cuando no hay filas. Sin esto, una tabla vacía queda muda. */
  empty?: ReactNode
  sort?: { key: string; dir: 'asc' | 'desc' }
  onSort?: (key: string) => void
}

export function Table<T>({
  columns,
  rows,
  rowKey,
  empty,
  sort,
  onSort,
}: TableProps<T>) {
  if (!rows.length && empty) {
    return <div className="bp-table-empty">{empty}</div>
  }
  return (
    <div className="bp-table-wrap">
      <table className="bp-table">
        <thead>
          <tr>
            {columns.map((c) => (
              <th
                key={c.header}
                className={c.align === 'right' ? 'bp-th bp-right' : 'bp-th'}
                aria-sort={
                  sort && c.sortKey === sort.key
                    ? sort.dir === 'asc'
                      ? 'ascending'
                      : 'descending'
                    : undefined
                }
              >
                {c.sortKey && onSort ? (
                  <button
                    type="button"
                    className="bp-th-sort"
                    onClick={() => onSort(c.sortKey!)}
                  >
                    {c.header}
                    <span aria-hidden="true">
                      {sort && sort.key === c.sortKey
                        ? sort.dir === 'asc'
                          ? ' ↑'
                          : ' ↓'
                        : ' ↕'}
                    </span>
                  </button>
                ) : (
                  c.header
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={rowKey(row)}>
              {columns.map((c) => (
                <td
                  key={c.header}
                  className={c.align === 'right' ? 'bp-td bp-right' : 'bp-td'}
                >
                  {c.cell(row, i)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
