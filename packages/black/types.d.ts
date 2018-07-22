import { DecorCompiledDecorator } from '@mcro/decor'
import { CSSPropertySet, ThemeObject } from '@mcro/gloss'

export { react } from '@mcro/automagical'
export { on, compose } from '@mcro/helpers'

export { Component } from './Component'
export { DecorCompiledDecorator } from '@mcro/decor'

export type Constants = { IS_ELECTRON: boolean }

export type DecorView = DecorCompiledDecorator<any>

import { Emitter } from 'event-kit'

export interface ViewDecorator {
  <A>(a: A): A
}

export type Props = any

export interface PotentiallyView<T> {
  new (a: Object): any
  defaultProps?: Object
  // TODO: make props flow
  theme?: (a: Props & { theme: ThemeObject }) => CSSPropertySet
  displayName?: string
  ignoreAttrs?: string[] | { [key: string]: boolean }
  style: T
}

export function view<T>(
  a?: T | CSSPropertySet,
  b?: CSSPropertySet,
): PotentiallyView<T>
export namespace view {
  export function on(
    name: string | Object,
    thing: Function | string,
    cb?: Function,
  ): void
  export const emitter: Emitter
  export const emit: Emitter['emit']
  export const ui: ViewDecorator
  export const electron: ViewDecorator
  export const provide: any
  export const attach: any
}

export interface Proppable {
  props: any
}

export function store<T>(a: T): T & Proppable

export function debugState(cb: Function): void

export function isEqual(a: any, b: any): boolean

export function sleep(a: number): Promise<void>

export function attachTheme<T>(a: T): T

export function deep<T>(a: T): T
