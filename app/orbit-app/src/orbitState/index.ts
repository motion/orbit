import { createOvermind } from 'overmind'
import { createHook } from 'overmind-react'
import { namespaced } from 'overmind/config'

import * as location from './location'

export const orbitState = createOvermind(
  namespaced({
    location,
  }),
)

export const useOrbitState = createHook(orbitState)
