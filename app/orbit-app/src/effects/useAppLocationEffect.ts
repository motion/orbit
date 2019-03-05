import { ensure, useReaction } from '@mcro/use-store'
import { useStoresSimple } from '../hooks/useStores'

export function useAppLocationEffect() {
  const { appStore, selectionStore, locationStore, paneManagerStore } = useStoresSimple()

  useReaction(
    () => locationStore.url,
    location => {
      ensure('location', !!location)
      ensure('external url', location.source === 'link')
      ensure('matches type', appStore.identifier === location.basename)
      ensure('matches app id', appStore.id === location.query.id)
      console.log('got location lets do it', location)
      paneManagerStore.setActivePane(location.basename)
      if (location.query.itemId) {
        selectionStore.moveToId(location.query.itemId)
      }
    },
  )
}
