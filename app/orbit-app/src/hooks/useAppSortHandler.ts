import { arrayMove } from 'react-sortable-hoc'
import { useActiveSpace } from './useActiveSpace'
import { useStoresSafe } from './useStoresSafe'

export function useAppSortHandler() {
  const { orbitWindowStore } = useStoresSafe()
  const [space, updateSpace] = useActiveSpace()

  const handleSortEnd = ({ oldIndex, newIndex }) => {
    const paneSort = arrayMove([...space.paneSort], oldIndex, newIndex)
    // console.log('paneSort', paneSort)
    const { activePaneIndex } = orbitWindowStore
    // if they dragged active tab we need to sync the new activeIndex to PaneManager through here
    const activePaneId = space.paneSort[activePaneIndex]
    console.log('sort finish', paneSort, space.paneSort, activePaneIndex, activePaneId)
    if (activePaneId !== paneSort[activePaneIndex]) {
      orbitWindowStore.activePaneIndex = paneSort.indexOf(activePaneId)
      console.log('updating active index to', orbitWindowStore.activePaneIndex)
    }
    // console.log(`updating space`, paneSort)
    updateSpace({ paneSort })
  }

  return handleSortEnd
}
