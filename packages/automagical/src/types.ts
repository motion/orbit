import { CompositeDisposable } from 'event-kit'

// how to have a more flexible Function?
// this often complains when used as callbacks from eventListener or mutationobserver
export type EffectCallback = (resolve: any, reject: any) => Function | void

export type ReactionHelpers = {
  setValue: (a: any) => void
  getValue: () => any
  sleep: (ms?: number) => Promise<void>
  when: (condition: () => boolean, ms?: number) => Promise<void>
  whenChanged: <A>(condition: () => A, dontCompare?: boolean) => Promise<A>
  useEffect: (cb: EffectCallback) => Promise<any>
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
  lazy?: boolean
  name?: string
}

export interface MagicalObject {
  __automagic: {
    subscriptions: CompositeDisposable
    reactions: {}
    getters: {}
  }
  dispose: Function
  props?: { [key: string]: any }
}
