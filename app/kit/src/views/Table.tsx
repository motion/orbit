import {
  DataColumn,
  guessColumns,
  normalizeRow,
  SearchableTable,
  SearchableTableProps,
  Section,
  SubTitle,
  Title,
  useRefGetter,
} from '@o/ui'
import React, { useCallback } from 'react'
import { Omit } from '../types'

export type TableColumns = { [key: string]: DataColumn | string }

export type TableProps = Omit<SearchableTableProps, 'columns'> & {
  columns?: TableColumns
  searchable?: boolean
  onHighlighted?: (rows: any[]) => void
  title?: React.ReactNode
  subTitle?: React.ReactNode
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

export function Table({ searchable, onHighlighted, title, subTitle, ...props }: TableProps) {
  const rows = props.rows.map(normalizeRow)
  const columns = deepMergeDefined(guessColumns(props.columns, rows && rows[0]), defaultColumns)
  const ogOnHighlightedIndices = useRefGetter(props.onHighlightedIndices)
  const onHighlightedIndices = useCallback(
    keys => {
      if (onHighlighted) {
        onHighlighted(keys.map(key => props.rows[rows.findIndex(x => x.key === key)]))
      }
      if (ogOnHighlightedIndices()) {
        ogOnHighlightedIndices()(keys)
      }
    },
    [props.rows],
  )

  const hasChrome = !!title || !!subTitle

  return (
    <>
      <Section sizePadding={hasChrome ? 1 : 0} paddingBottom={0}>
        {!!title && <Title>{title}</Title>}
        {!!subTitle && <SubTitle>{subTitle}</SubTitle>}
      </Section>
      <SearchableTable
        height="content-height"
        minWidth={100}
        minHeight={100}
        maxHeight={800}
        {...props}
        columns={columns}
        rows={rows}
        onHighlightedIndices={onHighlightedIndices}
      />
    </>
  )
}
