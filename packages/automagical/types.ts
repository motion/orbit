export type ReactionOptions = {
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
