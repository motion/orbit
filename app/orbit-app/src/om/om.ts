import { createOvermind, IConfig } from 'overmind'
import { createHook } from 'overmind-react'
import { merge, namespaced } from 'overmind/config'

import * as actions from './actions'
import * as effects from './effects'
import { onInitialize } from './onInitialize'
import * as router from './router'
import * as setupApp from './setupApp'
import { state } from './state'

const config = merge(
  {
    onInitialize,
    state,
    actions,
    effects,
  },
  namespaced({
    router,
    setupApp,
  }),
)

export const om = createOvermind(config)
export const useOm = createHook(om)

declare module 'overmind' {
  interface Config extends IConfig<typeof config> {}
}
