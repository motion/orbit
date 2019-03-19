import { DataRow, GenericDataRow } from '../types'

export function getRowValues(row: GenericDataRow): DataRow {
  if (row.type === 'row') {
    return row.values
  }
  return row as DataRow
}
