import { useReaction } from '@mcro/black'
import { AppBit } from '@mcro/models'
import { useState } from 'react'
import { useActiveApps } from './useActiveApps'
import { useStores } from './useStores'

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
