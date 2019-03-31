import {
  DataColumn,
  guessColumns,
  normalizeRow,
  SearchableTable,
  SearchableTableProps,
  Section,
  SectionProps,
  TitleRowProps,
  useGet,
  useParentNodeSize,
  useSectionProps,
  View,
} from '@o/ui'
import React, { useCallback } from 'react'
import { useStoresSimple } from '../hooks/useStores'
import { Omit } from '../types'

export type TableColumns = { [key: string]: DataColumn | string }

export type TableProps = Partial<Omit<TitleRowProps, 'title'>> &
  Omit<SearchableTableProps, 'columns'> &
  Pick<SectionProps, 'title' | 'subTitle' | 'bordered'> & {
    columns?: TableColumns
    searchable?: boolean
    onSelect?: (rows: any[]) => void
    shareable?: boolean
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

export function Table(direct: TableProps) {
  const stores = useStoresSimple()
  const {
    flex,
    bordered,
    searchable,
    onSelect,
    title,
    subTitle,
    shareable,
    ...props
  } = useSectionProps(direct)
  const { height, ref } = useParentNodeSize()
  const rows = props.rows ? props.rows.map(normalizeRow) : null
  const columns = deepMergeDefined(guessColumns(props.columns, rows && rows[0]), defaultColumns)
  const ogOnHighlightedIndices = useGet(props.onSelectIndices)

  const onSelectIndices = useCallback(
    keys => {
      if (!props.rows) return
      const selectedRows = keys.map(key => props.rows[rows.findIndex(x => x.key === key)])
      if (shareable) {
        console.log('selected', keys, selectedRows)
        stores.spaceStore.currentSelection = selectedRows.length ? selectedRows : null
      }
      if (onSelect) {
        onSelect(selectedRows)
      }
      if (ogOnHighlightedIndices()) {
        ogOnHighlightedIndices()(keys)
      }
    },
    [props.rows, shareable],
  )

  return (
    <Section
      background="transparent"
      flex={flex}
      title={title}
      subTitle={subTitle}
      bordered={bordered}
      padding={0}
    >
      {/* ref inside so it captures just below title height */}
      <View ref={ref}>
        <SearchableTable
          searchable={searchable}
          height="content-height"
          minWidth={100}
          minHeight={100}
          maxHeight={height > 0 ? height : 500}
          flex={flex}
          {...props}
          columns={columns}
          rows={rows}
          onSelectIndices={onSelectIndices}
        />
      </View>
    </Section>
  )
}
