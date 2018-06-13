import { DecorCompiledDecorator } from '@mcro/decor'
import { UtilityUsable } from '@mcro/decor-mobx'

export { DecorCompiledDecorator } from '@mcro/decor'

export type DecorView = DecorCompiledDecorator<any>

import { Emitter } from 'event-kit'

export interface ViewDecorator {
  <A>(a: A): A & UtilityUsable
}

export function view<T>(a: T): T & UtilityUsable
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

export function store<T>(a: T): T & UtilityUsable & Proppable

export type ReactionFunction = (...args: any[]) => any

export function react<B extends ReactionFunction>(
  a: Function,
  b?: B,
  c?: Object,
): ReturnType<B>

export namespace react {
  export const cancel: any
}

export function watch<A extends ReactionFunction>(
  a: A,
  b?: Object,
): ReturnType<A>

export function debugState(cb: Function): void

import * as React from 'react'

export class Component<T> extends React.Component<T, {}> {
  props: T
  state?: Object
  context?: Object
  refs?: Object
  setState: Function
  forceUpdate: Function
  render(props: T): JSX.Element | string | null
  setInterval: Function
  setTimeout: Function
}

export function isEqual(a: any, b: any): boolean
