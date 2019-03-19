import { DataRow, GenericDataRow } from '../types'

export function normalizeRow(row: GenericDataRow, index: number): DataRow {
  if (row.type === 'row') {
    return {
      type: 'row',
      key: `${index}`,
      values: row.values,
      ...row,
    }
  }
  return {
    type: 'row',
    key: `${index}`,
    values: row as any,
  }
}
