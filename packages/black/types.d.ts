import { DecorCompiledDecorator } from '@mcro/decor'

export { react } from '@mcro/automagical'
export { on } from '@mcro/helpers'

export { Component } from './Component'
export { DecorCompiledDecorator } from '@mcro/decor'

export type DecorView = DecorCompiledDecorator<any>

import { Emitter } from 'event-kit'

export interface ViewDecorator {
  <A>(a: A): A
}

export interface PotentiallyView {
  new (a: Object): any
}

export function view<T>(
  a: T,
  b?: any,
): T & { theme?: Object; displayName?: string } & PotentiallyView
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
