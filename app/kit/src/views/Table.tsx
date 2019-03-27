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
  useRefGetter,
  useSectionProps,
  View,
} from '@o/ui'
import React, { useCallback } from 'react'
import { Omit } from '../types'

export type TableColumns = { [key: string]: DataColumn | string }

export type TableProps = Partial<Omit<TitleRowProps, 'title'>> &
  Omit<SearchableTableProps, 'columns'> &
  Pick<SectionProps, 'title' | 'subTitle' | 'bordered'> & {
    columns?: TableColumns
    searchable?: boolean
    onSelect?: (rows: any[]) => void
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
  const { flex, bordered, searchable, onSelect, title, subTitle, ...props } = useSectionProps(
    direct,
  )
  const { height, ref } = useParentNodeSize()
  const rows = props.rows.map(normalizeRow)
  const columns = deepMergeDefined(guessColumns(props.columns, rows && rows[0]), defaultColumns)
  const ogOnHighlightedIndices = useRefGetter(props.onSelectIndices)
  const onSelectIndices = useCallback(
    keys => {
      if (onSelect) {
        onSelect(keys.map(key => props.rows[rows.findIndex(x => x.key === key)]))
      }
      if (ogOnHighlightedIndices()) {
        ogOnHighlightedIndices()(keys)
      }
    },
    [props.rows],
  )

  return (
    <Section flex={flex} title={title} subTitle={subTitle} bordered={bordered} padding={0}>
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
