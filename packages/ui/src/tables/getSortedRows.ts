import { TableRows, TableRowSortOrder } from './types'

const sortedBodyCache: WeakMap<
  TableRows,
  {
    sortOrder: TableRowSortOrder
    rows: TableRows
  }
> = new WeakMap()

export function getSortedRows(maybeSortOrder: TableRowSortOrder, rows: TableRows): TableRows {
  if (!maybeSortOrder) {
    return rows
  }
  const sortOrder: TableRowSortOrder = maybeSortOrder
  const cached = sortedBodyCache.get(rows)
  if (cached && cached.sortOrder === sortOrder) {
    return cached.rows
  }

  let sortedRows = rows.sort((a, b) => {
    const aVal = a.values[sortOrder.key]
    const bVal = b.values[sortOrder.key]

    if (typeof aVal === 'boolean' && typeof bVal === 'boolean') {
      return aVal === true && bVal === false ? 1 : -1
    } else if (typeof aVal === 'string' && typeof bVal === 'string') {
      return aVal.localeCompare(bVal)
    } else if (typeof aVal === 'number' && typeof bVal === 'number') {
      return aVal - bVal
    } else if (aVal instanceof Date && bVal instanceof Date) {
      return aVal.getTime() - bVal.getTime()
    } else {
      console.error('Unsure how to sort this')
      return 0
    }
  })

  if (sortOrder.direction === 'up') {
    sortedRows = sortedRows.reverse()
  }

  sortedBodyCache.set(rows, {
    rows: sortedRows,
    sortOrder,
  })

  return sortedRows
}
