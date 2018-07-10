export type ReactionHelpers = {
  preventLogging: Function
  setValue: (a: any) => void
  getValue: () => any
  sleep: (ms: number) => Promise<void>
  when: (condition: () => boolean, ms?: number) => Promise<void>
  whenChanged: <A>(condition: () => A, dontCompare?: boolean) => Promise<A>
}

export type ReactionOptions = {
  trace?: boolean
  fireImmediately?: boolean
  immediate?: boolean
  equals?: Function
  log?: false | 'state' | 'all'
  delay?: number
  isIf?: boolean
  delayValue?: boolean
  onlyUpdateIfChanged?: boolean
  defaultValue?: any
}
