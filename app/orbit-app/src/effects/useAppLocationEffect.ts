import { ensure, useReaction } from '@o/use-store'
import { useStoresSimple } from '../hooks/useStores'

export function useAppLocationEffect() {
  const { appStore, selectionStore, locationStore, paneManagerStore } = useStoresSimple()

  useReaction(
    () => locationStore.url,
    location => {
      ensure('location', !!location)
      ensure('external url', location.source === 'link')
      ensure('matches type', appStore.identifier === location.basename)

      if (appStore.id === location.query.id) {
        paneManagerStore.setActivePane(location.basename)
        selectionStore.moveToId(location.query.itemId)
      }

      if (!location.query.id) {
        paneManagerStore.setActivePaneByType(location.basename)
      }
    },
  )
}
