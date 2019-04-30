import { capitalize } from 'lodash'

import { getDataType } from '../helpers/getDataType'
import { DataColumns, DataColumnsShort, GenericDataRow } from '../types'
import { normalizeRow } from './normalizeRow'

export function guessColumns(
  userCols: DataColumnsShort | undefined,
  firstRow: GenericDataRow | false,
): DataColumns {
  // array to object
  let cols = Array.isArray(userCols)
    ? userCols.reduce((acc, cur, index) => {
        acc[typeof cur === 'string' ? guessColKey(cur, firstRow, index) : cur.key] = cur
        return acc
      }, {})
    : userCols

  if (!firstRow) return {}

  const hasCols = cols && !!Object.keys(cols)
  const guessRow = normalizeRow(firstRow, 0)

  // fill in empty cols
  if (!hasCols) {
    cols = {}
    for (const key of Object.keys(guessRow.values)) {
      cols[key] = capitalize(key)
    }
  }

  // fully filled out
  if (Object.keys(cols).every(key => typeof cols[key] !== 'string')) {
    return cols as DataColumns
  }

  // guess at columns
  const res = {}
  for (const key in cols) {
    const val = cols[key]
    res[key] =
      typeof val === 'string'
        ? {
            value: val,
            type: getDataType(guessRow.values[key]),
          }
        : val
  }

  return res
}

function guessColKey(key: string, firstRow: GenericDataRow | false, index: number) {
  if (!firstRow) {
    return key
  }
  if (firstRow.values[key]) {
    return key
  }
  return Object.keys(firstRow.values)[index]
}
