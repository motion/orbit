import { useReaction } from '@o/kit'

import { orbitStaticApps } from '../apps/orbitApps'
import { paneManagerStore } from '../om/stores'

export const isStaticApp = (identifier: string) => !!orbitStaticApps.find(x => x.id === identifier)

export const useIsOnStaticApp = () => {
  return useReaction(() =>
    isStaticApp((paneManagerStore.activePane && paneManagerStore.activePane.type) || ''),
  )
}
