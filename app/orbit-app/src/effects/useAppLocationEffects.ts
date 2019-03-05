import { ensure, useReaction } from '@mcro/black'
import { useStoresSimple } from '../hooks/useStores'

export function useAppLocationEffects() {
  const { appStore, selectionStore, locationStore, paneManagerStore } = useStoresSimple()

  useReaction(
    () => locationStore.current,
    location => {
      ensure('location', !!location)
      ensure('location matches id', appStore.id === location.basename)
      console.log('got location lets do it', location)
      paneManagerStore.setActivePane(location.basename)
      const queryID = location.query && location.query.find(x => x.key === 'id')
      if (queryID) {
        selectionStore.moveToId(queryID.value)
      }
    },
  )
}
