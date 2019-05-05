import { createOvermind, IConfig } from 'overmind'
import { createHook } from 'overmind-react'
import { namespaced } from 'overmind/config'

import * as router from './router'
import * as setupApp from './setupApp'

const config = namespaced({
  router,
  setupApp,
})

export const om = createOvermind(config)

export const useOm = createHook(om)

declare module 'overmind' {
  interface Config extends IConfig<typeof config> {}
}
