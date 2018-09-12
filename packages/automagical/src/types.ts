export type ReactionHelpers = {
  preventLogging: Function
  setValue: (a: any) => void
  getValue: () => any
  sleep: (ms?: number) => Promise<void>
  when: (condition: () => boolean, ms?: number) => Promise<void>
  whenChanged: <A>(condition: () => A, dontCompare?: boolean) => Promise<A>
  state: {
    hasResolvedOnce: boolean
  }
}

export type ReactionOptions = {
  trace?: boolean
  equals?: Function
  log?: boolean | 'state' | 'all'
  delay?: number
  delayValue?: boolean
  isIf?: boolean
  onlyUpdateIfChanged?: boolean
  onlyReactIfChanged?: boolean
  defaultValue?: any
  deferFirstRun?: boolean
}

export type MagicalObject = {
  subscriptions: { add: ({ dispose: Function }) => void }
  __automagical: {
    watchers?: [any] | undefined[]
    deep?: {}
    started?: boolean
  }
  props?: {}
}
