import { useMemo } from 'react'

import { TableFilter } from './types'

// export function useFilters(filters: TableFilter[], options) {
//   const [filterVal]
// }

export const FilterInclude = 'include' as 'include'
export const FilterExclude = 'exclude' as 'exclude'
export const FilterColumns = 'columns' as 'columns'

export function useFilters(filters: TableFilter[]) {
  return useMemo(() => filters, [JSON.stringify(filters)])
}

// function normalizeEnum(options: (string | Partial<any>)[]) {
//   return options.map(partial => {
//     let obj = typeof partial === 'string' ? { value: partial } : partial
//     return {
//       label: obj.label || capitalize(obj.value),
//       value: obj.value,
//       color: obj.color || null,
//     }
//   })
// }
