import { IConfig, Overmind } from 'overmind'
import { createHook } from 'overmind-react'
import { merge, namespaced } from 'overmind/config'

import * as actions from './actions'
import * as apps from './apps'
import * as develop from './develop'
import * as effects from './effects'
import { onInitialize } from './onInitialize'
import * as router from './router'
import * as spaces from './spaces'
import { state } from './state'
import * as user from './user'

export const config = merge(
  {
    onInitialize,
    state,
    actions,
    effects,
  },
  namespaced({
    develop,
    router,
    apps,
    spaces,
    user,
  }),
)

export type Om = Overmind<typeof config>

export const useOm = createHook<typeof config>()

declare module 'overmind' {
  interface Config extends IConfig<typeof config> {}
}

export const om = window['om']
