import { createOvermind } from 'overmind'
import { createHook } from 'overmind-react'
import { namespaced } from 'overmind/config'

import * as router from './router'

export const om = createOvermind(
  namespaced({
    router,
  }),
)

export const useOrbitState = createHook(om)
