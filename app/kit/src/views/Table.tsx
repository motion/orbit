import { ManagedTable, SearchableTable, SearchableTableProps, useMemoGetValue } from '@o/ui'
import React, { useCallback } from 'react'
import { Icon } from './Icon'

export type TableProps = SearchableTableProps & {
  searchable?: boolean
  onHighlightedRows?: (rows: any[]) => void
}

const defaultRowTypes = {
  verbose: {
    label: 'Verbose',
    color: 'purple',
  },
  debug: {
    label: 'Debug',
    color: 'grey',
  },
  info: {
    label: 'Info',
    icon: <Icon name="info-circle" color="cyan" />,
    color: 'cyan',
  },
  warn: {
    label: 'Warn',
    style: {
      backgroundColor: 'yellowTint',
      color: 'yellow',
      fontWeight: 500,
    },
    icon: <Icon name="caution-triangle" color="yellow" />,
    color: 'yellow',
  },
  error: {
    label: 'Error',
    style: {
      backgroundColor: 'redTint',
      color: 'red',
      fontWeight: 500,
    },
    icon: <Icon name="caution-octagon" color="red" />,
    color: 'red',
  },
  fatal: {
    label: 'Fatal',
    style: {
      backgroundColor: 'redTint',
      color: 'darkred',
      fontWeight: 700,
    },
    icon: <Icon name="stop" color="red" />,
    color: 'darkred',
  },
}

const defaultColumns = {
  resizable: true,
  sortable: true,
}

function addDefaults<A>(obj: A, defaults: Object): A {
  for (const key in obj) {
    Object.assign(obj[key], defaults)
  }
  return obj
}

export function Table({ searchable, columns, onHighlightedRows, ...props }: TableProps) {
  const columnsWithDefaults = addDefaults(columns, defaultColumns)
  const ogOnHighlightedIndices = useMemoGetValue(props.onHighlightedIndices)
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
        columns={columnsWithDefaults}
        {...props}
        onHighlightedIndices={onHighlightedIndices}
      />
    )
  } else {
    return (
      <ManagedTable
        columns={columnsWithDefaults}
        {...props}
        onHighlightedIndices={onHighlightedIndices}
      />
    )
  }
}
