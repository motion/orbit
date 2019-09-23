export type AutomagicalConfiguration = {
  isSubscribable?: (val: any) => boolean
  queueUpdate?: (cb: Function) => void
  clearQueuedUpdate?: (cb: Function) => void
}

export let automagicConfig: AutomagicalConfiguration = {
  isSubscribable: x => x && typeof x.subscribe === 'function',
}

let hasSet = false
export function configureAutomagical(opts: AutomagicalConfiguration) {
  if (hasSet) return
  hasSet = true
  automagicConfig = Object.freeze(Object.assign(automagicConfig, opts))
}
