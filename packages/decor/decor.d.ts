import { Emitter } from 'event-kit'

export type Helpers = {
  emit: Emitter['emit']
  alreadyDecorated: (a: any) => boolean
}

export interface DecorPlugin<T> {
  (options: Object, Helpers: Helpers): {
    name: string
    once?: boolean
    onlyClass?: boolean
    decorator?: <A>(a: A, b?: Object) => T & A
  }
}

export type DecorPlugins = Array<[DecorPlugin<any>, Object] | DecorPlugin<any>>

export interface DecorCompiledDecorator {
  (): (
    target: Function | Object,
    opts?: Object,
  ) => <T extends Function>(target: T) => T
  emitter: Emitter
  on: Emitter['on']
  emit: Emitter['emit']
}

declare function Decor(plugins: DecorPlugins): DecorCompiledDecorator

export default Decor
