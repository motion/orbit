import { selectDefined } from '@o/utils'
import React, { useCallback, useMemo } from 'react'

import { guessColumns } from '../forms/guessColumns'
import { normalizeRow } from '../forms/normalizeRow'
import { useGet } from '../hooks/useGet'
import { useNodeSize } from '../hooks/useNodeSize'
import { useParentNodeSize } from '../hooks/useParentNodeSize'
import { useScale } from '../Scale'
import { Section, SectionParentProps, SectionSpecificProps, useSectionProps } from '../Section'
import { useShareStore } from '../Share'
import { TitleRowSpecificProps } from '../TitleRow'
import { DataColumnsShort } from '../types'
import { useVisibility } from '../Visibility'
import { FilterableProps, FilterableSearchInput, useFilterable } from './Filterable'
import { ManagedTable, ManagedTableProps } from './ManagedTable'
import { DEFAULT_ROW_HEIGHT } from './types'

export type TableProps = Partial<Omit<TitleRowSpecificProps, 'title' | 'children' | 'selectable'>> &
  Omit<ManagedTableProps, 'columns'> &
  FilterableProps &
  Omit<SectionParentProps, 'children'> & {
    /** Flexibly define which columns to show, how to show them, and attach events to changes. Accepts array of strings, objects, or an object. */
    columns?: DataColumnsShort

    /** Automatically adds a search input to the table */
    searchable?: boolean

    /** Automatically exports selections to the Share store */
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

export const Table = (tableProps: TableProps) => {
  const shareStore = useShareStore()
  const sectionProps: SectionSpecificProps = useSectionProps(tableProps as any) // TODO fix
  const {
    flex = 1,
    bordered,
    title,
    subTitle,
    icon,
    beforeTitle,
    afterTitle,
    titleBorder,
    searchable,
    titlePadding = true,
    titleElement,
    shareable,
    maxHeight,
    maxWidth,
    children: _discardChildren,
    rowLineHeight = DEFAULT_ROW_HEIGHT,
    ...props
  } = {
    ...sectionProps,
    ...tableProps,
  }
  const isVisible = useVisibility()
  const scale = useScale()
  const rowHeight = rowLineHeight * scale
  const sizer = useNodeSize({ throttle: 150, disable: !isVisible })
  const height = typeof maxHeight === 'number' ? Math.min(maxHeight, sizer.height) : sizer.height
  const items = useMemo(() => (props.items ? props.items.map(normalizeRow) : null), [props.items])
  const columns = useMemo(
    () => deepMergeDefined(guessColumns(props.columns, items && items[0]), defaultColumns),
    [props.columns, items],
  )

  // do filtering...
  const filterable = useFilterable(props)

  const parentNodeSize = useParentNodeSize({ disable: !isVisible, throttle: 150 })

  const getOnSelect = useGet(props.onSelect)
  const onSelect = useCallback(
    (selectedItems, indices) => {
      if (shareable) {
        shareStore.setSelected(shareable, selectedItems)
      }
      if (getOnSelect()) {
        getOnSelect()(selectedItems.map(row => row.values), indices)
      }
    },
    [props.items, shareable],
  )

  return (
    <Section
      background="transparent"
      flex={flex}
      // this may be necessary to prevent the inifity bug
      overflow="hidden"
      title={title}
      subTitle={subTitle}
      bordered={bordered}
      titleBorder={titleBorder}
      titlePadding={titlePadding}
      titleElement={titleElement}
      icon={icon}
      beforeTitle={beforeTitle}
      afterTitle={afterTitle}
      maxHeight={selectDefined(
        maxHeight,
        parentNodeSize.height === 0 ? undefined : parentNodeSize.height,
      )}
      maxWidth={selectDefined(
        maxWidth,
        parentNodeSize.width === 0 ? undefined : parentNodeSize.width,
      )}
      ref={parentNodeSize.ref}
      belowTitle={searchable && <FilterableSearchInput useFilterable={filterable} />}
    >
      <ManagedTable
        containerRef={sizer.ref}
        minWidth={100}
        minHeight={100}
        maxHeight={height > 0 ? Math.min(height, rowHeight * items.length) : 800}
        height={height}
        flex={flex}
        {...props}
        columns={columns}
        filter={filterable.filter}
        onAddFilter={filterable.onAddFilter}
        onSelect={onSelect}
        rowLineHeight={rowHeight}
      />
    </Section>
  )
}

Table.accepts = {
  surfaceProps: true,
}
