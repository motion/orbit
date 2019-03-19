import { getDataType } from '../helpers/getDataType'
import { DataColumns, DataColumnsShort, GenericDataRow } from '../types'

export function guessColumns(
  userCols: DataColumnsShort | undefined,
  rows: GenericDataRow[],
): DataColumns {
  let cols = userCols
  if (!rows.length) return {}

  const hasCols = !!Object.keys(cols)
  const guessRow = rows[0]

  // fill in empty cols
  if (!hasCols) {
    cols = {}
    for (const key of Object.keys(guessRow.values)) {
      const val = guessRow.values[key]
      cols[key] = typeof val
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
            type: getDataType(guessRow[key]),
          }
        : val
  }
  console.log('res', res)
  return res
}
