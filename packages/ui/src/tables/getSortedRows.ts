import { SortOrder, TableRows } from './types'

const sortedBodyCache: WeakMap<
  TableRows,
  {
    sortOrder: SortOrder
    rows: TableRows
  }
> = new WeakMap()

export function getSortedRows(maybeSortOrder: SortOrder, rows: TableRows): TableRows {
  if (!maybeSortOrder) {
    return rows
  }
  const sortOrder: SortOrder = maybeSortOrder
  const cached = sortedBodyCache.get(rows)
  if (cached && cached.sortOrder === sortOrder) {
    return cached.rows
  }

  let sortedRows = rows.sort((a, b) => {
    const [aVal, bVal] = norm(a.values[sortOrder.key], b.values[sortOrder.key])

    if (typeof aVal === 'boolean' && typeof bVal === 'boolean') {
      return aVal === true && bVal === false ? 1 : -1
    } else if (typeof aVal === 'string' && typeof bVal === 'string') {
      return aVal.localeCompare(bVal)
    } else if (typeof aVal === 'number' && typeof bVal === 'number') {
      return aVal - bVal
    } else if (aVal instanceof Date && bVal instanceof Date) {
      return aVal.getTime() - bVal.getTime()
    } else {
      return aVal > bVal ? -1 : 1
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

const norm = (a: any, b: any) => [normVal(a), normVal(b)]

function normVal(a: any) {
  // normalize falsy
  if (a === undefined) return `zzz`
  if (a === null) return `zzz`
  if (typeof a === 'object') return `zzz`
  // normalize stringy numbers
  if (typeof a === 'string' && +a === +a) return +a
  return a
}
