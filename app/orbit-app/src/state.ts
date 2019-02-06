import { Overmind } from 'overmind'
import { createHook } from 'overmind-react'
import { namespaced } from 'overmind/config'
import { createApp } from './stores/createApp'

function getOvermind() {
  const overmind = namespaced({
    createApp,
  })
  window['overmind'] = overmind // make it global
  return overmind
}

export let overmind = new Overmind(getOvermind())
let overmindHook = createHook(overmind)

export function useOvermind() {
  return overmindHook()
}

function setupOvermind() {
  overmind = new Overmind(getOvermind())
  overmindHook = createHook(overmind)
}

if (module['hot']) {
  module['hot'].accept(() => {
    setupOvermind()
  })
}
