import { DecorCompiledDecorator } from '@mcro/decor'
import { UtilityUsable } from '@mcro/decor-mobx'

export { DecorCompiledDecorator } from '@mcro/decor'

export type DecorView = DecorCompiledDecorator<any>

export function view<T>(a: T): T & UtilityUsable
export function store<T>(a: T): T & UtilityUsable

export type ReactionFunction = (...args: any[]) => any

export function react<B extends ReactionFunction>(
  a: Function,
  b: B,
  c?: Object,
): ReturnType<B>

export function debugState(cb: Function): void
