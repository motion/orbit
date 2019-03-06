import { parseUrl } from '@mcro/kit'
import { ensure, useReaction } from '@mcro/use-store'
import { useStoresSimple } from '../hooks/useStores'

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
