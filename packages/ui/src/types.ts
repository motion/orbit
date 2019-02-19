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
