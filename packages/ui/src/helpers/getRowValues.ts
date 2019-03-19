import { GenericDataRow } from '../types'

export function getRowValues(row: GenericDataRow) {
  if (row.type === 'row') {
    return row.values
  }
  return row
}
