import { SortOrder, TableRows } from './types'

const sortCache: WeakMap<
  TableRows,
  {
    [key: string]: {
      up?: TableRows
      down?: TableRows
    }
  }
> = new WeakMap()

export function getSortedRows(maybeSortOrder: SortOrder, items: TableRows): TableRows {
  if (!maybeSortOrder) {
    return items
  }
  const sortOrder: SortOrder = maybeSortOrder
  const cached = sortCache.get(items)
  if (cached && cached[sortOrder.key] && cached[sortOrder.key][sortOrder.direction]) {
    return cached[sortOrder.key][sortOrder.direction]
  }
  const sorter = sortRowsFactory(sortOrder)
  // copy because sort mutates in place, we need new references
  // i tested a copy on 100k objects, takes 0.6ms, so seems fast enough
  let copy = [...items]
  let sortedRows = copy.sort(sorter)
  const next = sortCache.get(items) || { [sortOrder.key]: {} }
  next[sortOrder.key] = next[sortOrder.key] || {}
  next[sortOrder.key][sortOrder.direction] = items
  sortCache.set(items, next)
  return sortedRows
}

const sortRowsFactory = (sortOrder: SortOrder) => (a: any, b: any) => {
  let vals = norm(a.values[sortOrder.key], b.values[sortOrder.key])
  if (sortOrder.direction === 'up') {
    vals.reverse()
  }
  let [aVal, bVal] = vals
  let aType = typeof aVal
  let bType = typeof bVal
  if (aType === 'boolean' && bType === 'boolean') {
    return aVal === true && bVal === false ? 1 : -1
  } else if (aType === 'string' && bType === 'string') {
    return aVal.localeCompare(bVal)
  } else if (aType === 'number' && bType === 'number') {
    return aVal - bVal
  } else if (aVal instanceof Date && bVal instanceof Date) {
    return aVal.getTime() - bVal.getTime()
  } else {
    return aVal > bVal ? -1 : 1
  }
}

const norm = (a: any, b: any) => [normVal(a), normVal(b)]

const last = `zzz`
function normVal(a: any) {
  // normalize falsy
  if (a === undefined) return last
  if (a === null) return last
  if (typeof a === 'object') return last
  // normalize stringy numbers
  if (typeof a === 'string' && +a === +a) return +a
  return a
}
