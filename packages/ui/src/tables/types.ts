import { GenericDataRow } from '../types'

/**
 * Copyright 2018-present Facebook.
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * @format
 */

export type FilterIncludeExclude = 'include' | 'exclude'

export type TableFilterColumns = {
  type: 'columns'
  /** which table column to filter */
  key: string
  /** list of all filters for that column */
  options: {
    /** value to match */
    value: string
    /** display name */
    label?: string
    /** color for row/filter */
    color?: string
  }[]
  /** current state of active filters */
  values: string[]
  persistent?: boolean
}

export type TableFilterIncludeExclude = {
  /** maps to table column key */
  key: string
  value: string
  type: FilterIncludeExclude
  persistent?: boolean
}

export type TableFilterColumnsSimple = TableFilterColumns & {
  options: string[]
}

export type TableFilterSimple = TableFilterIncludeExclude | TableFilterColumnsSimple

export type TableFilter = TableFilterIncludeExclude | TableFilterColumns

export const MINIMUM_COLUMN_WIDTH = 100
export const DEFAULT_COLUMN_WIDTH = 200
export const DEFAULT_ROW_HEIGHT = 23

type TableColumnOrderVal = {
  key: string
  visible: boolean
}

export type TableColumnRawOrder = (string | TableColumnOrderVal)[]

export type TableColumnOrder = TableColumnOrderVal[]

export type TableColumnSizes = {
  [key: string]: string | number
}

export type TableHighlightedRows = string[]

export type TableColumnKeys = string[]

export type TableOnColumnResize = (sizes: TableColumnSizes) => void
export type TableOnColumnOrder = (order: TableColumnOrder) => void
export type TableOnSort = (order: SortOrder) => void
export type TableOnHighlight = (highlightedRows: TableHighlightedRows, e: Event) => void

export type TableBodyColumn = {
  sortValue?: string | number | boolean
  isFilterable?: boolean
  value: any
  title?: string
  type?: 'date'
}

export type TableRows = GenericDataRow[]

export type SortOrder = {
  key: string
  direction: 'up' | 'down'
}

export type TableOnDragSelect = (e: MouseEvent, key: string, index: number) => void

export type TableOnAddFilter = (filter: TableFilter) => void
