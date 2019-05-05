import { useEffect } from 'react'

export function useAppLocationEffect() {
  // const { appStore, selectableStore, paneManagerStore } = useStoresSimple()

  useEffect(() => {
    // Navigation.subscribe(route => {
    //   ensureBlock(() => {
    //     ensure('location', !!location)
    //     ensure('external url', location.source === 'link')
    //     ensure('matches type', appStore.identifier === location.basename)
    //     if (appStore.id === location.query.id) {
    //       paneManagerStore.setActivePane(location.basename)
    //       selectableStore.moveToId(location.query.itemId)
    //     }
    //     if (!location.query.id) {
    //       paneManagerStore.setActivePaneByType(location.basename)
    //     }
    //   })
    // })
  }, [])
}
