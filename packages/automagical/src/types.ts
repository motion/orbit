import { CompositeDisposable } from 'event-kit'
import { IEqualsComparer } from 'mobx'

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
  equals?: IEqualsComparer<any>
  log?: boolean | 'state' | 'all'
  delay?: number
  delayValue?: boolean
  defaultValue?: any
  lazy?: boolean
  name?: string
  priority?: 1 | 2 | 3 | 4
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
