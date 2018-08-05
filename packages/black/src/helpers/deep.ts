type DeeplyObservableState = {
  [key: string]: any
  __IS_DEEP?: boolean
}

export function deep<T extends DeeplyObservableState>(target: T): T {
  target.__IS_DEEP = true
  return target
}
