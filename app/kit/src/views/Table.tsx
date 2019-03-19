import {
  DataColumn,
  guessColumns,
  ManagedTable,
  normalizeRows,
  SearchableTable,
  SearchableTableProps,
  useRefGetter,
} from '@o/ui'
import React, { useCallback } from 'react'
import { Omit } from '../types'

export type TableColumns = { [key: string]: DataColumn | string }

export type TableProps = Omit<SearchableTableProps, 'columns'> & {
  columns: TableColumns
  searchable?: boolean
  onHighlighted?: (rows: any[]) => void
}

const defaultColumns = {
  resizable: true,
  sortable: true,
}

function deepMergeDefined<A>(obj: A, defaults: Object): A {
  for (const key in obj) {
    Object.assign(obj[key], defaults)
  }
  return obj
}

export function Table({
  multiHighlight = true,
  searchable,
  columns,
  onHighlighted,
  ...props
}: TableProps) {
  const colsWithDefaults = deepMergeDefined(columns, defaultColumns)
  const normalizedColumns = guessColumns(colsWithDefaults, props.rows)
  const rows = normalizeRows(props.rows)

  const ogOnHighlightedIndices = useRefGetter(props.onHighlightedIndices)
  const onHighlightedIndices = useCallback(keys => {
    if (onHighlighted) {
      onHighlighted(keys.map(key => props.rows.find(x => x.key === key)))
    }
    if (ogOnHighlightedIndices()) {
      ogOnHighlightedIndices()(keys)
    }
  }, [])

  if (searchable) {
    return (
      <SearchableTable
        multiHighlight={multiHighlight}
        columns={normalizedColumns}
        {...props}
        rows={rows}
        onHighlightedIndices={onHighlightedIndices}
      />
    )
  } else {
    return (
      <ManagedTable
        multiHighlight={multiHighlight}
        columns={normalizedColumns}
        {...props}
        rows={rows}
        onHighlightedIndices={onHighlightedIndices}
      />
    )
  }
}
