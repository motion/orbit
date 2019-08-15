/**
 * Copyright 2018-present Facebook.
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * @format
 */

export type GenericComponent<T> = React.ComponentClass<T> | React.SFC<T>

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

export type DataRow = {
  type: 'row'
  key: string
  values: {
    [key: string]: any
  }
  height?: number | void
  category?: string
  filterValue?: string | void
  sortKey?: string | number
  style?: Object
  onDoubleClick?: (e: MouseEvent) => void
  copyText?: string
  highlightOnHover?: boolean
}

// simple rows vs adding more information
export type GenericDataRow = DataRow | { [key: string]: any }

export enum DataType {
  number = 'number',
  boolean = 'boolean',
  string = 'string',
  date = 'date',
  unknown = 'unknown',
}

export type DataColumn = {
  // key is only necessary when doing array-style columns
  key?: string
  value: string
  sortable?: boolean
  resizable?: boolean
  flex?: number
  type?: DataType
  onChange?: (index: number, value: any) => void
}

export type DataColumns = {
  [key: string]: DataColumn
}

type DataColumnsObject = { [key: string]: DataColumn | string }

export type DataColumnsShort = DataColumnsObject | (DataColumn | string)[]
