import { ManagedTable, SearchableTable, SearchableTableProps, useRefGetter } from '@o/ui'
import React, { useCallback } from 'react'

export type TableProps = SearchableTableProps & {
  searchable?: boolean
  onHighlightedRows?: (rows: any[]) => void
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

export function Table({ searchable, columns, onHighlightedRows, ...props }: TableProps) {
  const colsWithDefaults = deepMergeDefined(columns, defaultColumns)
  const ogOnHighlightedIndices = useRefGetter(props.onHighlightedIndices)
  const onHighlightedIndices = useCallback(keys => {
    if (onHighlightedRows) {
      onHighlightedRows(keys.map(key => props.rows.find(x => x.key === key)))
    }
    if (ogOnHighlightedIndices()) {
      ogOnHighlightedIndices()(keys)
    }
  }, [])

  if (searchable) {
    return (
      <SearchableTable
        columns={colsWithDefaults}
        {...props}
        onHighlightedIndices={onHighlightedIndices}
      />
    )
  } else {
    return (
      <ManagedTable
        columns={colsWithDefaults}
        {...props}
        onHighlightedIndices={onHighlightedIndices}
      />
    )
  }
}
