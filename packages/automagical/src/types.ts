import { CompositeDisposable } from 'event-kit'
import { IEqualsComparer } from 'mobx'
import * as Scheduler from 'scheduler'

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

export enum UpdatePriority {
  Immediate = Scheduler.unstable_ImmediatePriority,
  UserBlocking = Scheduler.unstable_UserBlockingPriority,
  Normal = Scheduler.unstable_NormalPriority,
  Low = Scheduler.unstable_LowPriority,
  Idle = Scheduler.unstable_IdlePriority,
}

export type ReactionOptions = {
  equals?: IEqualsComparer<any>
  log?: boolean | 'state' | 'all'
  delay?: number
  delayValue?: boolean
  defaultValue?: any
  lazy?: boolean
  name?: string
  priority?: UpdatePriority
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
