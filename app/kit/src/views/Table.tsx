import {
  DataColumn,
  guessColumns,
  ManagedTable,
  normalizeRow,
  SearchableTable,
  SearchableTableProps,
  useRefGetter,
} from '@o/ui'
import React, { useCallback } from 'react'
import { Omit } from '../types'

export type TableColumns = { [key: string]: DataColumn | string }

export type TableProps = Omit<SearchableTableProps, 'columns'> & {
  columns?: TableColumns
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

export function Table({ multiHighlight = true, searchable, onHighlighted, ...props }: TableProps) {
  const rows = props.rows.map(normalizeRow)
  const columns = deepMergeDefined(guessColumns(props.columns, rows), defaultColumns)
  const ogOnHighlightedIndices = useRefGetter(props.onHighlightedIndices)
  const onHighlightedIndices = useCallback(
    keys => {
      if (onHighlighted) {
        onHighlighted(keys.map(key => rows.find(x => x.key === key)))
      }
      if (ogOnHighlightedIndices()) {
        ogOnHighlightedIndices()(keys)
      }
    },
    [props.rows],
  )

  if (searchable) {
    return (
      <SearchableTable
        multiHighlight={multiHighlight}
        {...props}
        columns={columns}
        rows={rows}
        onHighlightedIndices={onHighlightedIndices}
      />
    )
  }

  return (
    <ManagedTable
      multiHighlight={multiHighlight}
      {...props}
      columns={columns}
      rows={rows}
      onHighlightedIndices={onHighlightedIndices}
    />
  )
}
