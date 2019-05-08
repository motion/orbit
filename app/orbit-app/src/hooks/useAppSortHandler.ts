import { useActiveSpace } from '@o/kit'
import { arrayMove } from '@o/react-sortable-hoc'

import { usePaneManagerStore } from '../om/stores'

export function useAppSortHandler() {
  const paneManagerStore = usePaneManagerStore()
  const { paneIndex } = paneManagerStore
  const [space, updateSpace] = useActiveSpace()

  const handleSortEnd = ({ oldIndex, newIndex }) => {
    let paneSort = arrayMove([...space.paneSort], oldIndex, newIndex)
    // if they dragged active tab we need to sync the new activeIndex to PaneManager through here
    const activePaneId = space.paneSort[paneIndex]

    if (activePaneId !== paneSort[paneIndex]) {
      const next = paneSort.indexOf(activePaneId)
      console.log('updating active index to', next)
      paneManagerStore.setPaneIndex(next)
    }

    // bug fix we had multiple of the same, we need to figure out why this can happen though...
    paneSort = [...new Set(paneSort)]

    // update
    updateSpace(space => {
      space.paneSort = paneSort
    })
  }

  return handleSortEnd
}