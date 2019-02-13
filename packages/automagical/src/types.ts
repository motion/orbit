import { CompositeDisposable } from 'event-kit'

// how to have a more flexible Function?
// this often complains when used as callbacks from eventListener or mutationobserver
export type EffectCallback = ((resolve: any, reject: any) => Function | void)

export type ReactionHelpers = {
  preventLogging: Function
  setValue: (a: any) => void
  getValue: () => any
  sleep: (ms?: number) => Promise<void>
  when: (condition: () => boolean, ms?: number) => Promise<void>
  whenChanged: <A>(condition: () => A, dontCompare?: boolean) => Promise<A>
  idle: () => Promise<void>
  onCancel: (cb: Function) => void
  effect: (cb: EffectCallback) => void
  state: {
    hasResolvedOnce: boolean
    iteration?: number
  }
}

export type ReactionOptions = {
  trace?: boolean
  equals?: Function
  log?: boolean | 'state' | 'all'
  delay?: number
  delayValue?: boolean
  isIf?: boolean
  defaultValue?: any
  deferFirstRun?: boolean
}

export interface MagicalObject {
  __automagicSubscriptions: CompositeDisposable
  automagicDispose: Function
  props?: { [key: string]: any }
}
