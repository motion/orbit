import { AppBit } from '@o/models'
import { useReaction } from '@o/use-store'
import { useState } from 'react'
import { useActiveApps } from './useActiveApps'
import { useStores } from './useStores'

// this is more of an internal thing, should probably move out of kit
// because they shouldn't have access to "current showing app"

export function useActiveApp(): AppBit {
  const { paneManagerStore } = useStores()
  const activeApps = useActiveApps()
  const [state, setState] = useState({ id: -1, app: null as AppBit })

  useReaction(() => {
    const app = activeApps.find(x => `${x.id}` === paneManagerStore.activePane.id)
    if (!app) return
    if (app.id !== state.id) {
      console.log('waht', app)
      setState({ id: app.id, app })
    }
  })

  return state.app
}
