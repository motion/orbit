export type AutomagicalConfiguration = {
  isSubscribable?: (val: any) => boolean
  queueUpdate?: (cb: Function) => void
  clearQueuedUpdate?: (cb: Function) => void
}

export let automagicConfig: AutomagicalConfiguration = {
  isSubscribable: x => x && typeof x.subscribe === 'function',
}

export function configureAutomagical(opts: AutomagicalConfiguration) {
  automagicConfig = Object.freeze(Object.assign(automagicConfig, opts))
}
