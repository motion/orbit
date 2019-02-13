import { arrayMove } from 'react-sortable-hoc'
import { useActiveSpace } from './useActiveSpace'
import { useStoresSimple } from './useStores'

export function useAppSortHandler() {
  const { orbitWindowStore } = useStoresSimple()
  const [space, updateSpace] = useActiveSpace()

  const handleSortEnd = ({ oldIndex, newIndex }) => {
    let paneSort = arrayMove([...space.paneSort], oldIndex, newIndex)
    // console.log('paneSort', paneSort)
    const { activePaneIndex } = orbitWindowStore
    // if they dragged active tab we need to sync the new activeIndex to PaneManager through here
    const activePaneId = space.paneSort[activePaneIndex]

    console.log('sort finish', paneSort, space.paneSort, activePaneIndex, activePaneId)
    if (activePaneId !== paneSort[activePaneIndex]) {
      orbitWindowStore.activePaneIndex = paneSort.indexOf(activePaneId)
      console.log('updating active index to', orbitWindowStore.activePaneIndex)
    }

    // bug fix we had multiple of the same, we need to figure out why this can happen though...
    paneSort = [...new Set(paneSort)]

    // update
    updateSpace({ paneSort })
  }

  return handleSortEnd
}
