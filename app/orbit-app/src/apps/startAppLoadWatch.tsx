import { __SERIOUSLY_SECRET } from '@o/kit'
import { Desktop } from '@o/stores'
import { reaction } from 'mobx'

import { updateDefinitions } from './orbitApps'

export async function startAppLoadWatch() {
  await updateDefinitions()
  // watch for updates
  reaction(
    () => Desktop.state.workspaceState.packageIds,
    async () => {
      await updateDefinitions()
      __SERIOUSLY_SECRET.reloadAppDefinitions()
    },
  )
}
