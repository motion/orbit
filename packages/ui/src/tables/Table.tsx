import React, { useCallback, useMemo } from 'react'
import { guessColumns } from '../forms/guessColumns'
import { normalizeRow } from '../forms/normalizeRow'
import { useNodeSize } from '../hooks/useNodeSize'
import { Section, SectionParentProps, SectionSpecificProps, useSectionProps } from '../Section'
import { useShareStore } from '../Share'
import { TitleRowSpecificProps } from '../TitleRow'
import { DataColumnsShort, Omit } from '../types'
import { useVisibility } from '../Visibility'
import { SearchableTable, SearchableTableProps } from './SearchableTable'

export type TableProps = Partial<Omit<TitleRowSpecificProps, 'title'>> &
  Omit<SearchableTableProps, 'columns' | 'selectableStore'> &
  SectionParentProps & {
    columns?: DataColumnsShort
    searchable?: boolean
    shareable?: boolean
  }

const defaultColumns = {
  resizable: true,
  sortable: true,
}

function deepMergeDefined<A>(obj: A, defaults: Record<string, any>): A {
  for (const key in obj) {
    obj[key] = {
      ...defaults,
      ...obj[key],
    }
  }
  return obj
}

export function Table(tableProps: TableProps) {
  // const focusStore = useFocusStore()
  const shareStore = useShareStore()
  const sectionProps: SectionSpecificProps = useSectionProps(tableProps)
  const {
    flex = 1,
    bordered,
    title,
    subTitle,
    icon,
    beforeTitle,
    afterTitle,
    searchable,
    shareable,
    ...props
  } = {
    ...sectionProps,
    ...tableProps,
  }
  const isVisible = useVisibility()
  const { height, ref } = useNodeSize({ throttle: 200, disable: !isVisible })
  const rows = useMemo(() => (props.rows ? props.rows.map(normalizeRow) : null), [props.rows])
  const columns = useMemo(
    () => deepMergeDefined(guessColumns(props.columns, rows && rows[0]), defaultColumns),
    [props.columns, rows],
  )

  const onSelect = useCallback(
    (selectedRows, indices) => {
      if (shareable) {
        shareStore.selected = selectedRows
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
      icon={icon}
      beforeTitle={beforeTitle}
      afterTitle={afterTitle}
      padding={0}
    >
      <SearchableTable
        containerRef={ref}
        searchable={searchable}
        minWidth={100}
        minHeight={100}
        maxHeight={height > 0 ? height : 200}
        height={height}
        flex={flex}
        {...props}
        columns={columns}
        rows={rows}
        onSelect={onSelect}
      />
    </Section>
  )
}

Table.accepts = {
  surfaceProps: true,
}