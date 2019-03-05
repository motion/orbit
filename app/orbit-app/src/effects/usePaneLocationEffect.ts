import { ensure, useReaction } from '@mcro/use-store'
import { useStoresSimple } from '../hooks/useStores'
import { parseUrl } from '../stores/LocationStore'

export function usePaneLocationEffect() {
  const { locationStore, paneManagerStore } = useStoresSimple()

  useReaction(
    () => paneManagerStore.activePane,
    pane => {
      ensure('pane', !!pane)
      locationStore.go(parseUrl(`app://${pane.type}/?id=${pane.id}`, 'internal'))
    },
  )
}
