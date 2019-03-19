import { DataRow, GenericDataRow } from '../types'

export function normalizeRows(rows: GenericDataRow[]): DataRow[] {
  if (!rows.length) return rows as DataRow[]
  if (rows[0].key === 'row') return rows as DataRow[]
  // @ts-ignore
  return rows.map((row, index) => ({
    type: 'row',
    key: index,
    values: row,
  }))
}
