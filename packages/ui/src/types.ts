/**
 * Copyright 2018-present Facebook.
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * @format
 */

export type OnScroll = (
  params: {
    scrollHeight: number
    scrollTop: number
    clientHeight: number
  },
) => void

export type KeyMapper = (index: number) => string

export type RowRenderer = (
  params: {
    index: number
    style: Object
  },
) => any

export type GenericComponent<T> = React.ComponentClass<T> | React.SFC<T>

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

export type GenericDataRow = {
  key: string
  height?: number | void
  category?: string
  filterValue?: string | void
  sortKey?: string | number
  style?: Object
  onDoubleClick?: (e: MouseEvent) => void
  copyText?: string
  highlightOnHover?: boolean
  values: {
    [key: string]: any
  }
}

export enum DataType {
  number = 'number',
  boolean = 'boolean',
  string = 'string',
  date = 'date',
  unknown = 'unknown',
}

export type DataColumn ={
  value: string
  sortable?: boolean
  resizable?: boolean
  flex?: number
  type?: DataType
}

export type DataColumns = {
  [key: string]: DataColumn
}