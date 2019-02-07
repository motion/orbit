import { AppBit } from '@mcro/models'
import { useObserver } from 'mobx-react-lite'
import { useState } from 'react'
import { useActiveApps } from './useActiveApps'
import { useStoresSafe } from './useStoresSafe'

// defaults to using the appstore active query

export function useActiveApp(): AppBit {
  const { paneManagerStore } = useStoresSafe()
  const activeApps = useActiveApps()
  const [state, setState] = useState({ id: -1, app: null as AppBit })

  useObserver(() => {
    const app = activeApps.find(x => `${x.id}` === paneManagerStore.activePane.id)
    if (!app) return
    if (app.id !== state.id) {
      setState({ id: app.id, app })
    }
  })

  return state.app
}
