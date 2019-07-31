import { hmrSocket } from '@o/kit'
import { Desktop } from '@o/stores'
import { reaction } from 'mobx'
import { Action } from 'overmind'

import { om } from './om'

export const listenForHmrUpdate: Action = () => {
  // listen for HMR
  return
  reaction(
    () => Desktop.state.workspaceState.hmrBundleNames,
    names => {
      console.log('should set up hmr socket', names)
      for (const name of names) {
        if (name === 'main') continue
        hmrSocket(`/__webpack_hmr_${name}`, {
          // for some reason built is sent before 'sync', which applies update
          // and i can't hook into sync, so just doing settimeout for now
          built: () => {
            console.log('built', name)
            setTimeout(() => {
              om.actions.rerenderApp()
            }, 50)
          },
        })
      }
    },
    {
      fireImmediately: true,
    },
  )
}
