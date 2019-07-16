export type AutomagicalConfiguration = {
  isSubscribable?: (val: any) => boolean
  queueUpdate?: Function
}

export let automagicConfig: AutomagicalConfiguration = {
  isSubscribable: x => x && typeof x.subscribe === 'function',
}

export function configureAutomagical(opts: AutomagicalConfiguration) {
  automagicConfig = Object.freeze(Object.assign(automagicConfig, opts))
}