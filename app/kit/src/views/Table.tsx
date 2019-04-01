import {
  DataColumn,
  guessColumns,
  normalizeRow,
  SearchableTable,
  SearchableTableProps,
  Section,
  SectionProps,
  TitleRowProps,
  useParentNodeSize,
  useSectionProps,
  View,
} from '@o/ui'
import React, { useCallback, useMemo } from 'react'
import { useStoresSimple } from '../hooks/useStores'
import { Omit } from '../types'

export type TableColumns = { [key: string]: DataColumn | string }

type PartialSectionProps = Pick<SectionProps, 'title' | 'subTitle' | 'bordered'>

export type TableProps = Partial<Omit<TitleRowProps, 'title'>> &
  Omit<SearchableTableProps, 'columns' | 'selectableStore'> &
  PartialSectionProps & {
    columns?: TableColumns
    searchable?: boolean
    shareable?: boolean
  }

const defaultColumns = {
  resizable: true,
  sortable: true,
}

function deepMergeDefined<A>(obj: A, defaults: Record<string, any>): A {
  for (const key in obj) {
    Object.assign(obj[key], defaults)
  }
  return obj
}

export function Table(tableProps: TableProps) {
  const stores = useStoresSimple()
  const sectionProps: PartialSectionProps = useSectionProps(tableProps)
  const { flex, bordered, searchable, title, subTitle, shareable, ...props } = {
    ...sectionProps,
    ...tableProps,
  }
  const { height, ref } = useParentNodeSize()
  const rows = props.rows ? props.rows.map(normalizeRow) : null
  const columns = useMemo(
    () => deepMergeDefined(guessColumns(props.columns, rows && rows[0]), defaultColumns),
    [props.columns, rows],
  )

  const onSelect = useCallback(
    (selectedRows, indices) => {
      if (shareable) {
        stores.spaceStore.currentSelection = selectedRows
      }
      if (props.onSelect) {
        props.onSelect(selectedRows.map(row => row.values), indices)
      }
    },
    [props.rows, props.onSelect, shareable],
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
          onSelect={onSelect}
        />
      </View>
    </Section>
  )
}
