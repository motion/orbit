import { Emitter } from 'event-kit'

export type Helpers = {
  emit: Emitter['emit']
  alreadyDecorated: (a: any) => boolean
}

export interface DecorPlugin<T> {
  (options?: any, Helpers?: Helpers): {
    name: string
    once?: boolean
    onlyClass?: boolean
    decorator?: <A>(a: A, b?: Object) => T & A
  }
}

export type DecorPlugins = Array<[DecorPlugin<any>, Object] | DecorPlugin<any>>

export type DecorDecorator<T> = <X extends Function>(target: X) => T & X

export type DecorDecoratorWithOptionalOptions<T> = T extends Object
  ? (options: Object) => DecorDecorator<T>
  : T extends Function ? DecorDecorator<T> : void

export interface DecorCompiledDecorator<Extensions> {
  <T>(target: T): DecorDecoratorWithOptionalOptions<T>
  emitter: Emitter
  on: Emitter['on']
  emit: Emitter['emit']
}

declare function Decor(
  plugins: DecorPlugins,
): DecorCompiledDecorator<DecorPlugins>

export default Decor
