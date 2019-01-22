let hasSet = false

type ConfigureOpts = {
  useIcon?: any
}

export let configure: ConfigureOpts = {}

export function configureUI(opts: ConfigureOpts) {
  if (hasSet) throw new Error('Only configure once.')
  hasSet = true
  Object.assign(configure, opts)
}
